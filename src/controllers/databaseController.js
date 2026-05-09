const {
    getAllDatabases,
    getTablesFromDatabase,
    fetchRowsFromTable,
    getTableColumns,
    insertRowIntoTable,
    updateRowInTable,
    deleteRowFromTable
} = require("../services/databaseService");

const { isValidIdentifier } = require("../utils/validators");

// Database List Controller
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


// Fetch Tables
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

// Fetch Table Rows
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

    
    // Remove Operators
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


    // Check Column Exists
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


// Insert Row
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

// Update Row
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

// Delete Row
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