const Utils = require("./Modules/Utils/GenericUtils.js");
const colors = require('colors');
const AuthClass = require("./Modules/Auth/auth.js")
const DownloadStationClass = require("./Modules/DownloadStation/ds.js")


// ConstructoIr

/**
 * Synology Settings
 * @param {String} protocol / HTTP by default
 * @param {String} address 
 * @param {String} port / 5000 by default
 * @param {String} username
 * @param {String} password
 * @param {Boolean} debug / False by default
 * @return {Boolean} / If true, everything is ok
 */

function SynologyAPI(protocol, address, port, username, password, debug) {


    this.utils = new Utils();
    this.server = {
        protocol: "",
        address: "",
        port: "",
        username: "",
        password: "",
        debug: false,
        token: "",
        success: false,
        message: ""
    };

    // Debug verification
    if (debug == true) {
        this.server.debug = debug;
    };

    //Protocol verification
    if (protocol == "HTTP" || protocol == "HTTPS") {
        if (this.server.debug) {
            console.log("Protocol : " + protocol)
        }
        this.server.protocol = protocol
    } else {
        if (this.server.debug) {
            console.log("Protocol : Force to HTTP")
        }
        this.server.protocol = "HTTP"
    }

    //Address verification
    if (this.utils.IpValidator(address)) {
        if (this.server.debug) {
            console.log("Address : " + address)
        }
        this.server.address = address
    } else {
        if (this.server.debug) {
            console.log("Address : Your address is not good".red)
        }
        this.server.success = false;
        this.server.message = "Your address is not good"

    }

    //Port verification
    if (port) {
        if (this.server.debug) {
            console.log("Port : " + port)
        }
        this.server.port = port
    } else {
        if (this.server.debug) {
            console.log("Port : Force to 5000")
        }
    }

    //Username verification
    if (username) {
        if (this.server.debug) {
            console.log("Username : " + username)
        }
        this.server.username = username
    } else {
        if (this.server.debug) {
            console.log("Username : Is empty".red)
        }
        this.server.success = false;
        this.server.message = "You need to set a username"

    }

    //Password verification
    if (password) {
        if (this.server.debug) {
            console.log("Password : " + "Only you knows your password :-)")
        }
        this.server.password = password
    } else {
        if (this.server.debug) {
            console.log("Password : Is empty".red)
        }
        this.server.success = false;
        this.server.message = "You need to set a password"

    }

    // //If all is good

    if (debug) {
        console.log("Your Synology object is okay".green)
    }
    this.server.success = true;


    this.Auth = new AuthClass(this.server);
    this.DS = new DownloadStationClass(this.server, this.Auth);


}



// export the class
module.exports = SynologyAPI;
module.exports.Auth = this.Auth;
module.exports.DS = this.DS;