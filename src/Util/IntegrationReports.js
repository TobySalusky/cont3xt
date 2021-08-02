import { integrationNames } from "./IntegrationDefinitions";

import { toColorTextOld } from "./Util";
import {FIRST_SEEN, sortPassiveDNSResults} from "./SortUtil";
import { tabLines } from "./StringUtil";
import { toOrderedKeys } from "./IntegrationCleaners";

export const dnsString = (dns, settingsObj) => {
	let {tabs = false, spaceCount = -1} = settingsObj
	if (!tabs) spaceCount = 0;
	
	return `DNS: {\n${tabLines(Object.keys(dns).filter(dnsType => dns[dnsType].Answer != null).map(dnsType => {
		return `${dnsType}:\n${tabLines(dns[dnsType].Answer.map(answer => answer.data).join('\n'), spaceCount)}`;
	}).join('\n'), spaceCount)}\n}`;
}

// fragment is a bool that indicates whether the string returned is part of a larger report (determines if header is used)
export const generateIntegrationReport = (integrationType, integrationData, settingsObj = {}) => {
	
	if (integrationType == null) return null;
	
	const data = integrationData;
	let {tabs = false, spaceCount = -1} = settingsObj
	if (!tabs) spaceCount = 0;
	
	const keys = toOrderedKeys(integrationType, Object.keys(data));
	//const orderedKeys = Object.keys(data);
	
	switch (integrationType) {
		
		case integrationNames.PASSIVETOTAL_SUBDOMAINS: {
			const list = data.subdomains;
			return ['Subdomains:'].concat(tabLines(list.join('\n'), spaceCount)).join('\n');
		}
		
		case integrationNames.PASSIVETOTAL_PASSIVE_DNS_DOMAIN:
		case integrationNames.PASSIVETOTAL_PASSIVE_DNS_IP: {
			const keysAndColorText = keys.filter(key => key !== 'results').map(key => {
				const colorText = toColorTextOld(data[key])
				return {key, colorText};
			}).filter(({colorText}) => colorText.val != null);
			
			const resultList = data.results;
			
			const {sortType = FIRST_SEEN} = settingsObj;
			
			const stringifyResult = (result) => {
				const {recordType, resolveType, resolve, firstSeen, lastSeen} = result;
				return `${(integrationType === integrationNames.PASSIVETOTAL_PASSIVE_DNS_DOMAIN) ? `${resolveType}${recordType ? `(${recordType})` : ''}: ` : ''}${resolve}, firstSeen: ${firstSeen}, lastSeen: ${lastSeen}`;
			}

			return keysAndColorText.map(({key, colorText}) => `${key}: ${colorText.val}`).concat(['Results:'])
				.concat(tabLines(sortPassiveDNSResults(resultList, sortType).map(result => stringifyResult(result)).join('\n'), spaceCount)).join('\n');
		}
		
		default: {// TODO: remove colorText usage (it's very slow)
			const keysAndColorText = keys.map(key => {
				const colorText = toColorTextOld(data[key])
				return {key, colorText};
			}).filter(({colorText}) => colorText.val != null);
			
			return keysAndColorText.map(({key, colorText}) => `${key}: ${colorText.val}`).join('\n');
		}
	}
}

export const generateIntegrationReportTooltipCopy = (indicatorData, integrationType, integrationData, settingsObj) => {
	console.log(integrationType, integrationData)
	return `${indicatorData.stringify()}\n${generateIntegrationReport(integrationType, integrationData, settingsObj)}`;
}
