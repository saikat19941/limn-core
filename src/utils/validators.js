// Validate SQL Identifier
const isValidIdentifier = (value) => {

    const regex = /^[a-zA-Z0-9_]+$/;

    return regex.test(value);

};


module.exports = {
    isValidIdentifier
};