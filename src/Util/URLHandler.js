import History from "./History";
import { QueryContext, NumDaysContext, Base64Context } from "../State/SearchContext";
import {useContext} from "react";

export function argsFromURL() {
    // eslint-disable-next-line no-restricted-globals
    const params = new URLSearchParams(location.search);
    const d = params.get('d') ?? 7;
    const q = params.get('q') ?? '';
    const b = params.get('b') ?? null;
    return {d, q, b};
}

export function useReadArgsURL() {

    const [, setQuery] = useContext(QueryContext)
    const [, setNumDays] = useContext(NumDaysContext)
    const [, setBase64] = useContext(Base64Context)
    const { base64decode } = require('nodejs-base64');

    // noinspection UnnecessaryLocalVariableJS
    const readArgsURL = () => {
        const {q, b, d} = argsFromURL();
        if (b !== null) {
            setBase64(b);
            setQuery(base64decode(b));
        } else {
            setBase64(null);
            setQuery(q);
        }
        setNumDays(d);
    }

    return readArgsURL;
}

export function useUpdateArgsURL() {

    const [query, ] = useContext(QueryContext)
    const [numDays, ] = useContext(NumDaysContext)
    const [base64, ] = useContext(Base64Context)


    const updateArgsURL = () => {
    
        // eslint-disable-next-line no-restricted-globals
        const params = new URLSearchParams(location.search);

        const newParams = new URLSearchParams();
        newParams.append('d', numDays);
        if (base64 === null) {
            newParams.append('q', query);
        } else {
            newParams.append('b', base64);
        }

        const currURLEnd = params.toString();
        let newURLEnd = newParams.toString();

        if (query === '') {
            newURLEnd = '';
        }

        if (currURLEnd !== newURLEnd) {
            History.push('/'+(newURLEnd === '' ? '' : '?')+newURLEnd)
        }
    }

    return updateArgsURL
}
