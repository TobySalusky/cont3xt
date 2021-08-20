import {classificationObj} from "../Util/Classification";
import LineElement from "../Components/LineElement";
import {Copy} from "../Components/Copy";
import {LinkBack} from "../Components/LinkBack";
import {AllIntegrations, withPipe} from "../Components/AllIntegrations";
import {Integration} from "./Integration";
import {integrationNames} from "../Util/IntegrationDefinitions";
import {IndicatorData, IntegrationGenerationProgressReport} from "./Types";
import {makeUnbreakable, stripTrailingPeriod} from "../Util/Util";
import axios from "axios";
import {MaxLen} from "../Util/ElemUtil";
import IPASNBox from "../Components/IPASNBox";
import {fetchDataIP, fetchEmailVerification, fetchPhoneNumberValidation} from "../Requests/IntegrationRequests";
import {colorTable} from "../Util/Colors";
import ValidationBox from "../Components/ValidationBox";
import {emojiFlagOrEmptyString, tabLines} from "../Util/StringUtil";
import {InlineDiv} from "../Util/StyleUtil";
import {Colors} from "../Style/Theme";
import {RegistrarData} from "../Util/RegistrarData";


export class ResultNode {
    // styling
    indentation : number = 40;
    marginBottom : number = 5;
    parent? : IndicatorNode;
    children : ResultNode[] = [];

    // STATIC VARIABLES
    static lineIDCounter: number = 0;

    parentLineID() : string | undefined {
        if (this.parent) return this.parent.genLineID();
        return undefined;
    }

    genLineID() : string {
        const parentID = this.parentLineID();
        return parentID ? `${parentID}-${this.genUniqueLineIDSegment()}` : 'main';
    }

    genUniqueLineIDSegment() : string {
        return String(ResultNode.lineIDCounter++);
    }

    genMainBodyUI(): JSX.Element {
        return <p>No defined UI</p>;
    }

    genUI(): JSX.Element {
        return (
            <div style={{marginLeft: this.indentation}}>
                <LineElement lineID={this.genLineID()} lineFrom={this.parentLineID()} style={{marginBottom: this.marginBottom}}>
                    {this.genMainBodyUI()}
                </LineElement>
                {this.children.map((child : ResultNode) => child.genUI())}
            </div>
        );
    }
}

export class IpAsnNode extends ResultNode {
    ipData: any;

    constructor(ipData : any) {
        super();
        this.ipData = ipData;
    }


    genMainBodyUI(): JSX.Element {
        return (
            <IPASNBox ipData={this.ipData}/>
        );
    }
}

export class DnsErrorNode extends ResultNode {

    dnsType: string;
    status: number;

    static errorTable: {[key: number]: {name:string, description:string}} = {
        1: {name: "FormErr", description: "Format Error"},
        2: {name: "ServFail", description: "Server Failure"},
        3: {name: "NXDomain", description: "Non-Existent Domain"},
        4: {name: "NotImp", description: "Not Implemented"},
        5: {name: "Refused", description: "Query Refused"},
        6: {name: "YXDomain", description: "Name Exists when it should not"},
        7: {name: "YXRRSet", description: "RR Set Exists when it should not"},
        8: {name: "NXRRSet", description: "RR Set that should exist does not"},
        9: {name: "NotAuth", description: "Not Authorized"},
    }

    constructor(dnsType: string, status: number) {
        super();
        this.dnsType = dnsType;
        this.status = status;
    }

    genMainBodyUI(): JSX.Element {
        return (
            <div className="ResultBox" style={{justifyContent: 'space-between', padding: 5, paddingBlock: 2, fontSize: 12}}>
                <p style={{color: 'lightgreen', paddingRight: 8, fontWeight: 'bolder'}}>{this.dnsType}</p>
                <p style={{paddingRight: 8, color: colorTable.error, fontWeight: 'bold'}}>{DnsErrorNode.errorTable[this.status].name}:</p>
                <p style={{color: colorTable.error, fontWeight: 'bold'}}>{DnsErrorNode.errorTable[this.status].description}</p>
            </div>
        );
    }
}

export class ValidationNode extends ResultNode {
    valid: boolean;
    banner?: string;
    constructor(valid: boolean, banner?: string) {
        super();
        this.valid = valid;
        this.banner = banner;
    }

    genMainBodyUI(): JSX.Element {
        return (
            <ValidationBox status={this.valid} banner={this.banner}/>
        );
    }
}

export interface IndicatorNodeSettings {
    topLevel? : boolean;
    dnsType? : string;
}

export interface PhoneNumberValidationData {
    valid: boolean;
}

export interface EmailVerificationData {
    valid: boolean
    banner: string;
}

export interface IpAsnData {
    asn: string | number;
    org: string;
    country: string;
    precedence: number;
}

