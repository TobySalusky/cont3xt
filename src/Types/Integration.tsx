import ComponentTooltip from "../Components/ComponentTooltip";
import {IndicatorNode} from "./IndicatorNode";
import {integrationNames} from "../Util/IntegrationDefinitions";
import {
    fetchCensysDataIP,
    fetchPassiveTotalPassiveDNS,
    fetchPassiveTotalSubDomains,
    fetchPassiveTotalWhois, fetchSpurDataIP,
    fetchThreatStream, fetchURLScan, fetchVirusTotalDomain, fetchVirusTotalHash, fetchVirusTotalIP, fetchWhois
} from "../Components/SearchBar";
import {
    autoOrderedInfoBoxes,
    ColorDictBox,
    PassiveTotalPassiveDNSColorDictBox,
    UrlScanColorDictBox,
    VirusTotalBox
} from "../Components/ColorDictBox";
import {TooltipCopy} from "../Components/TooltipCopy";
import {generateIntegrationReportTooltipCopy} from "../Util/IntegrationReports";
import {toColorElemsMultiline, typeColors} from "../Util/Util";
import {IndicatorData} from "./Types";
import {getCleaner} from "../Util/IntegrationCleaners";
import React from "react";
import {tryUseASN} from "../Util/IpASN";
import {whiteFilter} from "../Util/Filters";
import {Colors} from "../Style/Theme";

export class Integration {

    type: string;
    data: any;
    imgSrc: string = './images/report.svg';
    imgAlt: string;
    imgStyle: any;

    indicatorNode?: IndicatorNode;

    compUI? : JSX.Element;

    constructor(result: any, type: string) {
        const cleaner = getCleaner(type);
        this.data = cleaner(result.data);
        this.type = type;
        this.imgAlt = type;
    }

    getRes(): any {
        return null;
    }

    genUI() {
        return (
            <ColorDictBox type={this.type} data={this.data} indicatorData={this.genIndicatorData()}/>
        );
    }

    genImage() {
        return <img className="ExternalLink" src={this.imgSrc} alt={this.imgAlt} style={this.imgStyle}/>
    }

    genInlineUI() {
        const flavor = this.genFlavorUI();
        const img = this.genImage();
        if (flavor) {
            return <span>{img}{flavor}</span>
        }
        return img;
    }



    genIntegrationUI: React.FC<{
        setActiveIntegration: React.Dispatch<React.SetStateAction<JSX.Element>>
    }> = (props) => {
        return (
            <ComponentTooltip comp={this.compUI}>
                <div onMouseEnter={() => props.setActiveIntegration(this.compUI as JSX.Element)}>
                    {this.genInlineUI()}
                </div>
            </ComponentTooltip>
        );
    }

    genFlavorUI() {
        let txt = this.genFlavorText();
        if (txt !== '') {
            if (this.shouldDecorateFlavorTextWithParens()) txt = `(${txt})`;
            return <p style={{fontSize: 14, color: 'lightgray', ...this.genFlavorStyle()}}>{txt}</p>
        }
        return null;
    }

    shouldDecorateFlavorTextWithParens() {return true;}

    genFlavorText() {
        return '';
    }

    genFlavorStyle(): any {
        return {color: 'lightgray'};
    }

    onAdd(indicatorNode: IndicatorNode) {
        this.indicatorNode = indicatorNode;
        this.compUI = this.genUI();
    }

    generateReport(withHeader?: boolean) : string {
        return (withHeader ? `${this.type}: ` : '') + JSON.stringify(this.data);
    }

    static startAsyncAddTo(integrationTask: Promise<Integration>, indicatorNode: IndicatorNode, onFinish?: ()=>void) {
        integrationTask.then(integration => {
            indicatorNode.integrations.push(integration);
            integration.onAdd(indicatorNode);
            onFinish?.();
        });
    }

    static startAsyncAddFromVal(type: string, value: string, indicatorNode: IndicatorNode, onFinish?: ()=>void) {
        this.startAsyncAddTo(Integration.create(type, Integration.getResTask(type, value)), indicatorNode, onFinish);
    }

    static async create(type: string, resTask: Promise<any>): Promise<Integration> {
        const res: any = await resTask;
        switch (type) {
            case integrationNames.SPUR:
                return new SpurIntegration(res);
            case integrationNames.THREAT_STREAM:
                return new ThreatStreamIntegration(res);
            case integrationNames.PASSIVETOTAL_SUBDOMAINS:
                return new PassiveTotalSubdomainsIntegration(res);
            case integrationNames.PASSIVETOTAL_PASSIVE_DNS_DOMAIN:
            case integrationNames.PASSIVETOTAL_PASSIVE_DNS_IP:
                return new PassiveTotalPassiveDNSIntegration(res, type);
            case integrationNames.PASSIVETOTAL_WHOIS:
                return new PassiveTotalWhoisIntegration(res);
            case integrationNames.URL_SCAN:
                return new UrlScanIntegration(res);
            case integrationNames.VIRUS_TOTAL_DOMAIN:
            case integrationNames.VIRUS_TOTAL_IP:
            case integrationNames.VIRUS_TOTAL_HASH:
                return new VirusTotalIntegration(res, type);
            case integrationNames.CENSYS_IP:
                return new CensysIntegration(res, type);
            case integrationNames.WHOIS:
                return new WhoisIntegration(res);
            default:
                return new Integration(res, type);
        }
    }
    
