import {integrationNames} from "./IntegrationDefinitions";
import {IndicatorNode} from "../Types/IndicatorNode";

export const tryUseASN = (indicatorNode: IndicatorNode, integrationType : string, integrationData : any) => {
    const data : any = integrationData;

    if (indicatorNode.type !== 'IP') return;

    const {precedence:lastPrecedence = -1} = indicatorNode.ipAsnData || {};
    const precedence = precedenceLevel(integrationType);

    if (precedence < lastPrecedence) return;

    const setAs = (asn : string | number, org : string, country : string) => {
        indicatorNode.ipAsnData = {
            asn, org, country, precedence
        };
    }

    switch (integrationType) {
        case integrationNames.SPUR:
            try {
                setAs(data.as.number, data.as.organization, data.geoLite.country);
            } catch (e) {
                console.log(e)
                console.log('failed to use spur asn data')
            }
            break;
        case integrationNames.URL_SCAN:
            try {
                const {asn, asnnumber, country} = data.results[0].page;
                setAs(asn, asnnumber, country);
            } catch (e) {
                console.log(e)
                console.log('failed to use urlscan asn data')
            }
            break;
        case integrationNames.VIRUS_TOTAL_IP:
            try {
                setAs(data.as, data.as_owner, data.country);
            } catch (e) {
                console.log(e)
                console.log('failed to use VT asn data')
            }
            break;
    }
}

const precedenceLevel = (integrationType : string) => {
    switch (integrationType) {
        case integrationNames.SPUR:
            return 3;
        case integrationNames.URL_SCAN:
            return 2;
        case integrationNames.VIRUS_TOTAL_IP:
            return 1;
        default:
            return -2;
    }
}