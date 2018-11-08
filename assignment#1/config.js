/*
*
* create and export configuration variables
*
*/


// container for all environments

var environments ={};




//staging default environment

environments.staging = {

  'httpport':13000,
  'httpsport':13001,
  'envName':'staging'


};

// production environment

environments.production = {

  'httpport':15000,
  'httpsport':15001,
  'envName':'production'


};

// keystore properties
var keystore ={

  'passphrase'  :'p3hkM0oBpMKOJbTi40yK',
  'keystorepath':'./ssl/asskey.pem',
  'certpath'    :'./ssl/assnodejs.cer'

};



// determine which environment is pass at the command line

var currentEnvironment = typeof(process.env.NODE_ENV) == 'string'? process.env.NODE_ENV.toLowerCase() :"";


var exportenvironment = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment]: environments.staging;


// export the module

module.exports = {'env':exportenvironment, 'keystore':keystore };
