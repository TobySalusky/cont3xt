import {TypeDataProvider} from "./Edit";
import {ConfigProvider, EditConfigProvider} from "./ConfigContext";


function GlobalProvider(props) {

    return (
        <TypeDataProvider>
            <EditConfigProvider>
                <ConfigProvider>
                    {props.children}
                </ConfigProvider>
            </EditConfigProvider>
        </TypeDataProvider>
    );
}

export default GlobalProvider;
