/* eslint-disable */
export function GeneralHunting(data) {
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
    return genLinks;
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
    return genLinks;
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
    return genLinks;
}