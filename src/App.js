import './App.css';
import SearchBar from "./SearchBar";
import ResultsBox from "./ResultsBox";
import { useState, useEffect } from 'react';
import LinkTab from "./LinkTab";
import NumDayInput from "./NumDayInput";
import {GeneralHunting, InternalTools, EnterpriseLinks} from "./Configurations";

// NOTE: Open All function is blocked unless popup blocking is disable for website (add notice when it doesn't work?)

function App() {

    const [numDays, setNumDays] = useState(7)
    const [startDate, setStartDate] = useState(7)
    const [results, setResults] = useState([])

    const [instance, setInstance] = useState(0)

    const [generalHunting, setGeneralHunting] = useState([])
    const [internalTools, setInternalTools] = useState([])
    const [enterpriseLinks, setEnterpriseLinks] = useState([])

    // debug
    useEffect(() => {

    }, []);

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

        setGeneralHunting(<LinkTab title="General Hunting" config={GeneralHunting} data={data} listen={instance}/>)
        setInternalTools(<LinkTab title="Internal Tools" config={InternalTools} data={data} listen={instance}/>)
        setEnterpriseLinks(<LinkTab title="Enterprise Links" config={EnterpriseLinks} data={data} listen={instance}/>)
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

            <div className="MainDesktop">
                {generalHunting}
                {internalTools}
                {enterpriseLinks}
            </div>
        </div>
    );
}

export default App;
