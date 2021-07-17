import '../Style/App.css';
import LineElement from "./LineElement";
import { Integrations } from "./Integrations";
import { Copy } from "./Copy";
import { LinkBack } from "./LinkBack";

// TODO: ip, hostname (domain [website]), phone number, email address, more?

function ResultsBox({result}) {

    return (
        <LineElement lineID="main" style={{marginBottom: 10}}>
            <div className="ResultBox" style={{alignItems: 'center'}}>
                <p className="ResultType" style={{color: 'orange'}}>{result.type}{(result.subType === 'None') ? '' : '('+result.subType+')'}:</p>
                <p>{result.indicator}</p>
                <Copy value={result.indicator}/>
                <LinkBack query={result.indicator}/>
                <Integrations integrations={result.integrations}/>
            </div>
        </LineElement>
    );
}

export default ResultsBox;
