import {isDict} from "../Util/VariableClassifier";

export interface IntegrationMask {
    whois: boolean;
    spur: boolean;
    censys: boolean;
    PT_Whois: boolean;
    PT_Subdomains: boolean;
    PT_PDNS_Domain: boolean;
    PT_PDNS_IP: boolean;
    urlScan: boolean;
    virusTotal_Domain: boolean;
    virusTotal_IP: boolean;
    virusTotal_Hash: boolean;
    threatStream: boolean;
    [key: string]: boolean;
}

export interface Settings {
    integrationPopups: boolean;
    integrationPanelDelayTime: number;
    integrationMask: IntegrationMask;
}

export interface SettingChanges {
    integrationPopups?: boolean;
    integrationPanelDelayTime?: number;
    integrationMask?: IntegrationMask;
}

export const validateSettings = (testSettings: any): boolean => {
    return validatePropertyKeysAndTypes(testSettings, defaultSettings);
}

export const validatePropertyKeysAndTypes = (testObj: any, referenceObj: any):boolean => {
    if (testObj == null && testObj !== referenceObj) return false;

    for (const [key, val] of Object.entries(referenceObj)) {
        const testVal = testObj[key];
        if (testVal === undefined || (isDict(val) && !validatePropertyKeysAndTypes(testVal, val))) return false;
    }

    return true;
}

export const defaultSettings: Settings = {
    integrationPopups: true,
    integrationPanelDelayTime: 0.2,
    integrationMask: {
        whois: true,
        spur: true,
        censys: true,
        PT_Whois: true,
        PT_Subdomains: true,
        PT_PDNS_Domain: true,
        PT_PDNS_IP: true,
        urlScan: true,
        virusTotal_Domain: true,
        virusTotal_IP: true,
        virusTotal_Hash: true,
        threatStream: true,
    }
};
