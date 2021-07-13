import '../Style/App.css';
import LineElement from "./LineElement";
import { Integrations } from "./Integrations";

// TODO: ip, hostname (domain [website]), phone number, email address, more?

function ResultsBox({result}) {

    return (
        <LineElement lineID="main" style={{marginBottom: 10}}>
            <div className="ResultBox">
                <p className="ResultType" style={{color: 'orange'}}>{result.type}{(result.subType === 'None') ? '' : '('+result.subType+')'}:</p>
                <p>{result.indicator}</p>
                <Integrations integrations={{
                    spurResult: result.spurResult,
                    censysResult: result.censysResult,
                    whoisResult: result.whoisResult,
                }}/>
            </div>
        </LineElement>
    );
}

export default ResultsBox;
