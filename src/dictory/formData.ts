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
    }

}


export default utilData;