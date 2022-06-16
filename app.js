//set up the server
const express = require("express");
const res = require("express/lib/response");
const logger = require("morgan");
const app = express();

const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT;

//Configure Express to use EJS
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

const db = require('./db/db_pool');

//configure Auth0
const { auth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENTID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASEURL
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

//configure express to parse URL-encoded POST request bodies (trad forms)
app.use(express.urlencoded({extended : false}));

//defining middleware, logs all incoming requests
app.use(logger("dev"));

//define middleware that serves static resources in the public directory
app.use(express.static(__dirname + '/public'));

// req.isAuthenticated is provided from the auth router
app.get('/testLogin', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
  });

const { requiresAuth } = require('express-openid-connect');

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

//defining middleware, runs before other reqs are touched
app.use((req, res, next) => {
    next(); //run, next=function call, repeat
});

// define a route for the default home page
app.get( "/", ( req, res ) => {
    res.render('index');
} );

const read_books_all_sql = `
    SELECT
        id, title, rating, genre, author
    FROM
        books
    WHERE
        email = ?
    ORDER BY
        title
`

// define a route for the stuff inventory page
app.get( "/inventory", requiresAuth(), ( req, res ) => {
    //taking data from db and send back to user
    db.execute(read_books_all_sql, (error, results) => {
        if (error)
            res.status(500).send(error); //500 = internal server error, error is object w/ info
        else
            res.render('inventory', { inventory : results, username : req.oidc.user.name});
        
    });
} );

const read_books_item_sql = `
    SELECT
        id, title, rating, genre, author
    FROM
        books
    WHERE id = ?
    AND email = ?
`

// define a route for the item detail page
app.get( "/inventory/detail/:id", requiresAuth(), ( req, res ) => { //: denotes param
    db.execute(read_books_item_sql, [req.params.id, rec.oidc.user.email], (error, results) =>{
        if (error)
            res.status(500).send(error);
        else if (results.length == 0)
            res.status(404).send(`No item found with id = "${req.params.id}"`);
        else{
            let data = results[0];
            res.render('detail', data);
        }
    })
} );

const delete_books_sql = `
    DELETE
    FROM 
        books
    WHERE 
        id = ?
        AND email = ?
`

app.get("/inventory/detail/:id/delete", (req, res) => {
    db.execute(delete_books_sql, [req.params.id, req.oidc.email], (error, results) => {
        if (error)
            res.status(500).send(error);
        else {
            res.redirect("/inventory");
        }
    })
})

const create_book_sql = `
    INSERT INTO books
        (title, rating, genre, author, email)
    VALUES
        (?,?,?,?,?)
`

//creates book from form vals
app.post("/inventory", requiresAuth(), (req, res) => {
    db.execute(create_book_sql, [req.body.title, req.body.rating, req.body.genre, req.body.author], (error, results) => {
        if (error)
            res.status(500).send(error);
        else 
            res.redirect(`/inventory/detail/${results.insertId}`);
    })
})

const update_book_sql = `
    UPDATE
        books
    SET
        title = ?,
        rating = ?,
        genre = ?,
        author = ?
    WHERE
        id = ?
        AND email = ?
`
app.post("/inventory/detail/:id", requiresAuth(), (req, res) => {
    db.execute(update_book_sql, [req.body.title, req.body.rating, req.body.genre, req.body.author, req.params.id, req.oidc.user.email], (error, results) => {
        if (error)
            res.status(500).send(error);
        else
            res.redirect(`/inventory/detail/${req.params.id}`);
    })
})
// start the server
app.listen( port, () => { //runs once server is fully started
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );