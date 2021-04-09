import {TypeDataProvider} from "./Edit";
import {ConfigProvider, EditConfigProvider} from "./ConfigContext";
import {NumDaysProvider, QueryProvider} from "./SearchContext";

function GlobalProvider(props) {

    return (
        <TypeDataProvider>
            <EditConfigProvider>
                <ConfigProvider>
                    <QueryProvider>
                        <NumDaysProvider>
                            {props.children}
                        </NumDaysProvider>
                    </QueryProvider>
                </ConfigProvider>
            </EditConfigProvider>
        </TypeDataProvider>
    );
}

export default GlobalProvider;
