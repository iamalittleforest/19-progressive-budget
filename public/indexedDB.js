// define global variables
let db;

// create budgetdb database
const request = indexedDB.open('budgetdb', 1);

// if upgrade needed (or no database exists)
request.onupgradeneeded = event => {
  console.log('Upgrade needed');
  db = event.target.result;

  // create object store
  if (db.objectStoreNames.length === 0) {
    db.createObjectStore('transactions', { autoIncrement: true });
    console.log('Object Store created!')
  }
};

// if success
request.onsuccess = event => {
  console.log('Request successful!');
  db = event.target.result;

  // run checkDatabase if app is online
  if (navigator.onLine) {
    console.log('App Online!');
    checkDatabase();
  }
};

// if error
request.onerror = event => {
  console.log(`Request error: ${event.target.errorCode}`);
};

// check database for records
function checkDatabase() {

  // open transaction to access object store
  let transaction = db.transaction(['transactions'], 'readwrite');
  const objectStore = transaction.objectStore('transactions');

  // get all records
  const getAll = objectStore.getAll();

  // if success
  getAll.onsuccess = () => {

    // fetch records from api if records are present
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(response => {
          
          // clear records after fetch
          if (response.length !== 0) {
            
            // open transaction to access object store
            transaction = db.transaction(['transactions'], 'readwrite');
            const currentStore = transaction.objectStore('transactions');

            // clear existing records
            currentStore.clear();
            console.log('IndexedDB cleared!');
          }
        });
    }
  };

  // if error
  getAll.onerror = () => {
    console.log(`Request error: ${target.errorCode}`);
  };
}

// add record to object store
const saveRecord = record => {

  // open transaction to access object store
  const transaction = db.transaction(['transactions'], 'readwrite');
  const objectStore = transaction.objectStore('transactions');

  // add record
  objectStore.add(record);
  console.log('Record Added!');
};

// listen for online status
window.addEventListener('online', checkDatabase);