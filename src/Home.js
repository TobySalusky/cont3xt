import './App.css';
import SearchBar from "./SearchBar";
import ResultsBox from "./ResultsBox";
import { useState, useEffect, useContext } from 'react';
import LinkTab from "./LinkTab";
import NumDayInput from "./NumDayInput";
import {createConfig} from "./Configurations";
import {Link} from 'react-router-dom';
import {ConfigContext} from "./ConfigContext";

// NOTE: Open All function is blocked unless popup blocking is disable for website (add notice when it doesn't work?)

function Home() {

    const [numDays, setNumDays] = useState(7)
    const [startDate, setStartDate] = useState(7)
    const [results, setResults] = useState([])

    const [instance, setInstance] = useState(0)

    const [desktopTabs, setDesktopTabs] = useState([])

    const [rawConfigs, setRawConfigs] = useContext(ConfigContext)

    useEffect(() => {
        setInstance(instance + 1);
    }, [results, numDays]);

    useEffect(() => {
        if (results.length === 0) return;

        const data = {
            type: results[0].type,
            subType: results[0].subType,
            indicator: results[0].indicator,
            numDays,
            startDate,
        }

        console.log(Object.keys(rawConfigs))

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

    return (

        <div className="App">
            <div className="TopBar">
                <div className="InputAreas">
                    <NumDayInput startDate={startDate} numDays = {numDays} setNumDays={setNumDays}/>
                    <SearchBar setResults={setResults}/>
                </div>

                <div className="ResultArea">
                    {results.map(result =>
                        (
                            <ResultsBox result={result}/>
                        )
                    )}
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
