var Mongo = require('mongodb').MongoClient;

async function connect(host, port, user, password) {
  
  let url = `mongodb://${host}:${port}/`;

  const client = new Mongo(url);

  await client.connect();
  
  console.log('Connected successfully to server');

  return client;
}

async function useDocument(conn, document) {
  const db = conn.db(document);
  return db;
}

async function closeDocument(conn) {
  
  await conn.close();
}

async function showDocuments(callback, host, port, user, password) {
  let url = `mongodb://${host}:${port}/`;

  await Mongo.connect(url, function(err, client) {
    // Use the admin database for the operation
    const adminDb = client.db("test").admin();

    // List all the available databases
    adminDb.listDatabases(function(err, dbs) {
      callback(dbs);
      client.close();
    });
  });
}

async function createDocument(conn, document) {
  const db = conn.db(document);

  db.createCollection("aaa");
}

async function useCollection(db, collection) {
  return await db.collection(collection);
}

async function showCollections(callback, db) {
  callback(await db.listCollections().toArray());
}

async function createCollection(db, collection) {
  return await db.createCollection(collection, function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
  });
}

async function deleteCollection(db, collection) {
  db.collection(collection).drop(function(err, delOK) {
    if (err) throw err;
    if (delOK) console.log("Collection deleted");
  });
}

async function insertRecord(collection, value) {
  collection.insertOne(value, function(err, res) {
    if (err) throw err;
  });
}

async function insertRecords(collection, values) {
  collection.insertMany(values, function(err, res) {
    if (err) throw err;
  });
}

async function updateRecords(collection, value, where = undefined) {
  var myquery = { address: /^S/ };
  var newvalues = {$set: {name: "Minnie"} };
  collection.updateMany(myquery, newvalues, function(err, res) {
    if (err) throw err;
  });
}

async function selectRecords(callback, collection, field = undefined, where = undefined, sort = undefined, limit = undefined, offset = undefined) {
  let res = undefined;
console.log("0");
  if(field != undefined) {
    if (where != undefined) {
      res = await collection.find(query, field);
      console.log("1");
    } else {
      res = await collection.find({}, field);
      console.log("2");
    }
  } else {
    if (where != undefined) {
      res = await collection.find(query);
      console.log("3");
    } else {
      res = await collection.find({});
      console.log("4");
      console.log(await res.toArray());
    }
  }

  if (limit != undefined) {
    res = await res.limit(limit);
    console.log("5");
  }

  if (sort != undefined) {
    res = await res.sort(sort);
    console.log("6");
  }
console.log("7");
  await res.toArray(function(err, result) {
    if (err) throw err;
    callback(result);
    console.log("8");
  });
}

async function deleteRecords(collection, query = undefined) {
  collection.deleteMany(query, function(err, obj) {
    if (err) throw err;
    console.log(" document(s) deleted");
  });
}

module.exports = {connect, createDocument, useDocument, closeDocument, showDocuments, useCollection, showCollections, createCollection, deleteCollection, insertRecord, insertRecords, updateRecords, selectRecords, deleteRecords};