import '../Style/App.css';
import React, {useContext, useEffect, useState} from 'react';
import {useUpdateArgsURL} from "../Util/URLHandler";
import {Base64Context, QueryContext} from "../State/SearchContext";
import {DisplayStatsContext} from '../State/DisplayStatsContext';
import dr from 'defang-refang'
import {whiteFilter} from "../Util/Filters";
import {downloadFullReport} from "../Util/ReportGenerator";
import {IndicatorNode} from "../Types/IndicatorNode";
import {ActiveIntegrationContext} from "../State/ActiveIntegrationContext";
import {ITypes} from "../Enums/ITypes";
import extractDomain from "extract-domain";
import DarkTooltip from "../Style/DarkTooltip";


// TODO: ip, hostname (domain [website]), phone number, email address, more?
// TODO: auto-format phone number results

export const copyBase64LinkToClipboard = (query : string) => {
    const { base64encode } = require('nodejs-base64');
    navigator.clipboard.writeText(`http://localhost:3000/?b=${base64encode(query)}`)
}

export const processQuery = (query : string) => {
    return dr.refang(query.trim());
}


const SearchBar : React.FC<{
    results : IndicatorNode[],
    setResults : any
}> = ({results, setResults}) => {

    const [search, setSearch] = useState('');
    const [query, setQuery] = useContext(QueryContext);
    const [, setBase64] = useContext(Base64Context);
    const updateArgsURL = useUpdateArgsURL();
    const [displayStats, setDisplayStats] = useContext(DisplayStatsContext)
    const [, setActiveIntegration] = useContext(ActiveIntegrationContext);

    useEffect(() => {

        setDisplayStats({});

        setActiveIntegration(null);

        if (query === '') {
            setResults([])
            return;
        }

        updateArgsURL()

        const indicator = query;
        const topResultNode = new IndicatorNode(indicator, {topLevel: true});
        const newResults = [topResultNode];

        IndicatorNode.rerender = ()=>{
            setResults([...newResults]);
        }

        // TODO: sanitize indicator (phone, etc.)
        if (topResultNode.type === ITypes.Email) {
            const domain = indicator.substring(indicator.indexOf('@') + 1);

            newResults.push(new IndicatorNode(domain, {topLevel: true}));
        } else if (topResultNode.type === ITypes.Url) {
            const domain = extractDomain(indicator);

            newResults.push(new IndicatorNode(domain, {topLevel: true}));
        }


        setResults(newResults)
        console.log(newResults);

    }, [query]);

    const getQuery = (e : any) => {
        e.preventDefault();
        if (query !== search && search !== '') {
            setBase64(null);
            setQuery(processQuery(search));
        }
        setSearch('');
    }

    return (
        <form className="SearchContainer" onSubmit={getQuery}>
            <input id='SearchBar' autoFocus className="SearchBar" type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder='indicators:'/>
            <DarkTooltip title='Share Link'>
                <div className="Base64Copy" onClick={()=>{
                    copyBase64LinkToClipboard(query);
                }}>
                    <img style={{...{width: 20, height: 20, marginLeft: 0}, ...whiteFilter}} className="ExternalLink" src="./images/share.svg" alt="share link"/>
                </div>
            </DarkTooltip>
            <DarkTooltip title='Generate Report'>
                <div className="Base64Copy" onClick={()=>{
                    if (results?.[0]) {
                        downloadFullReport(results[0]);
                    }
                }}>
                    <img style={{...{width: 20, height: 20, marginLeft: 0}, ...whiteFilter}} className="ExternalLink" src="./images/report.svg" alt="generate report"/>
                </div>
            </DarkTooltip>
            <button className="SearchSubmit" type="submit">
                {'Get\xa0Cont3xt'}
            </button>
        </form>
    );
}

export default SearchBar;
