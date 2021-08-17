import '../Style/App.css';
import { useContext, useEffect } from 'react';
import {NumDaysContext} from "../State/SearchContext";
import {argsFromURL, useUpdateArgsURL} from "../Util/URLHandler";
import { makeUnbreakable } from "../Util/Util";
import { Unbreakable } from "../Style/Unbreakable";

// TODO: ip, hostname (domain [website]), phone number, email address, more?
// TODO: auto-format phone number results

function NumDayInput({startDate}) { // TODO: HAVE AUTO-SELECTED WHEN PAGE IS OPENED!!

    const [numDays, setNumDays] = useContext(NumDaysContext)
    const updateArgsURL = useUpdateArgsURL();

    const updateDayURL = () => {
        updateArgsURL()
    }

    const enterPressed = (e) => {
        const code = e.keyCode || e.which;
        if (code === 13) { //13 is the enter keycode
            updateDayURL()
        }
    }

    return (
        <div className="DayContainer">
            <div style={{paddingRight: 5, fontSize: 14, display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                <Unbreakable>Days Back:</Unbreakable>
                <Unbreakable>{startDate}</Unbreakable>
            </div>
            <input onKeyPress={enterPressed} onBlur={updateDayURL} className="NumDaysInput" type="number" value={numDays} min={0} onChange={e => setNumDays(e.target.value)}/>
        </div>
    );
}

export default NumDayInput;
