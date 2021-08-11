import {makeUnbreakable, typeColors} from "../Util/Util";
import {ASCENDING, DESCENDING, sortVirusTotalResults} from "../Util/SortUtil";
import {LinkOut} from "./LinkBack";
import { boolPadRight, numPadRight, padRight, stringPadRight, stringStyle } from './ColorDictBox';
import {MaxLen} from "../Util/ElemUtil";

const snipDateBySpace = (dateStr) => makeUnbreakable(dateStr.substr(0, dateStr.indexOf(' ')));

const DEF_DATE = 'N/A ';

export function SampleTable({title, resultList, sortType, setSortType}) {

    // TODO: optimize/remove color text here

    return (
        <div className="ResultBox" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            marginBottom: 5, padding: 5, fontSize: 12, borderRadius: 8}}
        >
            <p style={{paddingRight: 8, color: 'orange', fontWeight: 'bold'}}>{title}:</p>
            <table className="TableCollapseBorders">
                <thead className="StickyTableHeader">
                <tr>
                    <th>positives</th>
                    <th>total</th>
                    <th>sha256</th>
                    <th/>
                    <th className="HoverClickLighten"
                        onClick={() => setSortType(sortType === DESCENDING ? ASCENDING : DESCENDING)}>
                        time {sortType === DESCENDING ? '∨' : '∧'}
                    </th>
                </tr>
                </thead>

                <tbody>
                {sortVirusTotalResults(resultList, sortType).map((result, i) => {
                    const {date = DEF_DATE, positives, total, sha256} = result;

                    return (
                        <tr key={`urlscan-result-row-${i}`}>
                            <td style={numPadRight}>{positives}</td>
                            <td className="TableSepLeft" style={numPadRight}>{total}</td>
                            <td className="TableSepLeft" style={stringPadRight}>
                                <MaxLen max={15}>{sha256}</MaxLen>
                            </td>
                            <td>
                                <LinkOut url={`https://www.virustotal.com/gui/search/${sha256}`} style={{width: 12, height: 12, margin: 0, marginRight: 5}}/>
                            </td>
                            <td className="TableSepLeft" style={stringStyle}>{snipDateBySpace(date)}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}

export function DetectedUrlTable({title, resultList, sortType, setSortType}) {

    // TODO: optimize/remove color text here

    return (
        <div className="ResultBox" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            marginBottom: 5, padding: 5, fontSize: 12, borderRadius: 8}}
        >
            <p style={{paddingRight: 8, color: 'orange', fontWeight: 'bold'}}>{title}:</p>
            <table className="TableCollapseBorders">
                <thead className="StickyTableHeader">
                <tr>
                    <th>positives</th>
                    <th>total</th>
                    <th>url</th>
                    <th className="HoverClickLighten"
                        onClick={() => setSortType(sortType === DESCENDING ? ASCENDING : DESCENDING)}>
                        scan date {sortType === DESCENDING ? '∨' : '∧'}
                    </th>
                </tr>
                </thead>

                <tbody>
                {sortVirusTotalResults(resultList, sortType).map((result, i) => {
                    const {scan_date:date = DEF_DATE, positives, total, url} = result;

                    return (
                        <tr key={`urlscan-result-row-${i}`}>
                            <td style={numPadRight}>{positives}</td>
                            <td className="TableSepLeft" style={numPadRight}>{total}</td>
                            <td className="TableSepLeft" style={stringPadRight}>
                                <MaxLen max={30}>{url}</MaxLen>
                            </td>
                            <td className="TableSepLeft" style={stringStyle}>{snipDateBySpace(date)}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}

export function UndetectedUrlTable({title, resultList, sortType, setSortType}) {

    // TODO: optimize/remove color text here

    const processedResultList = resultList.map(entry => {
        const [url, sha256, positives, total, date = DEF_DATE] = entry;
        return {url, sha256, positives, total, date};
    });
    
    return (
        <div className="ResultBox" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            marginBottom: 5, padding: 5, fontSize: 12, borderRadius: 8}}
        >
            <p style={{paddingRight: 8, color: 'orange', fontWeight: 'bold'}}>{title}:</p>
            <table className="TableCollapseBorders">
                <thead className="StickyTableHeader">
                <tr>
                    <th>positives</th>
                    <th>total</th>
                    <th>url</th>
                    <th>sha256</th>
                    <th/>
                    <th className="HoverClickLighten"
                        onClick={() => setSortType(sortType === DESCENDING ? ASCENDING : DESCENDING)}>
                        time {sortType === DESCENDING ? '∨' : '∧'}
                    </th>
                </tr>
                </thead>

                <tbody>
                {sortVirusTotalResults(processedResultList, sortType).map((result, i) => {
                    const {url, sha256, positives, total, date} = result;

                    return (
                        <tr key={`urlscan-result-row-${i}`}>
                            <td style={numPadRight}>{positives}</td>
                            <td className="TableSepLeft" style={numPadRight}>{total}</td>
                            <td className="TableSepLeft" style={stringPadRight}>
                                <MaxLen max={30}>{url}</MaxLen>
                            </td>
                            <td className="TableSepLeft" style={stringPadRight}>
                                <MaxLen max={15}>{sha256}</MaxLen>
                            </td>
                            <td>
                                <LinkOut url={`https://www.virustotal.com/gui/search/${sha256}`} style={{width: 12, height: 12, margin: 0, marginRight: 5}}/>
                            </td>
                            <td className="TableSepLeft" style={stringStyle}>{snipDateBySpace(date)}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}

export function ResolutionsTable({title, resultList, sortType, setSortType}) {

    // TODO: optimize/remove color text here

    let displayName = 'host name';
    let valName = 'hostname'
    if (resultList[0].ip_address) {
        displayName = 'ip address';
        valName = 'ip_address';
    }

    return (
        <div className="ResultBox" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            marginBottom: 5, padding: 5, fontSize: 12, borderRadius: 8}}
        >
            <p style={{paddingRight: 8, color: 'orange', fontWeight: 'bold'}}>{title}:</p>
            <table className="TableCollapseBorders">
                <thead className="StickyTableHeader">
                <tr>
                    <th>{displayName}</th>
                    <th className="HoverClickLighten"
                        onClick={() => setSortType(sortType === DESCENDING ? ASCENDING : DESCENDING)}>
                        last resolved {sortType === DESCENDING ? '∨' : '∧'}
                    </th>
                </tr>
                </thead>

                <tbody>
                {sortVirusTotalResults(resultList, sortType).map((result, i) => {
                    const {last_resolved:date = DEF_DATE, [valName]:val} = result;

                    return (
                        <tr key={`urlscan-result-row-${i}`}>
                            <td style={stringPadRight}>{val}</td>
                            <td className="TableSepLeft" style={stringStyle}>{snipDateBySpace(date)}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}

export function HashScansTable({title, resultList}) {

    const collapseScanName = (resultList) => {
        return Object.entries(resultList).map(([key, val]) => {
            return {scan: key, ...val};
        });
    }

    return (
        <div className="ResultBox" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            marginBottom: 5, padding: 5, fontSize: 12, borderRadius: 8}}
        >
            <p style={{paddingRight: 8, color: 'orange', fontWeight: 'bold'}}>{title}:</p>
            <table className="TableCollapseBorders">
                <thead className="StickyTableHeader">
                <tr>
                    <th>scan type</th>
                    <th>detected</th>
                    <th>result</th>
                    <th>update</th>
                    <th>version</th>
                </tr>
                </thead>

                <tbody>
                {collapseScanName(resultList).map((res, i) => {
                    const {scan, detected, result, update, version} = res;

                    return (
                        <tr key={`urlscan-result-row-${i}`}>
                            <td style={stringPadRight}>{scan}</td>
                            <td className="TableSepLeft" style={boolPadRight}>{''+detected}</td>
                            <td className="TableSepLeft" style={{...padRight, color: result ? typeColors.malicious : typeColors.null, fontWeight: result ? 'bold' : 'normal'}}>{result ?? 'null'}</td>
                            <td className="TableSepLeft" style={stringPadRight}>{update}</td>
                            <td className="TableSepLeft" style={stringStyle}>{version}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}