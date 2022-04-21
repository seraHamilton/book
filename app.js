//set up the server
const express = require("express");
const logger = require("morgan");
const app = express();
const port = 8080;

//defining middleware, logs all incoming requests
app.use(logger("dev"));

//define middleware that serves static resources in the public directory
app.use(express.static(__dirname + '/public'));

//defining middleware, runs before other reqs are touched
app.use((req, res, next) => {
    // console.log(`${req.method} ${req.url}`);
    next(); //run, next=function call, repeat
});

// define a route for the default home page
app.get( "/", ( req, res ) => {
    res.sendFile( __dirname + "/views/index.html" );
} );

// define a route for the stuff inventory page
app.get( "/inventory", ( req, res ) => {
    res.sendFile( __dirname + "/views/inventory.html" );
} );

// define a route for the item detail page
app.get( "/inventory/detail", ( req, res ) => {
    res.sendFile( __dirname + "/views/detail.html" );
} );

// start the server
app.listen( port, () => { //runs once server is fully started
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );