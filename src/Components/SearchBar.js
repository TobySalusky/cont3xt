import '../Style/App.css';
import { useState, useEffect, useContext } from 'react';
import {useUpdateArgsURL} from "../Util/URLHandler";
import { Base64Context, QueryContext } from "../State/SearchContext";
import {LineContext} from "../State/LineContext";
import axios from 'axios';
import { DisplayStatsContext } from '../State/DisplayStatsContext';

// TODO: ip, hostname (domain [website]), phone number, email address, more?
// TODO: auto-format phone number results

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
    // censys
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
            console.log('test censys', page);
            censysObj = {...censysObj, ...page};
        }
        
        if (Object.keys(censysObj).length === 0) return null;
        
        return {data: censysObj};
    }
    console.log('no censys api authentication provided.');
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
    
    console.log('passivetotal whois',passiveTotalWhois);
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
    
    console.log('passivetotal subdomains',passiveTotalSubDomainsResult);
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
    
    console.log('passivetotal passive dns', passiveTotalPassiveDNS);
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
    
    console.log('spur', spurRes)
    
    return spurRes
}


function SearchBar({setResults}) { // TODO: HAVE AUTO-SELECTED WHEN PAGE IS OPENED!!

    const [search, setSearch] = useState('');
    const [query, setQuery] = useContext(QueryContext);
    const [, setBase64] = useContext(Base64Context);
    const updateArgsURL = useUpdateArgsURL();
    const [, setLineRefs] = useContext(LineContext)
    const [displayStats, setDisplayStats] = useContext(DisplayStatsContext)
    
    const typeValidation = {
        phone: /^(\d{3})[-. ]?(\d{3})[-. ]?(\d{4})$/,
        domain: /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/, //TODO: don't accept hyphen as first or last
        email: /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-](\.?[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-])+@([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)$/,
        //ip: /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/,
        MD5: /^[A-Fa-f0-9]{32}$/,
        SHA1: /^[A-Fa-f0-9]{40}$/,
        SHA256: /^[A-Fa-f0-9]{64}$/,
    }

    useEffect(() => {

        if (query === '') {
            setResults([])
            return;
        }

        updateArgsURL()

        const ipRegex = require('ip-regex');

        let type = 'Text';
        let subType = 'None';
        if (typeValidation.phone.test(query)) type = 'PhoneNumber'
        else if (ipRegex.v4({exact: true}).test(query)) {
            type = 'IP';
            subType = 'IPv4';
        }
        else if (ipRegex.v6({exact: true}).test(query)) {
            type = 'IP';
            subType = 'IPv6';
        }
        else if (typeValidation.email.test(query)) type = 'Email'
        else if (typeValidation.domain.test(query)) type = 'Domain'
        else if (typeValidation.MD5.test(query)) {
            type = 'Hash';
            subType = 'MD5'
        }
        else if (typeValidation.SHA1.test(query)) {
            type = 'Hash';
            subType = 'SHA1'
        }
        else if (typeValidation.SHA256.test(query)) {
            type = 'Hash';
            subType = 'SHA256'
        }

        // TODO: sanitize indicator (phone, etc.)

        let newResults = [{type, subType, indicator: query}]
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
        
        const addIntegrationToResultObject = (object, integrationAdditionObj) => {
            if (!object.integrations) object.integrations = {};
            for (const key of Object.keys(integrationAdditionObj)) {
                object.integrations[key] = integrationAdditionObj[key];
            }
            setResults([...arr]);
        }
        
        const startIpAdditions = (object, ip) => {
            // AP2ISN
            // TODO: use backend AP2ISN
            fetchDataIP(ip).then(res => {
                addToResultObject(object, {ipData: res});
            }).catch(err => {
                console.log(err);
            });
    
            // Spur
            fetchSpurDataIP(ip).then(res => {
                addIntegrationToResultObject(object, {spurResult: res});
                let newSpurCount = res.headers['x-balance-remaining']
                if (!displayStats.spurBalance || newSpurCount < displayStats.spurBalance) {
                    setDisplayStats({...displayStats, spurBalance: newSpurCount})
                }
            }).catch(err => {
                console.log(err);
            });
    
            // censys
            fetchCensysDataIP(ip).then(res => {
                addIntegrationToResultObject(object, {censysResult: res});
            }).catch(err => {
                console.log(err);
            });
    
            // passivetotal
            fetchPassiveTotalPassiveDNS(ip).then(res => { // passive dns
                addIntegrationToResultObject(object, {passiveTotalPassiveDNSResult: res});
            }).catch(err => {
                console.log(err);
            });
        }
        
        const startDomainAdditions = async (object, domain) => {
            
            // DNS records
            const dataA = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${domain}&type=A`)).data
            const dataAAAA = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${domain}&type=AAAA`)).data
            const dataNS = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${domain}&type=NS`)).data
            const dataMX = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${domain}&type=MX`)).data
            const dataTXT = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${domain}&type=TXT`)).data
            const dataDmarcTXT = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=_dmarc.${domain}&type=TXT`)).data
            const dataCAA = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${domain}&type=CAA`)).data
            const dataSOA = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${domain}&type=SOA`)).data
    
            if (dataCAA.Answer !== undefined) {
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
                console.log('who is:', whoIsResult)
                if (whoIsResult.status === 200) {
                    addIntegrationToResultObject(object, {whoisResult: whoIsResult})
                }
            }).catch(err => {
                console.log(err);
            });
    
            // passivetotal ======
            fetchPassiveTotalWhois(domain).then(res => { // whois
                addIntegrationToResultObject(object, {passiveTotalWhoisResult: res})
            }).catch(err => {
                console.log(err);
            });
    
            fetchPassiveTotalPassiveDNS(domain).then(res => { // sub-domains
                addIntegrationToResultObject(object, {passiveTotalSubDomainsResult: res})
            }).catch(err => {
                console.log(err);
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
                console.log('email info:', infoResult)
                let status;
                if (infoResult.data === 'err') {
                    status = 'err';
                } else {
                    status = infoResult.data.success;
                }
        
                addToResultObject(object, {valid: status});
                console.log(arr)
            }).catch(err => {
                console.log(err);
            });
        }
    
        const startPhoneNumberAdditions = (object, phoneNumber) => {
            // Verify Phone Number
            axios.get('/verify-phone-number', {
                params: {
                    phoneNumber: phoneNumber
                }
            }).then(validResult => {
                console.log('phone number validation:', validResult.data)
                addToResultObject(object, {valid: validResult.data})
                console.log(arr)
            }).catch(err => {
                console.log(err);
            });
        }
        
        
        for (let i = 0; i < arr.length; i++) {
            const result = arr[i];
            let thisDiff = true;
            if (result.type === 'Domain') {
                
                await startDomainAdditions(result, result.indicator);
               
            } else if (result.type === 'IP') {
                
                startIpAdditions(result, result.indicator);
                
            } else if (result.type === 'Email') {
    
                startEmailAdditions(result, result.indicator);
                
            } else if (result.type === 'PhoneNumber') {
    
                startPhoneNumberAdditions(result, result.indicator);
    
            } else {
                thisDiff = false;
            }
            if (thisDiff) diff = true;
        }

        if (diff) {
            console.log('result:', arr[0])
            setResults(arr)
        }
    }

    const getQuery = e => {
        e.preventDefault();
        if (query !== search && search !== '') {
            setBase64(null);
            setQuery(search);
            
        }
        setSearch('');
    }

    return (
        <form className="SearchContainer" onSubmit={getQuery}>
            <input autoFocus className="SearchBar" type="text" value={search} onChange={e => setSearch(e.target.value)}/>
            <button className="SearchSubmit" type="submit">
                Get Cont3xt
            </button>
        </form>
    );
}

export default SearchBar;
