import {TypeDataProvider} from "../Pages/Edit";
import {ConfigProvider, EditConfigProvider} from "./ConfigContext";
import { Base64Provider, NumDaysProvider, QueryProvider } from "./SearchContext";
import { DisplayStatsProvider } from './DisplayStatsContext';
import { ActiveIntegrationProvider } from './ActiveIntegrationContext';
import { MutationProvider } from './MutationContext';

function GlobalProvider(props) {

    return (
        <TypeDataProvider>
            <EditConfigProvider>
                <ConfigProvider>
                    <Base64Provider>
                        <QueryProvider>
                            <NumDaysProvider>
                                <DisplayStatsProvider>
                                    <ActiveIntegrationProvider>
                                        <MutationProvider>
                                            {props.children}
                                        </MutationProvider>
                                    </ActiveIntegrationProvider>
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
