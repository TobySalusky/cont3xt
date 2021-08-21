import '../Style/App.css';
import SearchBar from "../Components/SearchBar";
import { useState, useEffect, useContext } from 'react';
import LinkTab from "../Components/LinkTab";
import NumDayInput from "../Components/NumDayInput";
import {createConfig} from "../Util/Configurations";
// @ts-ignore
import {Link} from 'react-router-dom';
import {ConfigContext} from "../State/ConfigContext";
import LineCanvas from "../Components/LineCanvas";
import {NumDaysContext} from "../State/SearchContext";
import {useReadArgsURL} from "../Util/URLHandler";
import {IndicatorNode} from "../Types/IndicatorNode";
import {IntegrationGenerationProgressReport, LinkGenerationData} from "../Types/Types";
import {RightIntegrationPanel} from "../Components/RightIntegrationPanel";
import {LeftStatsPanel} from "../Components/LeftStatsPanel";
import {ChildMutationObserver} from "../Components/ChildMutationObserver";
import {whiteFilter} from "../Util/Filters";
import {IntegrationProgressBar} from "../Components/IntegrationProgressBar";
import {Global} from "../Settings/Global";
import {ISubTypes, ITypes} from "../Enums/ITypes";

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
            type: ITypes[results[0].type],
            subType: ISubTypes[results[0].subType],
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

    const reportIntegrationProgress = (nodes: IndicatorNode[]): IntegrationGenerationProgressReport => {
        return nodes.map(node => node.reportIntegrationProgress()).reduce((a, b): IntegrationGenerationProgressReport => {
            return {
                numFinished: a.numFinished + b.numFinished,
                numOutgoing: a.numOutgoing + b.numOutgoing,
                numReturned: a.numReturned + b.numReturned,
                numFailed: a.numFailed + b.numFailed
            };
        }, {numFailed: 0, numReturned: 0, numFinished: 0, numOutgoing: 0});
    }

    const genResults = () => {
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
                        <div className="InputAreasTopWrapper">
                            <div className="InputAreas">
                                <NumDayInput startDate={startDate}/>
                                <SearchBar results={results} setResults={setResults}/>
                                <Link to="/configurations">
                                    <img className="IconButton" style={whiteFilter} src="./images/settingsBars.png" alt="settings button"/>
                                </Link>
                            </div>
                        </div>

                        <div className="ResultArea">
                            {genResults()}
                            {!Global.settings.progressBar || <IntegrationProgressBar report={reportIntegrationProgress(results)}/>}
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
