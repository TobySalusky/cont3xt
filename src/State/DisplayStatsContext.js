import {useState, createContext} from 'react';

export const DisplayStatsContext = createContext();

export const DisplayStatsProvider = (props) => {
    const [displayStats, setDisplayStats] = useState({})

    return <DisplayStatsContext.Provider value={[displayStats, setDisplayStats]}>{props.children}</DisplayStatsContext.Provider>;
}
