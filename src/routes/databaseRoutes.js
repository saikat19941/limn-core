const express = require("express");

const router = express.Router();

const {
    fetchDatabases,
    fetchTables,
    fetchTableRows,
    insertRow,
    updateRow,
    deleteRow
} = require("../controllers/databaseController");

// DELETE ROW
router.delete("/:dbName/:tableName/:id", deleteRow);

// UPDATE ROW
router.put("/:dbName/:tableName/:id", updateRow);

// INSERT ROW
router.post("/:dbName/:tableName", insertRow);

// GET DATABASE LIST
router.get("/", fetchDatabases);

// GET TABLE LIST
router.get("/:dbName/tables", fetchTables);

// GET TABLE ROWS
router.get("/:dbName/:tableName", fetchTableRows);



module.exports = router;