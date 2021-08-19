import {DataLayout} from "./DataLayout";
import {Colors} from "../Style/Theme";
import React from "react";
import {typeColors} from "../Util/Util";
import {MaxLen} from "../Util/ElemUtil";
import {CollapsableFieldBox} from "../Components/CollapsableFieldBox";

export class ListLayout extends DataLayout {

    title: string;
    list: any[];
    genElem: (value: any)=>JSX.Element;

    constructor(title: string, list: any[], genElem: (value: any)=>JSX.Element = value => <p>{value}</p>) {
        super();
        this.title = title;
        this.list = list;
        this.genElem = genElem;
    }

    genContainerStyle(): React.CSSProperties {
        return {};
    }

    genUI(): JSX.Element {
        return (
            <CollapsableFieldBox title={this.title}>
                <div style={{display: 'flex', flexDirection: 'column', ...this.genContainerStyle()}}>
                    {this.list.map((value: any) => this.genElem(value))}
                </div>
            </CollapsableFieldBox>
        );
    }
}

export class StringListLayout extends ListLayout {
    constructor(title: string, list: any[], maxChars: number) {
        super(title, list, value => <MaxLen max={maxChars}>{value}</MaxLen>);
    }

    genContainerStyle(): React.CSSProperties {
        return {color: typeColors.string};
    }
}
