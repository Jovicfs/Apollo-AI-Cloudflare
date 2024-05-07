const database = {};

// Function to create a new collection (table)
function createCollection(collectionName) {
    database[collectionName] = [];
}

// Function to insert a document (row) into a collection
function insertDocument(collectionName, document) {
    if (!database[collectionName]) {
        throw new Error('Table does not exist');
    }
    database[collectionName].push(document);
}

// Function to find documents in a collection
function findDocuments(collectionName, query) {
    if (!database[collectionName]) {
        throw new Error('Collection does not exist');
    }
    if (!query) {
        return database[collectionName];
    }
    return database[collectionName].filter(doc => {
        for (const key in query) {
            if (doc[key] !== query[key]) {
                return false;
            }
        }
        return true;
    });
}
