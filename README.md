# goodreads.js

## Local OAuth server

```shell
$ cd server
$ yarn
# Register you app https://www.goodreads.com/api/keys
$ export GOODREADS_API_KEY=goodreads_api_key
$ export GOODREADS_API_SECRET=goodreads_api_secret
$ babel-node index.js
```

Example output:

```json
{
    "username": "Egor Yurtaev",
    "userid": "37152837",
    "success": 1,
    "accessToken": "**********",
    "accessTokenSecret": "**********"
}
```


## Examples

```shell
$ export GOODREADS_API_KEY=**********
$ export GOODREADS_USER_KEY=**********
$ export GOODREADS_USER_SECRET=**********
$ export BABEL_ENV=es
$ babel-node examples/main.js --help
$ babel-node examples/main.js friends 37152837
$ babel-node examples/main.js reviews 37152837
$ babel-node examples/main.js shelves 37152837
```

## Autors

- [Egor Yurtaev](https://github.com/yurtaev)
- [Zhulduz Zhankenova](https://github.com/zhulduz)
