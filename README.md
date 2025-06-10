# 一：构建开发环境以及全局变量

## 1；开发环境以及项目

### (1): 安装 node

### (2): 创建项目：demo-cli

### (3): 创建 index.js

index.js 文件中输入 console.log("hello world")
在终端 输入 node index.js 运行，终端输出 hello world，则开环境搭建完成

## 2: 创建全局变量

### (1): 初始化 node_module

输入命令 npm init -y 初始化 node_module,项目中会出现 package.json 配置文件

### (2): 配置自定义命令

在 package.json 中配置自定义命令，在 bin 中添加 run 的指令执行 index.js

<img src=".\public\images\1749520793743.jpg">

### (3): 指令连接全局

输入 npm link 连接全局后，我们就可以在全局任何地方通过输入 run 命令来运行 index.js。且 index.js 最上面必须加上这行代码，或者绑定指令之后运行会报错。 #!/usr/bin/env node
链接指令
npm link
解绑指令
npm unlink

# 二：使用 Commander 解析命令行参数

## 1：原生获取命令行参数的方式 使用：process.argv 关键字

<img src=".\public\images\1749521143625.jpg">  
<img src=".\public\images\1749521173204.jpg">  
可以通过空格添加多个命令：run a b c
<img src=".\public\images\1749521277260.jpg">

## 2：使用包 Commander.js 模块来获取处理命令行参数

Commander.js 中文文档：https://github.com/tj/commander.js/blob/HEAD/Readme_zh-CN.md

### (1): 安装 commander.js 模块

npm install commander
通过命令： run -V 获取版本号
同理直接输入 run 会弹出选项提示
<img src=".\public\images\1749523049895.jpg">

## 3：设计自己的命令行参数

### (1): init 初始化模板命令

// init 命令 run init
program
// 定义命令：.command(命令名，[参数])
// []：表示可选参数
// <>：表示必填参数
.command("init <templateName> <projectName>")
// 命令别名
.alias("i")
// 命令作用介绍
.description("初始化项目模板")
// 可接在此命令之后连用的指令
.option("-i, --init <name>", "命令后使用选项接参数示例", "normal")
// 命令执行回调
.action((templateName, projectName, options) => {
// templateName：传给本项命令的参数
// projectName：传给本项命令的第二个参数
// options.\*\*\*：传给命令之后使用的指令的参数（option.init）
console.log(
`使用模板名：${templateName}, 项目名称为：${projectName}, ${
        options.init === "normal" ? "" : `选项参数为：${options.init}`
      }`
);
});

    ### (2): list 查看模板命令
    // list 命令
    program
    	.command("list")
    	.description("查看所有可用模板")
    	.action(() => {
    		console.log(`
    		Webpack Webpack-vue2模板
    		Webpack Webpack-vue3模板
    		Vite Vite-Vue2模板
    		Vite Vite-Vue3模板
    		`);
    	});

# 三：进行模板下载

## 1：准备模版

### (1):进入 GitHub 或 Gitee 新建仓库准备好需要使用的模板。

### (2): 配置模版信息

const templates = {
"sp-template": {
url: "https://geek.xxxx.com/scm/cbi-platform/gcjg-platform-mobile-demo.git", // 模板仓库地址
downloadUrl:
"direct:https://geek.xxxx.com/scm/cbi-platform/gcjg-platform-mobile-demo.git", // 模板下载地址
description: "移动端模板",
},
"sc-template": {
url: "https://geek.xxxx.com/scm/cbi-platform/gcjg-platform-front-demo.git", // 模板仓库地址
downloadUrl:
"direct:https://geek.xxxx.com/scm/cbi-platform/gcjg-platform-front-demo.git", // 模板下载地址
description: "大屏模板",
},
"filed-template": {
url: "https://geek.xxxx.com/scm/cbi-platform/gcjg-platform-front-demo.git", // 模板仓库地址
downloadUrl:
"direct:https://geek.xxxx.com/scm/cbi-platform/gcjg-platform-front-demo.git", // 模板下载地址
description: "工作台模板",
},
};

### (3): 修改 run list 命令

program
.command("list")
.description("查看所有可用模板")
.action(() => {
for (let key in templates) {
console.log(`${key} ${templates[key].description}`);
}
});

## 2：下载模板

### (1): 安装下载模板的包

npm install download-git-repo
download-git-repo 仅支持以下三个仓库源：
GitHub
GitLab
Bitbucket

### (2): 引入后使用

// 引入 clone-repo
import download from "download-git-repo";
download(
// 下载目标，格式为：仓库地址:用户名/仓库名字#分支
downloadUrl,
// 下载完成后的项目名称，也就是文件夹名
projectName,
// 以克隆形式下载
{
clone: true,
},
// 下载结束后的回调
(err) => {
console.log(err, "err++++++++");
}
);

