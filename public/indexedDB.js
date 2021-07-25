// define global variables
let db;
let budgetVersion;

// create budgetdb database
const request = indexedDB.open('budgetdb', budgetVersion || 1);

// upgrade needed (or no database exists)
request.onupgradeneeded = event => {

  // version is outdated
  const oldVersion = event;
  const newVersion = event.newVersion || db.version;
  console.log(`DB updated from version ${oldVersion} to ${newVersion}`);

  db = event.target.result;

  // create Transaction object store
  if (db.objectStoreNames.length === 0) {
    db.createObjectStore('transactions', { autoIncrement: true });
    console.log('Transactions created!')
  }
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