const { Client } = require('pg');

// Connection details
const connectionString = "postgresql://neondb_owner:9ZuqBg4cKoRS@ep-old-sunset-a1jqeoe3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

// Create a new PostgreSQL client
const client = new Client({
    connectionString: connectionString,
});

// Connect to the database
client.connect()
    .then(() => {
        console.log('Connected to the database');
        // You can start executing queries here
    })
    .catch(err => console.error('Error connecting to database', err));

module.exports = client;