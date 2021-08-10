import {integrationNames} from "./IntegrationDefinitions";

export const tryUseASN = (obj, integrationType, integrationResult, addFunc) => {
    const data = integrationResult;
    const integrations = obj.integrations;
    
    if (integrations?.indicatorData?.type !== 'IP') return;

    const {precedence:lastPrecedence = -1} = integrations.ipAsnData || {};
    const precedence = precedenceLevel(integrationType);

    if (precedence < lastPrecedence) return;

    const add = (asn, org, country) => {
        if (asn && org && country) addFunc(obj, {ipAsnData: {asn, org, country, precedence}});
    }

    switch (integrationType) {
        case integrationNames.SPUR:
            try {
                add(data.as.number, data.as.organization, data.geoLite.country);
            } catch (e) {
                console.log(e)
                console.log('failed to use spur asn data')
            }
            break;
        case integrationNames.URL_SCAN:
            try {
                const {asn, asnnumber, country} = data.results[0].page;
                add(asn, asnnumber, country);
            } catch (e) {
                console.log(e)
                console.log('failed to use urlscan asn data')
            }
            break;
        case integrationNames.VIRUS_TOTAL_IP:
            try {
                add(data.as, data.as_owner, data.country);
            } catch (e) {
                console.log(e)
                console.log('failed to use VT asn data')
            }
            break;
    }
}

const precedenceLevel = (integrationType) => {
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