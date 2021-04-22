import {TypeDataProvider} from "./Edit";
import {ConfigProvider, EditConfigProvider} from "./ConfigContext";
import {NumDaysProvider, QueryProvider} from "./SearchContext";
import {LineProvider} from "./LineContext";

function GlobalProvider(props) {

    return (
        <TypeDataProvider>
            <EditConfigProvider>
                <ConfigProvider>
                    <QueryProvider>
                        <NumDaysProvider>
                            <LineProvider>
                                {props.children}
                            </LineProvider>
                        </NumDaysProvider>
                    </QueryProvider>
                </ConfigProvider>
            </EditConfigProvider>
        </TypeDataProvider>
    );
}

export default GlobalProvider;
