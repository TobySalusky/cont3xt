import '../Style/App.css';
import {
    toColorElems,
    toColorText,
    typeColors,
    toColorElemsMultiline, makeUnbreakable, makeClickableLink
} from "../Util/Util";
import {LinkBack, LinkOut} from "./LinkBack";
import { TooltipCopy } from "./TooltipCopy";
import { InlineDiv, InlineRightDiv } from "../Util/StyleUtil";
import { CircleCheckBox } from "./CircleCheckBox";
import { useState } from "react";
import { generateIntegrationReportTooltipCopy } from "../Util/IntegrationReports";
import {
    ASCENDING,
    DESCENDING,
    FIRST_SEEN,
    LAST_SEEN,
    sortPassiveDNSResults,
    sortUrlScanResults
} from "../Util/SortUtil";
import { toOrderedKeys } from "../Util/IntegrationCleaners";
import { countryCodeEmoji } from 'country-code-emoji';
import {DetectedUrlTable, HashScansTable, ResolutionsTable, SampleTable, UndetectedUrlTable} from "./VirusTotalTables";
import DarkTooltip from "../Style/DarkTooltip";


const infoBox = (title, data) => {

    return (
        <div className="ResultBox" style={{justifyContent: 'space-between', marginBottom: 5, padding: 5, fontSize: 12, borderRadius: 8}}>
            <div style={{display: 'flex', justifyContent:'flex-start',
                maxWidth: 1000, flexWrap: "wrap", flexDirection: 'row'}}>
                <p style={{paddingRight: 8, color: 'orange', fontWeight: 'bold'}}>{title}:</p>

                {toColorElemsMultiline(data)}

            </div>
        </div>
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
export const padRight = {paddingRight: 5};
export const stringPadRight = {...padRight, ...stringStyle}
export const boolPadRight = {...padRight, ...boolStyle}

export function PassiveTotalPassiveDNSColorDictBox({type, data, indicatorData}) {
    
    const [sortType, setSortType] = useState(FIRST_SEEN);

    function InfoBoxResults({resultList, sortType}) {

        const isDomain = indicatorData.type === 'Domain';

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
            <div className="ResultBox" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                marginBottom: 5, padding: 5, fontSize: 12, borderRadius: 8}}
            >
                <p style={{paddingRight: 8, color: 'orange', fontWeight: 'bold'}}>Results:</p>
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
            </div>
        );
    }

    const {results:resultList, ...otherData} = data;

    return (
        <div className="WhoIsBox">
            <TooltipCopy valueFunc={() => generateIntegrationReportTooltipCopy(indicatorData, type, data, {sortType: sortType})}/>
            {autoOrderedInfoBoxes(type, otherData)}
            {!resultList || <InfoBoxResults resultList={resultList} sortType={sortType}/>}
        </div>
    );
}