    static async getResTask(type: string, value: string): Promise<any> {
        switch (type) {
            case integrationNames.THREAT_STREAM:
                return fetchThreatStream(value);
            case integrationNames.PASSIVETOTAL_WHOIS:
                return fetchPassiveTotalWhois(value);
            case integrationNames.PASSIVETOTAL_SUBDOMAINS:
                return fetchPassiveTotalSubDomains(value);
            case integrationNames.PASSIVETOTAL_PASSIVE_DNS_DOMAIN:
            case integrationNames.PASSIVETOTAL_PASSIVE_DNS_IP:
                return fetchPassiveTotalPassiveDNS(value);
            case integrationNames.SPUR:
                return fetchSpurDataIP(value);
            case integrationNames.CENSYS_IP:
                return fetchCensysDataIP(value);
            case integrationNames.URL_SCAN:
                return fetchURLScan(value);
            case integrationNames.VIRUS_TOTAL_DOMAIN:
                return fetchVirusTotalDomain(value);
            case integrationNames.VIRUS_TOTAL_IP:
                return fetchVirusTotalIP(value);
            case integrationNames.VIRUS_TOTAL_HASH:
                return fetchVirusTotalHash(value);
            case integrationNames.WHOIS:
                return fetchWhois(value);
        }
    }

    genIndicatorData(): IndicatorData {
        return this.indicatorNode?.genIndicatorData() as IndicatorData;
    }
}


export class ThreatStreamIntegration extends Integration {
    constructor(result: any) {
        super(result, integrationNames.THREAT_STREAM);
        this.imgSrc = './images/anomali.webp';
    }

    tryCount(): number {
        try {
            return this.data.objects.length;
        } catch {
            return -1;
        }
    }

    genFlavorText(): string {
        const count = this.tryCount();
        if (count === -1) return super.genFlavorText();
        return count.toString();
    }

    genFlavorStyle(): any {
        const count = this.tryCount();
        if (count > 0) return {color: typeColors.malicious, fontWeight: 'bold'};
        return null;
    }
}

export class PassiveTotalIntegration extends Integration {
    constructor(result: any, type: string) {
        super(result, type);
        this.imgSrc = './images/passivetotalIcon.png';
    }
}

export class PassiveTotalSubdomainsIntegration extends PassiveTotalIntegration {
    constructor(result: any) {
        super(result, integrationNames.PASSIVETOTAL_SUBDOMAINS);
    }

    genUI(): JSX.Element {
        const list: string[] = this.data.subdomains;
        return (
            <div className="WhoIsBox">
                <TooltipCopy valueFunc={() => generateIntegrationReportTooltipCopy(this.genIndicatorData(), this.type, this.data)}/>
                <div className="ResultBox" style={{justifyContent: 'space-between', marginBottom: 5, padding: 5, fontSize: 12, borderRadius: 8}}>
                    <div style={{display: 'flex', justifyContent:'flex-start',
                        maxWidth: 1000, flexWrap: "wrap", flexDirection: 'row'}}>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <p style={{paddingRight: 8, color: Colors.highlight, fontWeight: 'bold'}}>Subdomains:</p>

                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                {list.map((str: string) =>
                                    <p>{str}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export class PassiveTotalPassiveDNSIntegration extends PassiveTotalIntegration {
    genUI(): JSX.Element {
        return (
            <PassiveTotalPassiveDNSColorDictBox type={this.type} data={this.data} indicatorData={this.genIndicatorData()}/>
        );
    }
}

export class PassiveTotalWhoisIntegration extends PassiveTotalIntegration {
    constructor(result: any) {
        super(result, integrationNames.PASSIVETOTAL_WHOIS);
        this.imgSrc = './images/whoisIcon.svg';
        this.imgStyle = whiteFilter;
    }
}

export class UrlScanIntegration extends Integration {
    constructor(result: any) {
        super(result, integrationNames.URL_SCAN);
        this.imgSrc = './images/urlscanIcon.png';
    }

    onAdd(indicatorNode: IndicatorNode) {
        super.onAdd(indicatorNode);
        tryUseASN(indicatorNode, this.type, this.data);
    }

    genUI(): JSX.Element {
        return (
            <UrlScanColorDictBox type={this.type} data={this.data} indicatorData={this.genIndicatorData()}/>
        );
    }
}

export class VirusTotalIntegration extends Integration {
    constructor(result: any, type: string) {
        super(result, type);
        this.imgSrc = './images/virustotal.svg';
    }

    onAdd(indicatorNode: IndicatorNode) {
        super.onAdd(indicatorNode);
        if (this.type === integrationNames.VIRUS_TOTAL_IP) tryUseASN(indicatorNode, this.type, this.data);
    }

    tryCount(): number | null {
        try {
            return this.data.response_code;
        } catch {
            return null;
        }
    }

    genFlavorText(): string {
        const count = this.tryCount();
        if (count === null) return super.genFlavorText();
        return count.toString();
    }

    genFlavorStyle(): any {
        const count = this.tryCount();
        if (count !== null && count !== 0) return {color: typeColors.dnsType, fontWeight: 'bold'};
        return null;
    }

    genUI(): JSX.Element {
        return (
            <VirusTotalBox type={this.type} data={this.data} indicatorData={this.genIndicatorData()}/>
        );
    }
}

export class CensysIntegration extends Integration {
    constructor(result: any, type: string) {
        super(result, type);
        this.imgSrc = './images/censysIcon.png';
    }
}

export class WhoisIntegration extends Integration {
    constructor(result: any) {
        super(result, integrationNames.WHOIS);
        this.imgSrc = './images/whoisIcon.svg';
    }
}

export class SpurIntegration extends Integration {
    constructor(result: any) {
        super(result, integrationNames.SPUR);
        this.imgSrc = './images/spur.png';
        this.imgStyle = {width: 60};
    }

    onAdd(indicatorNode: IndicatorNode) {
        super.onAdd(indicatorNode);
        tryUseASN(indicatorNode, this.type, this.data);
    }
}