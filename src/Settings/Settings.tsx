import {isDict} from "../Util/VariableClassifier";

export interface IntegrationMask {
    whois: boolean;
    spur: boolean;
    censys: boolean;
    passiveTotal: boolean;
    urlScan: boolean;
    virusTotal: boolean;
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
        passiveTotal: true,
        urlScan: true,
        virusTotal: true,
        threatStream: true,
    }
};
