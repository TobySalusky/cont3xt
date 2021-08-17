import {DataLayout} from "./DataLayout";
import {Colors} from "../Style/Theme";
import React from "react";
import {typeColors} from "../Util/Util";
import {MaxLen} from "../Util/ElemUtil";

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
            <div className="ResultBox" style={{justifyContent: 'space-between', marginBottom: 5, padding: 5, fontSize: 12, borderRadius: 8}}>
                <div style={{display: 'flex', justifyContent:'flex-start',
                    maxWidth: 1000, flexWrap: "wrap", flexDirection: 'row'}}>
                    <div style={{display: 'flex', flexDirection: 'column', ...this.genContainerStyle()}}>
                        <p style={{paddingRight: 8, color: Colors.highlight, fontWeight: 'bold'}}>{this.title}:</p>

                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            {this.list.map((value: any) => this.genElem(value))}
                        </div>
                    </div>
                </div>
            </div>
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
