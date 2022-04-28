//gets exported object from db_con
const db = require("./db_connection");

//run sql, when answer comes run 2nd function
db.execute('SELECT 1 + 1 AS solution', 
    (error, results) => {
        if (error)
            throw error;
        console.log(results);
        console.log(results[0].solution);
    }
);

db.end(); //optional: close connection after queue is empty.