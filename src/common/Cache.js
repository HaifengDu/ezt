import { ECache } from '../enum/ECache';
var MemCache = (function () {
    function MemCache() {
        this.data = {};
    }
    MemCache.prototype.save = function (key, value) {
        this.data[key] = { 'ttl': Date.now(), 'val': value };
        return this.data[key];
    };
    MemCache.prototype.load = function (key, ttl) {
        return (this.data[key] && (this.data[key].ttl > Date.now() - (ttl || 60 * 60 * 24 * 365) * 1000)) ? this.data[key].val : false;
    };
    MemCache.prototype.clear = function () {
        this.data = {};
        return this;
    };
    MemCache.prototype.hasKey = function (key) {
        return key in this.data;
    };
    MemCache.prototype.remove = function (key) {
        if (key in this.data) {
            delete this.data[key];
            return true;
        }
        return false;
    };
    MemCache.MemCacheFactory = function () {
        if (!MemCache.MEMCACHE) {
            MemCache.MEMCACHE = new MemCache();
        }
        return MemCache.MEMCACHE;
    };
    return MemCache;
}());
var LocCache = (function () {
    function LocCache() {
        this.data = {};
    }
    LocCache.prototype.save = function (key, value) {
        try {
            key = ('&' == key.substring(0, 1)) ? key : '~' + key;
            this.data[key] = { 'ttl': Date.now(), 'val': value };
            localStorage[key] = JSON.stringify(this.data[key]);
            return this.data[key];
        }
        catch (e) {
            return false;
        }
    };
    LocCache.prototype.load = function (key, ttl) {
        try {
            key = ('&' == key.substring(0, 1)) ? key : '~' + key;
            this.data[key] = JSON.parse(localStorage[key]);
            return (this.data[key] && (this.data[key].ttl > Date.now() - (ttl || 60 * 60 * 24 * 365) * 1000)) ? this.data[key].val : false;
        }
        catch (e) {
            return false;
        }
    };
    LocCache.prototype.hasKey = function (key) {
        return !!this.load(key);
    };
    LocCache.prototype.clear = function (prefix) {
        prefix = prefix || '~';
        Object.keys(localStorage).forEach(function (key) {
            if (key.substring(0, 1) == prefix) {
                localStorage.removeItem(key);
            }
        });
        return this;
    };
    LocCache.prototype.remove = function (key, prefix) {
        prefix = prefix || '~';
        localStorage.removeItem(prefix + key);
        return true;
    };
    LocCache.LocCacheFactory = function () {
        if (!LocCache.LOCCACHE) {
            LocCache.LOCCACHE = new LocCache();
        }
        return LocCache.LOCCACHE;
    };
    return LocCache;
}());
var SessionCache = (function () {
    function SessionCache() {
        this.data = {};
    }
    SessionCache.prototype.save = function (key, value) {
        try {
            key = ('&' == key.substring(0, 1)) ? key : '~' + key;
            this.data[key] = { 'ttl': Date.now(), 'val': value };
            sessionStorage[key] = JSON.stringify(this.data[key]);
            return this.data[key];
        }
        catch (e) {
            return false;
        }
    };
    SessionCache.prototype.hasKey = function (key) {
        return !!this.load(key);
    };
    SessionCache.prototype.load = function (key, ttl) {
        try {
            key = ('&' == key.substring(0, 1)) ? key : '~' + key;
            this.data[key] = JSON.parse(sessionStorage[key]);
            return (this.data[key] && (this.data[key].ttl > Date.now() - (ttl || 60 * 60 * 24 * 365) * 1000)) ? this.data[key].val : false;
        }
        catch (e) {
            return false;
        }
    };
    SessionCache.prototype.clear = function (prefix) {
        prefix = prefix || '~';
        Object.keys(sessionStorage).forEach(function (key) {
            if (key.substring(0, 1) == prefix) {
                sessionStorage.removeItem(key);
            }
        });
        return this;
    };
    SessionCache.prototype.remove = function (key, prefix) {
        prefix = prefix || '~';
        sessionStorage.removeItem(prefix + key);
        return true;
    };
    SessionCache.SessionCacheFactory = function () {
        if (!SessionCache.LOCCACHE) {
            SessionCache.LOCCACHE = new SessionCache();
        }
        return SessionCache.LOCCACHE;
    };
    return SessionCache;
}());
var CacheFactory = (function () {
    function CacheFactory() {
    }
    CacheFactory.prototype.create = function (type) {
        var cache;
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
    };
    CacheFactory.getInstance = function () {
        if (!CacheFactory.INSTANCE) {
            CacheFactory.INSTANCE = new CacheFactory();
        }
        return CacheFactory.INSTANCE;
    };
    return CacheFactory;
}());
export { CacheFactory };
var CachePocily = (function () {
    function CachePocily(type) {
        if (type === void 0) { type = ECache.MemCache; }
        this.cacheContainer = CacheFactory.getInstance().create(type);
    }
    CachePocily.prototype.save = function (key, value) {
        this.cacheContainer.save(key, value);
    };
    CachePocily.prototype.remove = function (key) {
        this.cacheContainer.remove(key);
    };
    CachePocily.prototype.hasKey = function (key) {
        return this.cacheContainer.hasKey(key);
    };
    CachePocily.prototype.clear = function () {
        this.cacheContainer.clear();
    };
    CachePocily.prototype.getData = function (key, func) {
        var result = this.cacheContainer.load(key);
        if (!result && func) {
            result = func();
            this.cacheContainer.save(key, JSON.stringify(result));
        }
        return result;
    };
    CachePocily.prototype.getDataOnce = function (key) {
        var result = this.getData(key);
        this.cacheContainer.remove(key);
        return result;
    };
    CachePocily.prototype.getDataPromise = function (key, func) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var result = _this.cacheContainer.load(key);
            if (!result) {
                result = func();
                if (!result || !result.then) {
                    throw new Error('传入的func参数返回对象必须为promise');
                }
                result.then(function (result) {
                    _this.cacheContainer.save(key, result);
                    resolve(result);
                }, function (result) {
                    reject(result);
                });
            }
            else {
                resolve(result);
            }
        });
    };
    CachePocily.getInstance = function (type) {
        return new CachePocily(type);
    };
    return CachePocily;
}());
export { CachePocily };
