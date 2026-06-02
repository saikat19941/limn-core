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
        
        const [rows] = await pool.query(
            query,
            values
        );
        //ekhane korte hobe ??
        // Count Query

        let countQuery = `
            SELECT COUNT(*) as totalRows
            FROM \`${databaseName}\`.\`${tableName}\`
        `;

        const countValues = [];

        if (filterKeys.length > 0) {

            const conditions = [];

            for (const key of filterKeys) {

                const value = filters[key];

                if (key.endsWith("_gt")) {

                    const column = key.replace("_gt", "");

                    conditions.push(`\`${column}\` > ?`);

                    countValues.push(value);

                }

                else if (key.endsWith("_lt")) {

                    const column = key.replace("_lt", "");

                    conditions.push(`\`${column}\` < ?`);

                    countValues.push(value);

                }

                else if (key.endsWith("_gte")) {

                    const column = key.replace("_gte", "");

                    conditions.push(`\`${column}\` >= ?`);

                    countValues.push(value);

                }

                else if (key.endsWith("_lte")) {

                    const column = key.replace("_lte", "");

                    conditions.push(`\`${column}\` <= ?`);

                    countValues.push(value);

                }

                else if (key.endsWith("_ne")) {

                    const column = key.replace("_ne", "");

                    conditions.push(`\`${column}\` != ?`);

                    countValues.push(value);

                }

                else if (key.endsWith("_like")) {

                    const column = key.replace("_like", "");

                    conditions.push(`\`${column}\` LIKE ?`);

                    countValues.push(`%${value}%`);

                }

                else {

                    conditions.push(`\`${key}\` = ?`);

                    countValues.push(value);

                }

            }

            countQuery += `
                WHERE ${conditions.join(" AND ")}
            `;

        }

        const [countRows] = await pool.query(
            countQuery,
            countValues
        );

        return {

            rows,

            totalRows:
                countRows[0].totalRows

        };
        

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

// Find User By Email
const findUserByEmail = async (email) => {

    try {

        const query = `
            SELECT *
            FROM limn_core.users
            WHERE email = ?
            LIMIT 1
        `;

        const [rows] = await pool.query(
            query,
            [email]
        );

        return rows[0];

    } catch (error) {

        throw error;

    }

};

// Find API Key
const findApiKey = async (apiKey) => {

    try {

        const query = `
            SELECT *
            FROM limn_core.api_keys
            WHERE api_key = ?
            AND is_active = TRUE
            LIMIT 1
        `;

        const [rows] = await pool.query(
            query,
            [apiKey]
        );

        return rows[0];

    } catch (error) {

        throw error;

    }

};

// Update API Key Usage
const updateApiKeyUsage = async (id) => {

    try {

        const query = `
            UPDATE limn_core.api_keys
            SET
                used_hits = used_hits + 1,
                last_used_at = NOW()
            WHERE id = ?
        `;

        await pool.query(query, [id]);

    } catch (error) {

        throw error;

    }

};

// Create Audit Log
const createAuditLog = async (logData) => {

    try {

        const query = `
            INSERT INTO limn_core.audit_logs (

                user_type,
                user_identifier,
                action_type,
                database_name,
                table_name,
                row_id,
                action_data,
                ip_address

            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await pool.query(query, [

            logData.user_type,
            logData.user_identifier,
            logData.action_type,
            logData.database_name,
            logData.table_name,
            logData.row_id,
            JSON.stringify(logData.action_data),
            logData.ip_address

        ]);

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
    deleteRowFromTable,
    findUserByEmail,
    findApiKey,
    updateApiKeyUsage,
    createAuditLog
};