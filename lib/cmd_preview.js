"use strict";
/**
 * Created by chaozhou on 2016/2/21.
 */
var express = require("express");
var serveStatic = require("serve-static");
var path = require("path");
var fs = require("fs");
var markdowIt = require("markdown-it");
var md = new markdowIt({
    html:true,
    langPrefix:"code-"
});

module.exports = function (dir) {
    dir = dir || ".";

    var app = express();
    var router = express.Router();
    app.use("/assets",serveStatic(path.resolve(dir,"assets")));
    app.use(router);

    //渲染文章
    router.get("/posts/*",function(req,res,next){
        var name = stripExtname(req.params[0]);
        var file = path.resolve(dir,"_posts",name + ".md");
        fs.readFile(file,function(err,content){
            if(err) return next(err);
            var html = mdToHtml(content.toString());
            res.type("html");
            res.end(html);
        });
    });

    //渲染列表
    router.get("/",function(req,res,next){
        res.end("文章列表");
    });

    app.listen(3000);
};

//将markdown转换为html
function mdToHtml(content){
    return md.render(content || "");
}

//去掉文件名拓展名
function stripExtname(name){
    var i = 0 - path.extname(name).length;
    if(i === 0) i = name.length;
    return name.slice(0,i);
}
