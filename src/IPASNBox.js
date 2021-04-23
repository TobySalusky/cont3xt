import DarkTooltip from "./DarkTooltip";


export default function IPASNBox({ipData}) {

    return (
        <div className="ResultBox" style={{justifyContent: 'space-between', padding: 5, fontSize: 12}}>
            {
                (ipData.error) ? <p style={{color: '#FF6666', fontWeight: 'bold'}}>Error {ipData.status}</p> :

                    <DarkTooltip title={ipData.link} interactive>
                        <div style={{display: 'flex', justifyContent:'flex-start'}}>
                            <p style={{color: 'orange', fontWeight: 'bold', paddingRight: 8}}>Name:</p>
                            <p>{ipData.name}</p>
                        </div>
                    </DarkTooltip>
            }
        </div>
    );
}
