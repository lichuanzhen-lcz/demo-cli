#!/usr/bin/env node
// 使用Node开发命令行工具所执行的Javascript脚本必须在顶部加入 #!/usr/bin/env node

// 拿到 Command 对象
import { program } from "commander";
// 引入 clone-repo
import download from "download-git-repo";
// import download from "clone-repo";
// 引入模板引擎 handlebars
import handlebars from "handlebars";
// 引入 node 文件处理
import fs from "fs";
// 引入命令行交互 inquirer
import inquirer from "inquirer";
// 引入 ora 下载中美化样式
import ora from "ora";
// 引入 chalk
import chalk from "chalk";
// 引入 logSymbols
import logSymbols from "log-symbols";
// 1.获取用户输入命令
// process.argv原生获取命令行参数的方式
console.log(process.argv, "process.argv");
program.version("0.0.1"); // -V 或者 --version 的时候输出该版本号
const templates = {
  "sp-template": {
    url: "https://geek.glodon.com/scm/cbi-platform/gcjg-platform-mobile-demo.git", // 模板仓库地址
    downloadUrl:
      "direct:https://geek.glodon.com/scm/cbi-platform/gcjg-platform-mobile-demo.git", // 模板下载地址
    description: "移动端模板",
  },
  "sc-template": {
    url: "https://geek.glodon.com/scm/cbi-platform/gcjg-platform-front-demo.git", // 模板仓库地址
    downloadUrl:
      "direct:https://geek.glodon.com/scm/cbi-platform/gcjg-platform-front-demo.git", // 模板下载地址
    description: "大屏模板",
  },
  "filed-template": {
    url: "https://geek.glodon.com/scm/cbi-platform/gcjg-platform-front-demo.git", // 模板仓库地址
    downloadUrl:
      "direct:https://geek.glodon.com/scm/cbi-platform/gcjg-platform-front-demo.git", // 模板下载地址
    description: "工作台模板",
  },
};
program
  .command("init <template> <project>")
  .description("初始化项目模板")
  .action((templateName, projectName) => {
    const spiner = ora("正在下载模板...");
    spiner.start();
    // 根据模板名下载对应的模板到本地
    // download: 第一个参数是仓库下载地址，第二个参数是下载路劲
    const { downloadUrl } = templates[templateName];
    console.log(downloadUrl, "downloadUrl");
    download(
      downloadUrl,
      projectName,
      {
        clone: true,
      },
      (err) => {
        console.log(err, "err++++++++");
        if (err) {
          spiner.fail();
          console.log(logSymbols.error, chalk.red("初始化模板失败"));
          return;
        }
        spiner.succeed(); // 下载成功提示
        // 模板文件下载成功
        // 1. 把项目下的package.json文件读取出来
        // 2. 使用向导的方式采集用户输入的值
        // 3. 使用模板引擎把用户输入的数据解析到package.json文件中
        // 4. 解析完毕，把解析之后的结果重新写入package.json文件中
        inquirer
          .prompt([
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
          .then((answers) => {
            // 把采集到的用户输入的数据解析替换到package.json中
            const packagePath = `${projectName}/package.json`;
            const packageContent = fs.readFileSync(packagePath, "utf8"); // 读取本地文件
            const packageResult = handlebars.compile(packageContent)(answers); // 编译替换
            fs.writeFileSync(packagePath, packageResult); // 重写到本地文件
            console.log(logSymbols.success, chalk.yellow("初始化模板成功"));
          });
      }
    );
  });
program
  .command("list")
  .description("查看所有可用模板")
  .action(() => {
    for (let key in templates) {
      console.log(`${key} ${templates[key].description}`);
    }
  });
program.parse(process.argv);
