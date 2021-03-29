import './App.css';
import { useState, useEffect } from 'react';


// TODO: ip, hostname (domain [website]), phone number, email address, more?

function EnterpriseLinks(props) {

    const [links, setLinks] = useState([])
    const [active, setActive] = useState([])

    useEffect(() => { // onMount


        let indicator = props.indicator;
        if (props.type === 'Domain') {
            const genLinks = [
                ['PT Domain Lookup', "https://community.riskiq.com/research?query="+indicator],
            ]

            const genActive = []
            genLinks.map(() => {
                genActive.push(true);
            })

            setLinks(genLinks)
            setActive(genActive)
        } else if (props.type === 'IP') {
            const genLinks = [
                ['AlienVault IP','https://otx.alienvault.com/indicator/ip/'+indicator],
            ]

            const genActive = []
            genLinks.map(() => {
                genActive.push(true);
            })

            setLinks(genLinks)
            setActive(genActive)
        } else {
            setLinks([])
            setActive([])
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
                EnterpriseLinks
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

export default EnterpriseLinks;