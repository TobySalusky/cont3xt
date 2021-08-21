import {IndicatorNode} from "../Types/IndicatorNode";
import {ITypes} from "../Enums/ITypes";
import {IntegrationTypes} from "../Enums/IntegrationTypes";

export const tryUseASN = (indicatorNode: IndicatorNode, integrationType : string, integrationData : any) => {
    const data : any = integrationData;

    if (indicatorNode.type !== ITypes.IP) return;

    const {precedence:lastPrecedence = -1} = indicatorNode.ipAsnData || {};
    const precedence = precedenceLevel(integrationType);

    if (precedence < lastPrecedence) return;

    const setAs = (asn : string | number, org : string, country : string) => {
        indicatorNode.ipAsnData = {
            asn, org, country, precedence
        };
    }

    switch (integrationType) {
        case IntegrationTypes.SPUR:
            try {
                setAs(data.as.number, data.as.organization, data.geoLite.country);
            } catch (e) {
                console.log(e)
                console.log('failed to use spur asn data')
            }
            break;
        case IntegrationTypes.URL_SCAN:
            try {
                const {asn, asnnumber, country} = data.results[0].page;
                setAs(asn, asnnumber, country);
            } catch (e) {
                console.log(e)
                console.log('failed to use urlscan asn data')
            }
            break;
        case IntegrationTypes.VIRUS_TOTAL_IP:
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
        case IntegrationTypes.SPUR:
            return 3;
        case IntegrationTypes.URL_SCAN:
            return 2;
        case IntegrationTypes.VIRUS_TOTAL_IP:
            return 1;
        default:
            return -2;
    }
}
