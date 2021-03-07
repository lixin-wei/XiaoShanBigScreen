# JS

入口：index.php

JS(ES5),`/js`, 编译成老标准的js代码(dist/app.js)


index.php里引用了app.js

js代码中，会通过ajax和后端交互，获取数据库的数据

js里的ajax->`/php/`里的php脚本（之后要换成Java）



`dist/app.js`是由`js/app.js`编译出来的


app.js -> DataController.js里会生成所有的格子

BMCtl.initCell里注册点击事件


# CSS
css是用SCSS写的，css上层的一个语言，编译成css
SCSS放在`scss`目录下，`scss/index.scss`编译成`scss/index.css`

# 开发流程

1. 准备数据库， `xsdb.sql`，导入成一个叫xsdb的数据；数据库的连接
我写在 `php/mysqlAll.php`。
   
2. 准备一个php的运行环境，windows下使用WAMP，
   把整个工程放到 `www`目录下。启动apache，以XiaoSHanBigScreen为根目录。
   打开浏览器访问 `localhost:8080/`，应该就能显示出页面。
   
3. JS文件的编译，NPM，装一下node.js。`npm run watch`，会自动检测你工程目录下文件的变动，
   自动进行编译。
   
4. scss文件的编译，按这个教程<https://sass-lang.com/install>装SCSS编译器（用npm装）。
   装好后，用sass命令编译scss文件。应该也有个watch命令可以自动编译。
   

# 换后端接口

对于php写的后端接口，我默认是在同一个目录下，搜`$.post`

对于python的算法接口，我默认ip写在 `js/Global.js`里，`PYTHON_SERVER_ROOT`。