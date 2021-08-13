export interface Vector2 {
    x : number;
    y : number;
}

export class IndicatorData {
    value : string;
    type : string;
    subType : string;

    constructor(value : string, type : string, subType : string) {
        this.value = value;
        this.type = type;
        this.subType = subType;
    }


    stringify() {
        return `${this.type}${this.subType !== 'None' ? `(${this.subType})` : ''}: ${this.value}`;
    }
}

export interface LinkGenerationData {
    indicator: string;
    type: string;
    subType: string;
    numDays: number;
    startDate: string;
}