import '../Style/App.css';
import LineElement from "./LineElement";

// TODO: ip, hostname (domain [website]), phone number, email address, more?

function ResultsBox(props) {

    return (
        <LineElement lineID="main" style={{marginBottom: 10}}>
            <div className="ResultBox">
                <p className="ResultType" style={{color: 'orange'}}>{props.result.type}{(props.result.subType === 'None') ? '' : '('+props.result.subType+')'}:</p>
                <p>{props.result.indicator}</p>
            </div>
        </LineElement>
    );
}

export default ResultsBox;
