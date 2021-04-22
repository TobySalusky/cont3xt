import {createContext, useState} from "react";

export const LineContext = createContext();

export const LineProvider = (props) => {
    const [lineRefs, setLineRefs] = useState({})

    return <LineContext.Provider value={[lineRefs, setLineRefs]}>{props.children}</LineContext.Provider>;
}
