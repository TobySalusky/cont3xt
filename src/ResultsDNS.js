import './App.css';

function ResultsDNS({dns, dnsType}) {

    return (
        <div>
            {(dns === undefined) ? null :

                dns.Answer.map(e => (
                    <div className="ResultBox" style={{justifyContent: 'space-between', marginBottom: 5, padding: 5, marginLeft: 30}}>
                        <p style={{paddingRight: 8}}>{e.data}</p>
                        <p style={{color: 'orange'}}>{dnsType}</p>
                    </div>
                ))
            }
        </div>
    );
}

export default ResultsDNS;
