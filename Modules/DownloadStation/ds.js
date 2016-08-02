const Utils = require("./../../Modules/Utils/genericUtils.js");
const HTTP = require("http-request");
var Promise = require('promise');

function DownloadStation(server, auth) {
    this.server = server;
    this.auth = auth;
    this.URI = Utils.CreateURI(server);

}


DownloadStation.prototype.getTasks = function(offset) {

    if(offset !== parseInt(offset, 10)){
        offset = 0;
    }
    var dsSetting = this;
    return new Promise(function(resolve, reject) {

        var eligible = dsSetting.isEligible();

        if (eligible.Success) {

            HTTP.get(dsSetting.URI + "/webapi/DownloadStation/task.cgi?api=SYNO.DownloadStation.Task&version=1&method=list&offset="+offset+"&additional=detail,file,transfer&_sid="+dsSetting.server.token, function(err, res) {

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
                            "Offset" : content.data.offset,
                            "Tasks":content.data.tasks,
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

        if (this.server.debug == true) {
            console.log("You're login")
        }

        if (this.hasAPI()) {

            return {
                "Success": true
            }

        } else {
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