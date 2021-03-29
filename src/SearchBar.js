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
        ip: /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/, //TODO: don't accept hyphen as first or last
        MD5: /^[A-Fa-f0-9]{32}$/,
        SHA1: /^[A-Fa-f0-9]{40}$/,
        SHA256: /^[A-Fa-f0-9]{64}$/,
    }

    useEffect(() => {
        // TODO: use query

        let type = 'Text';
        if (typeValidation.phone.test(query)) type = 'PhoneNumber'
        else if (typeValidation.ip.test(query)) type = 'IP'
        else if (typeValidation.email.test(query)) type = 'Email'
        else if (typeValidation.domain.test(query)) type = 'Domain'
        else if (typeValidation.MD5.test(query)) type = 'MD5'
        else if (typeValidation.SHA1.test(query)) type = 'SHA1'
        else if (typeValidation.SHA256.test(query)) type = 'SHA256'

        if (query !== '') {
            props.setResults((
                [[type, query]]
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