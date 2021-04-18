import './App.css';
import { useState, useEffect, useContext } from 'react';
import {useUpdateArgsURL} from "./URLHandler";
import {QueryContext} from "./SearchContext";

// TODO: ip, hostname (domain [website]), phone number, email address, more?
// TODO: auto-format phone number results

function SearchBar({results, setResults}) { // TODO: HAVE AUTO-SELECTED WHEN PAGE IS OPENED!!

    const [search, setSearch] = useState('');
    const [query, setQuery] = useContext(QueryContext);
    const updateArgsURL = useUpdateArgsURL();

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

        dnsQueries(newResults);
    }, [query]);

    const fetchDataIP = async (ip) => {
        const axios = require('axios');
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
        const axios = require('axios');

        const instance = axios.create({
            headers: {'Accept': 'application/dns-json'}
        });

        let arr = [...newResults];
        let diff = false;

        for (let i = 0; i < newResults.length; i++) {
            const result = newResults[i];
            let thisDiff = true;
            if (result.type === 'Domain') {
                const dataA = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${result.indicator}&type=A`)).data
                const dataAAAA = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${result.indicator}&type=AAAA`)).data
                const dataNS = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${result.indicator}&type=NS`)).data
                const dataMX = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${result.indicator}&type=MX`)).data
                const dataTXT = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${result.indicator}&type=TXT`)).data
                const dataDmarcTXT = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=_dmarc.${result.indicator}&type=TXT`)).data
                const dataCAA = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${result.indicator}&type=CAA`)).data
                const dataSOA = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${result.indicator}&type=SOA`)).data

                if (dataCAA.Answer !== undefined) {
                    dataCAA.Answer = dataCAA.Answer.map(entry => {return {...entry, data:CAAToText(entry.data)}})
                }

                arr[i] = {...result, dns: {A: dataA, AAAA: dataAAAA, NS: dataNS, MX: dataMX, TXT: dataTXT, dmarcTXT: dataDmarcTXT, CAA: dataCAA, SOA: dataSOA}}

                if (dataA.Answer !== undefined) {
                    for (let j = 0; j < dataA.Answer.length; j++) {
                        fetchDataIP(dataA.Answer[j].data).then(ipData => {
                            dataA.Answer[j] = {...dataA.Answer[j], ipData}
                            setResults([...arr])
                        })
                    }
                }

            } else if (result.type === 'IP') {

                const ipData = await fetchDataIP(result.indicator)
                arr[i] = {...result, ipData}

            } else {
                thisDiff = false;
            }
            if (thisDiff) diff = true;
        }

        if (diff) {
            console.log('dns:', arr[0])
            setResults(arr)
        }
    }

    const getQuery = e => {
        e.preventDefault();
        setQuery(search);
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
