
export interface ICache {
    save(key: string, value: any): any,
    load(key: string, ttl?: number): any,
    clear(prefix?: string): any,
    hasKey(key:string):boolean,
    remove(key: string): boolean
}