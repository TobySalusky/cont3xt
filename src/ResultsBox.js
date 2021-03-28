import './App.css';

// TODO: ip, hostname (domain [website]), phone number, email address, more?

function ResultsBox(props) {

    return (
        <div className="ResultBox">
            <p className="ResultType" style={(props.resultType !== 'Invalid Input') ? {color: 'orange'} : {color: '#FF5C5C'}}>{props.resultType}:</p>
            <p>{props.indicator}</p>
        </div>
    );
}

export default ResultsBox;