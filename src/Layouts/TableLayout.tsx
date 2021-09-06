import {DataLayout} from "./DataLayout";
import React, {useState} from "react";
import {
    makeColorElems,
    makeUnbreakable,
    toColorElemsMultiline,
    toColorText,
    trySnipDate,
    typeColors
} from "../Util/Util";
import {ASCENDING, DESCENDING} from "../Util/SortUtil";
import {LinkOut} from "../Components/LinkBack";
import {MaxLen} from "../Util/ElemUtil";
import {CollapsableFieldBox} from "../Components/CollapsableFieldBox";
import {tabLines} from "../Util/StringUtil";
import { table, getBorderCharacters } from 'table';

export interface Header {
    value: string;
    genUI: (state: any, setState: React.Dispatch<any>)=>JSX.Element;
}

type Headerable = Header | string;

export interface Column {
    genContents: (value: any)=>JSX.Element|string|null;
    genReport?: (value: any)=>string|undefined;
    style?: React.CSSProperties;
    noSep?: boolean;
    primaryDate?: boolean;
    alphaSort?: boolean;
    boolSort?: boolean;
    subSort?: boolean;
    optionalDate?: boolean;
    primaryOptionalDate?: boolean;
}

export const combine = (columnableBase: Columnable, columnableOverride: Columnable): Column => {
    return {...makeColumn(columnableBase), ...makeColumn(columnableOverride)};
}

export const linkOutColumn = (urlFunc: (value: any)=>string|undefined): Column => {
    return combine('nosep', {genContents: value => {
        const url = urlFunc(value);
        if (url == null) return null;
        return <LinkOut url={url} style={{width: 12, height: 12, margin: 0, marginRight: 5}}/>
    }, genReport: () => undefined});
}

const makeColumn = (columnable: Columnable): Column => {
    if (typeof columnable === 'string') {
        const strings: string[] = columnable.split('|');
        let column: Column = {genContents: (value: any) => {
            if (value === undefined) return null;
            return String(value);
        }};
        const override = (obj: any) => {
            column = {...column, ...obj};
        }

        for (let str of strings) {
            if (str.startsWith('max_')) {
                const num = parseInt(str.substr(str.indexOf('_') + 1));
                column.genContents = value => <MaxLen max={num}>{value}</MaxLen>
                continue;
            }

            if (str.startsWith('sub_')) {
                column.subSort = true;
                str = str.replace('sub_', '');
            }

            switch (str) {
                case 'color_inline':
                    column.genContents = value => <span>{makeColorElems(value)}</span>;
                    break;
                case 'color':
                    column.genContents = value => <div>{toColorElemsMultiline(toColorText(value))}</div>;
                    break;
                case 'stringify_inline':
                    const func = (value: any) => toColorText(value, {multiline: false}).genText();
                    column.genContents = func;
                    column.genReport = func;
                    column.style = {color: typeColors.string};
                    break;
                case 'primary_date':
                    override({
                        genContents: (value: any) => <>{trySnipDate(value)}</>,
                        style: {color: typeColors.string},
                        primaryDate: true
                    });
                    break;
                case 'optional_date_descend':
                    override({
                        genContents: (value: any) => <>{trySnipDate(value)}</>,
                        style: {color: typeColors.string},
                        optionalDate: true
                    });
                    break;
                case 'default':
                    override({
                        primaryOptionalDate: true
                    });
                    break;
                case 'bool_sort':
                    override({
                        style: {color: typeColors.boolean},
                        boolSort: true
                    });
                    break;
                case 'alphabetic':
                    override({
                        style: {color: typeColors.string},
                        alphaSort: true
                    });
                    break;
                case 'string':
                    column.style = {color: typeColors.string};
                    break;
                case 'number':
                    column.style = {color: typeColors.number};
                    break;
                case 'boolean':
                    column.style = {color: typeColors.boolean};
                    break;
                case 'nosep':
                    column.noSep = true;
                    break;
            }
        }
        return column;
    }
    return columnable;
}

type Columnable = Column | string | 'string' | 'number' | 'boolean' | 'color' | 'primary_date' | 'nosep' | 'bool_sort' | 'alphabetic' | 'stringify_inline' | 'optional_date_descend';

export class TableLayout extends DataLayout {

    title: string;
    headers: Header[];
    columns: Column[];
    arr: any[];
    valueFunc: (rowData: any)=>any[];
    sortFuncGenerator?: (state: any)=>(a: any, b: any)=>number;
    preState: any = {};

    // TODO: combine headers/columns?

