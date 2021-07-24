import '../Style/App.css';
import { useState, useEffect, useContext } from 'react';
import {useUpdateArgsURL} from "../Util/URLHandler";
import { Base64Context, QueryContext } from "../State/SearchContext";
import {LineContext} from "../State/LineContext";
import axios from 'axios';
import { DisplayStatsContext } from '../State/DisplayStatsContext';
import dr from 'defang-refang'
import { log, stripTrailingPeriod } from "../Util/Util";
import { whiteFilter } from "../Util/Filters";
import { classificationObj } from "../Util/Classification";
import { integrationNames } from "../Util/IntegrationDefinitions";
import { downloadFullReport } from "../Util/ReportGenerator";
import { getCleaner } from "../Util/IntegrationCleaners";

// TODO: ip, hostname (domain [website]), phone number, email address, more?
// TODO: auto-format phone number results

const copyBase64LinkToClipboard = (query) => {
    const { base64encode } = require('nodejs-base64');
    navigator.clipboard.writeText(`http://localhost:3000/?b=${base64encode(query)}`)
}

export const processQuery = (query) => {
    return dr.refang(query);
}

const fetchDataIP = async (ip) => {
    let query_url = 'https://rdap.db.ripe.net/ip/' + ip.toString();
    const res = await axios.get(query_url, {
        validateStatus: false,
        headers: {
            'Accept': 'application/json'
        }
    })
    const data = await res.data
    
    return (res.status === 200) ? {status: res.status, name: data.name, link: data.links[0].value} : {status: res.status, error: res.status};
}

