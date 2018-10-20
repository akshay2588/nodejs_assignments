/*
 * Primary file for API
 *
 */

// Dependencies
var http = require('http');
var url = require('url');
var config = require('./config');

 // Instantiate the HTTP server
var httpServer = http.createServer(function(req,res){

	// Parse the url
	var parsedUrl = url.parse(req.url, true);

	// Get the path
	var path = parsedUrl.pathname;
	var trimmedPath = path.replace(/^\/+|\/+$/g, '');

	// Get the query string as an object
	var queryStringObject = parsedUrl.query;

	// Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
	var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

	// Construct the data object to send to the handler
	var data = {
	'name' : 'name' : typeof(queryStringObject.name) == 'string' ? queryStringObject.name : 'Guest User'
	};

	// Route the request to the handler specified in the router
	chosenHandler(data,function(statusCode,msg){

	// Use the status code returned from the handler, or set the default status code to 200
	statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

	// Use the msg returned from the handler, or set the default msg to an empty object
	msg = typeof(msg) == 'object'? msg : {};

	// Convert the payload to a string
	var msgString = JSON.stringify(msg);

	// Return the response
	res.setHeader('Content-Type', 'application/json');
	res.writeHead(statusCode);
	res.end(msgString);
	console.log("Returning this response: ",statusCode,msgString);

  });
  
});

// Start the HTTP server
httpServer.listen(config.port,function(){
  console.log('The HTTP server is running on port '+config.port+ ' as a '+config.envName+' environment.');
});


// Define all the handlers
var handlers = {};

// hello handler
handlers.hello = function(data,callback){
    callback(450,{'message':'Welcome '+data.name});
};

// Not found handler
handlers.notFound = function(data,callback){
  callback(404);
};

// Define the request router
var router = {
  'hello' : handlers.hello
};
