import History from "./History";
import {QueryContext, NumDaysContext} from "./SearchContext";
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
        console.log(args)
    }

    return readArgsURL
}

export function useUpdateArgsURL() {

    const [query, setQuery] = useContext(QueryContext)
    const [numDays, setNumDays] = useContext(NumDaysContext)


    const updateArgsURL = () => {
        // eslint-disable-next-line no-restricted-globals
        const params = new URLSearchParams(location.search);
        const currStr = '/?' + params.toString();
        const queryStr = '/?d='+numDays+'&q='+query;
        if (currStr !== queryStr && (query !== '' || currStr === '')) {
            if (query === '') {
                History.push('/')
            } else {
                History.push(queryStr)
            }
        }
    }

    return updateArgsURL
}
