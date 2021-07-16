import {TypeDataProvider} from "../Pages/Edit";
import {ConfigProvider, EditConfigProvider} from "./ConfigContext";
import { Base64Provider, NumDaysProvider, QueryProvider } from "./SearchContext";
import {LineProvider} from "./LineContext";
import { DisplayStatsProvider } from './DisplayStatsContext';

function GlobalProvider(props) {

    return (
        <TypeDataProvider>
            <EditConfigProvider>
                <ConfigProvider>
                    <Base64Provider>
                        <QueryProvider>
                            <NumDaysProvider>
                                <LineProvider>
                                    <DisplayStatsProvider>
                                        {props.children}
                                    </DisplayStatsProvider>
                                </LineProvider>
                            </NumDaysProvider>
                        </QueryProvider>
                    </Base64Provider>
                </ConfigProvider>
            </EditConfigProvider>
        </TypeDataProvider>
    );
}

export default GlobalProvider;
