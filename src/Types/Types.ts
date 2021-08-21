import {ISubTypes, ITypes} from "../Enums/ITypes";

export interface Vector2 {
    x : number;
    y : number;
}

export class IndicatorData {
    value : string;
    type : ITypes;
    subType : ISubTypes;

    constructor(value: string, type: ITypes, subType: ISubTypes) {
        this.value = value;
        this.type = type;
        this.subType = subType;
    }


    stringify() {
        return `${this.type}${this.subType !== ISubTypes.NONE ? `(${this.subType})` : ''}: ${this.value}`;
    }
}

export interface LinkGenerationData {
    indicator: string;
    type: string;
    subType: string;
    numDays: number;
    startDate: string;
}

export interface IntegrationGenerationProgressReport {
    numOutgoing: number;
    numReturned: number;
    numFailed: number;
    numFinished: number;
}
