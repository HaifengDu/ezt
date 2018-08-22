export default function mixins(derivedCtor) {
    var baseCtors = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        baseCtors[_i - 1] = arguments[_i];
    }
    baseCtors.forEach(function (baseCtor) {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
