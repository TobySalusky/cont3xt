import './App.css';
import { useState, useEffect } from 'react';

// TODO: ip, hostname (domain [website]), phone number, email address, more?
// TODO: auto-format phone number results

function SearchBar(props) { // TODO: HAVE AUTO-SELECTED WHEN PAGE IS OPENED!!

    const [search, setSearch] = useState('');
    const [query, setQuery] = useState('');

    const typeValidation = {
        phone: /^(\d{3})[-. ]?(\d{3})[-. ]?(\d{4})$/,
        domain: /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+$/,
        email: /^$/, // TODO:
        ip: /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/,
    }

    useEffect(() => {
        // TODO: use query

        let type = 'Text';
        if (typeValidation.phone.test(query)) type = 'PhoneNumber'
        else if (typeValidation.ip.test(query)) type = 'IP'
        else if (typeValidation.domain.test(query)) type = 'Domain'


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
            <input className="SearchBar" type="text" value={search} onChange={e => setSearch(e.target.value)}/>
            <button className="SearchSubmit" type="submit">
                Get Cont3xt
            </button>
        </form>
    );
}

export default SearchBar;