import {TypeDataProvider} from "./Edit";
import {ConfigProvider, EditConfigProvider} from "./ConfigContext";
import {NumDaysProvider, QueryProvider} from "./SearchContext";
import {LineProvider} from "./LineContext";
import { DisplayStatsProvider } from './DisplayStatsContext';

function GlobalProvider(props) {

    return (
        <TypeDataProvider>
            <EditConfigProvider>
                <ConfigProvider>
                    <QueryProvider>
                        <NumDaysProvider>
                            <LineProvider>
                                <DisplayStatsProvider>
                                    {props.children}
                                </DisplayStatsProvider>
                            </LineProvider>
                        </NumDaysProvider>
                    </QueryProvider>
                </ConfigProvider>
            </EditConfigProvider>
        </TypeDataProvider>
    );
}

export default GlobalProvider;
