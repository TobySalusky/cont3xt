import '../Style/App.css';
import LineElement from "./LineElement";
import DarkTooltip from "../Style/DarkTooltip";
import { toColorText } from "../Util/Util";


export function SpurBox({spurResult, notitle}) {

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

    return (
        <div className="WhoIsBox">
            {notitle ? null :
                <p style={{fontWeight:'bolder', color:'cyan'}}>SPUR</p>
            }
            
            {
                Object.keys(spurResult.data).map(key => {
                    const colorText = toColorText(spurResult.data[key])

                    return (colorText.val && key !== 'ip' && (key !== 'anonymous' || spurResult.data.anonymous === true)) ? infoBox(key, colorText) : null
                })
            }
        </div>
    );
}

export function MainSpurBox({spurResult}) {
    return (
        <div>
            {
                (spurResult && spurResult.data) ? (
                    <LineElement lineID="spur" lineFrom="main" style={{marginLeft: 40, marginBottom: 5}}>
                        {
                            (spurResult && spurResult.data) ? (
                                <SpurBox spurResult={spurResult}/>
                            ) : null
                        }
                    </LineElement>
                ) : null
            }

        </div>
    );
}