export class IndicatorNode extends ResultNode {
    // value
    value: string;
    type: string;
    subType: string;

    // important
    integrations: Integration[] = [];
    // flags
    topLevel?: boolean;
    // more value stuff
    dnsType?: string;
    ipAsnData?: IpAsnData;
    registrarData?: RegistrarData;

    // progress checks
    outgoingIntegrationRequests: number = 0;
    returnedIntegrationRequests: number = 0;
    finishedIntegrations: number = 0;
    failedIntegrationRequests: number = 0;


    // STATIC VARIABLES
    static rerender : ()=>void;
    static allowNameServerAdditions: boolean = false;

    constructor(value : string, settings? : IndicatorNodeSettings) {
        super();
        this.value = value;
        this.topLevel = settings?.topLevel;
        this.dnsType = settings?.dnsType;

        const {type, subType} = classificationObj(value);
        this.type = type;
        this.subType = subType;

        if (this.topLevel) {
            this.indentation = 0;
            this.marginBottom = 10;
        }

        if (this.dnsType !== 'NS') this.startAdditions();
    }

    genUniqueLineIDSegment() : string {
        return this.value;
    }

    addChild(child : ResultNode) {
        this.children.push(child);
        child.parent = this;
    }

    genInlineEnrichment(): JSX.Element | null {
        if (this.registrarData) return (
            <InlineDiv style={{fontSize: '70%', alignItems: 'center', padding: 0, margin: 0, justifyContent: 'center'}}>
                <div>
                    <p>{this.registrarData.registeredDateString}</p>
                    <MaxLen max={15}>{makeUnbreakable(this.registrarData.registrar)}</MaxLen>
                </div>
            </InlineDiv>
        );
        if (this.ipAsnData) return (
            <InlineDiv style={{fontSize: '70%', alignItems: 'center', padding: 0, margin: 0, justifyContent: 'center'}}>
                <div>
                    <p>{this.ipAsnData.asn}</p>
                    <MaxLen max={15}>{makeUnbreakable(this.ipAsnData.org)}</MaxLen>
                </div>
                <div>
                    <p>{this.ipAsnData.country}</p>
                    <p>{emojiFlagOrEmptyString(this.ipAsnData.country)}</p>
                </div>
            </InlineDiv>
        );
        return null;
    }

    genFullInlineEnrichment(): JSX.Element | null {
        const elem = this.genInlineEnrichment();
        if (elem) return withPipe(elem);
        return null;
    }

    genMainBodyUI(): JSX.Element { // TODO: this is slightly larger because the pipe fontsize is bigger on integrations!!

        if (this.topLevel) return (
            <div className="ResultBox" style={{alignItems: 'center', paddingInlineEnd: 5}}>
                <p className="ResultType" style={{color: Colors.highlight}}>{this.type}{(this.subType === 'None') ? '' : '('+this.subType+')'}:</p>
                <MaxLen max={30}>{this.value}</MaxLen>
                <Copy value={this.value}/>
                <LinkBack query={this.value}/>
                {this.genFullInlineEnrichment()}
                <AllIntegrations integrations={this.integrations}/>
            </div>
        );

        if (this.dnsType) return (
            <div className="ResultBox" style={{justifyContent: 'space-between', alignItems:'center', padding: 5, paddingBlock:2, fontSize: 12}}>
                <div className="SpaceBetweenRow">
                    <p style={{color: 'lightgreen', paddingRight: 8, fontWeight: 'bolder'}}>{this.dnsType}</p>
                    <MaxLen max={30}>{this.value}</MaxLen>
                </div>

                <Copy value={this.value}/>
                <LinkBack query={this.value}/>
                {this.genFullInlineEnrichment()}
                <AllIntegrations integrations={this.integrations}/>
            </div>
        );

        return (<p>Error generating ui</p>);
    }

    reportIntegrationProgress(): IntegrationGenerationProgressReport {
        let numOutgoing = 0, numReturned = 0, numFinished = 0, numFailed = 0;

        const add = (node: IndicatorNode) => {
            numOutgoing += node.outgoingIntegrationRequests;
            numReturned += node.returnedIntegrationRequests;
            numFinished += node.finishedIntegrations;
            numFailed += node.failedIntegrationRequests;
        }

        add(this);
        for (const child of this.children) {
            if (child instanceof IndicatorNode) {
                const indicatorChild = child as IndicatorNode;
                add(indicatorChild);
            }
        }
        return {numOutgoing, numReturned, numFinished, numFailed};
    }

