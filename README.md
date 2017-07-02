### ty-open

### install
`npm install ty-open -g`

### usage
* 添加一个站点, `to add <site_name> <site_url> [arguments] [options]`
  * to add npm "https://www.npmjs.com"
  * to add npm www.npmjs.com -s, 当缺少协议时-s选项会自动加上https协议，否则是http
  * to add npm.pkg "https://www.npmjs.com/package/ ", 命令的参数会依次替换空格部分, 例如 to npm.pkg http-server会打开https://www.npmjs.com/package/http-server, 可以使用多个空格定义多个可变参数
  * to add npm "https://www.npmjs.com" -d, -d选项用来设置缺少可变参数时访问的url
  * to add npm "https://www.npmjs.com/search?q= ", 这两条虽然都使用了npm作为站点名称，但是-d选项仅仅会在没有可变参数时才会有效，例如to npm 会进入npm的主页，to npm http-server 会进入搜索页
  * to add home "https://tingyuan.me/" // home可以指定主页，当仅仅使用to命令时会打开主页
  * to add loc localhost:8080 -f // -f选项会忽略校验url并强制添加
* 删除一个站点
  * to rm // 如果不指定站点名称则会删除所有的站点，-f不生效
  * to rm npm.pkg -f // -f选项不会提示，直接删除
  * to rm npm -c // -c选项则仅仅删除npm下的子站点（如果有的话）
* 列出现有的站点
  * to ls // 列出所有站点
  * to ls npm.pkg // 列出npm.pkg的站点
  * to ls npm -t // 以树形的方式列出，默认是以扁平化的方式
* 访问站点
  * to npm.pkg http-server
  * to https://google.com // 如果紧跟着URL则会直接访问这个url
  * to -h // to --help, print help info
  * to -v // to --version
  * to // 默认访问主页
* 内置支持Google搜索
  * to gg // will go to "https://google.com/"
  * to gg "tomorrow weather" // will search weather info using google

**notice: 'add', 'rm' and 'ls' is retained for this command, you can not use them as a site name, eg: `to add rm "https://..."` is invalid**

### license
MIT



