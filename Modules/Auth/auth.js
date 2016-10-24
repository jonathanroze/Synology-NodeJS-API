const HTTP = require("http-request");
const Utils = require("./../../Modules/Utils/GenericUtils.js");
var Promise = require('promise');


function Auth(server) {

    this.utils = new Utils();
    this.server = server;
    this.URI = this.utils.CreateURI(server);
    this.lol = "lol";
    this.Errors = ["DownloadStation", ];
    this.needs = {
        "SYNO.API.Auth": false,
        "SYNO.DownloadStation2": false
    };



}

Auth.prototype.getServices = function() {
    return this.needs;
}

Auth.prototype.getServerSettings = function() {
    return this.server;
}


Auth.prototype.Logout = function() {

    return new Promise(function(resolve, reject) {


        HTTP.get(NAS.URI + "/webapi/auth.cgi?api=SYNO.API.Auth&version=1&method=logout&session=DownloadStation", function(err, res) {
            if (err) {

                reject({
                    "Succes": false,
                });



            } else {

                var content = JSON.parse(res.buffer.toString())

                if (content.success) {

                    resolve({
                        "Success": true,
                    });

                } else {

                    reject({
                        "Success": false,
                        "Message": Error[content.error.code]
                    });


                }


            }

        });

    });


}

Auth.prototype.Connect = function() {

    NAS = this;

    return new Promise(function(resolve, reject) {
        HTTP.get(NAS.URI + "/webapi/query.cgi?api=SYNO.API.Info&version=1&method=query&query=all", function(err, res) {
            if (err) {

                //A FINIR
                reject({
                    "Succes": false,
                    "Message": "Authentifcation API is not avaiable"
                });
            } else {
                var content = JSON.parse(res.buffer.toString())

                for (var service in NAS.needs) {

                    for (var element in content.data) {

                        var matcher = new RegExp(service, "g");

                        if (matcher.test(element) && NAS.needs[service] != true) {

                            if (NAS.server.debug) {
                                console.log(' "' + service + '" service is found')
                            }
                            NAS.needs[service] = true

                        }


                    }

                }

                if (NAS.needs["SYNO.API.Auth"]) {
                    if (NAS.server.debug) {
                        console.log("Authentifcation API is avaiable")
                    }

                    var Error = {
                        "400": "No such account or incorrect password",
                        "401": "Account disabled",
                        "402": "Permission denied",
                        "403": "2-step verification code required",
                        "404": "Failed to authentificate 2-step verification code",

                        "100":"Unknown error",
                        "101":"Invalid paramter",
                        "102":"The requested API does not exist",
                        "103":"The requested method does not exist",
                        "104":"The requested version does not support the functionality",
                        "105":"The logged in session does not have permission",
                        "106":"Session timeout",
                        "107":"Session interrupted by duplicate login"

                    };

                    HTTP.get(NAS.URI + "/webapi/auth.cgi?api=SYNO.API.Auth&version=2&method=login&account=" + NAS.server.username + "&passwd=" + NAS.server.password + "&session=DownloadStation&format=cookie", function(err, res) {
                        if (err) {

                            reject({
                                "Succes": false,
                                // "Message": Error[content.error.code]
                            });




                        } else {

                            var content = JSON.parse(res.buffer.toString())

                            if (content.success) {

                                NAS.server.token = content.data.sid;
                                resolve({
                                    "Success": true,
                                    "Message": "Connected"
                                });

                            } else {

                                reject({
                                    "Success": false,
                                    "Message": Error[content.error.code]
                                });


                            }


                        }

                    });


                } else {

                    if (NAS.server.debug) {
                        console.log("Authentifcation API is not avaiable")
                    }

                    reject({
                        "Succes": false,
                        "Message": "Authentifcation API is not avaiable"
                    });
                }
            }

        });


    })

}



module.exports = Auth;