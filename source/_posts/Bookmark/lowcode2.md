
---
title: 搭建ERPnext
tags:
  - 书签 
categories:
  - 书签 
date: 2022-02-15
---

1. 如果当前登录的是root用户，就请新建一个用于安装ERP的sudo用户。

   ```bash
   adduser [frappe-user]
   usermod -aG sudo [frappe-user]
   ```

2. 更新系统并重启系统。

   ```bash
   apt update && apt upgrade -y && shutdown -r now
   ```

3. 使用安装ERP所建好的sudo用户,下载node.js

   ```
   curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   ```

4. 安装操作系统所需的各种依赖包

   ```bash
   sudo apt install -y python3.10-dev python3-setuptools python3-pip python3-distutils python3.10-venv software-properties-common mariadb-server mariadb-client redis-server nodejs xvfb libfontconfig libmysqlclient-dev nginx git ansible
   ```

5. 将Python的pip源改成国内源，有助于后面安装frappe时提高速度和成功率。

   ```bash
   pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/
   pip config set install.trusted-host mirrors.aliyun.com
   ```

6. 接下来开始配置MariaDB，用nano编辑my.cnf文件。

   ```bash
   sudo nano /etc/mysql/my.cnf
   ```

   将光标移动到最后空白行，复制以下文本内容，粘贴后注意格式和换行要同下方，ctrl + X返回命令行，保存cy.cnf。

   ```bash
   [mysqld]
   character-set-client-handshake = FALSE 
   character-set-server = utf8mb4 
   collation-server = utf8mb4_unicode_ci 
   
   [mysql]
   default-character-set = utf8mb4
   ```

7. 重启sql

   ```bash
   sudo service mysql restart
   ```

8. 开始mysql的安全配置

   ```
   sudo mysql_secure_installation
   ```

   第一个输入数据库密码对话框出来的时候，直接敲回车代表没有密码，剩下的按照下面选择：

   ```bash
   # 注：运行结果用 ··· 代替
   Enter current password for root (enter for none):  # 输入root(mysql)的密码，初次安装默认没有，直接回车 
    ... 
   Switch to unix_socket authentication [Y/n] n # 是否切换到unix套接字身份验证[Y/n]
    ... 
   Change the root password? [Y/n] y #是否设置root用户密码
   New password: # 新密码
   Re-enter new password:  # 再次输入密码
    ... 
   Remove anonymous users? [Y/n] y # 是否删除匿名用户，建议删除
    ... 
   Disallow root login remotely? [Y/n] n # 是否禁止root远程登录，建议不开启
    ... 
   Remove test database and access to it? [Y/n] n # 是否删除test数据库，可以保留
   ...
   Reload privilege tables now? [Y/n] y # 是否重新加载权限表，也可以直接回车
    ... 
   Thanks for using MariaDB! # 看到这句话证明设置成功
   ```

9. 安装yarn

   ```bash
   sudo npm install -g yarn
   
   #yarn config get registry查看源, 如果官方源请设置为以下国内源
   
   yarn config set registry https://registry.npmmirror.com/ --global  && \
   yarn config set disturl https://npmmirror.com/package/dist --global && \
   yarn config set sass_binary_site https://cdn.npmmirror.com/binaries/node-sass --global  && \
   yarn config set electron_mirror https://registry.npmmirror.com/binary.html?path=electron/ --global  && \
   yarn config set puppeteer_download_host https://registry.npmmirror.com/binary.html --global  && \
   yarn config set chromedriver_cdnurl https://cdn.npmmirror.com/binaries/chromedriver --global  && \
   yarn config set operadriver_cdnurl https://cdn.npmmirror.com/binaries/operadriver --global  && \
   yarn config set phantomjs_cdnurl https://cdn.npmmirror.com/binaries/phantomjs --global  && \
   yarn config set selenium_cdnurl https://cdn.npmmirror.com/binaries/selenium --global  && \
   yarn config set node_inspector_cdnurl https://cdn.npmmirror.com/binaries/node-inspector --global
   
   
   npm set registry https://registry.npmmirror.com/ && \
   npm set disturl https://npmmirror.com/package/dist && \
   npm set sass_binary_site https://cdn.npmmirror.com/binaries/node-sass && \
   npm set electron_mirror https://registry.npmmirror.com/binary.html?path=electron/ && \
   npm set puppeteer_download_host https://registry.npmmirror.com/binary.html && \
   npm set chromedriver_cdnurl https://cdn.npmmirror.com/binaries/chromedriver && \
   npm set operadriver_cdnurl https://cdn.npmmirror.com/binaries/operadriver && \
   npm set phantomjs_cdnurl https://cdn.npmmirror.com/binaries/phantomjs && \
   npm set selenium_cdnurl https://cdn.npmmirror.com/binaries/selenium && \
   npm set node_inspector_cdnurl https://cdn.npmmirror.com/binaries/node-inspector
   ```

10. 查看版本，对照一下，这一步不做也行.

    ```bash
    node -v && npm -v && python3 -V && pip3 -V && yarn -v
    ```

11. 安装bench，即erpnext系统的命令行管理工具，类似windows系统的程序管理器。

    ```bash
    sudo -H pip3 install frappe-bench
    ```

12. 使用bench命令安装frappe框架。frappe-bench是安装frappe框架的目录名称。

    ```bash
    bench init --frappe-branch version-14 frappe-bench --frappe-path=https://gitee.com/mirrors/frappe --verbose
    ```

13. 再将安装的系统用户分配一下执行权限。

    ```bash
    chmod -R o+rx /home/[frappe-user]/
    ```

14. 进入bench目录

    ```bash
    cd frappe-bench
    ```

15. 新建站点，下面是以erpnext作为站点名称。

    ```bash
    bench new-site erpnext
    ```

16. 设置为生产环境，即用supervisorctl管理所有进程，使用nginx做反向代理。如果安装只是为了做开发，可以跳过这一步。

    ```bash
    sudo bench setup production {USERNAME}
    ```

17. 下载app

    ```bash
    bench get-app --branch version-14 https://gitee.com/qinyanwan/payments
    bench get-app --branch version-14 erpnext https://gitee.com/mirrors/erpnext 
    bench get-app --branch version-14 https://gitee.com/phipsoft/hrms  
    ```

18. 安装app

    ```bash
    bench --site {sitename} install-app payments
    bench --site {sitename} install-app erpnext
    bench --site {sitename} install-app hrms
    ```

19. 安装完后可查看一下是否有活动的wokers，同样的，如果没开启生产环境，这一步也可以略过。

    ```bash
    bench doctor
    ```

20. 查看所需的app是否安装正确，可以用这个命令

    ```bash
    bench version
    ```

21. 最后解决可能存在PDF打印中文显示乱码所需要的工具

    ```bash
    wget https://gitee.com/qinyanwan/erpnext/releases/download/v13.29.0/wkhtmltox_0.12.6.1-2.jammy_amd64.deb
    ```

    ```bash
    sudo dpkg -i wkhtmltox_0.12.6.1-2.jammy_amd64.deb
    ```

    如果安装提示有缺少依赖的错误，执行下面命令。

    ```bash
    sudo apt -f install
    ```

    现在，我们可以检查wkhtmltopdf 库是否正确安装并确认是否为所需版本：

    ```bash
    wkhtmltopdf –version
    ```

    **显示wkhtmltopdf 0.12.6 (with patched qt)即是正确版本**

**其他**

汉化、本地化请登录 https://gitee.com/yuzelin/ 按需安装相关APP。
