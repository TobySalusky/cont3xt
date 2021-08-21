import '../Style/App.css';
import {
    toColorElems,
    toColorText,
    typeColors,
    toColorElemsMultiline, makeUnbreakable, countColorDataLines
} from "../Util/Util";
import {LinkBack} from "./LinkBack";
import { TooltipCopy } from "./TooltipCopy";
import { InlineDiv, InlineRightDiv } from "../Util/StyleUtil";
import { CircleCheckBox } from "./CircleCheckBox";
import { useState } from "react";
import { generateIntegrationReportTooltipCopy } from "../Util/IntegrationReports";
import {
    FIRST_SEEN,
    LAST_SEEN,
    sortPassiveDNSResults,
} from "../Util/SortUtil";
import { toOrderedKeys } from "../Util/IntegrationCleaners";
import { CollapsableFieldBox } from "./CollapsableFieldBox";
import { ISubTypes, ITypes } from "../Enums/ITypes";


export const infoBox = (title, data, startOpen = true) => {

    return (
        <CollapsableFieldBox title={title} inline={countColorDataLines(data) === 1} startOpen={startOpen}>
            {toColorElemsMultiline(data)}
        </CollapsableFieldBox>
    );
}

export function infoBoxes(orderedKeys, data) {
    return orderedKeys.map(key => {
        const colorData = toColorText(data[key])
        return {key, colorData};
    }).filter(({colorData}) => colorData != null).map(({key, colorData}) => {
        return infoBox(key, colorData)
    });
}

export function autoOrderedInfoBoxes(type, data) {
    return infoBoxes(toOrderedKeys(type, Object.keys(data)), data);
}

export function ColorDictBox({type, data, indicatorData}) {

    
    return (
        <div className="WhoIsBox">
            <TooltipCopy valueFunc={() => generateIntegrationReportTooltipCopy(indicatorData, type, data)}/>
            {
                autoOrderedInfoBoxes(type, data)
            }
        </div>
    );
}

export const stringStyle = {color: typeColors.string};
export const boolStyle = {color: typeColors.boolean};
export const numStyle = {color: typeColors.number};
export const padRight = {paddingRight: 5};
export const stringPadRight = {...padRight, ...stringStyle}
export const boolPadRight = {...padRight, ...boolStyle}
export const numPadRight = {...padRight, ...numStyle}

export function PassiveTotalPassiveDNSColorDictBox({resultList, indicatorData}) {
    
    const [sortType, setSortType] = useState(FIRST_SEEN);
    
    const isDomain = indicatorData.type === ITypes.Domain;
    
    function DateHeader({name, thisSortType, sortType})  {
        return (
            <th className="HoverClickLighten" onClick={() => setSortType(thisSortType)}>
                <InlineDiv style={{alignItems:'center', justifyContent: 'spaceAround'}}>
                    {makeUnbreakable(`${name} `)}
                    <CircleCheckBox filled={sortType === thisSortType}/>
                </InlineDiv>
            </th>
        );
    }
    
    // TODO: optimize/remove color text here
    
    return (
        <CollapsableFieldBox title={'results'}>
            <table className="TableCollapseBorders">
                <thead className="StickyTableHeader">
                <tr>
                    <th/>
                    {!isDomain || <><th>DNS Type</th><th>Type</th></>}
                    <th>Value</th>
                    <DateHeader name='First Seen' thisSortType={FIRST_SEEN} sortType={sortType}/>
                    <DateHeader name='Last Seen' thisSortType={LAST_SEEN} sortType={sortType}/>
                </tr>
                </thead>
        
                <tbody>
                {sortPassiveDNSResults(resultList, sortType).map((result, i) =>
                    <tr key={i}>
                        <td>
                            <LinkBack query={result.resolve} style={{width: 12, height: 12, margin: 0, marginRight: 5}}/>
                        </td>
                        {!isDomain ||
                        <>
                            <td style={stringStyle}>{result.recordType}</td>
                            <td>
                                <InlineRightDiv>
                                    {toColorElems(toColorText({[result.resolveType]: ' '}, {brackets: false, appendComma: false, spaces: false, multiline: false}))}
                                </InlineRightDiv>
                            </td>
                        </>
                        }
                        <td style={stringPadRight}>{result.resolve}</td>
                        <td className="TableSepLeft" style={stringPadRight}>{result.firstSeen}</td>
                        <td className="TableSepLeft" style={stringStyle}>{result.lastSeen}</td>
                    </tr>
                )}
                </tbody>
            </table>
        </CollapsableFieldBox>
    );
}
