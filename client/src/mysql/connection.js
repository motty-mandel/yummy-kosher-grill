import mysql from 'mysql2';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'appuser',
    password: 'Minemysql21515',
    database: 'yummy_kosher_grill',
    waitForConnections: true,
    connectionLimit: 10
});

connection.connect(err => {
    if (err) throw err;
    console.log('Connected!');
});

// Executing a query
connection.query('SELECT * FROM menu', (err, rows, fields) => {
    if (err) throw err;
    console.log('Data received from Db:\n', rows);
});

connection.end();