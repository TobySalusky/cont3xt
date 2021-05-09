import DarkTooltip from "./DarkTooltip";


export default function IPASNBox({ipData}) {

    return (
        <div className="ResultBox" style={{justifyContent: 'space-between', padding: 5, fontSize: 12}}>
            {
                (ipData.error) ? <p style={{color: '#FF6666', fontWeight: 'bold'}}>Error {ipData.status}</p> :

                    <div className="SpaceBetweenRow">

                        <DarkTooltip title={ipData.link} interactive>
                            <div style={{display: 'flex', justifyContent:'flex-start'}}>
                                <p style={{color: 'orange', fontWeight: 'bold', paddingRight: 8}}>Name:</p>
                                <p>{ipData.name}</p>
                            </div>
                        </DarkTooltip>
    
                        <div>
                            <img className="ExternalLink" src="./images/copy.svg" alt="copy"
                                 onClick={() => navigator.clipboard.writeText(ipData.name)}
                            />
    
                            <img className="ExternalLink" src="./images/externalLink.svg" alt="external link"
                                 onClick={() => window.open(`/?q=${ipData.name}`, '_blank', 'noreferrer')}
                            />
                        </div>

                    </div>
            }
        </div>
    );
}
