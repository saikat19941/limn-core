const {
    getAllDatabases,
    getTablesFromDatabase,
    fetchRowsFromTable,
    getTableColumns,
    insertRowIntoTable,
    updateRowInTable,
    deleteRowFromTable,
    createAuditLog
} = require("../services/databaseService");

const { isValidIdentifier } = require("../utils/validators");

const { getIO } = require("../sockets/socketManager");


// =============================
// DATABASE LIST
// =============================
const fetchDatabases = async (req, res) => {

    try {

        const databases = await getAllDatabases();

        res.json({
            success: true,
            databases
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed To Fetch Databases"
        });

    }

};


// =============================
// FETCH TABLES
// =============================
const fetchTables = async (req, res) => {

    try {

        const { dbName } = req.params;

        const tables = await getTablesFromDatabase(dbName);

        res.json({
            success: true,
            database: dbName,
            tables
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed To Fetch Tables"
        });

    }

};


// =============================
// FETCH TABLE ROWS
// =============================
const fetchTableRows = async (req, res) => {

    try {

        const { dbName, tableName } = req.params;

        // Validate DB Name
        if (!isValidIdentifier(dbName)) {

            return res.status(400).json({
                success: false,
                message: "Invalid Database Name"
            });

        }

        // Validate Table Name
        if (!isValidIdentifier(tableName)) {

            return res.status(400).json({
                success: false,
                message: "Invalid Table Name"
            });

        }

        // Get Table Columns
        const columnsData = await getTableColumns(
            dbName,
            tableName
        );

        // Extract Column Names
        const validColumns = columnsData.map(
            column => column.Field
        );

        // Query Params
        const {
            page = 1,
            limit = 10,
            sortBy,
            order = "ASC",
            ...filters
        } = req.query;

        // Validate Sort Column
        if (sortBy && !validColumns.includes(sortBy)) {

            return res.status(400).json({
                success: false,
                message: "Invalid Sort Column"
            });

        }

        // Validate Filter Columns
        for (const key of Object.keys(filters)) {

            let columnName = key;

            const operators = [
                "_gt",
                "_lt",
                "_gte",
                "_lte",
                "_ne",
                "_like"
            ];

            for (const operator of operators) {

                if (columnName.endsWith(operator)) {

                    columnName = columnName.replace(operator, "");

                }

            }

            if (!validColumns.includes(columnName)) {

                return res.status(400).json({
                    success: false,
                    message: `Invalid Filter Column: ${columnName}`
                });

            }

        }

        // Fetch Rows
        const rows = await fetchRowsFromTable(
            dbName,
            tableName,
            {
                page: Number(page),
                limit: Number(limit),
                sortBy,
                order,
                filters
            }
        );

        res.json({
            success: true,
            database: dbName,
            table: tableName,
            page: Number(page),
            limit: Number(limit),
            total: rows.length,
            data: rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed To Fetch Table Rows"
        });

    }

};


// =============================
// INSERT ROW
// =============================
const insertRow = async (req, res) => {

    try {

        const { dbName, tableName } = req.params;

        const data = req.body;

        // Empty Body Check
        if (!data || Object.keys(data).length === 0) {

            return res.status(400).json({
                success: false,
                message: "Request Body Required"
            });

        }

        // Validate DB Name
        if (!isValidIdentifier(dbName)) {

            return res.status(400).json({
                success: false,
                message: "Invalid Database Name"
            });

        }

        // Validate Table Name
        if (!isValidIdentifier(tableName)) {

            return res.status(400).json({
                success: false,
                message: "Invalid Table Name"
            });

        }

        // Get Table Columns
        const columnsData = await getTableColumns(
            dbName,
            tableName
        );

        // Extract Valid Columns
        const validColumns = columnsData.map(
            column => column.Field
        );

        // Validate Body Fields
        for (const key of Object.keys(data)) {

            if (!validColumns.includes(key)) {

                return res.status(400).json({
                    success: false,
                    message: `Invalid Column: ${key}`
                });

            }

        }

        // Insert Data
        const result = await insertRowIntoTable(
            dbName,
            tableName,
            data
        );

        // Emit Socket Event
        getIO()
            .to(`${dbName}.${tableName}`)
            .emit("row_inserted", {
                database: dbName,
                table: tableName,
                insertedId: result.insertId,
                data
            });

        // Audit Log
        await createAuditLog({

            user_type:
                req.headers["x-api-key"]
                    ? "api_key"
                    : "jwt",

            user_identifier:
                req.user?.email ||
                req.user?.apiKey ||
                "unknown",

            action_type: "INSERT",

            database_name: dbName,

            table_name: tableName,

            row_id: result.insertId,

            action_data: data,

            ip_address: req.ip

        });

        res.json({
            success: true,
            message: "Row Inserted Successfully",
            insertedId: result.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed To Insert Row"
        });

    }

};


