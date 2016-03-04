"use strict";
/**
 * Created by chaozhou on 2016/3/4.
 */
var path = require("path");
var utils = require("./utils");
var fse = require("fs-extra");
var moment = require("moment");

module.exports = function(dir){
    dir = dir || ".";

    //创建目录
    fse.mkdirsSync(path.resolve(dir,"_layout"));
    fse.mkdirsSync(path.resolve(dir,"_posts"));
    fse.mkdirsSync(path.resolve(dir,"assets"));
    fse.mkdirsSync(path.resolve(dir,"posts"));

    //复制模板文件
    var tplDir = path.resolve(__dirname, "../tpl");
    fse.copySync(tplDir,dir);

    //创建首篇文章
    newPost(dir,"hello world","这是我的第一篇文章");
    console.log("ok,create success");
};

//创建文章
function newPost(dir,title,content){
    var data = [
        '---',
        'title: ' + title,
        'date: ' + moment().format("YYYY-MM-DD"),
        '---',
        content
    ].join("\n");
    var name = moment().format("YYYY-MM") + "/hello-world.md";
    var file = path.resolve(dir,"_posts",name);
    fse.outputFileSync(file,data);
}