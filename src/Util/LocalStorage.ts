export class LocalStorage {
    static get<T>(identifier: string) : T | null {
        const itemStr = localStorage.getItem(identifier);
        if (itemStr === null) return null;
        return JSON.parse(itemStr);
    }

    static set(identifier: string, value: any) {
        localStorage.setItem(identifier, JSON.stringify(value));
    }

    static getOrDefault<T>(identifier: string, defaultVal: T) : T {
        const getRes = LocalStorage.get<T>(identifier);
        if (getRes !== null) return getRes;
        return defaultVal;
    }
}