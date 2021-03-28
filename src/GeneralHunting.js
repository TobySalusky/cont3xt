import './App.css';
import { useState, useEffect } from 'react';


// TODO: ip, hostname (domain [website]), phone number, email address, more?

function GeneralHunting(props) {

    const [links, setLinks] = useState([])
    const [active, setActive] = useState([])

    useEffect(() => { // onMount


        let indicator = props.indicator;
        if (props.type === 'Domain') {
            const genLinks = [
                ['PT Domain Lookup', "https://community.riskiq.com/research?query="+indicator],
                ['Censys Domain Lookup', "https://censys.io/domain?q="+indicator],
                ['Censys Certificate Lookup', "https://censys.io/certificates?q="+indicator],
                ['CRT Lookup', "https://crt.sh/?q="+indicator+"&showSQL=Y"],
                ['AlienVault Domain Lookup', "https://otx.alienvault.com/indicator/domain/"+indicator],
                ['Domain Tools', "https://whois.domaintools.com/"+indicator],
                ['Google Safe Browsing', "https://transparencyreport.google.com/safe-browsing/search?url="+indicator],
                ['Url Scan Search', "https://urlscan.io/search/#"+indicator+"*"],
                ['Domain Tools History', "https://research.domaintools.com/research/whois-history/search/?q="+indicator],
            ]

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
            genActive.push((i == index) ? isActive : thisActive);
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
                General Hunting
            </div>
            {links.map((linkData, i) => (
                <div className="LinkLine">
                    <input className="LinkCheck" type="checkbox" checked={active[i]} onChange={e => setActiveIndex(i, e.target.checked)}></input>
                    <a className="Link" target="_blank" href={linkData[1]}>{linkData[0]}</a>
                </div>
            ))}
            <button className="OpenLinksButton" onClick={openActive}>Open All</button>
        </div>
    );
}

export default GeneralHunting;