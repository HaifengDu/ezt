import TypeCheck from './TypeCheck'
import { ECache } from '../enum/ECache';
import { ICache } from '../interface/ICache';
import { ICacheFactory } from '../interface/ICacheFactory';

class MemCache implements ICache {
    private static MEMCACHE: MemCache;
    private data: any = {};
    private constructor() { }  
    public save(key: string, value: any): any {
        this.data[key] = { 'ttl': Date.now(), 'val': value };
        return this.data[key];
    }

    public load(key: string, ttl?: number): any {
        //缓存365天
        return (this.data[key] && (this.data[key].ttl > Date.now() - (ttl || 60 * 60 * 24 * 365) * 1000)) ? this.data[key].val : false;
    }
    public clear(): MemCache {
        this.data = {};
        return this;
    }

    public hasKey(key:string):boolean{
        return key in this.data;
    }

    public remove(key: string): boolean {
        if (key in this.data) {
            delete this.data[key];
            return true;
        }
        return false;
    }

    public static MemCacheFactory(): MemCache{
        if (!MemCache.MEMCACHE) {
            MemCache.MEMCACHE = new MemCache();
        }
        return MemCache.MEMCACHE;
    }
}

class LocCache implements ICache {
    private static LOCCACHE: LocCache;
    private data: any = {};

    public save(key: string, value: any): any {
        try {
            key = ('&' == key.substring(0, 1)) ? key : '~' + key;
            this.data[key] = { 'ttl': Date.now(), 'val': value };
            localStorage[key] = JSON.stringify(this.data[key]);
            return this.data[key];
        } catch (e) {
            return false;
        }
    }

    public load(key: string, ttl?: number): any {
        try {
            key = ('&' == key.substring(0, 1)) ? key : '~' + key;
            this.data[key] = JSON.parse(localStorage[key]);
            return (this.data[key] && (this.data[key].ttl > Date.now() - (ttl || 60 * 60 * 24 * 365) * 1000)) ? this.data[key].val : false;
        } catch (e) {
            return false;
        } 
    }   

    public hasKey(key:string):boolean{
        return !!this.load(key);
    }

    public clear(prefix?: string): LocCache {
        prefix = prefix || '~';
        Object.keys(localStorage).forEach(function (key) {
            if (key.substring(0,1) == prefix) { localStorage.removeItem(key); }
        });
        return this;
    }
    public remove(key: string,prefix?: string): boolean {
        prefix = prefix || '~';
        localStorage.removeItem(prefix+key);
        return true;
    }
    public static LocCacheFactory(): LocCache{
        if (!LocCache.LOCCACHE) {
            LocCache.LOCCACHE = new LocCache();
        }
        return LocCache.LOCCACHE;
    }
}

class SessionCache implements ICache {
    private static LOCCACHE: SessionCache;
    private data: any = {};

    public save(key: string, value: any): any {
        try {
            key = ('&' == key.substring(0, 1)) ? key : '~' + key;
            this.data[key] = { 'ttl': Date.now(), 'val': value };
            sessionStorage[key] = JSON.stringify(this.data[key]);
            return this.data[key];
        } catch (e) {
            return false;
        }
    }

    public hasKey(key:string):boolean{
        return !!this.load(key);
    }

    public load(key: string, ttl?: number): any {
        try {
            key = ('&' == key.substring(0, 1)) ? key : '~' + key;
            this.data[key] = JSON.parse(sessionStorage[key]);
            return (this.data[key] && (this.data[key].ttl > Date.now() - (ttl || 60 * 60 * 24 * 365) * 1000)) ? this.data[key].val : false;
        } catch (e) {
            return false;
        } 
    }   

    public clear(prefix?: string): SessionCache {
        prefix = prefix || '~';
        Object.keys(sessionStorage).forEach(function (key) {
            if (key.substring(0,1) == prefix) { sessionStorage.removeItem(key); }
        });
        return this;
    }
    public remove(key: string,prefix?: string): boolean {
        prefix = prefix || '~';
        sessionStorage.removeItem(prefix+key);
        return true;
    }
    public static SessionCacheFactory(): SessionCache{
        if (!SessionCache.LOCCACHE) {
            SessionCache.LOCCACHE = new SessionCache();
        }
        return SessionCache.LOCCACHE;
    }
}

export class CacheFactory implements ICacheFactory {
    private static INSTANCE:ICacheFactory;
    private constructor(){}
    public create(type: ECache): ICache {
        let cache: ICache;
        switch (type) {
            case ECache.MemCache:
                cache = MemCache.MemCacheFactory();
                break;
            case ECache.LocCache:
                cache = LocCache.LocCacheFactory();
                break;
            case ECache.SessionCache:
                cache = SessionCache.SessionCacheFactory();
                break;
            default:
                cache = MemCache.MemCacheFactory();
                break;
        }
        return cache;
    }

    public static getInstance(){
        if (!CacheFactory.INSTANCE) {
            CacheFactory.INSTANCE = new CacheFactory();
        }
        return CacheFactory.INSTANCE;
    }
}

export class CachePocily {
    private cacheContainer:ICache;
    private constructor(type:ECache=ECache.MemCache) {
        this.cacheContainer = CacheFactory.getInstance().create(type);
    }

    public save(key: string, value: any) {
        //优先使用MemCache
        this.cacheContainer.save(key, value);
    }

    public remove(key: string) {
        //优先使用MemCache
        this.cacheContainer.remove(key);
    }

    public hasKey(key:string):boolean{
        return this.cacheContainer.hasKey(key);
    }

    public clear(){
        this.cacheContainer.clear();
    }
    //非异步
    public getData(key: string, func?: () => any): any {
        //优先使用MemCache
        let result: any = this.cacheContainer.load(key);
        //无结果 存入
        if (!result && func) {
            result = func();
            // cacheContainer.save(key, angular.toJson(result));
            this.cacheContainer.save(key, JSON.stringify(result));
        }
        return result;
    }

    public getDataOnce(key: string): any{
        let result = this.getData(key);
        this.cacheContainer.remove(key);
        return result;
    }

    
    //异步
    public getDataPromise(key: string, func: () => Promise<any>): Promise<any> {        
        return new Promise((resolve,reject)=>{
            //优先使用MemCache
            let result: any = this.cacheContainer.load(key);
            //无结果 存入
            if (!result) {
                result = func();
                if (!result || !result.then) {
                    throw new Error('传入的func参数返回对象必须为promise');
                }
                result.then((result: any)=> {
                    this.cacheContainer.save(key, result);
                    resolve(result);
                }, function (result: any) {
                    reject(result);
                });
            } else {
                resolve(result);
            }
        });
    }

    public static getInstance(type?:ECache){
        return new CachePocily(type);
    }
}