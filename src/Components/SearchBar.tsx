import '../Style/App.css';
import React, { useState, useEffect, useContext } from 'react';
import {useUpdateArgsURL} from "../Util/URLHandler";
import { Base64Context, QueryContext } from "../State/SearchContext";
import axios from 'axios';
import { DisplayStatsContext } from '../State/DisplayStatsContext';
import dr from 'defang-refang'
import { log, stripTrailingPeriod } from "../Util/Util";
import { whiteFilter } from "../Util/Filters";
import { classificationObj } from "../Util/Classification";
import { integrationNames } from "../Util/IntegrationDefinitions";
import { downloadFullReport } from "../Util/ReportGenerator";
import { getCleaner } from "../Util/IntegrationCleaners";
import {tryUseASN} from "../Util/IpASN";
import {EmailVerificationData, IndicatorNode, PhoneNumberValidationData} from "../Types/IndicatorNode";
import exp from "constants";

// TODO: ip, hostname (domain [website]), phone number, email address, more?
// TODO: auto-format phone number results

const copyBase64LinkToClipboard = (query : string) => {
    const { base64encode } = require('nodejs-base64');
    navigator.clipboard.writeText(`http://localhost:3000/?b=${base64encode(query)}`)
}

export const processQuery = (query : string) => {
    return dr.refang(query.trim());
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
    return await axios.get('/who-is-domain', {
        params: {
            q: domain
        }
    });
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

export const fetchCensysDataIP = async (ip : string) => {
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

        let censysObj = {};

        for await (let page of query2) {
            log('test censys', page);
            censysObj = {...censysObj, ...page};
        }

        if (Object.keys(censysObj).length === 0) return null;

        /*{ //TODO: account for balance!
            c.v1.ipv4.account().then(res => {

            });
        }*/

        return {data: censysObj};
    }
    log('no censys api authentication provided.');
    return undefined;
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

    log('passivetotal whois',passiveTotalWhois);
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

    log('passivetotal subdomains',passiveTotalSubDomainsResult);
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

    log('passivetotal passive dns', passiveTotalPassiveDNS);
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

    log(`threatstream result for ${indicator}`, res);
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

    log('spur', spurRes)

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

    log('URL Scan', res)

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

    log('virus total res domain', res);
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

    log('virus total res ip', res);
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

    log('virus total res hash', res);
    return res;
}


