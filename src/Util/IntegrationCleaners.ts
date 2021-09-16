import {makeUnbreakable, stripTrailingPeriod} from "./Util";
import {mapOrder, onEnd} from "./SortUtil";
import dr from 'defang-refang'
import {isArray, isDict} from "./VariableClassifier";
import extractDomain from "extract-domain";
import { IntegrationTypes } from "../Enums/IntegrationTypes";

const PLACE_HOLDER = '_____cont3xt_placeholder';

export function toOrderedKeys(integrationType: IntegrationTypes, keyList: string[]) {

	switch (integrationType) {
		case IntegrationTypes.PASSIVETOTAL_WHOIS:
			return mapOrder(keyList, [
				'Domain', 'registrar', 'organization', 'registered', 'expiresAt', 'lastLoadedAt', 'registryUpdateAt', 'nameServers',
				'admin', 'billing', 'registrant', 'tech', 'whoisServer', 'name', 'telephone', 'domainStatus'
			]);
		case IntegrationTypes.URL_SCAN:
			return mapOrder(keyList, [
				'total', 'took', 'has_more'
			]);
		case IntegrationTypes.VIRUS_TOTAL_IP:
		case IntegrationTypes.VIRUS_TOTAL_DOMAIN:
			return onEnd(mapOrder(keyList, [ // TODO: allow regex in mapOrder (for category and info)
				'asn',
				'as_owner',
				'country',
				'verbose_msg',
				'Alexa category',
				'Alexa rank',
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
			]), ['subdomains', 'pcaps']);
		case IntegrationTypes.VIRUS_TOTAL_HASH:
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
		case IntegrationTypes.SHODAN:
			return onEnd(mapOrder(keyList, ['tags', 'ports', 'servicePortTable', 'certificateTable']), ['data']);
		default:
			return keyList;
	}
}

const getIntermediateCleaners = (integrationType: IntegrationTypes) => {
	switch (integrationType) {
		case IntegrationTypes.SPUR:
			return [cleanSpurExists, removeEmptyDicts, cleanSpur];
		case IntegrationTypes.CENSYS_IP:
			return [cleanCensys];
		case IntegrationTypes.WHOIS:
			return [cleanWhoIs];
		case IntegrationTypes.PASSIVETOTAL_WHOIS:
			return [removeEmptyDicts, cleanPassiveTotalWhois];
		case IntegrationTypes.PASSIVETOTAL_PASSIVE_DNS_IP:
		case IntegrationTypes.PASSIVETOTAL_PASSIVE_DNS_DOMAIN:
			return [cleanPassiveTotalPassiveDNS];
		case IntegrationTypes.URL_SCAN:
			return [defangUrlScanUrls, removeEmptyArraysAndDicts];
		case IntegrationTypes.VIRUS_TOTAL_DOMAIN:
		case IntegrationTypes.VIRUS_TOTAL_IP:
		case IntegrationTypes.VIRUS_TOTAL_HASH:
			return [removeEmptyArraysAndDicts, defangVirusTotal]
		case IntegrationTypes.THREAT_STREAM:
			return [cleanThreatStreamObjects, removeNullAndUndefined];
		case IntegrationTypes.SHODAN:
			return [removeNullAndUndefined, cleanShodan];
		default:
			return [noCleaner];
	}
}

export const getCleaner = (integrationType: IntegrationTypes) => {

	const cleaners = getIntermediateCleaners(integrationType);

	return (dict: any) => {
		let newDict = dict;
		for (const cleaner of cleaners) {
			newDict = cleaner(newDict);
		}
		return newDict;
	};
}

const noCleaner = (dict: any) => dict;

const cleanSpur = (dict: any) => {
	const clean: any = {};
	for (const key of Object.keys(dict)) {
		if (key !== 'ip' && (key !== 'anonymous' || dict.anonymous === true)) clean[key] = dict[key];
	}

	return clean;
}

const cleanCensys = (dict: any) => {
	const clean: any = {};
	for (const key of Object.keys(dict)) {
		if (key !== 'ip') clean[key] = dict[key];
	}

	return clean;
}

const cleanWhoIs = (dict: any) => {
	const keepFields = [
		'adminCountry',
		'registrar', 'registrantOrganization',
		'creationDate', 'created',
		'updatedDate'
	];

	const clean: any = {};
	for (const key of Object.keys(dict)) {
		if (keepFields.indexOf(key) !== -1) clean[key] = dict[key];
	}

	return clean;
}

const cleanPassiveTotalWhois = (dict: any) => {
	const clean: any = {};
	for (const key of Object.keys(dict)) {
		if (key !== 'rawText' && key !== 'domain') clean[key] = dict[key];
	}

	return clean;
}

