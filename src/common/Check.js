var Check = (function () {
    function Check() {
    }
    Check.checkImageFile = function (fileName) {
        var imgUrl = fileName.toLowerCase();
        var fileExtension = imgUrl.substring(imgUrl.lastIndexOf('.') + 1);
        return Check.FILE_RIGHT_TYPE.indexOf(fileExtension) > -1;
    };
    Check.checkBackImageFile = function (fileName) {
        var imgUrl = fileName.toLowerCase();
        var fileExtension = imgUrl.substring(imgUrl.lastIndexOf('.') + 1);
        return Check.FILE_BACK_RIGHT_TYPE.indexOf(fileExtension) > -1;
    };
    Check.countNull = function (list) {
        return list && list.length > 0;
    };
    Check.countCheck = function (list, count) {
        if (list && list.length) {
            return list.length >= count;
        }
        return false;
    };
    Check.FILE_RIGHT_TYPE = ["gif", "jpg", "jpeg", "png", "bmp"];
    Check.FILE_BACK_RIGHT_TYPE = ["jpg", "jpeg", "png"];
    return Check;
}());
export default Check;
