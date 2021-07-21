import '../Style/App.css';
import { toColorElems, toColorText, typeColors } from "../Util/Util";
import { LinkBack } from "./LinkBack";
import { Copy } from "./Copy";
import { TooltipCopy } from "./TooltipCopy";
import { InlineDiv, InlineRightDiv } from "../Util/StyleUtil";
import {CircleCheckBox} from "./CircleCheckBox";
import {useEffect, useState} from "react";

const infoBox = (title, data) => {
    
    return (
        <div className="ResultBox" style={{justifyContent: 'space-between', marginBottom: 5, padding: 5, fontSize: 12, borderRadius: 8}}>
            <div style={{display: 'flex', justifyContent:'flex-start', maxWidth: 1000, flexWrap: "wrap"}}>
                <p style={{paddingRight: 8, color: 'orange', fontWeight: 'bold'}}>{title}:</p>
                
                {toColorElems(data)}
            
            </div>
        </div>
    );
}

export function ColorDictBox({data, indicatorData}) {

    const keysAndColorText = Object.keys(data).map(key => {
        const colorText = toColorText(data[key])
        return {key, colorText};
    }).filter(({colorText}) => colorText.val != null);
    
    const copyVal = [indicatorData.stringify()].concat(keysAndColorText.map(({key, colorText}) =>
        `${key}: ${colorText.val}`)).join('\n');
    
    return (
        <div className="WhoIsBox">
            <TooltipCopy value={copyVal}/>
            {
                keysAndColorText.map(({key, colorText}) => {
                    return infoBox(key, colorText)
                })
            }
        </div>
    );
}

const stringStyle = {color: typeColors.string};
const padRight = {paddingRight: 5};
const stringPadRight = {...padRight, ...stringStyle}

export function PassiveTotalPassiveDNSColorDictBox({data, indicatorData}) {

    const LAST_SEEN = 'lastSeen', FIRST_SEEN = 'firstSeen';
    const FULL_CONV = {lastSeen: 'fullLastSeen', firstSeen: 'fullFirstSeen'}
    const [sortType, setSortType] = useState(LAST_SEEN);

    const sortResults = (resultList, thisSortType) => {
        const sortBy = FULL_CONV[thisSortType];
        const sorted = resultList.sort((a, b) => new Date(b[sortBy]) - new Date(a[sortBy]));
        console.log(sortBy, sorted)
        return sorted;
    }

    function InfoBoxResults({resultList, sortType}) {

        const isDomain = indicatorData.type === 'Domain';

        function DateHeader({name, thisSortType, sortType})  {
            return (
                <th className="HoverClickLighten" onClick={() => setSortType(thisSortType)}>
                    <InlineDiv style={{alignItems:'center', justifyContent: 'spaceAround'}}>
                        {name}
                        <CircleCheckBox filled={sortType === thisSortType}/>
                    </InlineDiv>
                </th>
            );
        }

        // TODO: optimize/remove color text here
        
        return (
            <div className="ResultBox" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                marginBottom: 5, padding: 5, fontSize: 12, borderRadius: 8}}
            >
                <p style={{paddingRight: 8, color: 'orange', fontWeight: 'bold'}}>Results:</p>
                <table className="TableCollapseBorders">
                    <thead className="StickyTableHeader">
                        <th/>
                        {!isDomain || <><th>DNS Type</th><th>Type</th></>}
                        <th>Value</th>
                        <DateHeader name='First Seen' thisSortType={FIRST_SEEN} sortType={sortType}/>
                        <DateHeader name='Last Seen' thisSortType={LAST_SEEN} sortType={sortType}/>
                    </thead>
                    
                    <tbody>
                    {sortResults(resultList, sortType).map((result, i) =>
                        <tr key={i}>
                            <td>
                                <LinkBack query={result.resolve} style={{width: 12, height: 12, margin: 0, marginRight: 5}}/>
                            </td>
                            {!isDomain ||
                            <>
                                <td style={stringStyle}>{result.recordType}</td>
                                <td>
                                    <InlineRightDiv>
                                        {toColorElems(toColorText({[result.resolveType]: ' '}, false, false, false))}
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
            </div>
        );
    }
    
    const stringifyResult = (result) => {
        return `${
            (indicatorData.type === 'Domain') ? toColorText({[result.resolveType]: result.resolve}, false).val : toColorText(result.resolve).val}, ${
            toColorText({firstSeen: result.firstSeen}, false).val}, ${
            toColorText({lastSeen: result.lastSeen}, false).val}`;
    }
    
    const keysAndColorText = Object.keys(data).filter(key => key !== 'results').map(key => {
        const colorText = toColorText(data[key])
        return {key, colorText};
    }).filter(({colorText}) => colorText.val != null);
    
    const resultList = data.results;
    
    const copyVal = [indicatorData.stringify()].concat(keysAndColorText.map(({key, colorText}) =>
        `${key}: ${colorText.val}`)).concat(['Results:']).concat(sortResults(resultList, sortType).map(result => stringifyResult(result))).join('\n');
    
    return (
        <div className="WhoIsBox">
            <TooltipCopy value={copyVal}/>
            {keysAndColorText.map(({key, colorText}) =>
                infoBox(key, colorText)
            )}
            <InfoBoxResults resultList={resultList} sortType={sortType}/>
        </div>
    );
}
