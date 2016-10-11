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

Now, you can get all tasks from your Synology Nas like that 

```javascript

syno.Auth.Connect().then(function(value) {
    console.log("Your are connected!");

    syno.DS.getTasks().then(function(value) {

        console.log("Success : " + value.Success)

        //Get your tasks
        for(var task in value.Tasks){
            console.log(value.Tasks[task].id)
        }



    }, function(reason) {

        console.log("Error : " + reason.Message)

    })

}, function(reason) {
    console.log("Error : " + reason.Message);

});

```

And when you do your business, logout :-) 

```javascript

data.Auth.Logout().then(function(data){
      console.log("You're log out")
  },function(reason){
          console.log("You're not log out")  
  });

```


For documentation go to https://github.com/Clowning/Synology-NodeJS-API/wiki