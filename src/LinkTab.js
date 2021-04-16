import './App.css';
import { useState, useEffect } from 'react';
import {fillLinkFormat} from "./LinkGeneration";


// TODO: ip, hostname (domain [website]), phone number, email address, more?

function LinkTab(props) {

    const [title, setTitle] = useState([])
    const [links, setLinks] = useState([])
    const [active, setActive] = useState([])

    useEffect(() => { // onMount

        const configOutput = props.config(props.data);
        const linkFormats = configOutput.genLinks;

        setTitle(configOutput.title)

        const genLinks = []
        const genActive = []
        linkFormats.map(linkData => {
            genLinks.push({label: linkData.label, link: fillLinkFormat(linkData.formatLink, props.data), color: linkData.color});
            genActive.push(true);
        })

        setLinks(genLinks)
        setActive(genActive)

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
                window.open(linkData.link, '_blank', 'noreferrer')
            }
        })
    }

    return (
        <div className="DesktopBox">
            <div className="DesktopTitle">
                {title}
            </div>
            {links.map((linkData, i) => (
                <div className="LinkLine">
                    <input className="LinkCheck" type="checkbox" checked={active[i]} onChange={e => setActiveIndex(i, e.target.checked)}/>
                    <a className="Link" style={{color: linkData.color}} target="_blank" rel="noreferrer" href={linkData.link}>{linkData.label}</a>
                </div>
            ))}
            <button className="OpenLinksButton" onClick={openActive}>Open All</button>
        </div>
    );
}

export default LinkTab;
