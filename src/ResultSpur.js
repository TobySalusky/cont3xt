import './App.css';
import LineElement from "./LineElement";
import DarkTooltip from "./DarkTooltip";


export default function ResultSpur({result}) {

    const infoBox = (title, data) => {
        return (
            <div className="ResultBox" style={{justifyContent: 'space-between', marginBottom: 5, padding: 5, fontSize: 12}}>
                <div style={{display: 'flex', justifyContent:'flex-start'}}>
                    <p style={{paddingRight: 8, color: 'orange', fontWeight: 'bold'}}>{title}:</p>
                    <p>{data}</p>
                </div>
            </div>
        );
    }

    const toText = (variable) => {
        const isDict = variable => {
            return typeof variable === "object" && !Array.isArray(variable);
        };

        if (isDict(variable)) {
            let str = '{'
            let init = true
            for (const key of Object.keys(variable)) {
                if (!init) str += ', '
                str += `${key}: ${variable[key]}`
                init = false
            }

            return str + '}'
        }
        return variable
    }

    const genBoxSpur = () => {

        return (
            <LineElement lineID="spur" lineFrom="main" style={{marginLeft: 40, marginBottom: 5}}>
                <div className="WhoIsBox">
                    <p style={{fontWeight:'bolder', color:'cyan'}}>SPUR</p>
                    {
                        Object.keys(result.spurResult.data).map(key => {
                            return infoBox(key, toText(result.spurResult.data[key]))
                        })
                    }
                </div>
            </LineElement>
        );
    }


    return (
        <div>

            {
                (result.spurResult && result.spurResult.data) ? genBoxSpur() : null
            }

        </div>
    );
}

