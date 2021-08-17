import {DataLayout} from "./DataLayout";
import {PassiveTotalPassiveDNSColorDictBox} from "../Components/ColorDictBox";
import {IndicatorData} from "../Types/Types";

export class PassiveTotalDnsTableLayout extends DataLayout {
    resultList: any[];
    indicatorData: IndicatorData;
    constructor(resultList: any[], indicatorData: IndicatorData) {
        super();
        this.resultList = resultList;
        this.indicatorData = indicatorData;
    }

    genUI(): JSX.Element {
        return <PassiveTotalPassiveDNSColorDictBox
            resultList={this.resultList} indicatorData={this.indicatorData}/>
    }
}
