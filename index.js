var syno = require("./synologyAPI");


var data = new syno(
    protocol = "HTTP",
    address = "192.168.0.20",
    port = "5000",
    username = "admin",
    password = "sopiket06",
    debug = true);


data.Auth.Connect().then(function(value) {
    console.log("Connecté!");

    data.DS.getTasks().then(function(value) {

        console.log("Success : " + value)

    }, function(reason) {

        console.log("Error : " + reason.Message)

    })



}, function(reason) {
    console.log("Error : " + reason.Message);

});










// data.Auth.Logout().then(function(data){
//       console.log("Deconnecté")
//   },function(reason){
//           console.log("Pas Deconnecté")  
//   });