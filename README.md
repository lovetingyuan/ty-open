### ty-open


### example config json file:
```json
{
  "version": 1.0.0,
  "home": "your home page",
  "sites": {
    "json": {
      "url": "https://tingyuan.me/jsonformat"
    },
    "npm": {
      "url": "https://npm.com",
      "sub": {
        "pkg": {
          "url": "https://npm.com/packages/ "
        }
      }
    }
  }
}
```

### usage
* to add wiki "https://zh.wikipedia.org/wiki/ "
* to add wiki "https://wikipedia.org/" -d // eg: `to wiki earth` will open `https://zh.wikipedia.org/wiki/earch`, while `to wiki` will open `https://wikipedia.org/`, if you omit arguments and you did not set -d option, the space in the url will be ignored
* to add npm npm.com -s // -s will set protocol to 'https://'
* to add mtime mtime.com
* to add home "https://tingyuan.me/" // you can set your home page, when use `to`, will open the home page
* to gg
* to gg "tomorrow weather" // if you do not rewrite gg, you can also use `to gg tomorrow weather`
* to rm -f // will reset to begaining
* to rm npm.pkg
* to rm npm -f // will delete npm and npm's children without prompt
* to rm npm // will only delete npm excluding it's children(if exist)
* to rm npm -c // will only delete npm's children
* to ls // will list all sites
* to ls npm.pkg
* to ls npm -t // will show list by tree, or will show in flatten way

**notice: 'add', 'rm' and 'ls' is retained for this command, you can not use them as a site name, eg: `to add rm "https://..."` is invalid**

* to npm.pkg http-server
* to mdn.css line-height
* to github.repo react stars
* to https://google.com // if you want to open url directly, you can not omit protocol
* to -h // to --help 
* to -v // to --version
* to // will go to home page



