import './App.css';
import { useState, useEffect } from 'react';

// TODO: ip, hostname (domain [website]), phone number, email address, more?
// TODO: auto-format phone number results

function SearchBar(props) { // TODO: HAVE AUTO-SELECTED WHEN PAGE IS OPENED!!

    const [search, setSearch] = useState('');
    const [query, setQuery] = useState('');

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
        // TODO: use query

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

        if (query !== '') {
            props.setResults((
                [{type, subType, indicator: query}]
            ))
        }
    }, [query]);

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