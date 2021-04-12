import './App.css';

// TODO: ip, hostname (domain [website]), phone number, email address, more?

function ResultsBox(props) {

    return (
        <div className="ResultBox" ref={props.resultBoxRef}>
            <p className="ResultType" style={{color: 'orange'}}>{props.result.type}{(props.result.subType === 'None') ? '' : '('+props.result.subType+')'}:</p>
            <p>{props.result.indicator}</p>
        </div>
    );
}

export default ResultsBox;