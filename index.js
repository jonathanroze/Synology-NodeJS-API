var Syno = require("./synologyAPI");

var syno = new Syno(
    protocol = "HTTP",
    address = "clowning.loginto.me", //IP Address or loginto.me address
    port = "5000",
    username = "admin",
    password = "sopiket06",
    debug = true);

syno.Auth.Connect().then(function(value) {
    console.log("Connecté!");

    syno.DS.getTasks().then(function(value) {

        console.log("Success : " + value.Success)

        for(var task in value.Tasks){
            console.log(value)
        }

            syno.Auth.Logout().then(function(data){
                console.log("Deconnecté")
            },function(reason){
                    console.log("Pas Deconnecté")  
            });

    }, function(reason) {

        console.log("Error : " + reason.Message)

    })

    // syno.DS.getConfiguration().then(function(value){console.log(value)},function(reason){console.log(reason)})



}, function(reason) {
    console.log("Error : " + reason.Message);

});




