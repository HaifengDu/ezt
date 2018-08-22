export var ECache;
(function (ECache) {
    ECache[ECache["MemCache"] = 1] = "MemCache";
    ECache[ECache["LocCache"] = 2] = "LocCache";
    ECache[ECache["SessionCache"] = 3] = "SessionCache";
})(ECache || (ECache = {}));
