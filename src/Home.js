import './App.css';
import SearchBar from "./SearchBar";
import ResultsBox from "./ResultsBox";
import { useState, useEffect, useContext, useRef } from 'react';
import LinkTab from "./LinkTab";
import NumDayInput from "./NumDayInput";
import {createConfig} from "./Configurations";
import {Link} from 'react-router-dom';
import {ConfigContext} from "./ConfigContext";
import ResultExtras from "./ResultExtras";
import LineCanvas from "./LineCanvas";
import {NumDaysContext} from "./SearchContext";
import {useReadArgsURL} from "./URLHandler";

// NOTE: Open All function is blocked unless popup blocking is disable for website (add notice when it doesn't work?)

function Home() {

    // STATE
    const [numDays, setNumDays] = useContext(NumDaysContext)
    const [startDate, setStartDate] = useState(7)
    const [results, setResults] = useState([])

    const [instance, setInstance] = useState(0)

    const [desktopTabs, setDesktopTabs] = useState([])

    const [rawConfigs, setRawConfigs] = useContext(ConfigContext)
    const readArgsURL = useReadArgsURL();

    // REFS
    const refStack = useRef([]);
    const refIndex = useRef(0);

    const topRefs = useRef([]);
    const subRefs = useRef([[]]);

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

        const data = {
            type: results[0].type,
            subType: results[0].subType,
            indicator: results[0].indicator,
            numDays,
            startDate,
        }

        setDesktopTabs(rawConfigs.map(config => <LinkTab config={createConfig(config)} data={data} listen={instance}/>));
    }, [instance]);

    useEffect(() => {
        setStartDate(dateNDaysAgo(numDays))
    }, [numDays]);

    const dateNDaysAgo = (numDays) => {
        const date = new Date();
        date.setDate(date.getDate()-numDays);
        return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    }

    const genResults = () => {

        subRefs.current = [[]]

        return results.map(result => // <LineCanvas refData={{refIndex, refStack, topRefs, subRefs}}>
            (
                <div>
                    <LineCanvas refData={{refIndex, refStack, topRefs, subRefs}}>
                        <ResultsBox result={result} resultBoxRef={el => topRefs.current[0] = el}/>
                        <ResultExtras whoIs={result.whoIsData} dns={result.dns} refData={{refIndex, refStack, topRefs, subRefs}} ipData={result.ipData}/>
                    </LineCanvas>
                </div>
            )
        );
    }

    return (

        <div className="App">
            <div className="TopBar">
                <div className="InputAreas">
                    <NumDayInput startDate={startDate}/>
                    <SearchBar results={results} setResults={setResults}/>
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

                <div className="DesktopSide">
                    <Link to="/configurations">
                        <img className="IconButton" src="./images/settingsBars.png" alt="settings button"/>
                    </Link>
                </div>
            </div>

        </div>
    );
}

export default Home;
