import DarkTooltip from "../Style/DarkTooltip";
import { LinkBack } from "./LinkBack";
import { Copy } from "./Copy";


export default function IPASNBox({ipData}) {

    return (
        <div className="ResultBox" style={{justifyContent: 'space-between', padding: 5, paddingBlock:2, fontSize: 12}}>
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
                            <Copy value={ipData.name}/>
    
                            <LinkBack query={ipData.name}/>
                        </div>

                    </div>
            }
        </div>
    );
}
