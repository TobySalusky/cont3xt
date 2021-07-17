import ComponentTooltip from "./ComponentTooltip";
import { ColorDictBox, PassiveTotalPassiveDNSColorDictBox } from "./ColorDictBox";
import { whiteFilter } from "../Util/Filters";

const withPipe = (html) => {
	if (!html) return;
	return (
		<span style={{alignItems: 'center'}}>
			<p style={{marginLeft: 10}}>|</p>
			{html}
		</span>
	);
}

// TODO: extract the 'exists' removing out of the toColorText!

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
		if (key !== 'rawText') clean[key] = dict[key];
	}
	
	return clean;
}

const cleanPassiveTotalPassiveDNS = (dict) => {
	const clean = {};
	for (const key of Object.keys(dict)) {
		if (dict[key] != null && key !== 'queryValue' && key !== 'queryType') clean[key] = dict[key];
	}
	
	const snipDate = (date) => date.substring(0, date.indexOf(' '));

	clean.results = clean.results.map(result => {
		return {resolve: result.resolve, firstSeen: snipDate(result.firstSeen), lastSeen: snipDate(result.lastSeen)}
	}).sort((a, b) => new Date(b.lastSeen) - new Date(a.lastSeen));
	
	return clean;
}

// eslint-disable-next-line no-unused-vars
const noCleaner = (dict) => dict;

const createIntegration = (result, cleaner, img) => {
	return (
		!result ? null :
			<ComponentTooltip comp={
				<ColorDictBox data={cleaner(result.data)}/>
			}>
				{img}
			</ComponentTooltip>
	);
}

const createPassiveTotalPassiveDNSIntegration = (result, cleaner, img) => {
	return (
		!result ? null :
			<ComponentTooltip comp={
				<PassiveTotalPassiveDNSColorDictBox data={cleaner(result.data)}/>
			}>
				{img}
			</ComponentTooltip>
	);
}

const createListIntegration = (list, img) => {
	return (
		<ComponentTooltip comp={
			<div className="ResultBox" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginBottom: 5, padding: 5, fontSize: 12, borderRadius: 8}}>
				<p style={{color: 'orange', fontWeight: 'bold'}}>Subdomains:</p>
				{list.map(str =>
					<p>{str}</p>
				)}
			</div>
		}>
			{img}
		</ComponentTooltip>
	);
}

export function Integrations({integrations}) {
	
	if (!integrations) return null;
	
	const {
		spurResult,
		censysResult,
		whoisResult,
		passiveTotalWhoisResult,
		passiveTotalSubDomainsResult,
		passiveTotalPassiveDNSResult,
	} = integrations;
	
	let hasIntegrations = false;
	for (const val of Object.values(integrations)) {
		if (val != null) {
			hasIntegrations = true;
			break;
		}
	}
	
	if (!hasIntegrations) return null;
	
	const elems = [
		// spur
		createIntegration(spurResult, cleanSpur,
			<img className="ExternalLink" style={{width: 60}} src="./images/spur.png" alt="spur"/>
			),
		// censys
		createIntegration(censysResult, cleanCensys,
			<img className="ExternalLink" src="./images/censysIcon.png" alt="censys"/>
			),
		// whois
		createIntegration(whoisResult, cleanWhoIs,
			<img className="ExternalLink" src="./images/whoisIcon.svg" alt="whois"/>
		),
		// passivetotal whois
		createIntegration(passiveTotalWhoisResult, cleanPassiveTotalWhois,
			<img className="ExternalLink" style={whiteFilter} src="./images/whoisIcon.svg" alt="passivetotal whois"/>
		),
		// passivetotal passive dns
		createPassiveTotalPassiveDNSIntegration(passiveTotalPassiveDNSResult, cleanPassiveTotalPassiveDNS,
			<img className="ExternalLink" src="./images/passivetotalIcon.png" alt="passivetotal passive dns"/>
		),
		// passivetotal subdomains
		(!passiveTotalSubDomainsResult || !passiveTotalSubDomainsResult.data || !passiveTotalSubDomainsResult.data.subdomains) ? null :
			createListIntegration(passiveTotalSubDomainsResult.data.subdomains,
				<img className="ExternalLink" src="./images/passivetotalIcon.png" alt="passivetotal sub-domains"/>
		),
		
	];
	
	return (
		<span style={{alignItems: 'center'}}>
			{elems.map(el => withPipe(el))}
		</span>
	);
}
