import ComponentTooltip from "./ComponentTooltip";
import { ColorDictBox } from "./ColorDictBox";

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

export function Integrations({integrations}) {
	
	const {spurResult, censysResult, whoisResult} = integrations;
	
	if (!integrations) return null;
	
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
	];
	
	return (
		<span style={{alignItems: 'center'}}>
			{elems.map(el => withPipe(el))}
		</span>
	);
}
