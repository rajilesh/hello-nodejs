/*
* Primary file for the API 
*
*
*/

// Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

// The server should respond all requests with a string

var server = http.createServer(function(req,res){

    // Get the url and parse it
    var parsedURL = url.parse(req.url,true);

    // Get the path
    var path = parsedURL.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');

    // Get the query string as an object
    var queryStringObject = parsedURL.query;

    // Get the HTTP method
    var method = req.method.toLowerCase();

    // Get the headers of as an object
    var headers = req.headers;

    // Get the payload, if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data',function(data){
        buffer += decoder.write(data);
    });

    req.on('end',function(){
        buffer += decoder.end();



        // Handles the routing

        var chosenHanlders = typeof(router[trimmedPath]) !=='undefined' ? router[trimmedPath] : handlers.notFound;

        var data = {
            'trimmedPath':trimmedPath,
            'queryStringObject':queryStringObject,
            'method':method,
            'headers':headers,
            'payload':buffer
        };

        chosenHanlders(data,function(statusCode,payload){
            
            // Use the status code callback by the handler, or default to 200
            statusCode = typeof(statusCode) =='number' ? statusCode : 200;

            payload = typeof(payload) =='object' ? payload : {};

            var payloadString = JSON.stringify(payload);
            
            // Return the results
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the request path
        console.log('Returning this response : ',statusCode,payloadString);

        });

        

        
    });

    


    

});


// Start the server, and have it listen on port 3000

server.listen(config.port,function(){
    console.log("The server is listening on port "+config.port+" "+config.envName+" mode");
});


// Define handlers
var handlers  = {};

// Sample handler
handlers.hello = function(data,callback){

    callback(200,{'name':'Hi I\'Rajilesh Panoli. This is my first nodejs app.'});

}

// Not found handler
handlers.notFound = function(data,callback){

callback(404);
}


// Define routing
var router  = {
    'hello': handlers.hello
};
