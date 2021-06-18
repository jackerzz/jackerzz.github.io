# 初始化
```shell
hexo init username.github.io
```

### 修改主题插件
```shell
git clone https://github.com/litten/hexo-theme-yilia.git themes/yilia
git clone https://github.com/iissnan/hexo-theme-next themes/next  
```

### 修改 _config.yml 
```yml
# Extensions
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/

# theme: landscape # 默认插件
# theme: yilia     # themes/yilia
theme: next        # themes/next

``` 
### 预览效果
```sh
   hexo clean && hexo g && hexo s
```
### 访问浏览器
```python
# http://localhost:4000/
```
### 新增文章
```
hexo new "PostName"        # 新建文章至 \source\_posts
hexo new page  "pageName"  # 新建页面
```
### cdn代理
```
https://www.jsdelivr.com/github
```

### 发布

- hexo clean && hexo g -s    # 清除缓存+生成+预览
- hexo clean && hexo g -d    # 清除缓存+生成+发布
- hexo deploye         # 发布 https://username.github.io

### 部署
```sh
git add -A
git commit -m "$info"
git push origin hexo
git push coding hexo
```
