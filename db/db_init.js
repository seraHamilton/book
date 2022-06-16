const db = require("./db_connection");

//delete the table if it exists
const drop_books_table_sql = "DROP TABLE IF EXISTS books";

db.execute(drop_books_table_sql);
//create table with suitable columns, etc

const create_books_table_sql = `
CREATE TABLE books (
    email VARCHAR(45) NULL,
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    rating DOUBLE NULL,
    genre VARCHAR(45) NULL,
    author VARCHAR(45) NULL,
    PRIMARY KEY (id));
`

db.execute(create_books_table_sql);

/**
 * add sample data to table
 * prepared statement: vals undetermined until later
 */
const insert_books_table_sql = `
    INSERT INTO books
        (title, rating, genre, author)
    VALUES
        (?, ?, ?, ?)
`
db.execute(insert_books_table_sql, ["The Catcher in the Rye", 4, "Fiction", "Salinger"]);
db.execute(insert_books_table_sql, ["Title2", 2, "Nonfiction", null]);
db.execute(insert_books_table_sql, ["Long Way Down", 3, null, null]);
db.execute(insert_books_table_sql, ["The Three Body Problem", null, "Sci Fi", "Cixin"]);

//read the new contents
const read_books_table_sql = "SELECT * FROM books";

db.execute(read_books_table_sql, 
    (error, results) => {
        if (error) 
            throw error;

        console.log("Table 'books' initialized with:")
        console.log(results);
    }
);

db.end();