# 项目拉取
```shell
git clone --recurse-submodules https://github.com/jackerzz/jackerzz.github.io.git
```
# 更新依赖
```
npm install
```
# 预览效果
```sh
   hexo clean && hexo g  && hexo s
```
# 访问浏览器
```sh
# http://localhost:4000/
```

### cdn代理
```
https://www.jsdelivr.com/github
```
https://www.pexels.com/zh-tw/photo/2919587/
### 发布

- hexo clean && hexo g -s    # 清除缓存+生成+预览
- hexo clean && hexo g && gulp  && hexo d    # 清除缓存+生成+发布
- hexo deploye         # 发布 https://username.github.io

### 部署
- 1.清除缓存+生成+发布
```sh
hexo clean && hexo g -d
```
- 2.推送hexo 分支到远程
```sh
git add -A
git commit -m "$info"
git push origin hexo
git push coding hexo
```