import '../Style/App.css';
import { toColorElems, toColorText } from "../Util/Util";
import { LinkBack } from "./LinkBack";
import { Copy } from "./Copy";
import { TooltipCopy } from "./TooltipCopy";

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

export function ColorDictBox({data, indicatorData}) {

    const keysAndColorText = Object.keys(data).map(key => {
        const colorText = toColorText(data[key])
        return {key, colorText};
    }).filter(({colorText}) => colorText.val != null);
    
    const copyVal = [indicatorData.stringify()].concat(keysAndColorText.map(({key, colorText}) =>
        `${key}: ${colorText.val}`)).join('\n');
    
    return (
        <div className="WhoIsBox">
            <TooltipCopy value={copyVal}/>
            {
                keysAndColorText.map(({key, colorText}) => {
                    return infoBox(key, colorText)
                })
            }
        </div>
    );
}

export function PassiveTotalPassiveDNSColorDictBox({data, indicatorData}) {
    
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
                <p style={{paddingRight: 8, color: 'orange', fontWeight: 'bold'}}>Results:</p>
                
                <div style={{display: 'flex', flexDirection: 'row', maxWidth: 1000}}>
                    
                    {indicatorData.type !== 'Domain' ? null :
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            {results.map(result =>
                                <div style={{display: 'flex', justifyContent:'flex-start'}}>
                                    <LinkBack query={result.resolve} style={{width: 12, height: 12, margin: 0, marginRight: 5}}/>
                                    {toColorElems(toColorText({[result.resolveType]: ' '}, false, false, false))}
                                </div>
                            )}
                        </div>
                    }
                    <div style={{display: 'flex', flexDirection: 'column', marginRight: 5}}>
                        {results.map(result =>
                            <div style={{display: 'flex', justifyContent:'flex-start'}}>
                                {indicatorData.type === 'Domain' ? null :
                                    <LinkBack query={result.resolve} style={{width: 12, height: 12, margin: 0, marginRight: 5}}/>
                                }
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
    
    const stringifyResult = (result) => {
        return `${
            (indicatorData.type === 'Domain') ? toColorText({[result.resolveType]: result.resolve}, false).val : toColorText(result.resolve).val}, ${
            toColorText({firstSeen: result.firstSeen}, false).val}, ${
            toColorText({lastSeen: result.lastSeen}, false).val}`;
    }
    
    const keysAndColorText = Object.keys(data).map(key => {
        const colorText = toColorText(data[key])
        return {key, colorText};
    }).filter(({key, colorText}) => colorText.val != null && key !== 'results');
    
    const results = data.results;
    
    const copyVal = [indicatorData.stringify()].concat(keysAndColorText.map(({key, colorText}) =>
        `${key}: ${colorText.val}`)).concat(['Results:']).concat(results.map(result => stringifyResult(result))).join('\n');
    
    return (
        <div className="WhoIsBox">
            <TooltipCopy value={copyVal}/>
            {keysAndColorText.map(({key, colorText}) =>
                infoBox(key, colorText)
            )}
            {infoBoxResults(results)}
        </div>
    );
}