// =============================
// UPDATE ROW
// =============================
const updateRow = async (req, res) => {

    try {

        const { dbName, tableName, id } = req.params;

        const data = req.body;

        // Empty Body Check
        if (!data || Object.keys(data).length === 0) {

            return res.status(400).json({
                success: false,
                message: "Request Body Required"
            });

        }

        // Validate DB Name
        if (!isValidIdentifier(dbName)) {

            return res.status(400).json({
                success: false,
                message: "Invalid Database Name"
            });

        }

        // Validate Table Name
        if (!isValidIdentifier(tableName)) {

            return res.status(400).json({
                success: false,
                message: "Invalid Table Name"
            });

        }

        // Get Table Columns
        const columnsData = await getTableColumns(
            dbName,
            tableName
        );

        // Extract Valid Columns
        const validColumns = columnsData.map(
            column => column.Field
        );

        // Validate Body Fields
        for (const key of Object.keys(data)) {

            if (!validColumns.includes(key)) {

                return res.status(400).json({
                    success: false,
                    message: `Invalid Column: ${key}`
                });

            }

        }

        // Update Data
        const result = await updateRowInTable(
            dbName,
            tableName,
            id,
            data
        );

        // Emit Socket Event
        getIO()
            .to(`${dbName}.${tableName}`)
            .emit("row_updated", {
                database: dbName,
                table: tableName,
                rowId: id,
                updatedData: data
            });

        // Audit Log
        await createAuditLog({

            user_type:
                req.headers["x-api-key"]
                    ? "api_key"
                    : "jwt",

            user_identifier:
                req.user?.email ||
                req.user?.apiKey ||
                "unknown",

            action_type: "UPDATE",

            database_name: dbName,

            table_name: tableName,

            row_id: id,

            action_data: data,

            ip_address: req.ip

        });

        res.json({
            success: true,
            message: "Row Updated Successfully",
            affectedRows: result.affectedRows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed To Update Row"
        });

    }

};


// =============================
// DELETE ROW
// =============================
const deleteRow = async (req, res) => {

    try {

        const { dbName, tableName, id } = req.params;

        // Validate DB Name
        if (!isValidIdentifier(dbName)) {

            return res.status(400).json({
                success: false,
                message: "Invalid Database Name"
            });

        }

        // Validate Table Name
        if (!isValidIdentifier(tableName)) {

            return res.status(400).json({
                success: false,
                message: "Invalid Table Name"
            });

        }

        // Delete Row
        const result = await deleteRowFromTable(
            dbName,
            tableName,
            id
        );

        // Emit Socket Event
        getIO()
            .to(`${dbName}.${tableName}`)
            .emit("row_deleted", {
                database: dbName,
                table: tableName,
                rowId: id
            });

        // Audit Log
        await createAuditLog({

            user_type:
                req.headers["x-api-key"]
                    ? "api_key"
                    : "jwt",

            user_identifier:
                req.user?.email ||
                req.user?.apiKey ||
                "unknown",

            action_type: "DELETE",

            database_name: dbName,

            table_name: tableName,

            row_id: id,

            action_data: null,

            ip_address: req.ip

        });

        res.json({
            success: true,
            message: "Row Deleted Successfully",
            affectedRows: result.affectedRows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed To Delete Row"
        });

    }

};


module.exports = {
    fetchDatabases,
    fetchTables,
    fetchTableRows,
    insertRow,
    updateRow,
    deleteRow
};