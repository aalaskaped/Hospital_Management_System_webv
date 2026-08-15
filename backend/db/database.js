// Database connection and initialization module
// This module handles all database operations using SQLite3

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Path to SQLite database file
const dbPath = path.join(__dirname, '../database/hospital.db');

// Create or open SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database at:', dbPath);
        // Initialize database with schema on startup
        initializeDatabase();
    }
});

/**
 * Initialize database schema on startup
 * Reads schema.sql and executes it to create tables if they don't exist
 */
function initializeDatabase() {
    const schemaPath = path.join(__dirname, '../schema.sql');
    
    fs.readFile(schemaPath, 'utf8', (err, sql) => {
        if (err) {
            console.error('Error reading schema.sql:', err.message);
            return;
        }
        
        // Execute all SQL statements in schema.sql
        db.exec(sql, (err) => {
            if (err) {
                console.error('Error initializing database:', err.message);
            } else {
                console.log('Database schema initialized successfully');
            }
        });
    });
}

/**
 * Wrapper for database.run() - for INSERT, UPDATE, DELETE operations
 * Returns a Promise to support async/await
 * 
 * @param {string} sql - SQL query string
 * @param {array} params - Query parameters (values to be inserted)
 * @returns {Promise} - Resolves with lastID and changes, rejects with error
 */
function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    id: this.lastID,
                    changes: this.changes
                });
            }
        });
    });
}

/**
 * Wrapper for database.get() - for SELECT operations (single row)
 * Returns a Promise to support async/await
 * 
 * @param {string} sql - SQL query string
 * @param {array} params - Query parameters
 * @returns {Promise} - Resolves with single row data, rejects with error
 */
function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

/**
 * Wrapper for database.all() - for SELECT operations (multiple rows)
 * Returns a Promise to support async/await
 * 
 * @param {string} sql - SQL query string
 * @param {array} params - Query parameters
 * @returns {Promise} - Resolves with array of rows, rejects with error
 */
function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Export database instance and helper functions
module.exports = {
    db,
    run,
    get,
    all
};
