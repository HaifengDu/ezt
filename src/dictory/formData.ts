let utilData = {
    /**
     * 修改参数key的信息
     * @param {Object,Array} target 目标对象或数组（旧的）
     * @param {Object} modifyOpt 修改的配置文件 {key:修改后的名称}（新的）
     */
    modifyParams(target: any, modifyOpt: Object, isDeep=true) {
        
        let targetParam = [],
            targetType = utilData.getType(target);
    
        if (targetType === 'Object') {
            // 取出所有的key值，并存放临时的数组中去
            targetParam = Object.keys(target);
    
            // 创建对应的属性并赋值
            targetParam.forEach(targetParamItem => {
                if (modifyOpt[targetParamItem]) {
                    target[modifyOpt[targetParamItem]] = target[targetParamItem];
                    delete target[targetParamItem];
    
                    if (isDeep){
                      // 判断是否还是数组
                      if (utilData.getType(target[modifyOpt[targetParamItem]]) === 'Array' || utilData.getType(target[modifyOpt[targetParamItem]]) === 'Object') {
                          utilData.modifyParams(target[modifyOpt[targetParamItem]], modifyOpt);
                      } else {
                          return false;
                      }
                    }
                    
                }
            });
        } else if (targetType === 'Array') {
            target.forEach((targetItem:any) => {
                Object.keys(targetItem).forEach(targetParamItem => {
                    // 将需要修改的字段给替换掉
                    if (targetItem[targetParamItem]) {
                        if (modifyOpt[targetParamItem]) {
                            targetItem[modifyOpt[targetParamItem]] = targetItem[targetParamItem];
                            delete targetItem[targetParamItem];
    
                            if (isDeep){
                              // 判断是否还是数组
                              if (utilData.getType(targetItem[modifyOpt[targetParamItem]]) === 'Array' || utilData.getType(targetItem[modifyOpt[targetParamItem]]) === 'Object') {
                                utilData.modifyParams(targetItem[modifyOpt[targetParamItem]], modifyOpt);
                              } else {
                                  return false;
                              }
                            }
    
                        }
                    }
                });
            });
        } else {
            return false;
        }
    },

    /**
     * 获取类型
     * @param {Any} val
     * @returns {String} 类型 
     */
    getType:function(val:any) {
        let valTypeStr = Object.prototype.toString.call(val);
        return valTypeStr.slice(8, valTypeStr.length - 1)
    },
    /* *
     * 去抖動
     * @param func 
     * @param wait 
     */
  /*   throttle:(fn:Function, time = 50) => { // 防抖动 控制空闲时间 用户输入频繁
        let timer:any; // 這裏如果函數被調用后，timer就會在内存裏面生成一份  1
        return  function (...args:[]){  // 2
            // 返回的function也會形成一塊内存區域，因爲它引用了timer，所以他們兩塊内存存在強引用關係
            // 如果2的内存不被釋放掉 1的内存就不會被釋放掉，這就形成了閉包。
            // 但是，咱們這個屬於每次都 new了一個内存，所以timer創建了多個而不是一個clearTimeout(timer);就不生效了，爲了保持生效
            // 必須只能讓1創建一次，2創建多次但是timer始終引入的只有1裏面的timer  clearTimeout(timer);清除的就是上一個創建出來的timer了
            let that = this;
            clearTimeout(timer);
            timer = setTimeout(()=>{
                fn.call(that, args);
            }, time);
        }
    } */
}


export default utilData;