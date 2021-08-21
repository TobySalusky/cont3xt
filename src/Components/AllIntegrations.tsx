import React, {useContext} from "react";
import {Integration} from "../Types/Integration";
import {mapOrder} from "../Util/SortUtil";
import {ActiveIntegrationContext} from "../State/ActiveIntegrationContext";
import {IntegrationTypes} from "../Enums/IntegrationTypes";

export const withPipe = (html : any) : JSX.Element => {
    return (
        <span style={{alignItems: 'center'}}>
			<p style={{marginLeft: 5}}>|</p>
            {html}
		</span>
    );
}

export const AllIntegrations : React.FC<{
    integrations : Integration[]
}> = ({integrations}) => {

    const integrationDict: any = {};

    for (const integration of integrations) {
        integrationDict[integration.type] = integration;
    }

    const sortedTypes = sortIntegrationTypes(integrations.map(integration => integration.type));

    const [, setActiveIntegration] = useContext(ActiveIntegrationContext);

    return (
        <span>
            {sortedTypes.map((typeStr) =>
                withPipe(integrationDict[typeStr].genIntegrationUI({setActiveIntegration}))
            )}
        </span>
    );
}

const sortIntegrationTypes = (integrationTypes: IntegrationTypes[]) : string[] => {
    return mapOrder(integrationTypes, [
        IntegrationTypes.SPUR,
        IntegrationTypes.CENSYS_IP,
        IntegrationTypes.WHOIS,
        IntegrationTypes.PASSIVETOTAL_WHOIS,
        IntegrationTypes.PASSIVETOTAL_PASSIVE_DNS_DOMAIN,
        IntegrationTypes.PASSIVETOTAL_PASSIVE_DNS_IP,
        IntegrationTypes.PASSIVETOTAL_SUBDOMAINS,
        IntegrationTypes.URL_SCAN,
        IntegrationTypes.VIRUS_TOTAL_DOMAIN,
        IntegrationTypes.VIRUS_TOTAL_IP,
        IntegrationTypes.VIRUS_TOTAL_HASH,
        IntegrationTypes.THREAT_STREAM,
    ]);
}
