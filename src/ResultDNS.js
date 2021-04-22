import './App.css';
import { useRef } from 'react';
import { Tooltip } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';
import LineElement from "./LineElement";

const DarkTooltip = withStyles(() => ({
    tooltip: {
        backgroundColor: '#222222',
        color: 'white',
        border: '1px solid #888888',
        fontSize: 12,
    },
}))(Tooltip);


export default function ResultDNS({dns, ipData, refUtils}) {

    const {appendRef, topRef, resetRefs} = refUtils;

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



    const genBoxIP = (data, lineFromID) => {
        const ref = appendRef()

        if (data.error !== undefined) {
            return (
                <div ref={ref} className="ResultBox" style={{
                    justifyContent: 'space-between',
                    marginBottom: 5,
                    padding: 5,
                    marginLeft: 40,
                    fontSize: 12
                }}>
                    <p style={{color: '#FF6666', fontWeight: 'bold'}}>Error {data.status}</p>
                </div>
            );
        }

        return (
            <LineElement lineID={`${lineFromID}-ip`} lineFrom={lineFromID} style={{marginBottom: 5, marginLeft: 40}}>
                <div ref={ref} className="ResultBox" style={{justifyContent: 'space-between', padding: 5, fontSize: 12}}>
                    <DarkTooltip title={data.link} interactive>
                        <div style={{display: 'flex', justifyContent:'flex-start'}}>
                            <p style={{color: 'orange', fontWeight: 'bold', paddingRight: 8}}>Name:</p>
                            <p>{data.name}</p>
                        </div>
                    </DarkTooltip>
                </div>
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
                        <div ref={hasChild ? topRef(1) : appendRef()} className="ResultBox" style={{justifyContent: 'space-between', padding: 5, fontSize: 12}}>
                            <p style={{color: 'lightgreen', paddingRight: 8, fontWeight: 'bolder'}}>{dnsType}</p>
                            {content}
                        </div>
                    </LineElement>
                </div>

                {dnsAnswer.ipData ?
                    <div style={{marginLeft:30}}>{genBoxIP(dnsAnswer.ipData, boxLineID)}</div> : null
                }
            </div>
        );
    }

    return (
        <div>
            {resetRefs()}

            { // DNS
                (dns === undefined) ? null :

                Object.keys(dns).map(dnsType => {
                    if (dns[dnsType] === undefined) {
                        return null
                    } else if (dns[dnsType].Status !== 0) {
                        return (
                            <div ref={appendRef()} className="ResultBox" style={{justifyContent: 'space-between', marginBottom: 5, padding: 5, marginLeft: 40, fontSize: 12}}>
                                <p style={{paddingRight: 8, color: 'orange'}}>{dnsType}</p>
                                <p style={{paddingRight: 8, color: '#FF6666', fontWeight: 'bold'}}>{errorTable[dns[dnsType].Status].name}:</p>
                                <p style={{color: '#FF6666', fontWeight: 'bold'}}>{errorTable[dns[dnsType].Status].description}</p>
                            </div>
                        )
                    } else if (dns[dnsType].Answer !== undefined) {
                        return dns[dnsType].Answer.map((dnsAnswer,i) => genBoxDNS(dnsAnswer, dnsType, i))
                    }
                })
            }

            { // IP DATA
                (ipData === undefined) ? null : genBoxIP(ipData)
            }

        </div>
    );
}

