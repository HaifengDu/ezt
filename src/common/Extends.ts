interface Date {
    format(fmt: string): string
}
interface Number {
    /**
*数字转字符串不保留后面的0
*/
    toFixedNoZero(digit?: number): string;
    /**
*数字转字符串不保留后面的0
*/
    toFixedNoZeroNumber(digit?: number): number;
    /**
*将NaN转成0
*/
    naNToZero(): number;
}
interface String {
    toDate(): Date;
}

/**
*数字转字符串不保留后面的0
*/
Number.prototype.toFixedNoZero = function (digit?: number): string {
    let temp: string = this.toFixed(digit);
    //小数
    //根据点分割
    let tempArr = temp.split('.');
    //存在点
    if (tempArr.length == 2) {
        //分割点后面的数据
        let dotAfter = tempArr[1].split('');
        //从后面循环点后的数据  如果是0替换为空
        for (let i = dotAfter.length - 1; i >= 0; i--) {
            if (dotAfter[i] != "0") {
                break;
            }
            dotAfter[i] = '';
        }
        let dotAfterStr = dotAfter.join('');
        //如果存在点后面的数据 
        if (dotAfterStr) {
            temp = tempArr[0] + "." + dotAfter.join('');
        } else {
            temp = tempArr[0];
        }
    }
    return temp;
};

Number.prototype.toFixedNoZeroNumber = function (digit?: number): number {
    let temp: string = this.toFixed(digit);
    //小数
    //根据点分割
    let tempArr = temp.split('.');
    //存在点
    if (tempArr.length == 2) {
        //分割点后面的数据
        let dotAfter = tempArr[1].split('');
        //从后面循环点后的数据  如果是0替换为空
        for (let i = dotAfter.length - 1; i >= 0; i--) {
            if (dotAfter[i] != "0") {
                break;
            }
            dotAfter[i] = '';
        }
        let dotAfterStr = dotAfter.join('');
        //如果存在点后面的数据 
        if (dotAfterStr) {
            temp = tempArr[0] + "." + dotAfter.join('');
        } else {
            temp = tempArr[0];
        }
    }
    return parseFloat(temp);
};
/**
*字符串转成日期
*/
String.prototype.toDate = function (): Date {
    return new Date(this.replace(/-/g, "/"));
}
/**
*将NaN转成0
*/
Number.prototype.naNToZero = function (): number {
    if (isNaN(this as number))
        return 0;
    return parseFloat(<any>this);
}
Date.prototype.format = function (fmt: string): string {
    var o: any = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}