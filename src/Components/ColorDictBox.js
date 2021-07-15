import '../Style/App.css';
import { toColorElems, toColorText } from "../Util/Util";
import { LinkBack } from "./LinkBack";
import { Copy } from "./Copy";

const infoBox = (title, data) => {
    
    return (
        <div className="ResultBox" style={{justifyContent: 'space-between', marginBottom: 5, padding: 5, fontSize: 12, borderRadius: 8}}>
            <div style={{display: 'flex', justifyContent:'flex-start', maxWidth: 500, flexWrap: "wrap"}}>
                <p style={{paddingRight: 8, color: 'orange', fontWeight: 'bold'}}>{title}:</p>
                
                {toColorElems(data)}
            
            </div>
        </div>
    );
}

export function ColorDictBox({data}) {

    

    return (
        <div className="WhoIsBox">
            {
                Object.keys(data).map(key => {
                    const colorText = toColorText(data[key])

                    return (colorText.val) ? infoBox(key, colorText) : null
                })
            }
        </div>
    );
}

export function PassiveTotalPassiveDNSColorDictBox({data}) {
    
    const infoBoxResults = (results) => {
        
        let copyVal = '';
        results.forEach((result, i) => {
            if (i > 0) copyVal += '\n';
            copyVal += `${toColorText(result.resolve).val}, ${toColorText({firstSeen: result.firstSeen}, false).val}, ${toColorText({lastSeen: result.lastSeen}, false).val}`;
        });
        
        return (
            <div className="ResultBox" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                marginBottom: 5, padding: 5, fontSize: 12, borderRadius: 8}}
            >
                <span>
                    <p style={{paddingRight: 8, color: 'orange', fontWeight: 'bold'}}>Results:</p>
                    <Copy value={copyVal}/>
                </span>
                
                <div style={{display: 'flex', flexDirection: 'row', maxWidth: 800}}>
                    <div style={{display: 'flex', flexDirection: 'column', marginRight: 5}}>
                        {results.map(result =>
                            <div style={{display: 'flex', justifyContent:'flex-start'}}>
                                <LinkBack query={result.resolve} style={{width: 12, height: 12, margin: 0, marginRight: 5}}/>
                                {toColorElems(toColorText(result.resolve, false, true))}
                            </div>
                        )}
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', marginRight: 5}}>
                        {results.map(result =>
                            <div style={{display: 'flex', justifyContent:'flex-start'}}>
                                {
                                    toColorElems(toColorText({firstSeen: result.firstSeen}, false, true))
                                }
                            </div>
                        )}
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        {results.map(result =>
                            <div style={{display: 'flex', justifyContent:'flex-start'}}>
                                {
                                    toColorElems(toColorText({lastSeen: result.lastSeen}, false))
                                }
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="WhoIsBox">
            {
                Object.keys(data).map(key => {
                    
                    if (key === 'results') return infoBoxResults(data[key]);
    
                    const colorText = toColorText(data[key])
    
                    return (colorText.val) ? infoBox(key, colorText) : null
                })
            }
        </div>
    );
}
