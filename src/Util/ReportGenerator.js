// Currently only handles one result
import { dnsString, generateIntegrationReport } from "./IntegrationReports";
import { downloadNamedTextFile } from "./DownloadUtil";
import { currentTimeStamp } from "./Util";
import { tabLines } from "./StringUtil";

export const generateFullReport = (result) => {
	const integrations = result.integrations;
	const indicatorData = integrations.indicatorData;
	let report = indicatorData.stringify();
	
	const settings = {tabs: true, spaceCount: 2};
	
	for (const integrationResult of Object.values(integrations)) {
		const fragment = generateIntegrationReport(integrationResult.integrationType, integrationResult.data, settings);
		if (fragment != null) report += `\n\n${integrationResult.integrationType}: {\n${tabLines(fragment, 2)}\n}`;
	}
	
	if (result.dns) report += `\n\n${dnsString(result.dns, settings)}`
	
	return report;
}

export const downloadFullReport = (result) => {
	downloadNamedTextFile(`${result.integrations.indicatorData.value}_${currentTimeStamp()}`, generateFullReport(result))
}