export function UrlScanColorDictBox({type, data, indicatorData}) {

    const [sortType, setSortType] = useState(DESCENDING);

    function InfoBoxResults({resultList, sortType}) {

        // TODO: optimize/remove color text here

        const snipDate = (dateStr) => makeUnbreakable(dateStr.substr(0, dateStr.indexOf('T')));

        return (
            <div className="ResultBox" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                marginBottom: 5, padding: 5, fontSize: 12, borderRadius: 8}}
            >
                <p style={{paddingRight: 8, color: 'orange', fontWeight: 'bold'}}>Results:</p>
                <table className="TableCollapseBorders">
                    <thead className="StickyTableHeader">
                    <tr>
                        <th>visibility</th>
                        <th>method</th>
                        <th>url</th>
                        <th/>
                        <th>country</th>
                        <th>server</th>
                        <th>status</th>
                        <th>screenshot</th>
                        <th className="HoverClickLighten"
                            onClick={() => setSortType(sortType === DESCENDING ? ASCENDING : DESCENDING)}>
                            time {sortType === DESCENDING ? '∨' : '∧'}
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {sortUrlScanResults(resultList, sortType).map((result, i) => {
                        const {visibility, method, url, uuid, time} = result.task ?? {};
                        const {country = 'N/A', server, status} = result.page ?? {};
                        const {screenshot} = result;

                        return (
                            <tr key={`urlscan-result-row-${i}`}>
                                <td style={stringPadRight}>{visibility}</td>
                                <td className="TableSepLeft" style={stringPadRight}>{method}</td>
                                <td className="TableSepLeft" style={stringPadRight}>
                                    <DarkTooltip title={url} interactive>
                                        <InlineDiv>
                                            <p>{url.substr(0, 40)}</p>
                                            {url.length <= 40 ? null : <p style={{color:'white'}}>...</p>}
                                        </InlineDiv>
                                    </DarkTooltip>
                                </td>
                                <td>
                                    <LinkOut url={`https://urlscan.io/result/${uuid}`} style={{width: 12, height: 12, margin: 0, marginRight: 5}}/>
                                </td>
                                <td className="TableSepLeft" style={stringPadRight}>{country}{country !== 'N/A' ? ` ${countryCodeEmoji(country)}` : ''}</td>
                                <td className="TableSepLeft" style={stringPadRight}>{server}</td>
                                <td className="TableSepLeft" style={{...stringPadRight, color:typeColors.number}}>{status}</td>
                                <td className="TableSepLeft" style={stringPadRight}>{makeClickableLink(screenshot, screenshot.substr(0, 15))}</td>
                                <td className="TableSepLeft" style={stringStyle}>{snipDate(time)}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        );
    }

    const {results:resultList, ...otherData} = data;

    return (
        <div className="WhoIsBox">
            <TooltipCopy valueFunc={() => generateIntegrationReportTooltipCopy(indicatorData, type, data, {sortType: sortType})}/>
            {autoOrderedInfoBoxes(type, otherData)}
            {!resultList || <InfoBoxResults resultList={resultList} sortType={sortType}/>}
        </div>
    );
}


export function VirusTotalBox({type, data, indicatorData}) {

    const [sortType, setSortType] = useState(DESCENDING);

    const orderedKeys = toOrderedKeys(type, Object.keys(data));

    return (
        <div className="WhoIsBox">
            <TooltipCopy valueFunc={() => generateIntegrationReportTooltipCopy(indicatorData, type, data, {sortType: sortType})}/>
            {orderedKeys.map(key => {

                if (key === 'detected_urls') {
                    return {res: <DetectedUrlTable title={key} resultList={data[key]} sortType={sortType} setSortType={setSortType}/>};
                }

                if (key === 'undetected_urls') {
                    return {res: <UndetectedUrlTable title={key} resultList={data[key]} sortType={sortType} setSortType={setSortType}/>};
                }

                // eslint-disable-next-line default-case
                switch (key) {
                    case 'detected_urls':
                        return {res: <DetectedUrlTable title={key} resultList={data[key]} sortType={sortType} setSortType={setSortType}/>};
                    case 'undetected_urls':
                        return {res: <UndetectedUrlTable title={key} resultList={data[key]} sortType={sortType} setSortType={setSortType}/>};
                    case 'resolutions':
                        return {res: <ResolutionsTable title={key} resultList={data[key]} sortType={sortType} setSortType={setSortType}/>};
                }

                if (key.endsWith('samples')) {
                    return {res: <SampleTable title={key} resultList={data[key]} sortType={sortType} setSortType={setSortType}/>};
                }

                if (key === 'scans') {
                    return {res: <HashScansTable title={key} resultList={data[key]}/>};
                }

                const colorData = toColorText(data[key])
                return {key, colorData};
            }).filter(({res, colorData}) => res != null || colorData != null).map(({res, key, colorData}) => {
                if (res) return res;
                return infoBox(key, colorData)
            })}
        </div>
    );
}
