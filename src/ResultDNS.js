import './App.css';
import LineElement from "./LineElement";
import DarkTooltip from "./DarkTooltip";
import IPASNBox from "./IPASNBox";
import {SpurBox} from "./SpurBox";
import { jsonLines } from "./Util";
import ComponentTooltip from './ComponentTooltip';

export default function ResultDNS({dns}) {

    const errorTable = {
        1: {name: "FormErr", description: "Format Error"},
        2: {name: "ServFail", description: "Server Failure"},
        3: {name: "NXDomain", description: "Non-Existent Domain"},
        4: {name: "NotImp", description: "Not Implemented"},
        5: {name: "Refused", description: "Query Refused"},
        6: {name: "YXDomain", description: "Name Exists when it should not"},
        7: {name: "YXRRSet", description: "RR Set Exists when it should not"},
        8: {name: "NXRRSet", description: "RR Set that should exist does not"},
        9: {name: "NotAuth", description: "Not Authorized"},
    }



    const genAsnBoxIP = (data, lineFromID) => {

        return (
            <LineElement lineID={`${lineFromID}-ip`} lineFrom={lineFromID} style={{marginBottom: 5, marginLeft: 40}}>
                <IPASNBox ipData={data}/>
            </LineElement>
        );
    }

    const genBoxDNS = (dnsAnswer, dnsType, i) => {
        const data = dnsAnswer.data
        const charLimit = 30;

        let content = (data.length > charLimit) ? (
            <DarkTooltip title={data} interactive>
                <div style={{display: 'flex', justifyContent:'flex-start'}}>
                    <p>{data.substring(0, charLimit)}</p>
                    <p style={{color: 'orange'}}>...</p>
                </div>
            </DarkTooltip>
        ) : <p>{data}</p>

        let hasChild = dnsAnswer.ipData !== undefined

        const boxLineID = `dns-${dnsType}-${i}`

        return (
            <div>
                <div style={{marginBottom: 5, marginLeft: 40}}>
                    <LineElement lineID={boxLineID} lineFrom="main">
                        <div className="ResultBox" style={{justifyContent: 'space-between', padding: 5, fontSize: 12}}>
                            <div className="SpaceBetweenRow">
                                <p style={{color: 'lightgreen', paddingRight: 8, fontWeight: 'bolder'}}>{dnsType}</p>
                                {content}
                            </div>
    
                            <img className="ExternalLink" src="./images/copy.svg" alt="copy"
                                 onClick={() => navigator.clipboard.writeText(data)}
                            />
                            <img className="ExternalLink" src="./images/externalLink.svg" alt="external link"
                                onClick={() => window.open(`/?q=${data}`, '_blank', 'noreferrer')}
                            />
                            
                            {!dnsAnswer.spurResult ? null :
                                <div style={{display: 'flex', flexDirection: 'row'}}>
                                    <p style={{marginLeft: 10}}>|</p>
    
                                    <ComponentTooltip comp={
                                        <SpurBox spurResult={dnsAnswer.spurResult}/>
                                    }>
                                        <img className="ExternalLink" style={{width: 60}} src="./images/spur.png" alt="spur"/>
                                    </ComponentTooltip>
                                </div>
                            }
                        </div>
                    </LineElement>
                </div>

                {dnsAnswer.ipData ?
                    <div style={{marginLeft:30}}>{genAsnBoxIP(dnsAnswer.ipData, boxLineID)}</div> : null
                }
            </div>
        );
    }

    return (
        <div>

            { // DNS
                (dns === undefined) ? null :

                Object.keys(dns).map(dnsType => {
                    if (dns[dnsType] === undefined) {
                        return null
                    } else if (dns[dnsType].Status !== 0) {
                        return (
                            <LineElement lineID={`${dnsType}-err`} lineFrom="main" style={{marginLeft: 40, marginBottom: 5}}>
                                <div className="ResultBox" style={{justifyContent: 'space-between', padding: 5, fontSize: 12}}>
                                    <p style={{color: 'lightgreen', paddingRight: 8, fontWeight: 'bolder'}}>{dnsType}</p>
                                    <p style={{paddingRight: 8, color: '#FF6666', fontWeight: 'bold'}}>{errorTable[dns[dnsType].Status].name}:</p>
                                    <p style={{color: '#FF6666', fontWeight: 'bold'}}>{errorTable[dns[dnsType].Status].description}</p>
                                </div>
                            </LineElement>
                        );
                    } else if (dns[dnsType].Answer !== undefined) {
                        return dns[dnsType].Answer.map((dnsAnswer,i) => genBoxDNS(dnsAnswer, dnsType, i))
                    }
                })
            }

        </div>
    );
}