    constructor(
        title: string, data: any,
        headerablesAndColumnables: [Headerable, Columnable][],
        valueFunc: (rowData: any)=>any[],
        arrayFunc: (data: any)=>any[] = (data: any)=>data
    ) {
        super();

        this.title = title;

        this.headers = headerablesAndColumnables.map(([headerable, columnable]) => {
            let header: Header;
            header = (typeof headerable === 'string') ? {value: headerable, genUI: () => <th>{headerable}</th>} : headerable;

            if (typeof columnable === 'string') {
                if (columnable.indexOf('primary_date') !== -1) {
                    this.preState.primaryDateSort = DESCENDING;
                    header = {...header, genUI: (state, setState) => (
                            <th className="HoverClickLighten" onClick={() => this.overrideState(state, setState,
                                {primaryDateSort: state.primaryDateSort === DESCENDING ? ASCENDING : DESCENDING})}>
                                {makeUnbreakable(`${header.value} ${state.primaryDateSort === DESCENDING ? '∨' : '∧'}`)}
                            </th>
                        )}
                } else if (columnable.indexOf('optional_date_descend') !== -1) { // TODO:
                    /*this.preState.primaryDateIndex = DESCENDING;
                    header = {...header, genUI: (state, setState) => (
                            <th className="HoverClickLighten" onClick={() => this.overrideState(state, setState,
                                {primaryDateSort: state.primaryDateSort === DESCENDING ? ASCENDING : DESCENDING})}>
                                {makeUnbreakable(`${header.value} ${state.primaryDateSort === DESCENDING ? '∨' : '∧'}`)}
                            </th>
                        )}*/
                }
            }

            return header;
        });

        this.columns = headerablesAndColumnables.map(([, columnable]) => makeColumn(columnable));

        this.valueFunc = valueFunc;
        try {
            this.arr = arrayFunc(data).map(rowData => valueFunc(rowData));
        } catch {
            this.arr = [];
        }

        this.sortFuncGenerator = this.genDefaultSortGenerator();
    }

    genReport(): string | undefined {

        const contentMatrix = this.arr.map((values: any[]) =>
            values.map((value: any, i: number) => {
                const reportFunc = this.columns[i].genReport;
                if (!reportFunc) return value || '';
                return reportFunc(value);
            }).filter(val => val !== undefined)
        );

        const removeControl = (str: string) => { // temporary fix, surely there ought to be a better way of doing this
            // I'm not really sure which control characters should be line breaks or not :/
            return str.replace(/\u009F/g, "   ").replace(/[\u000A\u000C]/g, "\n").replace(/[\u001F]/g, " ").replace(/[\u0000-\u001F\u007F-\u009F]/g, " ");
        }

        const headerArr = [this.headers.map(header => header.value).filter(str => str !== '')];

        const matrix = headerArr.concat(contentMatrix).map((row: string[], rowNum: number) => row.map(
            (str: string, i: number) => removeControl(i === 0 ? str : `${rowNum === 0 ? '   ' : ' | '}${str}`)
        ));

        const tableText = table(matrix, {
                border: getBorderCharacters('void'),
                columnDefault: {
                    paddingLeft: 0,
                    paddingRight: 0
                },
                drawHorizontalLine: () => false
            }
        ).trim();

        return `${this.title}: [\n${tabLines(tableText, 2)}\n]`
    }

    genDefaultSortGenerator(): ((state: any)=>(a: any, b: any)=>number) | undefined {

        let primary: (((state: any)=>(a: any, b: any)=>number) | undefined) = undefined;
        let sub: (((state: any)=>(a: any, b: any)=>number) | undefined) = undefined;

        const set = (sortGen: (state: any)=>(a: any, b: any)=>number, column: Column): void => {
            if (column.subSort) sub = sortGen;
            else primary = sortGen;
        }

        for (const [i, column] of Object.entries(this.columns)) {
            if (column.primaryDate) {
                set((state) => {
                    const comp = (val1: any, val2: any) => (state.primaryDateSort === DESCENDING) ? val1 - val2 : val2 - val1;
                    return(a, b) => comp(new Date(a[i]), new Date(b[i]));
                }, column);
            } else if (column.alphaSort)  {
                set(() => (a, b) => a[i].localeCompare(b[i]), column);
            } else if (column.boolSort)  {
                set(() => (a, b) => (b[i] - a[i]), column);
            }
        }

        if (primary === undefined) return undefined;

        if (sub === undefined) return primary;

        let finalPrimary: (((state: any)=>(a: any, b: any)=>number)) = primary;
        let finalSub: (((state: any)=>(a: any, b: any)=>number)) = sub;

        return (state) => {
            return (a, b) => {
                return finalPrimary(state)(a, b) || finalSub(state)(a, b);
            };
        }
    }

    genTD(value: any, i: number) {
        const column = this.columns[i];
        let style: React.CSSProperties = column.style || {};
        if (i !== this.columns.length - 1 && !column.noSep && !this.columns[i + 1].noSep) {
            style = {...style, paddingRight: 5}
        }
        const className = (i === 0 || column.noSep) ? undefined : "TableSepLeft";
        return (
            <td className={className} style={style}>{column.genContents(value)}</td>
        );
    }

    genUI(): JSX.Element {
        return <TableDisplay table={this}/>;
    }

    sortArr(state: any): any[] {
        if (this.sortFuncGenerator == null) return this.arr;
        return this.arr.sort(this.sortFuncGenerator(state));
    }

    overrideState(state: any, setState: React.Dispatch<any>, editVals: any) {
        setState({...state, ...editVals});
    }
}

const TableDisplay: React.FC<{table: TableLayout}> = ({table}) => {

    const [state, setState] = useState(table.preState);

    return (
        <CollapsableFieldBox title={table.title}>
            <table className="TableCollapseBorders">
                <thead className="StickyTableHeader">
                <tr>
                    {table.headers.map(header => header.genUI(state, setState))}
                </tr>
                </thead>

                <tbody>
                {table.sortArr(state).map((values: any[]) =>
                    <tr>
                        {values.map((value: any, i: number) => table.genTD(value, i))}
                    </tr>
                )}
                </tbody>
            </table>
        </CollapsableFieldBox>
    );
}
