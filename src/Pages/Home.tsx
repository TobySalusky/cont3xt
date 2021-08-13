import '../Style/App.css';
import SearchBar from "../Components/SearchBar";
import ResultsBox from "../Components/ResultsBox";
import { useState, useEffect, useContext } from 'react';
import LinkTab from "../Components/LinkTab";
import NumDayInput from "../Components/NumDayInput";
import {createConfig} from "../Util/Configurations";
// @ts-ignore
import {Link} from 'react-router-dom';
import {ConfigContext} from "../State/ConfigContext";
import ResultDNS from "../Components/ResultDNS";
import LineCanvas from "../Components/LineCanvas";
import {NumDaysContext} from "../State/SearchContext";
import {useReadArgsURL} from "../Util/URLHandler";
import LineElement from "../Components/LineElement";
import IPASNBox from "../Components/IPASNBox";
import { DisplayStatsContext } from '../State/DisplayStatsContext';
import { camelToCapWords } from '../Util/StringUtil';
import ValidationBox from '../Components/ValidationBox';
import { TsTest } from '../Util/Test';
import {IndicatorNode} from "../Types/IndicatorNode";
import {LinkGenerationData} from "../Types/Types";
import {RightIntegrationPanel} from "../Components/RightIntegrationPanel";
import {LeftStatsPanel} from "../Components/LeftStatsPanel";
import {ChildMutationObserver} from "../Components/ChildMutationObserver";

// NOTE: Open All function is blocked unless popup blocking is disable for website (add notice when it doesn't work?)
function Home() {

    // STATE
    const [numDays, ] = useContext(NumDaysContext)
    const [startDate, setStartDate] = useState('')
    const [results, setResults] = useState<IndicatorNode[]>([])

    const [instance, setInstance] = useState(0)

    const [desktopTabs, setDesktopTabs] = useState([])

    const [rawConfigs, ] = useContext(ConfigContext)
    const readArgsURL = useReadArgsURL();
    
    const [displayStats, ] = useContext(DisplayStatsContext)
    
    const readURL = () => {
        readArgsURL()
    }
    useEffect(() => { // on mount
        window.addEventListener("popstate", readURL)
        readArgsURL()
    }, [])

    useEffect(() => { // TODO: maybe remove instance (may be unnecessary)
        setInstance(instance + 1);
    }, [results, numDays, rawConfigs]);

    useEffect(() => {
        if (results.length === 0) return;

        const linkGenerationData : LinkGenerationData = {
            type: results[0].type,
            subType: results[0].subType,
            indicator: results[0].value,
            numDays,
            startDate,
        }

        setDesktopTabs(rawConfigs.map((configStr: string) => <LinkTab config={createConfig(configStr)} data={linkGenerationData} listen={instance}/>));
    }, [instance]);

    useEffect(() => {
        setStartDate(dateNDaysAgo(numDays))
    }, [numDays]);

    const dateNDaysAgo = (numDays : number) : string => {
        const date = new Date();
        date.setDate(date.getDate()-numDays);
        return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    }

    const genResults = () => {

        /*return results.map(result =>
            (
                <div>
                    <LineCanvas>
                        <div style={{display:'flex', flexDirection:'row'}}>
                            <div style={{display:'flex', flexDirection:'column'}}>
                                
                                <ResultsBox result={result}/>

                                <ValidationBox status={result.valid} banner={result.emailVerificationBanner}/>
                                
                                <ResultDNS dns={result.dns} ipData={result.ipData}/>

                                {(!result.ipData) ? null :
                                    <LineElement lineID="ip-asn" lineFrom="main" style={{marginBottom: 5, marginLeft: 40}}>
                                        <IPASNBox ipData={result.ipData}/>
                                    </LineElement>
                                }

                            </div>
                        </div>
                    </LineCanvas>
                </div>
            )
        );*/
        //console.log(results);
        return results.map(indicatorNode =>
            <div>
                <LineCanvas>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <div style={{display:'flex', flexDirection:'column'}}>
                            {indicatorNode.genUI()}
                        </div>
                    </div>
                </LineCanvas>
            </div>
        );
    }

    return (
        <ChildMutationObserver>
            <div className="HomeWrapper">
                <LeftStatsPanel/>
                <div className="App">
                    <div className="TopBar">
                        <div className="InputAreas">
                            <NumDayInput startDate={startDate}/>
                            <SearchBar results={results} setResults={setResults}/>
                            <Link to="/configurations">
                                <img className="IconButton" src="./images/settingsBars.png" alt="settings button"/>
                            </Link>
                        </div>

                        <div className="ResultArea">
                            {genResults()}
                        </div>
                    </div>

                    <div className="Divider"/>

                    <div className="Desktop">
                        <div className="DesktopSide"/>

                        <div className="MainDesktop">
                            {desktopTabs}
                        </div>

                        <div className="DesktopSide"/>
                    </div>
                </div>
                <RightIntegrationPanel/>
            </div>
        </ChildMutationObserver>
    );
}

export default Home;
