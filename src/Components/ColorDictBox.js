import '../Style/App.css';
import { toColorText } from "../Util/Util";

const infoBox = (title, data) => {
    let text = data.val
    let colors = data.colorData
    
    return (
        <div className="ResultBox" style={{justifyContent: 'space-between', marginBottom: 5, padding: 5, fontSize: 12, borderRadius: 8}}>
            <div style={{display: 'flex', justifyContent:'flex-start', maxWidth: 500, flexWrap: "wrap"}}>
                <p style={{paddingRight: 8, color: 'orange', fontWeight: 'bold'}}>{title}:</p>
                
                {
                    colors.map(colorEntry => {
                        const snip = text.substring(0, colorEntry[1]).replace(' ', '\xa0')
                        text = text.substring(colorEntry[1])
                        return <p style={{color: colorEntry[0]}}>{snip}</p>
                    })
                }
            
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
        
        return (
            <div className="ResultBox" style={{justifyContent: 'space-between', marginBottom: 5, padding: 5, fontSize: 12, borderRadius: 8}}>
                <div style={{display: 'flex', flexDirection: 'column', maxWidth: 700}}>
                    <p style={{paddingRight: 8, color: 'orange', fontWeight: 'bold'}}>Results:</p>
                    
                    {
                        results.map(result => {
    
                            const colorText = toColorText(result)
                            let text = colorText.val;
                            const colors = colorText.colorData;
                            let firstColon = false;
                            
                            return (
                                <div style={{display: 'flex', justifyContent:'flex-start'}}>
                                    {
                                        colors.map(colorEntry => {
                                            const snip = text.substring(0, colorEntry[1]).replace(' ', '\xa0')
                                            text = text.substring(colorEntry[1])
                                            
                                            const visible = firstColon && snip !== '}';
                                            
                                            if (snip.indexOf(':') !== -1) firstColon = true;
                                            
                                            return visible ? <p style={{color: colorEntry[0]}}>{snip}</p> : null;
                                        })
                                    }
                                </div>
                            );
                        })
                    }
                
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
