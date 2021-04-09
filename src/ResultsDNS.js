import './App.css';

function ResultsDNS({dns}) {

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

    return (
        <div>
            {(dns === undefined) ? null :

                Object.keys(dns).map(dnsType => {
                    if (dns[dnsType] === undefined) {
                        return null
                    } else if (dns[dnsType].Status !== 0) {
                        return (
                            <div className="ResultBox" style={{justifyContent: 'space-between', marginBottom: 5, padding: 5, marginLeft: 30, fontSize: 12}}>
                                <p style={{paddingRight: 8, color: '#FF6666', fontWeight: 'bold'}}>{errorTable[dns[dnsType].Status].name}:</p>
                                <p style={{paddingRight: 8, color: '#FF6666', fontWeight: 'bold'}}>{errorTable[dns[dnsType].Status].description}</p>
                                <p style={{color: 'orange'}}>{dnsType}</p>
                            </div>
                        )
                    }
                    return dns[dnsType].Answer.map(e => (
                        <div className="ResultBox" style={{justifyContent: 'space-between', marginBottom: 5, padding: 5, marginLeft: 30, fontSize: 12}}>
                            <p style={{paddingRight: 8}}>{e.data}</p>
                            <p style={{color: 'orange'}}>{dnsType}</p>
                        </div>
                    ))
                })
            }
        </div>
    );
}

export default ResultsDNS;
