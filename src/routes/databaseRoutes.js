const express = require("express");

const router = express.Router();


// SMART ACCESS MIDDLEWARE
const {
    allowAccess
} = require("../middleware/accessMiddleware");


// ROLE MIDDLEWARE
const {
    allowRoles
} = require("../middleware/roleMiddleware");


// CONTROLLERS
const {
    fetchDatabases,
    fetchTables,
    fetchTableRows,
    insertRow,
    updateRow,
    deleteRow
} = require("../controllers/databaseController");



/*
|--------------------------------------------------------------------------
| DATABASE LIST
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    allowAccess,
    fetchDatabases
);



/*
|--------------------------------------------------------------------------
| TABLE LIST
|--------------------------------------------------------------------------
*/

router.get(
    "/:dbName/tables",
    allowAccess,
    fetchTables
);



/*
|--------------------------------------------------------------------------
| TABLE ROWS
|--------------------------------------------------------------------------
*/

router.get(
    "/:dbName/:tableName",
    allowAccess,
    fetchTableRows
);



/*
|--------------------------------------------------------------------------
| INSERT ROW
|--------------------------------------------------------------------------
*/

router.post(
    "/:dbName/:tableName",
    allowAccess,
    allowRoles("admin", "editor"),
    insertRow
);



/*
|--------------------------------------------------------------------------
| UPDATE ROW
|--------------------------------------------------------------------------
*/

router.put(
    "/:dbName/:tableName/:id",
    allowAccess,
    allowRoles("admin", "editor"),
    updateRow
);



/*
|--------------------------------------------------------------------------
| DELETE ROW
|--------------------------------------------------------------------------
*/

router.delete(
    "/:dbName/:tableName/:id",
    allowAccess,
    allowRoles("admin"),
    deleteRow
);



module.exports = router;