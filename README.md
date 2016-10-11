# Synology-NodeJS-API
A NodeJS API to communicate with your Synology NAS



You can : 

- Login and logout to your Synology NAS
- Communicate with DownloadCenter application (Go to wiki for more information)




Installation

```javascript
npm install synology-api
```

Create your Synology Object 

```javascript

var syno = new Syno(
    protocol = "HTTP",
    address = "192.168.0.0",
    port = "5000",
    username = "admin",
    password = "password",
    debug = true);

```


For documentation go to https://github.com/Clowning/Synology-NodeJS-API/wiki