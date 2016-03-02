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

var swig = require("swig");
swig.setDefaults({cache:false});        // => Disables Cache

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
            var post = parseSourceContent(content.toString());
            post.content = markdownToHtml(post.source);
            post.layout = post.layout || "post";
            var html = renderFile(path.resolve(dir,"_layout",post.layout + ".html"),{post:post});
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
function markdownToHtml(content){
    return md.render(content || "");
}

//去掉文件名拓展名
function stripExtname(name){
    var i = 0 - path.extname(name).length;
    if(i === 0) i = name.length;
    return name.slice(0,i);
}

//解析文章内容
function parseSourceContent(data){
    var split = '---\r\n';
    var i = data.indexOf(split);
    var info = {};
    if(i != -1){
        var j = data.indexOf(split,i + split.length);
        if(j !== -1){
            var str = data.slice(i + split.length,j).trim();            //title&date部分
            data = data.slice(j + split.length);                //文章content部分
            str.split("\n").forEach(function(line){
                var n = line.indexOf(":");
                if(n !== -1){
                    var name = line.slice(0,n).trim();
                    var value = line.slice(n + 1).trim();
                    info[name] = value;
                }
            });
        }
    }
    info.source = data;
    return info;
}

//渲染模板
function renderFile(file,data){
    return swig.render(fs.readFileSync(file).toString(),{
        filename: file,         //渲染到file文件
        autoescape:false,       //是否自动转义
        locals: data    //默认传递给模板的上下文变量
    });
}