const SearchBar : React.FC<{
    results : IndicatorNode[],
    setResults : any
}> = ({results, setResults}) => {

    const [search, setSearch] = useState('');
    const [query, setQuery] = useContext(QueryContext);
    const [, setBase64] = useContext(Base64Context);
    const updateArgsURL = useUpdateArgsURL();
    const [displayStats, setDisplayStats] = useContext(DisplayStatsContext)

    useEffect(() => {

        if (query === '') {
            setResults([])
            return;
        }

        updateArgsURL()

        const indicator = query;
        const topResultNode = new IndicatorNode(indicator, {topLevel: true});
        const newResults = [topResultNode];

        IndicatorNode.rerender = ()=>{
            setResults([...newResults]);
        }

        // TODO: sanitize indicator (phone, etc.)
        if (topResultNode.type === 'Email') {
            const afterEmailAt = indicator.substring(indicator.indexOf('@') + 1);

            newResults.push(new IndicatorNode(afterEmailAt, {topLevel: true}));
        }

        setResults(newResults)
        console.log(newResults);

        //dnsQueries(newResults);
    }, [query]);

    // const dnsQueries = async (newResults) => { // TODO: FIX ISSUE where if the url is changed very quick between domains, the older one can sometimes override the newest addition
    //
    //     const instance = axios.create({
    //         headers: {'Accept': 'application/dns-json'}
    //     });
    //
    //     let arr = [...newResults];
    //     let diff = false;
    //
    //     const addToResultObject = (object, additionObj) => {
    //         for (const key of Object.keys(additionObj)) {
    //             object[key] = additionObj[key];
    //         }
    //         setResults([...arr]);
    //     }
    //
    //     const addIntegrationToResultObject = (object, integrationAdditionObj, integrationType) => {
    //
    //         if (!object.integrations) object.integrations = {};
    //         for (const key of Object.keys(integrationAdditionObj)) {
    //             if (integrationAdditionObj[key] == null) continue;
    //             object.integrations[key] = integrationAdditionObj[key];
    //             if (integrationType) {
    //                 object.integrations[key].integrationType = integrationType;
    //                 object.integrations[key].data = getCleaner(integrationType)(object.integrations[key].data);
    //                 tryUseASN(object, integrationType, object.integrations[key].data, addIntegrationToResultObject);
    //             }
    //         }
    //         setResults([...arr]);
    //     }
    //
    //     const updateBalance = (balanceObj : any) => {
    //         /*let obj = {...displayStats.balances};
    //         for (const key in Object.keys(balanceObj)) {
    //             if (!obj.hasOwnProperty(key) || balanceObj[key] < obj[key]) {
    //                 obj[key] = balanceObj[key];
    //             }
    //         }
    //         log({...displayStats, balances: obj})
    //         const key = Object.keys(balanceObj[0]);
    //         if (displayStats?.balances?[key] && displayStats.balances[key] === balanceObj[key]) {
    //             setDisplayStats({...displayStats, balances: {...displayStats.balances, ...balanceObj}})
    //         }*/
    //         setDisplayStats({...displayStats, balances: {...displayStats.balances, ...balanceObj}})
    //         // TODO: fix, this doesn't compare values!
    //     }
    //
    //     const startIpAdditions = (object, ip : string) => {
    //
    //         // AP2ISN
    //         // TODO: use backend AP2ISN
    //         fetchDataIP(ip).then(res => {
    //             addToResultObject(object, {ipData: res});
    //         }).catch(err => {
    //             log(err);
    //         });
    //
    //         // Spur
    //         fetchSpurDataIP(ip).then(res => {
    //             addIntegrationToResultObject(object, {spurResult: res}, integrationNames.SPUR);
    //             let newSpurCount : number = res?.headers['x-balance-remaining'];
    //             updateBalance({spurBalance: newSpurCount})
    //         }).catch(err => {
    //             log(err);
    //         });
    //
    //         // censys
    //         fetchCensysDataIP(ip).then(res => {
    //             addIntegrationToResultObject(object, {censysResult: res}, integrationNames.CENSYS_IP);
    //         }).catch(err => {
    //             log(err);
    //         });
    //
    //         // passivetotal
    //         fetchPassiveTotalPassiveDNS(ip).then(res => { // passive dns
    //             addIntegrationToResultObject(object, {passiveTotalPassiveDNSResult: res}, integrationNames.PASSIVETOTAL_PASSIVE_DNS_IP);
    //         }).catch(err => {
    //             log(err);
    //         });
    //
    //         // url scan
    //         fetchURLScan(ip).then(res => {
    //             addIntegrationToResultObject(object, {urlScanResult: res}, integrationNames.URL_SCAN)
    //         }).catch(err => {
    //             log(err);
    //         });
    //
    //         // virus total
    //         fetchVirusTotalIP(ip).then(res => {
    //             addIntegrationToResultObject(object, {virusTotalIPResult: res}, integrationNames.VIRUS_TOTAL_IP)
    //         }).catch(err => {
    //             log(err);
    //         });
    //
    //         // threatstream
    //         fetchThreatStream(ip).then(res => {
    //             addIntegrationToResultObject(object, {threatStreamResult: res}, integrationNames.THREAT_STREAM)
    //         }).catch(err => {
    //             log(err);
    //         });
    //     }
    //
    //     const startDomainAdditions = async (object, domain) => {
    //
    //         // DNS records
    //         const dataA = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${domain}&type=A`)).data
    //         const dataAAAA = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${domain}&type=AAAA`)).data
    //         const dataNS = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${domain}&type=NS`)).data
    //         const dataMX = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${domain}&type=MX`)).data
    //         const dataTXT = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${domain}&type=TXT`)).data
    //         const dataDmarcTXT = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=_dmarc.${domain}&type=TXT`)).data
    //         const dataCAA = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${domain}&type=CAA`)).data
    //         const dataSOA = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${domain}&type=SOA`)).data
    //
    //         if (dataNS.Answer) {
    //             dataNS.Answer = dataNS.Answer.map(entry => {return {...entry, data:stripTrailingPeriod(entry.data)}})
    //         }
    //         if (dataMX.Answer) {
    //             dataMX.Answer = dataMX.Answer.map(entry => {return {...entry, data:stripTrailingPeriod(entry.data)}})
    //         }
    //         if (dataCAA.Answer) {
    //             dataCAA.Answer = dataCAA.Answer.map(entry => {return {...entry, data:CAAToText(entry.data)}})
    //         }
    //
    //         addToResultObject(object,
    //             {dns: {A: dataA, AAAA: dataAAAA, NS: dataNS, MX: dataMX, TXT: dataTXT, dmarcTXT: dataDmarcTXT, CAA: dataCAA, SOA: dataSOA}});
    //
    //         // get whois data
    //         axios.get('/who-is-domain', {
    //             params: {
    //                 q: domain
    //             }
    //         }).then(whoIsResult => {
    //             log('who is:', whoIsResult)
    //             if (whoIsResult.status === 200) {
    //                 addIntegrationToResultObject(object, {whoisResult: whoIsResult}, integrationNames.WHOIS)
    //             }
    //         }).catch(err => {
    //             log(err);
    //         });
    //
    //         // passivetotal ======
    //         fetchPassiveTotalWhois(domain).then(res => { // whois
    //             addIntegrationToResultObject(object, {passiveTotalWhoisResult: res}, integrationNames.PASSIVETOTAL_WHOIS)
    //         }).catch(err => {
    //             log(err);
    //         });
    //
    //         fetchPassiveTotalSubDomains(domain).then(res => { // sub-domains
    //             log('subdomains', res)
    //             addIntegrationToResultObject(object, {passiveTotalSubDomainsResult: res}, integrationNames.PASSIVETOTAL_SUBDOMAINS)
    //         }).catch(err => {
    //             log(err);
    //         });
    //
    //         /**
    //          * CURRENT TODO:
    //          * abstract out sorts and cleaning from rendering code (they're getting called like crazy, and I expect that is bottle-necking performance)
    //          */
    //         fetchPassiveTotalPassiveDNS(domain).then(res => { // passive dns for domain
    //             log('passive dns for domain', res)
    //             addIntegrationToResultObject(object, {passiveTotalPassiveDNSResult: res}, integrationNames.PASSIVETOTAL_PASSIVE_DNS_DOMAIN)
    //         }).catch(err => {
    //             log(err);
    //         });
    //
    //         // url scan
    //         fetchURLScan(domain).then(res => {
    //             addIntegrationToResultObject(object, {urlScanResult: res}, integrationNames.URL_SCAN)
    //         }).catch(err => {
    //             log(err);
    //         });
    //
    //         // virus total
    //         fetchVirusTotalDomain(domain).then(res => {
    //             addIntegrationToResultObject(object, {virusTotalDomainResult: res}, integrationNames.VIRUS_TOTAL_DOMAIN)
    //         }).catch(err => {
    //             log(err);
    //         });
    //
    //         // threatstream
    //         fetchThreatStream(domain).then(res => {
    //             addIntegrationToResultObject(object, {threatStreamResult: res}, integrationNames.THREAT_STREAM)
    //         }).catch(err => {
    //             log(err);
    //         });
    //
    //
    //         // resolve more information for ip children
    //         for (const data of [dataA, dataAAAA]) {
    //             if (data.Answer !== undefined) {
    //                 for (let j = 0; j < data.Answer.length; j++) {
    //                     const ip = data.Answer[j].data
    //
    //                     startIpAdditions(data.Answer[j], ip);
    //                 }
    //             }
    //         }
    //     }
    //
    //     const startEmailAdditions = (object, email) => {
    //         // Verify Email
    //         axios.get('/verify-email', {
    //             params: {
    //                 email: email
    //             }
    //         }).then(infoResult => {
    //             log('email info:', infoResult)
    //             let status = 'err', banner = '';
    //             if (infoResult.data !== 'err') {
    //                 status = infoResult.data.success;
    //                 banner = infoResult.data.banner;
    //             }
    //
    //             addToResultObject(object, {valid: status, emailVerificationBanner: banner});
    //             log(arr)
    //         }).catch(err => {
    //             log(err);
    //         });
    //
    //         // threatstream
    //         fetchThreatStream(email).then(res => {
    //             addIntegrationToResultObject(object, {threatStreamResult: res}, integrationNames.THREAT_STREAM)
    //         }).catch(err => {
    //             log(err);
    //         });
    //     }
    //
    //     const startPhoneNumberAdditions = (object, phoneNumber) => {
    //         // Verify Phone Number
    //         axios.get('/verify-phone-number', {
    //             params: {
    //                 phoneNumber: phoneNumber
    //             }
    //         }).then(validResult => {
    //             log('phone number validation:', validResult.data)
    //             addToResultObject(object, {valid: validResult.data})
    //             log(arr)
    //         }).catch(err => {
    //             log(err);
    //         });
    //     }
    //
    //     const startHashAdditions = (object, hash) => {
    //         // virus total
    //         fetchVirusTotalHash(hash).then(res => {
    //             addIntegrationToResultObject(object, {virusTotalHashResult: res}, integrationNames.VIRUS_TOTAL_HASH)
    //         }).catch(err => {
    //             log(err);
    //         });
    //
    //         // threatstream
    //         fetchThreatStream(hash).then(res => {
    //             addIntegrationToResultObject(object, {threatStreamResult: res}, integrationNames.THREAT_STREAM)
    //         }).catch(err => {
    //             log(err);
    //         });
    //     }
    //
    //
    //     for (let i = 0; i < arr.length; i++) {
    //         const result = arr[i];
    //         let thisDiff = true;
    //
    //         addIntegrationToResultObject(result, {indicatorData: classificationObj(result.indicator)});
    //
    //         switch (result.type) {
    //             case 'Domain':
    //                 await startDomainAdditions(result, result.indicator); // why is this one await but the others aren't?
    //                 break;
    //             case 'IP':
    //                 startIpAdditions(result, result.indicator);
    //                 break;
    //             case 'Email':
    //                 startEmailAdditions(result, result.indicator);
    //                 break;
    //             case 'PhoneNumber':
    //                 startPhoneNumberAdditions(result, result.indicator);
    //                 break;
    //             case 'Hash':
    //                 startHashAdditions(result, result.indicator);
    //                 break;
    //             default:
    //                 thisDiff = false;
    //                 break;
    //         }
    //         if (thisDiff) diff = true; // TODO: figure out what this was for
    //     }
    //
    //     if (diff) {
    //         log('result:', arr[0])
    //         setResults(arr)
    //     }
    // }

    const getQuery = (e : any) => {
        e.preventDefault();
        if (query !== search && search !== '') {
            setBase64(null);
            setQuery(processQuery(search));
        }
        setSearch('');
    }

    return (
        <form className="SearchContainer" onSubmit={getQuery}>
            <input autoFocus className="SearchBar" type="text" value={search} onChange={e => setSearch(e.target.value)}/>
            <div className="Base64Copy" onClick={()=>{
                copyBase64LinkToClipboard(query);
            }}>
                <img style={{...{width: 20, height: 20, marginLeft: 0}, ...whiteFilter}} className="ExternalLink" src="./images/share.svg" alt="share link"/>
            </div>
            <div className="Base64Copy" onClick={()=>{
                if (results?.[0]) {
                    downloadFullReport(results[0]);
                }
            }}>
                <img style={{...{width: 20, height: 20, marginLeft: 0}, ...whiteFilter}} className="ExternalLink" src="./images/report.svg" alt="generate report"/>
            </div>
            <button className="SearchSubmit" type="submit">
                {'Get\xa0Cont3xt'}
            </button>
        </form>
    );
}

export default SearchBar;
