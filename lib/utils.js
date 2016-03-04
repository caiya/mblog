"use strict";
/**
 * Created by chaozhou on 2016/3/4.
 */
var path = require("path");
var fs = require("fs");
var markdowIt = require("markdown-it");
var md = new markdowIt({
    html:true,
    langPrefix:"code-"
});

var swig = require("swig");
swig.setDefaults({cache:false});        // => Disables Cache
var rd = require("rd");

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
    var split = '---\n';
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
        filename: file,         //渲染到file模板文件
        autoescape:false,       //是否自动转义
        locals: data    //默认传递给模板的上下文变量
    });
}

//遍历所有文章
function eachSourceFile(sourceDir,callback){
    rd.eachFileFilterSync(sourceDir,/\.md$/,callback);
}

//渲染文章
function renderPost(dir,file){
    var content = fs.readFileSync(file).toString();
    var post = parseSourceContent(content.toString());
    post.content = markdownToHtml(post.source);
    post.layout = post.layout || "post";
    var config = loadConfig(dir);
    var html = renderFile(path.resolve(dir,"_layout",post.layout + ".html"),{post:post,config:config});
    return html;
}

//渲染文章列表
function renderIndex(dir){
    var list = [];
    var sourceDir = path.resolve(dir,"_posts");
    rd.eachFileFilterSync(sourceDir,/\.md$/,function(f,s){
        var source = fs.readFileSync(f).toString();
        var post = parseSourceContent(source);
        post.timeStamp = new Date(post.date);
        post.url = "/posts/" + stripExtname(f.slice(sourceDir.length + 1)) + ".html";
        list.push(post);
    });
    list.sort(function(a,b){
        return b.timeStamp - a.timeStamp;
    });
    var config = loadConfig(dir);
    var html = renderFile(path.resolve(dir,"_layout","index.html"),{posts:list,config:config});
    return html;
}

//加载配置文件
function loadConfig(dir){
    var content = fs.readFileSync(path.resolve(dir,"config.json")).toString();
    var data = JSON.parse(content);
    return data;
}

exports.stripExtname = stripExtname;
exports.renderPost = renderPost;
exports.renderIndex = renderIndex;
exports.eachSourceFile = eachSourceFile;
exports.loadConfig = loadConfig;