import './App.css';
//import { useState, useEffect } from 'react';

// TODO: ip, hostname (domain [website]), phone number, email address, more?

function ResultsBox(props) {

    const genContents = () => {
        if (props.type === 'Domain') {
            return (
                <p>
                    https://community.riskiq.com/research?query={props.indicator}
                </p>
            );
        } else {
            console.log("awejfkleaw")
        }
    }

    return (
        <div className="ResultBox">
            <p className="ResultType" style={(props.resultType !== 'Invalid Input') ? {color: 'orange'} : {color: '#FF5C5C'}}>{props.resultType}:</p>
            <p>{props.indicator}</p>
            {genContents(props.resultType, props.indicator)}
        </div>
    );
}

export default ResultsBox;