import ComponentTooltip from "./ComponentTooltip";
import {ColorDictBox, PassiveTotalPassiveDNSColorDictBox, UrlScanColorDictBox, VirusTotalBox} from "./ColorDictBox";
import { whiteFilter } from "../Util/Filters";
import { classificationObj } from "../Util/Classification";
import { log, stripTrailingPeriod } from "../Util/Util";
import { TooltipCopy } from "./TooltipCopy";
import { generateIntegrationReportTooltipCopy } from "../Util/IntegrationReports";
import { getCleaner } from "../Util/IntegrationCleaners";

const withPipe = (html) => {
	if (!html) return;
	return (
		<span style={{alignItems: 'center'}}>
			<p style={{marginLeft: 10}}>|</p>
			{html}
		</span>
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
		urlScanResult,
		virusTotalDomainResult,
		virusTotalIPResult,
		virusTotalHashResult,
		
		indicatorData = classificationObj('WARNING: no indicator found'),
	} = integrations;
	
	// local methods
	const createIntegration = (result, img) => {
		return (
			!result ? null :
				<ComponentTooltip comp={
					<ColorDictBox type={result.integrationType} data={result.data} indicatorData={indicatorData}/>
				}>
					{img}
				</ComponentTooltip>
		);
	}
	
	const createListIntegration = (result, list, img) => {
		
		return (
			<ComponentTooltip comp={
				<div className="ResultBox" style={{maxWidth: 800, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginBottom: 5, padding: 5, fontSize: 12, borderRadius: 8}}>
					<TooltipCopy valueFunc={() => generateIntegrationReportTooltipCopy(indicatorData, result.integrationType, result.data)}/>
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
	
	const createPassiveTotalPassiveDNSIntegration = (result, img) => {
		return (
			!result ? null :
				<ComponentTooltip comp={
					<PassiveTotalPassiveDNSColorDictBox type={result.integrationType} data={result.data} indicatorData={indicatorData}/>
				}>
					{img}
				</ComponentTooltip>
		);
	}

	const createUrlScanIntegration = (result, img) => {
		return (
			!result ? null :
				<ComponentTooltip comp={
					<UrlScanColorDictBox type={result.integrationType} data={result.data} indicatorData={indicatorData}/>
				}>
					{img}
				</ComponentTooltip>
		);
	}

	const createVirusTotalIntegration = (result, img) => {
		return (
			!result ? null :
				<ComponentTooltip comp={
					<VirusTotalBox type={result.integrationType} data={result.data} indicatorData={indicatorData}/>
				}>
					{img}
				</ComponentTooltip>
		);
	}
	
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
		createIntegration(spurResult,
			<img className="ExternalLink" style={{width: 60}} src="./images/spur.png" alt="spur"/>
			),
		// censys
		createIntegration(censysResult,
			<img className="ExternalLink" src="./images/censysIcon.png" alt="censys"/>
			),
		// whois
		createIntegration(whoisResult,
			<img className="ExternalLink" src="./images/whoisIcon.svg" alt="whois"/>
		),
		// passivetotal whois
		createIntegration(passiveTotalWhoisResult,
			<img className="ExternalLink" style={whiteFilter} src="./images/whoisIcon.svg" alt="passivetotal whois"/>
		),
		// url scan
		createUrlScanIntegration(urlScanResult,
			<img className="ExternalLink" src="./images/urlscanIcon.png" alt="url scan"/>
		),
		// passivetotal passive dns
		createPassiveTotalPassiveDNSIntegration(passiveTotalPassiveDNSResult,
			<img className="ExternalLink" src="./images/passivetotalIcon.png" alt="passivetotal passive dns"/>
		),
		// passivetotal subdomains
		(!passiveTotalSubDomainsResult || !passiveTotalSubDomainsResult.data || !passiveTotalSubDomainsResult.data.subdomains) ? null :
			createListIntegration(passiveTotalSubDomainsResult, passiveTotalSubDomainsResult.data.subdomains,
				<img className="ExternalLink" src="./images/passivetotalIcon.png" alt="passivetotal sub-domains"/>
		),
		// virus total domain
		createVirusTotalIntegration(virusTotalDomainResult,
			<img className="ExternalLink" style={whiteFilter} src="./images/virustotal.svg" alt="virus total domain"/>
		),
		// virus total ip
		createVirusTotalIntegration(virusTotalIPResult,
			<img className="ExternalLink" style={whiteFilter} src="./images/virustotal.svg" alt="virus total ip"/>
		),
		// virus total hash
		createIntegration(virusTotalHashResult,
			<img className="ExternalLink" style={whiteFilter} src="./images/virustotal.svg" alt="virus total hash"/>
		),
	];
	
	return (
		<span style={{alignItems: 'center'}}>
			{elems.map(el => withPipe(el))}
		</span>
	);
}