# 四：使用 inquirer 和 handlebars 采集处理用户信息

## 1： 命令行交互 inquirer

### (1): 安装 inquirer

npm i inquirer

### (2): 使用 inquirer 将其放在 download 的下载回调中。

inquirer.prompt([
{
// 输入类型
type: "input",
// 字段名称
name: "name",
// 提示信息
message: "请输入项目名称",
},
{
// 输入类型
type: "input",
name: "description",
message: "请输入项目简介",
},
{
type: "input",
name: "author",
message: "请输入作者名称",
},
])
// 获取输入结果
.then((answers) => {
console.log(answers.author);
});

<img src=".\public\images\E3DC3093-E1C5-40BD-B98F-7D7F3B8059A2.png">

## 2：使用 handlebars 生成模板

### (1): 安装 handlebars

npm i handlebars
修改 package.json 中的内容
// 修改模板中的 name description author
"name": "{{ name }}",
"description": "{{ description }}",
"author": "{{ author }}",

### (2): 使用 handlebars

import handlebars from "handlebars";
// 把采集到的用户数据解析替换到 package.json 文件中
// 保存下载下来的模板 package.json 配置文件路径
const packagePath = `${projectName}/package.json`;
// 使用 fs 获取下载到的模板中额 package.json 配置文件
const packageContent = fs.readFileSync(packagePath, "utf8");
// 使用 handlebars 编译这个文件为渲染函数
const packageResult = handlebars.compile(packageContent)(answers);
// 将修改后配置写入下载下来的模板中
fs.writeFileSync(packagePath, packageResult);
console.log("初始化模板成功！");

# 五：使用 ora 增加下载中 loading 效果

## 1：安装 ora

npm i ora

## 2：因其 ora 最新版只能使用 import 来导入，所以要设置当前项目的默认包管理为 ESModule。

// 在 package.json 文件中，添加这行。
"type": "module",

修改包引入 将 require 引入方式全部改为 import 方式。
// 拿到 Command 对象
import { program } from "commander";
// 引入 clone-repo
import download from "download-git-repo";
// 引入模板引擎 handlebars
import handlebars from "handlebars";
// 引入 node 文件处理
import fs from "fs";
// 引入命令行交互 inquirer
import inquirer from "inquirer";
// 引入 ora 下载中美化样式
import ora from "ora";
// 初始化 ora
const loading = ora("模板下载中...");

## 3：使用，分别在模板下载开始前，下载中，下载完后调用 ora 的 start()、fail()、succeed() 方法。

// 添加下载中样式，开始
loading.start();

// 调用 ora 下载失败方法，进行提示
loading.fail("下载失败：");

// 调用 ora 下载成功方法，进行提示
loading.succeed("下载成功！");

# 六：使用 chalk 增加命令行输出信息样式-字体美化

## 1：安装 chalk

npm i chalk

## 2：使用 chalk

import chalk from "chalk";

// 输出红色警告字体告知用户模板下载失败
console.log(logSymbols.error, chalk.red("模板下载失败!"));
console.log("错误原因：", err);
// 前面代码省略...
// 将修改后配置写入下载下来的模板中
fs.writeFileSync(packagePath, packageResult);
// chalk 内部并没有内置橙色，所以需要我们自己使用 hex 生成对应颜色字体，再去输出
// 以橙色字体提示用户模板已经下载完成
const log = chalk.hex("#FFA500");
// 模板初始化成功后输出
console.log(logSymbols.success, log("模板初始化成功！"))

# 七：使用 log-symbols 增加命令行输出信息样式-图标美化

logSymbols 能够在控制台输出指定的日志符号。

## 1：安装 log-symbols

npm i log-symbols

## 2：使用 log-symbols

import logSymbols from "log-symbols";

// 输出红色警告字体告知用户模板下载失败
console.log(logSymbols.error, chalk.red("模板下载失败!"));
console.log("错误原因：", err);

// 以橙色字体提示用户模板已经下载完成
const log = chalk.hex("#FFA500");
// 模板初始化成功后输出
console.log(logSymbols.success, log("模板初始化成功！"));

# 八：npm 发包

## 1：注册 npm 账号

NPM 搜索看有无重名包。
把 package.json 中的 name 修改为发布到 NPM 上的包名

## 2：打开同志太，执行登录命令：npm login

## 3：登陆成功以后，在项目下执行发布命令：npm publish

## 4：行验证并下载我们自己的包

// 取消本地连接的全局指令
npm unlink
// 安装我们自己的包
npm i demo-cli

##
