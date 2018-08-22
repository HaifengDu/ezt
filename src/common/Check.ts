
/**
 * 验证类
 */
export default class Check{
    public static readonly FILE_RIGHT_TYPE = ["gif", "jpg", "jpeg", "png", "bmp"];

    private static readonly FILE_BACK_RIGHT_TYPE = ["jpg", "jpeg", "png"];


    /**
     * 验证图片
     * @param fileName
     */
    public static checkImageFile(fileName:string):boolean{
        let imgUrl = fileName.toLowerCase();
        let fileExtension = imgUrl.substring(imgUrl.lastIndexOf('.') + 1);
        return Check.FILE_RIGHT_TYPE.indexOf(fileExtension) > -1;
    }

    /**
     * 验证后台图片
     * @param fileName 
     */
    public static checkBackImageFile(fileName:string):boolean{
        let imgUrl = fileName.toLowerCase();
        let fileExtension = imgUrl.substring(imgUrl.lastIndexOf('.') + 1);
        return Check.FILE_BACK_RIGHT_TYPE.indexOf(fileExtension) > -1;
    }

    /**
     * 验证集合是否为空
     * @param list
     */
    public static countNull(list: Array<any>): boolean {
        return list && list.length > 0;
    }

    /**
     * 验证集合长度
     * @param list
     * @param count
     */
    public static countCheck(list: Array<any>, count: number): boolean {
        if (list && list.length) {
            return list.length >= count;
        }
        return false;
    }

    /**
     * 验证是否存在item
     * @param list
     * @param item
     * @param key
     */
    // public static checkInArray(list: Array<any>, item: any, key?: string): boolean{
    //     if (!key) {
    //         return list.filter(model => {
    //             return model == item;
    //         }).length>0;
    //     }
    //     if (key in item) {
    //         return list.filter(model => {
    //             return model[key] == item[key];
    //         }).length>0;
    //     }
    //     return false;
    // }
}