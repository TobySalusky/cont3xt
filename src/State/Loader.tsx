import {ConfigContext} from "./ConfigContext";
import React, { useEffect, useContext } from 'react';
import { LocalStorage } from "../Util/LocalStorage";
import {Settings} from "../Settings/Settings";
import {Global} from "../Settings/Global";
import {existsSync} from 'fs';

const Loader: React.FC = ({children}) => {

    const [, setRawConfigs] = useContext(ConfigContext)

    const loadInitConfigs = async (): Promise<void> => {

        const paths = ['config/GeneralHunting.txt', 'config/InternalTools.txt', 'config/EnterpriseLinks.txt']
        let configs = []
        for (let i = 0; i < paths.length; i++) {
            configs.push(await (await fetch(paths[i])).text())
        }
        setRawConfigs(configs)
    }

    useEffect(() => {
        loadInitConfigs();
    }, []);


    return (
        <div>
            {children}
        </div>
    );
}

export default Loader;
