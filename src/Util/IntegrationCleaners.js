import { stripTrailingPeriod } from "./Util";
import { integrationNames } from "./IntegrationDefinitions";
import { mapOrder } from "./SortUtil";

export function orderedKeys(integrationType, keyList) {
	switch (integrationType) {
		case integrationNames.PASSIVETOTAL_WHOIS:
			return mapOrder(keyList, [
				'Domain', 'registrar', 'organization', 'registered', 'expiresAt', 'lastLoadedAt', 'registryUpdateAt', 'nameServers',
				'admin', 'billing', 'registrant', 'tech', 'whoisServer', 'name', 'telephone', 'domainStatus'
			]);
		default:
			return keyList;
	}
}

export const getCleaner = (integrationType) => {
	switch (integrationType) {
		case integrationNames.SPUR:
			return cleanSpur;
		case integrationNames.CENSYS_IP:
			return cleanCensys;
		case integrationNames.WHOIS:
			return cleanWhoIs;
		case integrationNames.PASSIVETOTAL_WHOIS:
			return cleanPassiveTotalWhois;
		case integrationNames.PASSIVETOTAL_PASSIVE_DNS_IP:
		case integrationNames.PASSIVETOTAL_PASSIVE_DNS_DOMAIN:
			return cleanPassiveTotalPassiveDNS;
		default:
			return noCleaner;
	}
}

export const noCleaner = (dict) => dict;

export const cleanSpur = (dict) => {
	const clean = {};
	for (const key of Object.keys(dict)) {
		if (key !== 'ip' && (key !== 'anonymous' || dict.anonymous === true)) clean[key] = dict[key];
	}
	
	return clean;
}

export const cleanCensys = (dict) => {
	const clean = {};
	for (const key of Object.keys(dict)) {
		if (key !== 'ip') clean[key] = dict[key];
	}
	
	return clean;
}

export const cleanWhoIs = (dict) => {
	const keepFields = [
		'adminCountry',
		'registrar', 'registrantOrganization',
		'creationDate', 'created',
		'updatedDate'
	];
	
	const clean = {};
	for (const key of Object.keys(dict)) {
		if (keepFields.indexOf(key) !== -1) clean[key] = dict[key];
	}
	
	return clean;
}

export const cleanPassiveTotalWhois = (dict) => {
	const clean = {};
	for (const key of Object.keys(dict)) {
		if (key !== 'rawText' && key !== 'domain') clean[key] = dict[key];
	}
	
	return clean;
}

export const cleanPassiveTotalPassiveDNS = (dict) => {
	const clean = {};
	for (const key of Object.keys(dict)) {
		if (dict[key] != null && key !== 'queryValue' && key !== 'queryType') clean[key] = dict[key];
	}
	
	const snipDate = (date) => date.substring(0, date.indexOf(' ')).replaceAll('-', '‑'); // uses non-breaking hyphens
	
	clean.results = clean.results.map(result => {
		const {recordType, resolveType, resolve, firstSeen, lastSeen} = result;
		return {
			recordType, resolveType,
			resolve: stripTrailingPeriod(resolve),
			firstSeen: snipDate(firstSeen), lastSeen: snipDate(lastSeen),
			fullFirstSeen: firstSeen, fullLastSeen: lastSeen
		}
	}).sort((a, b) => new Date(b.fullLastSeen) - new Date(a.fullFirstSeen));
	
	return clean;
}
