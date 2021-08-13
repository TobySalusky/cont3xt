import ComponentTooltip from "./ComponentTooltip";
import {ColorDictBox, PassiveTotalPassiveDNSColorDictBox, UrlScanColorDictBox, VirusTotalBox} from "./ColorDictBox";
import { whiteFilter } from "../Util/Filters";
import { classificationObj } from "../Util/Classification";
import { log, makeUnbreakable, stripTrailingPeriod, typeColors } from '../Util/Util';
import { TooltipCopy } from "./TooltipCopy";
import { generateIntegrationReportTooltipCopy } from "../Util/IntegrationReports";
import {InlineDiv} from "../Util/StyleUtil";
import {MaxLen} from "../Util/ElemUtil";
import {emojiFlagOrEmptyString} from "../Util/StringUtil";

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
		threatStreamResult,
		
		ipAsnData,
		
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
		// ip asn data
		!ipAsnData ? null :
		<InlineDiv style={{fontSize: '70%', alignItems: 'center', padding: 0, margin: 0, justifyContent: 'center'}}>
			<div>
				<p>{ipAsnData.asn}</p>
				<MaxLen max={15}>{makeUnbreakable(ipAsnData.org)}</MaxLen>
			</div>
			<div>
				<p>{ipAsnData.country}</p>
				<p>{emojiFlagOrEmptyString(ipAsnData.country)}</p>
			</div>
		</InlineDiv>,
	];
	
	return (
		<span style={{alignItems: 'center'}}>
			{elems.map(el => withPipe(el))}
		</span>
	);
}