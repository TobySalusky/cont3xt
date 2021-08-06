import {TypeDataProvider} from "../Pages/Edit";
import {ConfigProvider, EditConfigProvider} from "./ConfigContext";
import { Base64Provider, NumDaysProvider, QueryProvider } from "./SearchContext";
import { DisplayStatsProvider } from './DisplayStatsContext';

function GlobalProvider(props) {

    return (
        <TypeDataProvider>
            <EditConfigProvider>
                <ConfigProvider>
                    <Base64Provider>
                        <QueryProvider>
                            <NumDaysProvider>
                                <DisplayStatsProvider>
                                    {props.children}
                                </DisplayStatsProvider>
                            </NumDaysProvider>
                        </QueryProvider>
                    </Base64Provider>
                </ConfigProvider>
            </EditConfigProvider>
        </TypeDataProvider>
    );
}

export default GlobalProvider;
