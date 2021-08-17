import {ConfigContext} from "./ConfigContext";
import React, { useEffect, useContext } from 'react';
import { LocalStorage } from "../Util/LocalStorage";
import {Settings} from "../Settings/Settings";
import {Global} from "../Settings/Global";

const Loader: React.FC = ({children}) => {

    const [, setRawConfigs] = useContext(ConfigContext)

    const loadInitConfigs = async (): Promise<void> => {

        const paths = ['config/GeneralHunting.txt', 'config/InternalTools.txt', 'config/EnterpriseLinks.txt']
        let configs = []
        for (let i = 0; i < paths.length; i++) {
            configs.push(await (await fetch(paths[i])).text())
        }
        setRawConfigs(configs)

        /*let test = await axios.get('/ip2asn', {
            params: {
                ip: '1.1.1.2'
            }
        })

        log(test)

        const test = await axios.post('/register', {
            username: 'a',
            password: 'A',
            id: 1
        });*/
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
