import './App.css';
import SearchBar from "./SearchBar";
import ResultsBox from "./ResultsBox";
import { useState } from 'react';


function App() {

    const [result, setResult] = useState([])

    return (
        <div className="App">
            <SearchBar setResult={setResult}/>

            <div className="ResultArea">
                {result}
            </div>

            <div className="MainDesktop">
            </div>
        </div>
    );
}

export default App;
