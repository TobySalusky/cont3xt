import './App.css';

function ResultsDNS({dns}) {

    return (
        <div>
            {(dns === undefined) ? null :

                Object.keys(dns).map(dnsType => {
                    if (dns[dnsType] === undefined || dns[dnsType].Answer === undefined) {
                        return null
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
