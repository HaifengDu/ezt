import Vue from 'vue';
Vue.filter("highlight",function(orignal:string){
    const htmlRegex = /<(.*)>.*|<(.*) \/>/ig;
    if(htmlRegex.test(orignal)){
        return orignal;
    }
    return template(orignal);
    function template(key:string) { 
        return "<span style='color:#11b7f3;'>" + key + "</span>"; 
    }
});
Vue.filter("maxlength",function(value:string,length = 5){
    let tempItem = value||"";
    if(tempItem.length>length){
        tempItem = tempItem.substr(0,length)+"...";
    }
    return tempItem;
});
Vue.filter("json", (value:any)=> {
    // 返回处理后的值
    if(value&&value.split) {
        return value;
    }
    return JSON.stringify(value||{});
});

Vue.filter("date", (value:any,format='yyyy-MM-dd hh:mm:ss')=> {
    // 返回处理后的值
    return new Date(value).format(format);
});

Vue.filter("isnull", (value:string)=> {
    // 返回处理后的值
    return value||"暂无";
});
Vue.filter("toFixedPrice",(value:string) => {
    const val = Number(value);
    return val.toFixedNoZero(4);
});
Vue.filter("toFixedMount",(value:string) => {
    const val = Number(value);
    return val.toFixedNoZero(4);
});