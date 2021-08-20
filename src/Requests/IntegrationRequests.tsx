import axios from "axios";
import {EmailVerificationData, PhoneNumberValidationData} from "../Types/IndicatorNode";
import {log} from "../Util/Util";
import {integrationNames} from "../Util/IntegrationDefinitions";

const logData = (integrationName: string, indicator: string, data: any): void => {
    log(`${integrationName} for ${indicator}`, data);
}

export const fetchDataIP = async (ip : string) => {
    let query_url = 'https://rdap.db.ripe.net/ip/' + ip.toString();
    const res = await axios.get(query_url, {
        // @ts-ignore
        validateStatus: false,
        headers: {
            'Accept': 'application/json'
        }
    })
    const data = await res.data

    return (res.status === 200) ? {status: res.status, name: data.name, link: data.links[0].value} : {status: res.status, error: res.status};
}

export const fetchWhois = async (domain: string) => {
    const res = await axios.get('/who-is-domain', {
        params: {
            q: domain
        }
    });

    logData(integrationNames.WHOIS, domain, res);

    return res;
}

export const fetchPhoneNumberValidation = async (phoneNumber: string) : Promise<PhoneNumberValidationData> => {
    const res = await axios.get('/verify-phone-number', {
        params: {
            phoneNumber: phoneNumber
        }
    });
    return {valid: res.data};
}

export const fetchEmailVerification = async (email: string) : Promise<EmailVerificationData> => {
    const res = await axios.get('/verify-email', {
        params: {
            email: email
        }
    });

    return {valid: res.data.success, banner: res.data.banner};
}

export const fetchCensysDataIPv4 = async (ip : string) => {
    const {REACT_APP_CENSYS_API_ID, REACT_APP_CENSYS_API_SECRET} = process.env
    if (REACT_APP_CENSYS_API_ID && REACT_APP_CENSYS_API_SECRET) {
        const { SearchClient } = require("@censys/node");
        const c = new SearchClient({
            apiId: REACT_APP_CENSYS_API_ID,
            apiSecret: REACT_APP_CENSYS_API_SECRET,
        });

        let fields = [
            "ip",
            "location",
            "protocols",
            "updated_at",
            "443.https.get.title",
            "443.https.get.headers.server",
            "443.https.get.headers.x_powered_by",
            "443.https.get.metadata.description",
            "443.https.tls.certificate.parsed.subject_dn",
            "443.https.tls.certificate.parsed.names",
            "443.https.tls.certificate.parsed.subject.common_name",
        ];

        let query2 = c.v1.ipv4.search(
            ip, fields
        );

        let censysData = {};

        for await (let page of query2) {
            censysData = {...censysData, ...page};
        }

        /*{ //TODO: account for balance!
            c.v1.ipv4.account().then(res => {

            });
        }*/

        logData(integrationNames.CENSYS_IP, ip, censysData);

        return {data: censysData};
    }
    log('no censys api authentication provided.');
    return null;
}

export const fetchPassiveTotalWhois = async (domain : string) => {
    const {REACT_APP_PASSIVETOTAL_API_USER:user, REACT_APP_PASSIVETOTAL_API_KEY:apikey} = process.env;
    if (!user || !apikey) return null;
    const passiveTotalWhois = await axios.get('https://api.passivetotal.org/v2/whois', {
        params: {
            query: domain,
            history: false
        },
        auth: {
            username: user,
            password: apikey
        }
    });

    logData(integrationNames.PASSIVETOTAL_WHOIS, domain, passiveTotalWhois);

    return passiveTotalWhois;
}

export const fetchPassiveTotalSubDomains = async (domain : string) => {
    const {REACT_APP_PASSIVETOTAL_API_USER:user, REACT_APP_PASSIVETOTAL_API_KEY:apikey} = process.env;
    if (!user || !apikey) return null;
    const passiveTotalSubDomainsResult = await axios.get('https://api.passivetotal.org/v2/enrichment/subdomains', {
        params: {
            query: domain
        },
        auth: {
            username: user,
            password: apikey
        }
    });

    logData(integrationNames.PASSIVETOTAL_SUBDOMAINS, domain, passiveTotalSubDomainsResult);
    return passiveTotalSubDomainsResult;
}

export const fetchPassiveTotalPassiveDNS = async (ip : string) => {
    const {REACT_APP_PASSIVETOTAL_API_USER:user, REACT_APP_PASSIVETOTAL_API_KEY:apikey} = process.env;
    if (!user || !apikey) return null;
    const passiveTotalPassiveDNS = await axios.get('https://api.passivetotal.org/v2/dns/passive', {
        params: {
            query: ip
        },
        auth: {
            username: user,
            password: apikey
        }
    });

    logData('PassiveTotal Passive DNS', ip, passiveTotalPassiveDNS)
    return passiveTotalPassiveDNS;
}

export const fetchThreatStream = async (indicator : string) => {
    const {REACT_APP_THREATSTREAM_URL:url, REACT_APP_THREATSTREAM_API_USER:user, REACT_APP_THREATSTREAM_API_KEY:apikey} = process.env;
    if (!url || !user || !apikey) return null;
    const res = await axios.get('/threat-stream', {
        params: {
            q: indicator,
            url, user, apikey
        },
    })

    logData(integrationNames.THREAT_STREAM, indicator, res);
    return res;
}

export const fetchSpurDataIP = async (ip : string) => {
    const {REACT_APP_SPUR_TOKEN} = process.env

    if (!REACT_APP_SPUR_TOKEN) return null;

    const spurRes = await axios.get(`https://api.spur.us/v1/context/${ip}`, {
        headers: {
            'Token': REACT_APP_SPUR_TOKEN
        }
    })

    logData(integrationNames.SPUR, ip, spurRes);
    return spurRes
}

export const fetchURLScan = async (ipOrDomain : string) => {

    const {REACT_APP_URLSCAN_KEY} = process.env

    if (!REACT_APP_URLSCAN_KEY) return null;

    const res = await axios.get('/url-scan', {
        params: {
            q: ipOrDomain,
            key: REACT_APP_URLSCAN_KEY,
        },
    })

    logData(integrationNames.URL_SCAN, ipOrDomain, res);

    return res
}

export const fetchVirusTotalDomain = async (domain : string) => {
    const {REACT_APP_VIRUSTOTAL_API_KEY} = process.env;
    if (!REACT_APP_VIRUSTOTAL_API_KEY) return null;
    const res = await axios.get('/virus-total-domain', {
        params: {
            q: domain,
            key: REACT_APP_VIRUSTOTAL_API_KEY,
        },
    })

    logData(integrationNames.VIRUS_TOTAL_DOMAIN, domain, res);
    return res;
}

export const fetchVirusTotalIP = async (ip : string) => {
    const {REACT_APP_VIRUSTOTAL_API_KEY} = process.env;
    if (!REACT_APP_VIRUSTOTAL_API_KEY) return null;
    const res = await axios.get('/virus-total-ip', {
        params: {
            q: ip,
            key: REACT_APP_VIRUSTOTAL_API_KEY,
        },
    })

    logData(integrationNames.VIRUS_TOTAL_IP, ip, res);
    return res;
}

export const fetchVirusTotalHash = async (hash : string) => {
    const {REACT_APP_VIRUSTOTAL_API_KEY} = process.env;
    if (!REACT_APP_VIRUSTOTAL_API_KEY) return null;
    const res = await axios.get('/virus-total-hash', {
        params: {
            q: hash,
            key: REACT_APP_VIRUSTOTAL_API_KEY,
        },
    })

    logData(integrationNames.VIRUS_TOTAL_HASH, hash, res);
    return res;
}
