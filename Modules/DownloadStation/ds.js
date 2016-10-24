const Utils = require("./../../Modules/Utils/genericUtils.js");
const HTTP = require("http-request");
var Promise = require('promise');

function DownloadStation(server, auth) {
    this.server = server;
    this.auth = auth;
    this.utils = new Utils();
    this.URI = this.utils.CreateURI(server);
    this.Error = {

        "Common": {
            "100": "Unknown error",
            "101": "No parameter of API, method or version",
            "102": "The requested API does not exist",
            "103": "The requested method does not exist",
            "104": "The requested version does not support the functionality",
            "105": "The logged in session does not have permission",
            "106": "Session timeout",
            "107": "Session interrupted by duplicate login",

            "400": "File upload failed",
            "401": "Max number of tasks reached",
            "402": "Destination denied",
            "403": "Destionation does not exist",
            "404": "Invalid task id",
            "405": "Invalid task action",
            "406": "No default destination",
            "407": "Set destination failed",
            "408": "File does not exist"
        },

        "BT":{

            "400": "Unknown error",
            "401": "Invalid paramter",
            "402": "Parse the user setting failed",
            "403": "Get category failed",
            "404": "Get the search result from DB failed",
            "405": "Get the user setting failed",


        }

    }
}

DownloadStation.prototype.GetConfiguration = function(){


    
}


DownloadStation.prototype.getInfo = function(){
    var dsSetting = this;
    return new Promise(function(resolve, reject) {

        var eligible = dsSetting.isEligible();

        if (eligible.Success) {
            HTTP.get(dsSetting.URI + "/webapi/DownloadStation/info.cgi?api=SYNO.DownloadStation.Task&version=1&method=getinfo&_sid=" + dsSetting.server.token, function(err, res) {
                if (err) {
                    reject({
                        "Success": false,
                        "Message": "Error Occured"
                    });
                }
                else {
                    var content = JSON.parse(res.buffer.toString())
                    if (content.success) {resolve(content)} 
                    else {
                        reject({
                            "Success": false,
                            "Message": "Une erreur"
                        });
                    }
                }
            });
        }
         else {
            reject({
                "Success": false,
                "Message": eligible.Message
            })
        }
    })
}


DownloadStation.prototype.getTasks = function(offset) {

    if (offset !== parseInt(offset, 10)) {
        offset = 0;
    }
    var dsSetting = this;
    return new Promise(function(resolve, reject) {

        var eligible = dsSetting.isEligible();

        if (eligible.Success) {

            HTTP.get(dsSetting.URI + "/webapi/DownloadStation/task.cgi?api=SYNO.DownloadStation.Task&version=1&method=list&offset=" + offset + "&additional=detail,file,transfer&_sid=" + dsSetting.server.token, function(err, res) {

                if (err) {

                    reject({
                        "Success": false,
                        "Message": "Error Occured"
                    });


                } else {


                    var content = JSON.parse(res.buffer.toString())


                    console.log(content.data.total)
                    if (content.success) {

                        resolve({
                            "Total": content.data.total,
                            "Offset": content.data.offset,
                            "Tasks": content.data.tasks,
                            "Success": true,
                        });

                    } else {

                        console.log(content)
                        reject({
                            "Success": false,
                            "Message": "Une erreur"
                        });


                    }


                }

            });

        } else {


            reject({
                "Success": false,
                "Message": eligible.Message
            })

        }



    })


}

DownloadStation.prototype.hasAPI = function() {

    var data = this.auth.getServices();

    if (data["SYNO.DownloadStation2"] == true) {
        return true
    } else  {
        return false
    }


}
DownloadStation.prototype.isEligible = function() {

    if (this.server.token != "") {
        if (this.server.debug == true) {console.log("You're login")}
        if (this.hasAPI()) {return {"Success": true}}
        
        else {
            if (this.server.debug == true) {
                console.log("DownloadStation access is not allowed")
            }
            return {
                "Success": false,
                "Message": "DownloadStation access is not allowed"
            }

        }

    } else {

        if (this.server.debug == true) {
            console.log("You need to login")
        }
        return {
            "Success": false,
            "Message": "You need to login"
        }

    }

}
module.exports = DownloadStation;