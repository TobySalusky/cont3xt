import './App.css';
import SearchBar from "./SearchBar";
import ResultsBox from "./ResultsBox";
import { useState, useEffect } from 'react';
import GeneralHunting from "./GeneralHunting";
import NumDayInput from "./NumDayInput";
import InternalTools from "./InternalTools";
import EnterpriseLinks from "./EnterpriseLinks";

// NOTE: Open All function is blocked unless popup blocking is disable for website (add notice when it doesn't work?)

function App() {

    const [numDays, setNumDays] = useState(7)
    const [startDate, setStartDate] = useState(7)
    const [results, setResults] = useState([])

    const [generalHunting, setGeneralHunting] = useState([])
    const [internalTools, setInternalTools] = useState([])
    const [enterpriseLinks, setEnterpriseLinks] = useState([])

    useEffect(() => {
        if (results.length == 0 || results[0][0] === 'Text') {
            setGeneralHunting();
            setInternalTools();
            setEnterpriseLinks();
        } else {
            const data = {
                numDays,
                startDate
            }
            setGeneralHunting(<GeneralHunting type={results[0][0]} indicator={results[0][1]} listen={results}/>)
            setInternalTools(<InternalTools type={results[0][0]} indicator={results[0][1]} data={data} listen={results}/>)
            setEnterpriseLinks(<EnterpriseLinks type={results[0][0]} indicator={results[0][1]} listen={results}/>)
        }
    }, [results]);

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
                            <ResultsBox resultType={result[0]} indicator={result[1]}/>
                        )
                    )}
                </div>
            </div>

            <div className="Divider"></div>

            <div className="MainDesktop">
                {generalHunting}
                {internalTools}
                {enterpriseLinks}
            </div>
        </div>
    );
}

export default App;
