import {useState, createContext} from 'react';

export const Base64Context = createContext();

export const Base64Provider = (props) => {
    const [base64, setBase64] = useState(null)
    
    return <Base64Context.Provider value={[base64, setBase64]}>{props.children}</Base64Context.Provider>;
}

export const QueryContext = createContext();

export const QueryProvider = (props) => {
    const [query, setQuery] = useState('')

    return <QueryContext.Provider value={[query, setQuery]}>{props.children}</QueryContext.Provider>;
}

export const NumDaysContext = createContext();

export const NumDaysProvider = (props) => {
    const [numDays, setNumDays] = useState(7)

    return <NumDaysContext.Provider value={[numDays, setNumDays]}>{props.children}</NumDaysContext.Provider>;
}
