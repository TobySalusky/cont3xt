import {createTimeStamp} from "./Util";
import {integrationNames} from "./IntegrationDefinitions";
import {IndicatorNode} from "../Types/IndicatorNode";

export interface RegistrarData {
    registrar: string;
    registeredDateString: string;
    precedence: number;
}

export const createRegistrarData = (integrationType: string, registrar: string, registeredDateTimestamp: string): RegistrarData => {
    return {
        registrar,
        registeredDateString: createTimeStamp(new Date(registeredDateTimestamp)),
        precedence: integrationType === integrationNames.PASSIVETOTAL_WHOIS ? 1 : 0,
    };
}

export const tryUseRegistrarData = (indicatorNode: IndicatorNode, integrationType: string, data: any): void => {
    try {
        const registrarData = (()=>{
            if (integrationType === integrationNames.PASSIVETOTAL_WHOIS) {
                // PT whois
                return createRegistrarData(integrationType, data.registrar, data.registered);
            }
            // basic whois
            return createRegistrarData(integrationType, data.registrar || data.registrantOrganization, data.creationDate || data.created);
        })();
        if (registrarData != null && (indicatorNode.registrarData === undefined || indicatorNode.registrarData.precedence < registrarData.precedence)) {
            indicatorNode.registrarData = registrarData;
        }
    } catch (e) {
        console.log(`failed to use registrar data from ${integrationType}`, e)
    }
}
