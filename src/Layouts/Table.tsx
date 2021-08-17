import {DataLayout} from "./DataLayout";
import {Colors} from "../Style/Theme";
import React, {useState} from "react";
import {makeColorElems, makeUnbreakable, trySnipDate, typeColors} from "../Util/Util";
import {ASCENDING, DESCENDING} from "../Util/SortUtil";
import {LinkOut} from "../Components/LinkBack";
import {MaxLen} from "../Util/ElemUtil";

export interface Header {
    value: string;
    genUI: (state: any, setState: React.Dispatch<any>)=>JSX.Element;
}

type Headerable = Header | string;

export interface Column {
    genContents: (value: any)=>JSX.Element|string|null;
    style?: React.CSSProperties;
    noSep?: boolean;
    primaryDate?: boolean;
}

export const combine = (columnableBase: Columnable, columnableOverride: Columnable): Column => {
    return {...makeColumn(columnableBase), ...makeColumn(columnableOverride)};
}

export const linkOutColumn = (urlFunc: (value: any)=>string|undefined): Column => {
    return combine('nosep', {genContents: value => {
        const url = urlFunc(value);
        if (url == null) return null;
        return <LinkOut url={url} style={{width: 12, height: 12, margin: 0, marginRight: 5}}/>
    }});
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

        for (const str of strings) {
            if (str.startsWith('max_')) {
                const num = parseInt(str.substr(str.indexOf('_') + 1));
                column.genContents = value => <MaxLen max={num}>{value}</MaxLen>
                continue;
            }
            switch (str) {
                case 'color':
                    column.genContents = value => <>{makeColorElems(value)}</>;
                    break;
                case 'primary_date':
                    override({
                        genContents: (value: any) => <>{trySnipDate(value)}</>,
                        style: {color: typeColors.string},
                        primaryDate: true
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

type Columnable = Column | string | 'string' | 'number' | 'boolean' | 'color' | 'primary_date' | 'nosep';

export class Table extends DataLayout {

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

            if (typeof columnable === 'string' && columnable.indexOf('primary_date') !== -1) {
                this.preState.primaryDateSort = DESCENDING;
                header = {...header, genUI: (state, setState) => (
                    <th className="HoverClickLighten" onClick={() => this.overrideState(state, setState,
                            {primaryDateSort: state.primaryDateSort === DESCENDING ? ASCENDING : DESCENDING})}>
                        {makeUnbreakable(`${header.value} ${state.primaryDateSort === DESCENDING ? '∨' : '∧'}`)}
                    </th>
                    )}
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

    genDefaultSortGenerator(): ((state: any)=>(a: any, b: any)=>number) | undefined {
        for (const [i, column] of Object.entries(this.columns)) {
            if (column.primaryDate) {
                return (state) => {
                    const comp = (val1: any, val2: any) => (state.primaryDateSort === DESCENDING) ? val1 - val2 : val2 - val1;
                    return (a, b) => comp(new Date(a[i]), new Date(b[i]));
                }
            }
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

const TableDisplay: React.FC<{table: Table}> = ({table}) => {

    const [state, setState] = useState(table.preState);

    return (
        <div className="ResultBox" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            marginBottom: 5, padding: 5, fontSize: 12, borderRadius: 8}}
        >
            <p style={{paddingRight: 8, color: Colors.highlight, fontWeight: 'bold'}}>{table.title}:</p>
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
        </div>
    );
}
