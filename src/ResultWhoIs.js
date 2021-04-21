import './App.css';

export default function ResultWhoIs({whoIs, refUtils}) {

    const {appendRef, resetRefs} = refUtils;

    const infoBox = (title, data) => {
        return (
            <div className="ResultBox" style={{justifyContent: 'space-between', marginBottom: 5, padding: 5, fontSize: 12}}>
                <div style={{display: 'flex', justifyContent:'flex-start'}}>
                    <p style={{paddingRight: 8, color: 'orange', fontWeight: 'bold'}}>{title}:</p>
                    <p>{data}</p>
                </div>
            </div>
        );
    }

    const table = (whoIs === undefined) ? null :
        [
            ['Country', whoIs.adminCountry],
            ['Created', whoIs.creationDate],
            ['Updated', whoIs.updatedDate],
        ]

    return (
        <div>
            {resetRefs()}

            {
                (whoIs === undefined) ? null :
                    <div ref={appendRef()} className="WhoIsBox">
                        <p style={{fontWeight:'bolder', color:'orange'}}>whois</p>
                        {
                            table?.map(entry => {
                                return infoBox(entry[0], entry[1])
                            })
                        }
                    </div>
            }
        </div>
    );
}
