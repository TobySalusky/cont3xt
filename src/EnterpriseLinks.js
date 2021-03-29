import './App.css';
import { useState, useEffect } from 'react';


// TODO: ip, hostname (domain [website]), phone number, email address, more?

function EnterpriseLinks(props) {

    const [links, setLinks] = useState([])
    const [active, setActive] = useState([])

    useEffect(() => { // onMount

        const indicator = props.data.indicator;
        const numDays = props.data.numDays;
        const startDate = props.data.startDate;

        let genLinks;
        switch (props.data.type) {
            case 'Domain':
                genLinks = [
                    ['Censys Domain Lookup', "https://censys.io/domain?q="+indicator],
                ]
                break;
            case 'IP':
                genLinks = [
                    ['AlienVault IP','https://otx.alienvault.com/indicator/ip/'+indicator],
                ]
                break;
            default:
                genLinks = []
                break;
        }

        if (genLinks.length === 0) {
            setLinks([])
            setActive([])
        } else {

            const genActive = []
            genLinks.map(() => {
                genActive.push(true);
            })

            setLinks(genLinks)
            setActive(genActive)
        }

    }, [props.listen]);

    const setActiveIndex = (i, isActive) => {
        const genActive = [];
        active.map((thisActive, index) => {
            genActive.push((i === index) ? isActive : thisActive);
        })
        setActive(genActive);
    }

    const openActive = () => {
        links.map((linkData, i) => {
            if (active[i]) {
                window.open(linkData[1])
            }
        })
    }

    return (
        <div className="DesktopBox">
            <div className="DesktopTitle">
                Enterprise Links
            </div>
            {links.map((linkData, i) => (
                <div className="LinkLine">
                    <input className="LinkCheck" type="checkbox" checked={active[i]} onChange={e => setActiveIndex(i, e.target.checked)}/>
                    <a className="Link" target="_blank" href={linkData[1]}>{linkData[0]}</a>
                </div>
            ))}
            <button className="OpenLinksButton" onClick={openActive}>Open All</button>
        </div>
    );
}

export default EnterpriseLinks;