import {isDict} from "../Util/VariableClassifier";
import {IntegrationTypes, shortSettingsName} from "../Enums/IntegrationTypes";

export interface IntegrationMask {
    [key: string]: boolean;
}

export interface Settings {
    integrationPopups: boolean;
    integrationPanelDelayTime: number;
    integrationMask: IntegrationMask;

    progressBar: boolean;
}

export interface SettingChanges {
    progressBar?: boolean;
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
    integrationMask: (()=>{
        const dict: IntegrationMask = {};

        for (const val of Object.values(IntegrationTypes)) {
            dict[val] = true;
        }

        return dict;
    })(),
    progressBar: true,
};
