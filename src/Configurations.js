
export function readConfig(fullText) {

    const lines = fullText.split("\n");

    let title = 'Untitled';
    let linkDict = {};

    let linkArr;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        let lower = line.toLowerCase();

        if (line.length === 0) continue; // skips empty lines

        if (lower.startsWith('title:')) { // Title

            title = line.substring(6).trim();

        } else if (line.endsWith(':')) { // Starting typed segments

            linkArr = [];
            linkDict[line.substring(0, line.length - 1)] = linkArr;

        } else if (Object.keys(linkDict).length > 0 && line.startsWith('\"')) {
            let lastQuote = line.lastIndexOf('\"');
            let name = line.substring(1, lastQuote).trim();
            let formatLink = line.substring(lastQuote + 1).trim();
            linkArr.push([name, formatLink])
        }
    }

    return {title, linkDict};
}

export function createConfig(fullText) {

    const {title, linkDict} = readConfig(fullText)

    return (data) => {
        let genLinks = []
        if (data.type in linkDict) {
            genLinks = linkDict[data.type];
        }
        return {title, genLinks};
    }
}

// deprecated
/*export function GeneralHunting(data) {
    let genLinks;
    switch (data.type) {
        case 'Domain':
            genLinks = [
                ['PT Domain Lookup', "https://community.riskiq.com/research?query=${indicator}"],
                ['Censys Domain Lookup', "https://censys.io/domain?q=${indicator}"],
                ['Censys Certificate Lookup', "https://censys.io/certificates?q=${indicator}"],
                ['CRT Lookup', "https://crt.sh/?q=${indicator}&showSQL=Y"],
                ['AlienVault Domain Lookup', "https://otx.alienvault.com/indicator/domain/${indicator}"],
                ['Domain Tools', "https://whois.domaintools.com/${indicator}"],
                ['Google Safe Browsing', "https://transparencyreport.google.com/safe-browsing/search?url=${indicator}"],
                ['Url Scan Search', "https://urlscan.io/search/#${indicator}*"],
                ['Domain Tools History', "https://research.domaintools.com/research/whois-history/search/?q=${indicator}"],
            ]
            break;
        case 'IP':
            genLinks = [
                ['AlienVault IP','https://otx.alienvault.com/indicator/ip/${indicator}'],
            ]
            break;
        default:
            genLinks = []
            break;
    }
    return {title: 'General Hunting', genLinks};
}

export function InternalTools(data) {
    let genLinks;
    switch (data.type) {
        case 'Domain':
            genLinks = [
                ['PT Domain Lookup', "https://community.riskiq.com/research?query=${indicator}"],
                ['threathole', "http://threathole.com/test?days=${numDays}&startDate=${startDate}"],
            ]
            break;
        case 'IP':
            genLinks = [
                ['AlienVault IP','https://otx.alienvault.com/indicator/ip/${indicator}'],
            ]
            break;
        default:
            genLinks = []
            break;
    }
    return {title: 'Internal Tools', genLinks};
}

export function EnterpriseLinks(data) {
    let genLinks;
    switch (data.type) {
        case 'Domain':
            genLinks = [
                ['Censys Domain Lookup', "https://censys.io/domain?q=${indicator}"],
            ]
            break;
        case 'IP':
            genLinks = [
                ['AlienVault IP','https://otx.alienvault.com/indicator/ip/${indicator}'],
            ]
            break;
        default:
            genLinks = []
            break;
    }
    return {title: 'Enterprise Links', genLinks};
}*/