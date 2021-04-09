import './App.css';
import { useContext, useEffect } from 'react';
import {NumDaysContext} from "./SearchContext";
import {argsFromURL, useUpdateArgsURL} from "./URLHandler";

// TODO: ip, hostname (domain [website]), phone number, email address, more?
// TODO: auto-format phone number results

function NumDayInput({startDate}) { // TODO: HAVE AUTO-SELECTED WHEN PAGE IS OPENED!!

    const [numDays, setNumDays] = useContext(NumDaysContext)
    const updateArgsURL = useUpdateArgsURL();

    const updateDayURL = () => {
        updateArgsURL()
    }

    const enterPressed = (e) => {
        let code = e.keyCode || e.which;
        if(code === 13) { //13 is the enter keycode
            updateDayURL()
        }
    }

    return (
        <div className="DayContainer">
            <p>Days Back:</p>
            <input onKeyPress={enterPressed} onBlur={updateDayURL} className="NumDaysInput" type="text" value={numDays} onChange={e => setNumDays(e.target.value)}/>
            <p>{startDate}</p>
        </div>
    );
}

export default NumDayInput;
