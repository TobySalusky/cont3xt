import {makeUnbreakable, stripTrailingPeriod} from "./Util";
import { integrationNames } from "./IntegrationDefinitions";
import { mapOrder } from "./SortUtil";
import dr from 'defang-refang'

export function orderedKeys(integrationType, keyList) {
	switch (integrationType) {
		case integrationNames.PASSIVETOTAL_WHOIS:
			return mapOrder(keyList, [
				'Domain', 'registrar', 'organization', 'registered', 'expiresAt', 'lastLoadedAt', 'registryUpdateAt', 'nameServers',
				'admin', 'billing', 'registrant', 'tech', 'whoisServer', 'name', 'telephone', 'domainStatus'
			]);
		case integrationNames.URL_SCAN:
			return mapOrder(keyList, [
				'total', 'took', 'has_more'
			]);
		default:
			return keyList;
	}
}

const getIntermediateCleaners = (integrationType) => {
	switch (integrationType) {
		case integrationNames.SPUR:
			return [cleanSpurExists, removeEmptyDicts, cleanSpur];
		case integrationNames.CENSYS_IP:
			return [cleanCensys];
		case integrationNames.WHOIS:
			return [cleanWhoIs];
		case integrationNames.PASSIVETOTAL_WHOIS:
			return [removeEmptyDicts, cleanPassiveTotalWhois];
		case integrationNames.PASSIVETOTAL_PASSIVE_DNS_IP:
		case integrationNames.PASSIVETOTAL_PASSIVE_DNS_DOMAIN:
			return [cleanPassiveTotalPassiveDNS];
		case integrationNames.URL_SCAN:
			return [defangUrlScanUrls];
		case integrationNames.VIRUS_TOTAL_DOMAIN:
		case integrationNames.VIRUS_TOTAL_IP:
		case integrationNames.VIRUS_TOTAL_HASH:
			return [defangAll]
		default:
			return [noCleaner];
	}
}

export const getCleaner = (integrationType) => {
	
	const cleaners = getIntermediateCleaners(integrationType);
	
	return (dict) => {
		let newDict = dict;
		for (const cleaner of cleaners) {
			newDict = cleaner(newDict);
		}
		return newDict;
	};
}

const noCleaner = (dict) => dict;

const cleanSpur = (dict) => {
	const clean = {};
	for (const key of Object.keys(dict)) {
		if (key !== 'ip' && (key !== 'anonymous' || dict.anonymous === true)) clean[key] = dict[key];
	}
	
	return clean;
}

const cleanCensys = (dict) => {
	const clean = {};
	for (const key of Object.keys(dict)) {
		if (key !== 'ip') clean[key] = dict[key];
	}
	
	return clean;
}

const cleanWhoIs = (dict) => {
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

const cleanPassiveTotalWhois = (dict) => {
	const clean = {};
	for (const key of Object.keys(dict)) {
		if (key !== 'rawText' && key !== 'domain') clean[key] = dict[key];
	}
	
	return clean;
}

const cleanPassiveTotalPassiveDNS = (dict) => {
	const clean = {};
	for (const key of Object.keys(dict)) {
		if (dict[key] != null && key !== 'queryValue' && key !== 'queryType') clean[key] = dict[key];
	}
	
	const snipDate = (date) => makeUnbreakable(date.substring(0, date.indexOf(' '))); // uses non-breaking hyphens
	
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



// default stuff

const isDict = variable => {
	return typeof variable === "object" && !Array.isArray(variable);
};

const isArray = variable => Array.isArray(variable);


const recurseAll = (
	variable,
    objFunc = (val)=>val,
    arrFunc = (val)=>val,
    valFunc = (val)=>val
) => {
	if (isDict(variable)) {
		const newDict = {};
		for (const key of Object.keys(variable)) {
			newDict[key] = recurseAll(variable[key], objFunc, arrFunc, valFunc);
		}
		
		return objFunc(newDict);
	}
	if (isArray(variable)) {
		return arrFunc(variable.map(elem => recurseAll(elem, objFunc, arrFunc, valFunc)))
	}
	return valFunc(variable);
}

const removeEmptyDicts = (dict) => {
	return recurseAll(dict, (obj) => {
		
		const entries = Object.entries(obj);
		if (entries.length === 0) return null;
		const newObj = {};
		for (const [key, val] of entries) {
			if (val !== null) newObj[key] = val;
		}
		
		return newObj;
		
	}, (arr) => arr.filter(elem => elem !== null));
}

// SPECIFIC recursive cleaners
const cleanSpurExists = (dict) => recurseAll(dict, (obj) => {
	const newObj = {};
	for (const [key, val] of Object.entries(obj)) {
		if (key !== 'exists') newObj[key] = val;
	}
	
	return newObj;
});

const defangUrlScanUrls = (dict) => recurseAll(dict, (obj) => {
	const newObj = {};
	for (const [key, val] of Object.entries(obj)) {
		newObj[key] = (key === 'url') ? dr.defang(val) : val;
	}
	
	return newObj;
});

const defangAll = (dict) => recurseAll(dict,
	(val)=>val,
	(val)=>val,
	(val) => {
		const str = `${val}`;
		if (str.match(/^https?:/)) {
			return dr.defang(str);
		}
		return val;
});
