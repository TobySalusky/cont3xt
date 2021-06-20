import '../Style/App.css';
import {Link} from "react-router-dom";
import {ConfigContext, EditConfigContext} from "../State/ConfigContext";
import { useContext, useState } from 'react';
import {readConfig} from "../Util/Configurations";



function ConfigSelectPage() {

    const [rawConfigs, setRawConfigs] = useContext(ConfigContext)
    const [editConfigIndex, setEditConfigIndex] = useContext(EditConfigContext)

    return (
        <div className="App">
            <div className="SettingsTopBar">
                <div className="Left">
                    <Link to="/">
                        <img className="IconButton" style={{marginLeft: 20}} src="./images/backArrow.png" alt="back arrow"/>
                    </Link>
                </div>

                <div className="CenterFull">
                    <h1 style={{fontSize: 50}}>Configurations</h1>
                </div>
            </div>

            <div className="ConfigArea">
                {rawConfigs.map((configText, i) => (
                    <ConfigBox name={readConfig(configText).title} index={i}></ConfigBox>
                ))}
                <div className="ConfigBox">
                    <Link to="/edit">
                        <img className="IconButton" src="./images/addButton.png" alt="settings button" onClick={() => setEditConfigIndex(-1)}/>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ConfigSelectPage;

export function ConfigBox({name, index}) {

    const [rawConfigs, setRawConfigs] = useContext(ConfigContext)
    const [editConfigIndex, setEditConfigIndex] = useContext(EditConfigContext)
    const [text, setText] = useState(name)

    const removeConfig = () => {
        let arr = [...rawConfigs]
        arr.splice(index, 1)
        setRawConfigs(arr)
    }

    const startEdit = () => {
        setEditConfigIndex(index);
    }

    return (
        <div className="ConfigBox">
            <h1>{name}</h1>
            <Link to="/edit">
                <img className="IconButton" src="./images/settingsBars.png" alt="settings button" onClick={startEdit}/>
            </Link>
            <img className="IconButton" src="./images/deleteButton.png" alt="settings button" onClick={removeConfig}/>
        </div>
    );
}