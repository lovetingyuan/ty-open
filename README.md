### ty-open

### install
`npm install ty-open -g`

### usage

```
usage: to [command] [args...] [options] 
commands: add, ls, rm, bak, res
  add, add a site, eg: to add npm "https://www.npmjs.com/" 
    options: -s, -d 
      -s, --ssl, use "https" as the protocol, no need to specify it 
      -d, --default, set default url (used when no arguments are provided)
      -f, --force, add a site without checking the url
  ls, list sites, eg: to ls npm 
    options: -t 
      -t, --tree, will list the sites in a tree 
  rm, delete a site, eg: to rm npm 
    options: -f, -c 
      -f, --force, delete the site without prompt 
      -c, --children, only delete the children sites under the namespace 
  bak, export current config file, eg: to bak [path], default path is current dir
  res, import config file, eg: to res <config_file_path>
    options: -m
      -m, --merge, merge custom config file and current config file, default is false 
when command is the site name or a valid url, will open the default browser directly 
eg: to npm, will open "https://www.npmjs.com" 
```

**notice: 'add', 'rm', 'ls', 'bak' and 'res' are retained for this command, you can not use them as a site name, eg: `to add rm "https://..."` is invalid**

### license
MIT

