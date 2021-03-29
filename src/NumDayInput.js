import './App.css';
import { useState, useEffect } from 'react';

// TODO: ip, hostname (domain [website]), phone number, email address, more?
// TODO: auto-format phone number results

function NumDayInput(props) { // TODO: HAVE AUTO-SELECTED WHEN PAGE IS OPENED!!

    return (
        <div className="DayContainer">
            <p>Days Back:</p>
            <input className="NumDaysInput" type="text" value={props.numDays} onChange={e => props.setNumDays(e.target.value)}/>
            <p>{props.startDate}</p>
        </div>
    );
}

export default NumDayInput;