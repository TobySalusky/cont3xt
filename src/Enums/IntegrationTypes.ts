export enum IntegrationTypes {
    WHOIS = 'whois',
    CENSYS_IP = 'Censys IP',
    PASSIVETOTAL_PASSIVE_DNS_IP = 'Passivetotal IP Passive DNS',
    PASSIVETOTAL_PASSIVE_DNS_DOMAIN = 'Passivetotal Domain Passive DNS',
    PASSIVETOTAL_SUBDOMAINS = 'Passivetotal Subdomains',
    PASSIVETOTAL_WHOIS = 'Passivetotal Whois',
    SPUR = 'Spur',
    URL_SCAN = 'Url Scan',
    VIRUS_TOTAL_DOMAIN = 'VirusTotal Domain Report',
    VIRUS_TOTAL_IP = 'VirusTotal IP Report',
    VIRUS_TOTAL_HASH = 'VirusTotal Hash',
    THREAT_STREAM = 'ThreatStream',
    SHODAN = 'Shodan',
}

export const shortSettingsName =(integrationType: IntegrationTypes): string => {
    switch (integrationType) {
        case IntegrationTypes.CENSYS_IP: return 'censys';

        case IntegrationTypes.PASSIVETOTAL_PASSIVE_DNS_DOMAIN: return 'PT_PDNS_Domain';
        case IntegrationTypes.PASSIVETOTAL_PASSIVE_DNS_IP: return 'PT_PDNS_IP';
        case IntegrationTypes.PASSIVETOTAL_SUBDOMAINS: return 'PT_subdomains';
        case IntegrationTypes.PASSIVETOTAL_WHOIS: return 'PT_whois';

        case IntegrationTypes.VIRUS_TOTAL_DOMAIN: return 'virusTotal_Domain';
        case IntegrationTypes.VIRUS_TOTAL_IP: return 'virusTotal_IP';
        case IntegrationTypes.VIRUS_TOTAL_HASH: return 'virusTotal_Hash';

        case IntegrationTypes.URL_SCAN: return 'urlScan';

        case IntegrationTypes.SPUR: return 'spur';

        case IntegrationTypes.SHODAN: return 'shodan';

        case IntegrationTypes.THREAT_STREAM: return 'threatStream';
        case IntegrationTypes.WHOIS: return 'whois';
    }

    return integrationType;
}
