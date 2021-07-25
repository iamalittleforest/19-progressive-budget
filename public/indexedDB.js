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

  // create object store
  if (db.objectStoreNames.length === 0) {
    db.createObjectStore('transactions', { autoIncrement: true });
    console.log('Transactions created!')
  }
};

// success
request.onsuccess = event => {
  console.log('Request successful!');
  db = event.target.result;

  // run checkDatabase if app is online
  if (navigator.onLine) {
    console.log('App Online!');
    checkDatabase();
  }
};

// error
request.onerror = event => {
  console.log(`Request error: ${event.target.errorCode}`);
};

// check database for records
function checkDatabase() {

  // open transaction to access object store
  let transaction = db.transaction(['transactions'], 'readwrite');
  const store = transaction.objectStore('transactions');

  // get all records
  const getAll = store.getAll();

  // success
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
          
          // clear records if returned response is not empty
          if (response.length !== 0) {
            
            // open transaction to access object store
            transaction = db.transaction(['transactions'], 'readwrite');
            const currentStore = transaction.objectStore('transactions');

            // clear existing records
            currentStore.clear();
            console.log('Clearing store');
          }
        });
    }
  };
}

// add record to object store
const saveRecord = record => {

  // open transaction to access object store
  const transaction = db.transaction(['transactions'], 'readwrite');
  const store = transaction.objectStore('transactions');

  // add record
  store.add(record);
};

// listen for online status
window.addEventListener('online', checkDatabase);