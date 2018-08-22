export function isObjectLike(value:any) {
    return value != null && typeof value == 'object';
}
export default class TypeCheck {
    public static isObjectLike(value:any){
        return isObjectLike(value);
    }

    public static isArray(value:any){
        return value && typeof value == 'object' && typeof value.length == 'number' &&
        Object.prototype.toString.call(value) == "[object Array]" || false;
    }

    public static isString(str:any): str is string {
        return typeof str === "string";
    }

    public static isNumber(str: any): str is number {
        return typeof str == 'number' ||
        (isObjectLike(str) && Object.prototype.toString.call(str) == "[object Number]");
    }

    public static isNaNRe(str: any): boolean  {
        return isNaN(parseFloat(str));
    }

    public static isBoolean(arg: any): arg is boolean {
        return typeof arg === "boolean" || 
        (isObjectLike(arg) && Object.prototype.toString.call(arg) == "[object Boolean]");
    }

    public static isDate(arg: any): arg is Date {
        return arg instanceof Date;
    }

    public static isFunction(arg:any):arg is Function{
        return typeof arg == 'function';
    }
}