var Calucate = (function () {
    function Calucate() {
    }
    Calucate.numAdd = function (num1, num2) {
        var baseNum, baseNum1, baseNum2;
        try {
            baseNum1 = num1.toString().split(".")[1].length;
        }
        catch (e) {
            baseNum1 = 0;
        }
        try {
            baseNum2 = num2.toString().split(".")[1].length;
        }
        catch (e) {
            baseNum2 = 0;
        }
        baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
        return (num1 * baseNum + num2 * baseNum) / baseNum;
    };
    ;
    Calucate.numSub = function (num1, num2) {
        var baseNum, baseNum1, baseNum2;
        var precision;
        try {
            baseNum1 = num1.toString().split(".")[1].length;
        }
        catch (e) {
            baseNum1 = 0;
        }
        try {
            baseNum2 = num2.toString().split(".")[1].length;
        }
        catch (e) {
            baseNum2 = 0;
        }
        baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
        precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
        return ((num1 * baseNum - num2 * baseNum) / baseNum);
    };
    ;
    Calucate.numMulti = function (num1, num2) {
        var baseNum = 0;
        try {
            baseNum += num1.toString().split(".")[1].length;
        }
        catch (e) { }
        try {
            baseNum += num2.toString().split(".")[1].length;
        }
        catch (e) { }
        return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
    };
    ;
    Calucate.numDiv = function (num1, num2) {
        var baseNum1 = 0, baseNum2 = 0;
        var baseNum3, baseNum4;
        try {
            baseNum1 = num1.toString().split(".")[1].length;
        }
        catch (e) {
            baseNum1 = 0;
        }
        try {
            baseNum2 = num2.toString().split(".")[1].length;
        }
        catch (e) {
            baseNum2 = 0;
        }
        baseNum3 = Number(num1.toString().replace(".", ""));
        baseNum4 = Number(num2.toString().replace(".", ""));
        return (baseNum3 / baseNum4) * Math.pow(10, baseNum2 - baseNum1);
    };
    Calucate.add = function () {
        var pargs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            pargs[_i] = arguments[_i];
        }
        var arrTemp = [], args = Array.prototype.slice.apply(arguments);
        arrTemp = args.map(function (item, index) {
            item = item || "0";
            return parseFloat(item.toString());
        });
        return arrTemp.reduce(Calucate.numAdd, 0);
    };
    return Calucate;
}());
export default Calucate;
