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
    }

    return (
        <div>
            {props.children}
        </div>
    );
}

export default Loader;
