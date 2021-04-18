import {ConfigContext} from "./ConfigContext";
import { useEffect, useContext } from 'react';

function Loader (props) {

    const [rawConfigs, setRawConfigs] = useContext(ConfigContext)
    useEffect(() => { // TODO: fix order
        loadInitConfigs()
    }, []);

    const loadInitConfigs = async () => {
        const paths = ['config/GeneralHunting.txt', 'config/InternalTools.txt', 'config/EnterpriseLinks.txt']
        let configs = []
        for (let i = 0; i < paths.length; i++) {
            configs.push(await (await fetch(paths[i])).text())
        }
        setRawConfigs(configs)

        const axios = require('axios');
        let test = await axios.get('/ip2asn', {
            params: {
                ip: '1.1.1.2'
            }
        })

        console.log(test)

        test = await axios.get('/whoisdomain', {
            params: {
                domain: 'test.com'
            }
        })

        console.log(test)
    }

    return (
        <div>
            {props.children}
        </div>
    );
}

export default Loader;
