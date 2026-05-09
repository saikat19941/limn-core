const { pool } = require("../config/db");

// Get Table Columns
const getTableColumns = async (
    databaseName,
    tableName
) => {

    try {

        const query = `
            SHOW COLUMNS
            FROM \`${databaseName}\`.\`${tableName}\`
        `;

        const [rows] = await pool.query(query);

        return rows;

    } catch (error) {

        throw error;

    }

};

// Get All Databases
const getAllDatabases = async () => {

    try {

        const [rows] = await pool.query("SHOW DATABASES");

        return rows;

    } catch (error) {

        throw error;

    }

};

// Get Tables From Database
const getTablesFromDatabase = async (databaseName) => {

    try {

        const [rows] = await pool.query(
            `SHOW TABLES FROM \`${databaseName}\``
        );

        return rows;

    } catch (error) {

        throw error;

    }

};

// Fetch Rows With Pagination
const fetchRowsFromTable = async (
    databaseName,
    tableName,
    options = {}
) => {

    try {

        const {
            page = 1,
            limit = 10,
            sortBy = null,
            order = "ASC",
            filters = {}
        } = options;


        // Offset Calculation
        const offset = (page - 1) * limit;


        // Base Query
        let query = `
            SELECT *
            FROM \`${databaseName}\`.\`${tableName}\`
        `;


        // Values
        const values = [];


        // Filtering
const filterKeys = Object.keys(filters);

if (filterKeys.length > 0) {

    const conditions = [];

    for (const key of filterKeys) {

        const value = filters[key];


        // GREATER THAN
        if (key.endsWith("_gt")) {

            const column = key.replace("_gt", "");

            conditions.push(`\`${column}\` > ?`);

            values.push(value);

        }


        // LESS THAN
        else if (key.endsWith("_lt")) {

            const column = key.replace("_lt", "");

            conditions.push(`\`${column}\` < ?`);

            values.push(value);

        }


        // GREATER THAN EQUAL
        else if (key.endsWith("_gte")) {

            const column = key.replace("_gte", "");

            conditions.push(`\`${column}\` >= ?`);

            values.push(value);

        }


        // LESS THAN EQUAL
        else if (key.endsWith("_lte")) {

            const column = key.replace("_lte", "");

            conditions.push(`\`${column}\` <= ?`);

            values.push(value);

        }


        // NOT EQUAL
        else if (key.endsWith("_ne")) {

            const column = key.replace("_ne", "");

            conditions.push(`\`${column}\` != ?`);

            values.push(value);

        }


        // LIKE SEARCH
        else if (key.endsWith("_like")) {

            const column = key.replace("_like", "");

            conditions.push(`\`${column}\` LIKE ?`);

            values.push(`%${value}%`);

        }


        // NORMAL EQUAL
        else {

            conditions.push(`\`${key}\` = ?`);

            values.push(value);

        }

    }


    query += ` WHERE ${conditions.join(" AND ")}`;

}


        // Sorting
        if (sortBy) {

            query += `
                ORDER BY \`${sortBy}\`
                ${order === "DESC" ? "DESC" : "ASC"}
            `;

        }


        // Pagination
        query += `
            LIMIT ?
            OFFSET ?
        `;

        values.push(Number(limit));
        values.push(Number(offset));


        // Execute Query
        const [rows] = await pool.query(query, values);


        return rows;

    } catch (error) {

        throw error;

    }

};

// Insert Row Into Table
const insertRowIntoTable = async (
    databaseName,
    tableName,
    data
) => {

    try {

        // Columns
        const columns = Object.keys(data);


        // Values
        const values = Object.values(data);


        // Generate Placeholders
        const placeholders = columns.map(() => "?").join(", ");


        // Generate Column Names
        const columnNames = columns
            .map(column => `\`${column}\``)
            .join(", ");


        // Final Query
        const query = `
            INSERT INTO \`${databaseName}\`.\`${tableName}\`
            (${columnNames})
            VALUES (${placeholders})
        `;


        // Execute Query
        const [result] = await pool.query(
            query,
            values
        );


        return result;

    } catch (error) {

        throw error;

    }

};

// Update Row
const updateRowInTable = async (
    databaseName,
    tableName,
    id,
    data
) => {

    try {

        // Columns
        const columns = Object.keys(data);


        // Values
        const values = Object.values(data);


        // Generate SET Clause
        const setClause = columns
            .map(column => `\`${column}\` = ?`)
            .join(", ");


        // Final Query
        const query = `
            UPDATE \`${databaseName}\`.\`${tableName}\`
            SET ${setClause}
            WHERE id = ?
        `;


        // Add ID
        values.push(id);


        // Execute Query
        const [result] = await pool.query(
            query,
            values
        );


        return result;

    } catch (error) {

        throw error;

    }

};

// Delete Row
const deleteRowFromTable = async (
    databaseName,
    tableName,
    id
) => {

    try {

        const query = `
            DELETE FROM \`${databaseName}\`.\`${tableName}\`
            WHERE id = ?
        `;

        const [result] = await pool.query(
            query,
            [id]
        );

        return result;

    } catch (error) {

        throw error;

    }

};

module.exports = {
    getAllDatabases,
    getTablesFromDatabase,
    fetchRowsFromTable,
    getTableColumns,
    insertRowIntoTable,
    updateRowInTable,
    deleteRowFromTable
};