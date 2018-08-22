export function isObjectLike(value) {
    return value != null && typeof value == 'object';
}
var TypeCheck = (function () {
    function TypeCheck() {
    }
    TypeCheck.isObjectLike = function (value) {
        return isObjectLike(value);
    };
    TypeCheck.isArray = function (value) {
        return value && typeof value == 'object' && typeof value.length == 'number' &&
            Object.prototype.toString.call(value) == "[object Array]" || false;
    };
    TypeCheck.isString = function (str) {
        return typeof str === "string";
    };
    TypeCheck.isNumber = function (str) {
        return typeof str == 'number' ||
            (isObjectLike(str) && Object.prototype.toString.call(str) == "[object Number]");
    };
    TypeCheck.isNaNRe = function (str) {
        return isNaN(parseFloat(str));
    };
    TypeCheck.isBoolean = function (arg) {
        return typeof arg === "boolean" ||
            (isObjectLike(arg) && Object.prototype.toString.call(arg) == "[object Boolean]");
    };
    TypeCheck.isDate = function (arg) {
        return arg instanceof Date;
    };
    TypeCheck.isFunction = function (arg) {
        return typeof arg == 'function';
    };
    return TypeCheck;
}());
export default TypeCheck;