const cleanPassiveTotalPassiveDNS = (dict: any) => {
	const clean: any = {};
	for (const key of Object.keys(dict)) {
		if (dict[key] != null && key !== 'queryValue' && key !== 'queryType') clean[key] = dict[key];
	}

	const snipDate = (date: string) => makeUnbreakable(date.substring(0, date.indexOf(' '))); // uses non-breaking hyphens

	clean.results = clean.results.map((result: any) => {
		const {recordType, resolveType, resolve, firstSeen, lastSeen} = result;
		return {
			recordType, resolveType,
			resolve: stripTrailingPeriod(resolve),
			firstSeen: snipDate(firstSeen), lastSeen: snipDate(lastSeen),
			fullFirstSeen: firstSeen, fullLastSeen: lastSeen
		}
	}).sort((a: any, b: any) => (new Date(b.fullLastSeen)).valueOf() - (new Date(a.fullFirstSeen)).valueOf());

	return clean;
	//return {...clean, temp: PLACE_HOLDER};
}



// default stuff


const recurseAll = (
	variable: any,
    objFunc = (val: any)=>val,
    arrFunc = (val: any)=>val,
    valFunc = (val: any)=>val
) => {
	if (isDict(variable)) {
		const newDict: any = {};
		for (const key of Object.keys(variable)) {
			newDict[key] = recurseAll(variable[key], objFunc, arrFunc, valFunc);
		}

		return objFunc(newDict);
	}
	if (isArray(variable)) {
		return arrFunc(variable.map((elem: any) => recurseAll(elem, objFunc, arrFunc, valFunc)))
	}
	return valFunc(variable);
}

const removeEmptyDicts = (dict: any) => {
	return recurseAll(dict, (obj) => {

		const entries = Object.entries(obj);
		if (entries.length === 0) return intermediates.EMPTY_OBJECT;
		const newObj: any = {};
		for (const [key, val] of entries) {
			if (val !== intermediates.EMPTY_OBJECT) newObj[key] = val;
		}
		if (Object.keys(newObj).length === 0) return intermediates.EMPTY_OBJECT

		return newObj;

	}, (arr) => arr.filter((elem: any) => elem !== intermediates.EMPTY_OBJECT));
}

const removeEmptyArraysAndDicts = (dict: any) => {
	return recurseAll(dict, (obj) => {

		const entries = Object.entries(obj);
		if (entries.length === 0) return intermediates.EMPTY_OBJECT;
		const newObj: any = {};
		for (const [key, val] of entries) {
			if (val !== intermediates.EMPTY_OBJECT && val !== intermediates.EMPTY_ARRAY) newObj[key] = val;
		}
		if (Object.keys(newObj).length === 0) return intermediates.EMPTY_OBJECT

		return newObj;

	}, (arr) => arr.length === 0 ? intermediates.EMPTY_ARRAY : arr);
}

const removeNullAndUndefined = (dict: any) => {
	return recurseAll(dict, (obj) => {

		const entries = Object.entries(obj);
		const newObj: any = {};
		for (const [key, val] of entries) {
			if (val != null) newObj[key] = val;
		}

		return newObj;

	}, (arr) => arr.filter((elem: any) => elem != null));
}

const intermediates = {
	EMPTY_OBJECT: '_____cont3xt_empty_object',
	EMPTY_ARRAY: '_____cont3xt_empty_array',
};

// SPECIFIC recursive cleaners
const cleanSpurExists = (dict: any) => recurseAll(dict, (obj) => {
	const newObj: any = {};
	for (const [key, val] of Object.entries(obj)) {
		if (key !== 'exists') newObj[key] = val;
	}

	return newObj;
});

const defangUrlScanUrls = (dict: any) => recurseAll(dict, (obj) => {
	const newObj: any = {};
	for (const [key, val] of Object.entries(obj)) {
		newObj[key] = (key === 'url' && typeof val === 'string') ? dr.defang(val) : val;
	}

	return newObj;
});

const makeValueEditor = (valFunc: (val: any)=>any) => {
	return (dict: any) => recurseAll(dict, val=>val, val=>val, valFunc);
}

// eslint-disable-next-line no-unused-vars
const defangAll = makeValueEditor((val: any) => {
		const str = `${val}`;
		if (str.match(/^https?:/)) {
			return dr.defang(str);
		}
		return val;
});

const defangVirusTotal = makeValueEditor((val: any) => {
	const str = `${val}`;
	if (str.match(/^https?:/) && extractDomain(val) !== 'virustotal.com') {
		return dr.defang(str);
	}
	return val;
});

const cleanThreatStreamObjects = (res: any) => {
	const objects = res?.objects?.map((obj: any) => cleanThreatStreamObject(obj));
	const noObjects = objects == null || objects.length === 0;
	return {all_tagnames: noObjects ? null : objects?.map((object: any) => object.tagNames).flat(), object_table: noObjects ? null : PLACE_HOLDER, objects};
}

const cleanThreatStreamObject = (obj: any) => {

	const newObj: any = {};

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
			newObj['tagNames'] = val?.map((entry: any) => entry.name);
		} else {
			newObj[key] = val;
		}
	}

	return newObj;
}

const cleanShodan = (obj: any) => {
	return {...obj, servicePortTable: PLACE_HOLDER, certificateTable: PLACE_HOLDER};
}
