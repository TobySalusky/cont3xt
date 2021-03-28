import './App.css';
import { useState, useEffect } from 'react';
import ResultsBox from "./ResultsBox";

// TODO: ip, hostname (domain [website]), phone number, email address, more?
// TODO: auto-format phone number results

function SearchBar(props) {

    const [search, setSearch] = useState('');
    const [query, setQuery] = useState('');

    const typeValidation = {
        phone: /^(\d{3})[-. ]?(\d{3})[-. ]?(\d{4})$/,
        domain: /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+$/,
        email: /^$/, // TODO:
        ip: /^$/,
    }

    useEffect(() => {
        // TODO: use query
        console.log(query);
        console.log(typeValidation.phone.test(query))
        console.log(typeValidation.domain.test(query))

        let type = 'Text';
        if (typeValidation.phone.test(query)) type = 'PhoneNumber'
        else if (typeValidation.domain.test(query)) type = 'Domain'

        if (query !== '') {
            props.setResult((
                <ResultsBox resultType={type} indicator={query}/>
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
                Search
            </button>
        </form>
    );
}

export default SearchBar;