import {useState, createContext} from 'react';

export const ConfigContext = createContext();

export const ConfigProvider = (props) => {
    const [configs, setConfigs] = useState([])

    return <ConfigContext.Provider value={[configs, setConfigs]}>{props.children}</ConfigContext.Provider>;
}

export const EditConfigContext = createContext();

export const EditConfigProvider = (props) => {
    const [editConfigIndex, setEditConfigIndex] = useState([])

    return <EditConfigContext.Provider value={[editConfigIndex, setEditConfigIndex]}>{props.children}</EditConfigContext.Provider>;
}