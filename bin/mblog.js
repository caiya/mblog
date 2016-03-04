#!/usr/bin/env node

/**
 * @author 晁州
 * @type {Command|*|exports|module.exports}
 */

var program = require("commander");

program.version("0.0.1");

//help
program
    .command("help")
    .description("帮助")
    .action(function(){
        program.outputHelp();
    });

//create
program
    .command("create [dir]")
    .description("创建一个空白博客")
    .action(function(dir){
        console.log("create %s",dir);
    });

//preview
program
    .command("preview [dir]")
    .description("实时预览")
    .action(require("../lib/cmd_preview.js"));

//build
program
    .command("build [dir]")
    .description("生成全站静态html")
    .option("-o,--output <dir>","生成的静态html存放目录")
    .action(require("../lib/cmd_build.js"));

//start
program.parse(process.argv);