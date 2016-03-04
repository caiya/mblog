"use strict";
/**
 * Created by chaozhou on 2016/2/21.
 */
var express = require("express");
var serveStatic = require("serve-static");
var path = require("path");
var utils = require("./utils");

module.exports = function (dir) {
    dir = dir || ".";
    var app = express();
    var router = express.Router();
    app.use("/assets",serveStatic(path.resolve(dir,"assets")));
    app.use(router);
    //渲染文章
    router.get("/posts/*",function(req,res,next){
        var name = utils.stripExtname(req.params[0]);
        console.log("GET：%s",name);
        var file = path.resolve(dir,"_posts",name + ".md");
        var html = utils.renderPost(dir,file);
        res.type("html");
        res.end(html);
    });

    //渲染列表
    router.get("/",function(req,res,next){
        console.log("GET：/");
        var html = utils.renderIndex(dir);
        res.type("html");
        res.end(html);
    });
    console.log("server listening on port 3000");
    app.listen(3000);
};
