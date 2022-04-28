const db = require("./db_connection");

//delete the table if it exists
const drop_books_table_sql = "DROP TABLE IF EXISTS books";

db.execute(drop_books_table_sql);
//create table with suitable columns, etc

const create_books_table_sql = `
CREATE TABLE books (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    rating INT NULL,
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
db.execute(insert_books_table_sql, ["Title1", 1, "Fiction", "lastname"]);
db.execute(insert_books_table_sql, ["Title2", 2, "Nonfiction", null]);
db.execute(insert_books_table_sql, ["Title3", 3, null, null]);
db.execute(insert_books_table_sql, ["Title4", null, null, null]);

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