    startAdditions() {
        const rerender = () => {IndicatorNode.rerender();};
        const integrate = (type : string) => {
            Integration.startAsyncAddFromVal(type, this.value, this, rerender);
            this.reportIntegrationProgress();
        }

        switch (this.type) {
            case 'Domain':
                this.dnsQueries(this.value).then(rerender);
                integrate(integrationNames.WHOIS);

                integrate(integrationNames.THREAT_STREAM);

                integrate(integrationNames.PASSIVETOTAL_WHOIS);
                integrate(integrationNames.PASSIVETOTAL_PASSIVE_DNS_DOMAIN);
                integrate(integrationNames.PASSIVETOTAL_SUBDOMAINS);

                integrate(integrationNames.VIRUS_TOTAL_DOMAIN);

                integrate(integrationNames.URL_SCAN);
                break;
            case 'IP':
                fetchDataIP(this.value).then((res) => {
                    this.addChild(new IpAsnNode(res));
                    rerender();
                });

                integrate(integrationNames.SPUR);

                integrate(integrationNames.THREAT_STREAM);

                integrate(integrationNames.PASSIVETOTAL_PASSIVE_DNS_IP);

                if (this.subType !== 'IPv6') {
                    integrate(integrationNames.CENSYS_IP);
                    integrate(integrationNames.VIRUS_TOTAL_IP);
                    integrate(integrationNames.URL_SCAN);
                }

                break;
            case 'Hash':
                integrate(integrationNames.THREAT_STREAM);

                integrate(integrationNames.VIRUS_TOTAL_HASH);
                break;
            case 'Email':
                fetchEmailVerification(this.value).then((emailValidation) => {
                    this.addChild(new ValidationNode(emailValidation.valid, emailValidation.banner));
                    rerender();
                });
                break;
            case 'PhoneNumber':
                fetchPhoneNumberValidation(this.value).then((phoneNumberValidation) => {
                    this.addChild(new ValidationNode(phoneNumberValidation.valid));
                    rerender();
                });
                break;
        }
    }

    genIndicatorData() : IndicatorData {
        return new IndicatorData(this.value, this.type, this.subType);
    }

    async dnsQueries(domain : string) {

        const CAAToText = (hexStr : string) => {

            hexStr = hexStr.split(' ').join('')

            hexStr = hexStr.substring(4)

            const tagLength = parseInt(hexStr.substring(0,4), 16)
            hexStr = hexStr.substring(4)

            let str = ''
            for (let i = 0; i < hexStr.length; i += 2) {
                str += String.fromCharCode(parseInt(hexStr.substr(i, 2), 16))
            }

            return str.substring(0, tagLength) + ' ' +str.substring(tagLength)
        }

        const instance = axios.create({
            headers: {'Accept': 'application/dns-json'}
        });

        const dataA = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${domain}&type=A`)).data
        const dataAAAA = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${domain}&type=AAAA`)).data
        const dataNS = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${domain}&type=NS`)).data
        const dataMX = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${domain}&type=MX`)).data
        const dataTXT = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${domain}&type=TXT`)).data
        const dataDmarcTXT = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=_dmarc.${domain}&type=TXT`)).data
        const dataCAA = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${domain}&type=CAA`)).data
        const dataSOA = await (await instance.get(`https://cloudflare-dns.com/dns-query?name=${domain}&type=SOA`)).data

        type Answer = {data : string};

        if (dataNS.Answer) {
            dataNS.Answer = dataNS.Answer.map((entry: Answer) => {return {...entry, data:stripTrailingPeriod(entry.data)}})
        }
        if (dataMX.Answer) {
            dataMX.Answer = dataMX.Answer.map((entry: Answer) => {return {...entry, data:stripTrailingPeriod(entry.data)}})
        }
        if (dataCAA.Answer) {
            dataCAA.Answer = dataCAA.Answer.map((entry: Answer) => {return {...entry, data:CAAToText(entry.data)}})
        }

        for (const [dnsType, res] of Object.entries({A:dataA, AAAA:dataAAAA, NS:dataNS, MX:dataMX, TXT:dataTXT, dmarcTXT:dataDmarcTXT, CAA:dataCAA, SOA:dataSOA})) {
            const status = res.Status;
            if (status !== 0) {
                this.addChild(new DnsErrorNode(dnsType, status));
                continue;
            }
            if (res?.Answer) {
                for (const answer of res.Answer) {
                    this.addChild(new IndicatorNode(answer.data, {dnsType}));
                }
            }
        }
    }

    genFullReport () : string {
        let str : string = this.genIndicatorData().stringify();
        str += '\n\n';
        str = str += this.integrations.map(integration => integration.generateReport(true)).join('\n\n');
        if (this.type === 'Domain') {
            str += '\n\n';
            const dns = this.children.filter(child => child instanceof IndicatorNode).map(child => child as IndicatorNode)
                .map(dnsRecord => `${dnsRecord.dnsType}: ${dnsRecord.value}`).join('\n');
            str += `DNS: {\n${tabLines(dns)}\n}`;
        }
        return str;
    }
}