const fetchCensysDataIP = async (ip) => {
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

const fetchPassiveTotalWhois = async (domain) => {
    const {REACT_APP_PASSIVETOTAL_API_USER, REACT_APP_PASSIVETOTAL_API_KEY} = process.env;
    const passiveTotalWhois = await axios.get('https://api.passivetotal.org/v2/whois', {
        params: {
            query: domain,
            history: false
        },
        auth: {
            username: REACT_APP_PASSIVETOTAL_API_USER,
            password: REACT_APP_PASSIVETOTAL_API_KEY
        }
    });
    
    log('passivetotal whois',passiveTotalWhois);
    return passiveTotalWhois;
}

const fetchPassiveTotalSubDomains = async (domain) => {
    const {REACT_APP_PASSIVETOTAL_API_USER, REACT_APP_PASSIVETOTAL_API_KEY} = process.env;
    const passiveTotalSubDomainsResult = await axios.get('https://api.passivetotal.org/v2/enrichment/subdomains', {
        params: {
            query: domain
        },
        auth: {
            username: REACT_APP_PASSIVETOTAL_API_USER,
            password: REACT_APP_PASSIVETOTAL_API_KEY
        }
    });
    
    log('passivetotal subdomains',passiveTotalSubDomainsResult);
    return passiveTotalSubDomainsResult;
}

const fetchPassiveTotalPassiveDNS = async (ip) => {
    const {REACT_APP_PASSIVETOTAL_API_USER, REACT_APP_PASSIVETOTAL_API_KEY} = process.env;
    const passiveTotalPassiveDNS = await axios.get('https://api.passivetotal.org/v2/dns/passive', {
        params: {
            query: ip
        },
        auth: {
            username: REACT_APP_PASSIVETOTAL_API_USER,
            password: REACT_APP_PASSIVETOTAL_API_KEY
        }
    });
    
    log('passivetotal passive dns', passiveTotalPassiveDNS);
    return passiveTotalPassiveDNS;
}

const fetchSpurDataIP = async (ip) => {
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

const fetchURLScan = async (ipOrDomain) => {

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


function SearchBar({results, setResults}) { // TODO: HAVE AUTO-SELECTED WHEN PAGE IS OPENED!!

    const [search, setSearch] = useState('');
    const [query, setQuery] = useContext(QueryContext);
    const [, setBase64] = useContext(Base64Context);
    const updateArgsURL = useUpdateArgsURL();
    const [, setLineRefs] = useContext(LineContext)
    const [displayStats, setDisplayStats] = useContext(DisplayStatsContext)

    useEffect(() => {

        if (query === '') {
            setResults([])
            return;
        }

        updateArgsURL()
        

        const {type, subType} = classificationObj(query);

        // TODO: sanitize indicator (phone, etc.)

        let newResults = [{type, subType, indicator: query}]
        
        if (type === 'Email') {
            const afterEmailAt = query.substring(query.indexOf('@') + 1);
            const {type, subType} = classificationObj(afterEmailAt);
            newResults.push({type, subType, indicator: afterEmailAt})
        }
        
        setResults(newResults)

        setLineRefs({})

        dnsQueries(newResults);
    }, [query]);


    const CAAToText = (hexStr) => {

        hexStr = hexStr.split(' ').join('')

        hexStr = hexStr.substring(4)

        const tagLength = parseInt(hexStr.substring(0,4), 16)
        hexStr = hexStr.substring(4)

        let str = ''
        for (let i = 0; i < hexStr.length; i += 2) {
            str += String.fromCharCode(parseInt(hexStr.substr(i, 2), 16))
        }

        return str.substring(0, tagLength) + ' ' +str.substring(tagLength)
    }

    const dnsQueries = async (newResults) => { // TODO: FIX ISSUE where if the url is changed very quick between domains, the older one can sometimes override the newest addition

        const instance = axios.create({
            headers: {'Accept': 'application/dns-json'}
        });

        let arr = [...newResults];
        let diff = false;
    
        const addToResultObject = (object, additionObj) => {
            for (const key of Object.keys(additionObj)) {
                object[key] = additionObj[key];
            }
            setResults([...arr]);
        }
        
        const addIntegrationToResultObject = (object, integrationAdditionObj, integrationType) => {
            if (!object.integrations) object.integrations = {};
            for (const key of Object.keys(integrationAdditionObj)) {
                object.integrations[key] = integrationAdditionObj[key];
                if (integrationType) {
                    object.integrations[key].integrationType = integrationType;
                    object.integrations[key].data = getCleaner(integrationType)(object.integrations[key].data);
                }
            }
            setResults([...arr]);
        }
        
        const updateBalance = (balanceObj) => {
            /*let obj = {...displayStats.balances};
            for (const key in Object.keys(balanceObj)) {
                if (!obj.hasOwnProperty(key) || balanceObj[key] < obj[key]) {
                    obj[key] = balanceObj[key];
                }
            }
            log({...displayStats, balances: obj})
            const key = Object.keys(balanceObj[0]);
            if (displayStats?.balances?[key] && displayStats.balances[key] === balanceObj[key]) {
                setDisplayStats({...displayStats, balances: {...displayStats.balances, ...balanceObj}})
            }*/
            setDisplayStats({...displayStats, balances: {...displayStats.balances, ...balanceObj}})
            // TODO: fix, this doesn't compare values!
        }
        
        const startIpAdditions = (object, ip) => {
    
            // TODO: this shouldn't really be an integration!
            addIntegrationToResultObject(object, {indicatorData: classificationObj(ip)});
            // AP2ISN
            // TODO: use backend AP2ISN
            fetchDataIP(ip).then(res => {
                addToResultObject(object, {ipData: res});
            }).catch(err => {
                log(err);
            });
    
            // Spur
            fetchSpurDataIP(ip).then(res => {
                addIntegrationToResultObject(object, {spurResult: res}, integrationNames.SPUR);
                let newSpurCount = res.headers['x-balance-remaining']
                updateBalance({spurBalance: newSpurCount})
            }).catch(err => {
                log(err);
            });
    
            // censys
            fetchCensysDataIP(ip).then(res => {
                addIntegrationToResultObject(object, {censysResult: res}, integrationNames.CENSYS_IP);
            }).catch(err => {
                log(err);
            });
    
            // passivetotal
            fetchPassiveTotalPassiveDNS(ip).then(res => { // passive dns
                addIntegrationToResultObject(object, {passiveTotalPassiveDNSResult: res}, integrationNames.PASSIVETOTAL_PASSIVE_DNS_IP);
            }).catch(err => {
                log(err);
            });

            // url scan TODO:
        }
        
        const startDomainAdditions = async (object, domain) => {
    
            // TODO: this also shouldn't really be an integration!
            addIntegrationToResultObject(object, {indicatorData: classificationObj(domain)});
    
            // DNS records
            const dataA = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${domain}&type=A`)).data
            const dataAAAA = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${domain}&type=AAAA`)).data
            const dataNS = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${domain}&type=NS`)).data
            const dataMX = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${domain}&type=MX`)).data
            const dataTXT = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${domain}&type=TXT`)).data
            const dataDmarcTXT = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=_dmarc.${domain}&type=TXT`)).data
            const dataCAA = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${domain}&type=CAA`)).data
            const dataSOA = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${domain}&type=SOA`)).data
    
            if (dataNS.Answer) {
                dataNS.Answer = dataNS.Answer.map(entry => {return {...entry, data:stripTrailingPeriod(entry.data)}})
            }
            if (dataMX.Answer) {
                dataMX.Answer = dataMX.Answer.map(entry => {return {...entry, data:stripTrailingPeriod(entry.data)}})
            }
            if (dataCAA.Answer) {
                dataCAA.Answer = dataCAA.Answer.map(entry => {return {...entry, data:CAAToText(entry.data)}})
            }
            
            addToResultObject(object,
                {dns: {A: dataA, AAAA: dataAAAA, NS: dataNS, MX: dataMX, TXT: dataTXT, dmarcTXT: dataDmarcTXT, CAA: dataCAA, SOA: dataSOA}});
    
            // get whois data
            axios.get('/who-is-domain', {
                params: {
                    domain: domain
                }
            }).then(whoIsResult => {
                log('who is:', whoIsResult)
                if (whoIsResult.status === 200) {
                    addIntegrationToResultObject(object, {whoisResult: whoIsResult}, integrationNames.WHOIS)
                }
            }).catch(err => {
                log(err);
            });
    
            // passivetotal ======
            fetchPassiveTotalWhois(domain).then(res => { // whois
                addIntegrationToResultObject(object, {passiveTotalWhoisResult: res}, integrationNames.PASSIVETOTAL_WHOIS)
            }).catch(err => {
                log(err);
            });
    
            fetchPassiveTotalSubDomains(domain).then(res => { // sub-domains
                log('subdomains', res)
                addIntegrationToResultObject(object, {passiveTotalSubDomainsResult: res}, integrationNames.PASSIVETOTAL_SUBDOMAINS)
            }).catch(err => {
                log(err);
            });
    
            /**
             * CURRENT TODO:
             * abstract out sorts and cleaning from rendering code (they're getting called like crazy, and I expect that is bottle-necking performance)
             */
            fetchPassiveTotalPassiveDNS(domain).then(res => { // passive dns for domain
                log('passive dns for domain', res)
                addIntegrationToResultObject(object, {passiveTotalPassiveDNSResult: res}, integrationNames.PASSIVETOTAL_PASSIVE_DNS_DOMAIN)
            }).catch(err => {
                log(err);
            });

            // url scan
            fetchURLScan(domain).then(res => { // sub-domains
                addIntegrationToResultObject(object, {urlScanResult: res}, integrationNames.URL_SCAN)
            }).catch(err => {
                log(err);
            });

            
            // resolve more information for ip children
            for (const data of [dataA, dataAAAA]) {
                if (data.Answer !== undefined) {
                    for (let j = 0; j < data.Answer.length; j++) {
                        const ip = data.Answer[j].data
                
                        startIpAdditions(data.Answer[j], ip);
                    }
                }
            }
        }
        
        const startEmailAdditions = (object, email) => {
            // Verify Email
            axios.get('/verify-email', {
                params: {
                    email: email
                }
            }).then(infoResult => {
                log('email info:', infoResult)
                let status = 'err', banner = '';
                if (infoResult.data !== 'err') {
                    status = infoResult.data.success;
                    banner = infoResult.data.banner;
                }
        
                addToResultObject(object, {valid: status, emailVerificationBanner: banner});
                log(arr)
            }).catch(err => {
                log(err);
            });
        }
    
        const startPhoneNumberAdditions = (object, phoneNumber) => {
            // Verify Phone Number
            axios.get('/verify-phone-number', {
                params: {
                    phoneNumber: phoneNumber
                }
            }).then(validResult => {
                log('phone number validation:', validResult.data)
                addToResultObject(object, {valid: validResult.data})
                log(arr)
            }).catch(err => {
                log(err);
            });
        }
        
        
        for (let i = 0; i < arr.length; i++) {
            const result = arr[i];
            let thisDiff = true;
            
            switch (result.type) {
                case 'Domain':
                    await startDomainAdditions(result, result.indicator); // why is this one await but the others aren't?
                    break;
                case 'IP':
                    startIpAdditions(result, result.indicator);
                    break;
                case 'Email':
                    startEmailAdditions(result, result.indicator);
                    break;
                case 'PhoneNumber':
                    startPhoneNumberAdditions(result, result.indicator);
                    break;
                default:
                    thisDiff = false;
                    break;
            }
            if (thisDiff) diff = true; // TODO: figure out what this was for
        }

        if (diff) {
            log('result:', arr[0])
            setResults(arr)
        }
    }

    const getQuery = e => {
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
