import {makeUnbreakable, stripTrailingPeriod} from "./Util";
import { integrationNames } from "./IntegrationDefinitions";
import {mapOrder, onEnd} from "./SortUtil";
import dr from 'defang-refang'
import {isArray, isDict} from "./VariableClassifier";

const PLACE_HOLDER = '_____cont3xt_placeholder';

export function toOrderedKeys(integrationType, keyList) {
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
		case integrationNames.VIRUS_TOTAL_IP:
		case integrationNames.VIRUS_TOTAL_DOMAIN:
			return mapOrder(keyList, [
				'asn',
				'as_owner',
				'country',
				'verbose_msg',
				'Alexa category',
				'Alexa domain info',
				'Webutation domain info',
				'BitDefender category',
				'Forcepoint ThreatSeeker category',
				'BitDefender domain info',
				'detected_urls',
				'undetected_urls',
				'detected_downloaded_samples',
				'undetected_downloaded_samples',
				'detected_referrer_samples',
				'undetected_referrer_samples',
				'resolutions',
				'response_code'
			]);
		case integrationNames.VIRUS_TOTAL_HASH:
			return mapOrder(keyList, [
				'scan_date',
				'total',
				'positives',
				'md5', 'sha1', 'sha256',
				'permalink',
				'scan_id',
				'resource',
				'verbose_msg',
				'scans',
				'response_code',
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
			return [removeEmptyArraysAndDicts, defangAll]
		case integrationNames.THREAT_STREAM:
			return [cleanThreatStreamObjects, removeNullAndUndefined];
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
		if (entries.length === 0) return intermediates.EMPTY_OBJECT;
		const newObj = {};
		for (const [key, val] of entries) {
			if (val !== intermediates.EMPTY_OBJECT) newObj[key] = val;
		}
		if (Object.keys(newObj).length === 0) return intermediates.EMPTY_OBJECT

		return newObj;
		
	}, (arr) => arr.filter(elem => elem !== intermediates.EMPTY_OBJECT));
}

const removeEmptyArraysAndDicts = (dict) => {
	return recurseAll(dict, (obj) => {

		const entries = Object.entries(obj);
		if (entries.length === 0) return intermediates.EMPTY_OBJECT;
		const newObj = {};
		for (const [key, val] of entries) {
			if (val !== intermediates.EMPTY_OBJECT && val !== intermediates.EMPTY_ARRAY) newObj[key] = val;
		}
		if (Object.keys(newObj).length === 0) return intermediates.EMPTY_OBJECT

		return newObj;

	}, (arr) => arr.length === 0 ? intermediates.EMPTY_ARRAY : arr);
}

const removeNullAndUndefined = (dict) => {
	return recurseAll(dict, (obj) => {
		
		const entries = Object.entries(obj);
		const newObj = {};
		for (const [key, val] of entries) {
			if (val != null) newObj[key] = val;
		}
		
		return newObj;
		
	}, (arr) => arr.filter(elem => elem != null));
}

const intermediates = {
	EMPTY_OBJECT: '_____cont3xt_empty_object',
	EMPTY_ARRAY: '_____cont3xt_empty_array',
};

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

const cleanThreatStreamObjects = (res) => {
	const objects = res?.objects?.map(obj => cleanThreatStreamObject(obj));
	const noObjects = objects == null || objects.length === 0;
	return {all_tagnames: noObjects ? null : objects?.map(object => object.tagNames).flat(), object_table: noObjects ? null : PLACE_HOLDER, objects};
}

const cleanThreatStreamObject = (obj) => {
	
	const newObj = {};
	
	const sortedKeys = mapOrder(Object.keys(obj), [
		'status',
		'threatscore',
		'source_reported_confidence',
		'tags',
		'source',
		'source_created',
		'expiration_ts'
	]);
	
	for (const key of sortedKeys) {
		const val = obj[key];
		if (key === 'tags') {
			newObj['tagNames'] = val?.map(entry => entry.name);
		} else {
			newObj[key] = val;
		}
	}
	
	return newObj;
}
