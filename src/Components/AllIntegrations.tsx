import React, {useContext} from "react";
import {Integration} from "../Types/Integration";
import {mapOrder} from "../Util/SortUtil";
import {integrationNames} from "../Util/IntegrationDefinitions";
import {ActiveIntegrationContext} from "../State/ActiveIntegrationContext";

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

const sortIntegrationTypes = (integrationTypes: string[]) : string[] => {
    return mapOrder(integrationTypes, [
        integrationNames.SPUR,
        integrationNames.CENSYS_IP,
        integrationNames.WHOIS,
        integrationNames.PASSIVETOTAL_WHOIS,
        integrationNames.PASSIVETOTAL_PASSIVE_DNS_DOMAIN,
        integrationNames.PASSIVETOTAL_PASSIVE_DNS_IP,
        integrationNames.PASSIVETOTAL_SUBDOMAINS,
        integrationNames.URL_SCAN,
        integrationNames.VIRUS_TOTAL_DOMAIN,
        integrationNames.VIRUS_TOTAL_IP,
        integrationNames.VIRUS_TOTAL_HASH,
        integrationNames.THREAT_STREAM,
    ]);
}
