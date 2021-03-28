import './App.css';
import SearchBar from "./SearchBar";
import ResultsBox from "./ResultsBox";
import { useState, useEffect } from 'react';
import GeneralHunting from "./GeneralHunting";

// NOTE: Open All function is blocked unless popup blocking is disable for website (add notice when it doesn't work?)

function App() {

    const [results, setResults] = useState([])

    const [generalHunting, setGeneralHunting] = useState([])

    useEffect(() => {
        if (results.length == 0 || results[0][0] === 'Text') {
            setGeneralHunting();
        } else {
            setGeneralHunting(<GeneralHunting type={results[0][0]} indicator={results[0][1]} listen={results}/>)
        }
    }, [results]);

    return (
        <div className="App">
            <div className="TopBar">
                <SearchBar setResults={setResults}/>

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

                <div className="DesktopBox">
                    <div className="DesktopTitle">
                        Internal Tools
                    </div>
                </div>

                <div className="DesktopBox">
                    <div className="DesktopTitle">
                        Enterprise Links
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
