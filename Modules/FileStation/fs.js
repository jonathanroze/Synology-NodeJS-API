const Utils = require("./../../Modules/Utils/genericUtils.js");
const HTTP = require("http-request");
var Promise = require('promise');

function FileStation(server, auth) {
    this.server = server;
    this.auth = auth;
    this.utils = new Utils();
    this.URI = this.utils.CreateURI(server);

    this.Error = {

        "100":"Unknown error",
        "101":"No parameter of API, method or version",
        "102":"The requested API does not exist",
        "103":"The requested method does not exist",
        "104":"The requested version does not support the functionality",
        "105":"The logged in session does not have permission",
        "106":"Session timeout",
        "107":"Session interrupted by duplicate login",

        "400":"Invalid paramter of file operation",
        "401":"Unknown eroor of file operation",
        "402":"System is too busy",
        "403":"Invalid user does this file operation",
        "404":"Invalid group does this file operation",
        "405":"Invalid user and group does this operation",
        "406":"Can't get user/group information from the account server",
        "407":"Operation not permitted",
        "408":"No such file or directory",
        "409":"Non-supported file system",
        "410":"Failed to connect internet-based file system (ex: CIFS)",
        "411":"Read-only file system",
        "412":"Filename too long in the non-encrypted file system",
        "413":"Filename too long in the encrypted file system",
        "414":"File already exists",
        "415":"Disk quota exceeded",
        "416":"No space left on device",
        "417":"Input/ouput error",
        "418":"Illegal name or path",
        "419":"Illegal file name",
        "420":"Illegal file name on FAT file system",
        "421":"Device or resource busy",
        "599":"No such task of the file operation",

        "1800":"There is no Content-Length information in the HTTP header or the received size doesn’t match the value of Content-Length information in the HTTP header.",
        "1801":"Wait too long, no date can be received from client (Default maximum wait time is 3600 seconds).",
        "1802":"No filename information in the last part of file content.",
        "1803":"Upload connection is cancelled",
        "1804":"Failed to upload too big file to FAT file system",
        "1805":"Can’t overwrite or skip the existed file, if no overwrite parameter is given.",

        "1100":"Failed to create a folder. More information in <errors> object",
        "1101":"The number of folders to the parent folder would exceed the system limitation",

        "1000":"Failed to copy files/folders. More information in <errors> object.",
        "1001":"Failed to move files/folders. More information in <errors> object.",
        "1002":"An error occurred at the destination. More information in <errors> object",
        "1003":"Cannot overwrite or skip the existing file because no overwrite parameter is given.",
        "1004":"File cannot overwrite a folder with the same name, or folder cannot overwrite a file with the same name",
        "1006":"Cannot copy/move file/folder with special characters to a FAT32 file system.",
        "1007":"Cannot copy/move a file bigger than 4G to a FAT32 file system.",

        "1400":"Failed to extract files",
        "1401":"Cannot open the file as archive",
        "1402":"Failed to read archive data error",
        "1403":"Wrong password",
        "1404":"Failed to get the file and dir list in an archive",
        "1405":"Failed to find the item ID in an archive file",

        "1300":"Failed to compres files/folders",
        "1301":"Cannot create the archive beacause the given archive name is too long",
        

}

}


FileStation.prototype.getTasks = function(offset) {

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
module.exports = FileStation;