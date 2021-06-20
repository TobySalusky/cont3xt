import History from "./History";
import {QueryContext, NumDaysContext} from "../State/SearchContext";
import {useContext} from "react";

export function argsFromURL() {
    // eslint-disable-next-line no-restricted-globals
    const params = new URLSearchParams(location.search);
    let d = params.get('d')
    d = d ? d : 7;
    let q = params.get('q')
    q = q ? q : '';
    return {d, q};
}

export function useReadArgsURL() {

    const [query, setQuery] = useContext(QueryContext)
    const [numDays, setNumDays] = useContext(NumDaysContext)

    const readArgsURL = () => {
        const args = argsFromURL();
        setQuery(args.q)
        setNumDays(args.d)
    }

    return readArgsURL
}

export function useUpdateArgsURL() {

    const [query, setQuery] = useContext(QueryContext)
    const [numDays, setNumDays] = useContext(NumDaysContext)


    const updateArgsURL = () => {
        // eslint-disable-next-line no-restricted-globals
        const params = new URLSearchParams(location.search);

        const newParams = new URLSearchParams();
        newParams.append('d', numDays)
        newParams.append('q', query)

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
