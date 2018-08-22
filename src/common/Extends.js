Number.prototype.toFixedNoZero = function (digit) {
    var temp = this.toFixed(digit);
    var tempArr = temp.split('.');
    if (tempArr.length == 2) {
        var dotAfter = tempArr[1].split('');
        for (var i = dotAfter.length - 1; i >= 0; i--) {
            if (dotAfter[i] != "0") {
                break;
            }
            dotAfter[i] = '';
        }
        var dotAfterStr = dotAfter.join('');
        if (dotAfterStr) {
            temp = tempArr[0] + "." + dotAfter.join('');
        }
        else {
            temp = tempArr[0];
        }
    }
    return temp;
};
Number.prototype.toFixedNoZeroNumber = function (digit) {
    var temp = this.toFixed(digit);
    var tempArr = temp.split('.');
    if (tempArr.length == 2) {
        var dotAfter = tempArr[1].split('');
        for (var i = dotAfter.length - 1; i >= 0; i--) {
            if (dotAfter[i] != "0") {
                break;
            }
            dotAfter[i] = '';
        }
        var dotAfterStr = dotAfter.join('');
        if (dotAfterStr) {
            temp = tempArr[0] + "." + dotAfter.join('');
        }
        else {
            temp = tempArr[0];
        }
    }
    return parseFloat(temp);
};
String.prototype.toDate = function () {
    return new Date(this.replace(/-/g, "/"));
};
Number.prototype.naNToZero = function () {
    if (isNaN(this))
        return 0;
    return parseFloat(this);
};
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
