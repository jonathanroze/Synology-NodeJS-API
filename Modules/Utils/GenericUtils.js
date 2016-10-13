
function genericUtils(){

}


genericUtils.prototype.IpValidator = function(ipaddress)
{  

 if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress))  
  {  
    return (true)  
  }
   if( (ipaddress.indexOf("loginto") !== -1)){
    return (true) 
  }

return (false)  
}  


genericUtils.prototype.CreateURI = function(server){
  return server.protocol+"://"+server.address+":"+server.port
}


module.exports = genericUtils;
