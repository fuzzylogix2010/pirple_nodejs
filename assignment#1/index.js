/*
*
* Primary file for API
*
*/

// dependencies

var http          = require('http');
var https         = require('https');
var url           = require('url');
var stringDecoder = require('string_decoder').StringDecoder;
var config        = require('./config');
var  fs           = require('fs');



// The instantiate the http server
var httpServer = http.createServer(function (req, res){
    unifiedServer(req, res);

});


// Start the http server

httpServer.listen(config.env.httpport,function(){

  console.log("server is running at http://localhost:"+config.env.httpport+"/ in "+config.env.envName+"  node.");
});


var httpsServerOptions = {
  'key'       : fs.readFileSync(config.keystore.keystorepath),
  'cert'      : fs.readFileSync(config.keystore.certpath),
  'passphrase': config.keystore.passphrase

};
// The instantiate the https server

var httpsServer = https.createServer(httpsServerOptions,function (req, res){
    unifiedServer(req, res);

});


// Start the https server
httpsServer.listen(config.env.httpsport,function(){

  console.log("server is running at https://localhost:"+config.env.httpsport+"/ in "+config.env.envName+"  node.");
});


// all server logics [http , https]

var unifiedServer = function( req, res){
  // get the url and parse it

  var parseURL = url.parse(req.url,true);

  // get the path

  var path = parseURL.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

// get the query string

  var querystr= parseURL.query;

// get http method
  var method = req.method.toLowerCase();

// get the headers as an object
  var headers = req.headers;


  // get payload if there is any

  var decoder = new stringDecoder('utf-8');
  var buffer ='';

  req.on('data',function(data){
    buffer += decoder.write(data);
  });

  req.on('end', function(){

      buffer +=  decoder.end();


        // choose the handler the request should go to, if one is not found, choose the notFound handlers

      var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound ;


      // construct data object

      var data = {
        'trimmedPath' :trimmedPath,
        'querystr'    :querystr,
        'method'      : method,
        'headers'     :headers,
        'payload'     :buffer

      };


      // route the request to the specified handler

      chosenHandler(data, function(statusCode, payload){

          // use status code defined by handler or use default to 200

          statusCode = typeof(statusCode) == 'number'? statusCode : 200;

          //use payload called back by handler or default to empty object

          payload = typeof(payload) == 'object' ? payload: {};


          //convert payload into a string

          var payloadStr = JSON.stringify(payload);

          res.setHeader('Content-Type','application/json');
          // return response
          res.writeHead(statusCode);

          // send the response
          res.end(payloadStr);

          console.log("\n returning response : ", statusCode, payloadStr);

      });


  });


};


// define handlers

var handlers = {};


//hello handlers

handlers.hello = function(data, callback){
  // callback http status code, and payload object

  var qryname = data.querystr;

  var name  = typeof(qryname['name']) == 'string'?qryname['name']:'' ;//JSON.parse(qryname);

  console.log("name: \n ",name);

  console.log("data: \n ",data);

  callback(200,{
            'message':'Hello World!',
            'welcome':'Welcome '+name+' to NodeJS World'  });

};


//sample handlers

handlers.sample = function(data, callback){
  // callback http status code, and payload object

  callback(406,{'name':'sample callback'});

};


// ping handler
handlers.ping = function(data, callback){
  // callback http status code, and payload object

  callback(200,{'status':'server up'});

};



//handler not found

handlers.notFound = function(data, callback){
  callback(404);

};
// define a request routers

var router ={
  'sample': handlers.sample,
  'ping': handlers.ping,
  'hello': handlers.hello

};
