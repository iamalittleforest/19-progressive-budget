// define global variables
let db;
let budgetVersion;

// request for budgetdb database.
const request = indexedDB.open('budgetdb', budgetVersion || 1);

// upgrade needed
request.onupgradeneeded = event => {

};

// success
request.onsuccess = event => {

};

// error
request.onerror = event => {

};

// check database for transactions
function checkDatabase() {

}

// add transaction to budget db
const saveRecord = record => {

};

// listen for online status
window.addEventListener('online', checkDatabase);