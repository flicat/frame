/*!
 * @author liyuelong1020@gmail.com
 * @date 15-7-15 下午4:30
 * @version 1.0.0
 * @description 处理图片方向/压缩图片
 */

define(function (require, exports) {
    var pkgd = require('pkgd');
    var binaryajax = require('binaryajax');
    var exif = require('exif');

    var MegaPixImage = require('megapix');

    return function(img, width, height, callback) {

        //定义选择图像容器
        var photo = document.createElement('canvas');
        photo.height = height;
        photo.width = width;

        var base64 = img.src.replace(/^.*?,/,'');
        var binary = atob(base64);
        var binaryData = new BinaryFile(binary);

        // get EXIF data
        var exif = EXIF.readFromBinaryFile(binaryData);
        var orientation = exif.Orientation;

        photo.width = width;
        photo.height = height;

        //缩略尺寸
        var mpImg = new MegaPixImage(img);

        mpImg.onrender = function() {
            callback(photo);
        };

        mpImg.render(photo, { maxWidth: width, maxHeight: height, orientation: orientation });
    }
});