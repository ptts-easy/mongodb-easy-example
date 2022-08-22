const Mongo = require('mongodb').MongoClient;

async function connect(host, port, user, password) {
  
  let url = `mongodb://${host}:${port}/`;

  const client = new Mongo(url);

  await client.connect();
  
  console.log('Connected successfully to server');

  return client;
}

async function useDatabase(conn, document) {
  const db = await conn.db(document);
  return db;
}

async function closeDatabase(conn) {
  
  await conn.close();
}

async function showDatabases(callback, host, port, user, password) {
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

async function createDatabase(conn, document) {
  const db = await conn.db(document);

  await db.createCollection("aaa");
}

async function isExistDatabase(conn, document) {
  return 1;
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
  await db.collection(collection).drop(function(err, delOK) {
    if (err) throw err;
    if (delOK) console.log("Collection deleted");
  });
}

async function isExistCollection(db, collection) {
  return await db.collection(collection).count({}, { limit: 1 });
}

async function insertDocument(collection, value) {
  await collection.insertOne(value, function(err, res) {
    if (err) throw err;
  });
}

async function insertDocuments(collection, values) {
  await collection.insertMany(values, function(err, res) {
    if (err) throw err;
  });
}

async function updateDocument(collection, query, newvalue) {
  await collection.updateOne(query, { $set: newvalue }, function(err, res) {
    if (err) throw err;
  });
}

async function updateDocuments(collection, query, newvalues) {
  collection.updateMany(query, {$set: newvalues}, function(err, res) {
    if (err) throw err;
  });
}

async function selectDocuments(callback, collection, field = undefined, where = undefined, sort = undefined, offset = undefined, limit = undefined) {
  let res = undefined;

  if(field != undefined) {
    if (where != undefined) {
      res = await collection.find(where, field);
    } else {
      res = await collection.find({}, field);
    }
  } else {
    if (where != undefined) {
      res = await collection.find(where);
    } else {
      res = await collection.find({});
    }
  }

  if (sort != undefined) {
    res = await res.sort(sort);
  }

  if (offset != undefined) {
    res = await res.skip(offset);
  }

  if (limit != undefined) {
    res = await res.limit(limit);
  }

  if (res != undefined) {
    callback(await res.toArray());
  }
}

async function deleteDocuments(collection, query = undefined) {
  collection.deleteMany(query, function(err, obj) {
    if (err) throw err;
    console.log(" document(s) deleted");
  });
}

async function joinCollection(callback, collection, join) {

  let res = await collection.aggregate([{ $lookup: join }]);
  if (res != undefined) {
    let documents = [];
    res = await res.toArray();
    res.forEach(order => documents.push(JSON.stringify(order)));
    callback(documents);
  }
}

module.exports = {
  connect, 
  createDatabase, 
  isExistDatabase, 
  useDatabase, 
  closeDatabase, 
  showDatabases, 
  useCollection, 
  showCollections, 
  createCollection, 
  deleteCollection, 
  isExistCollection, 
  insertDocument, 
  insertDocuments, 
  updateDocument, 
  updateDocuments, 
  selectDocuments, 
  deleteDocuments, 
  joinCollection
};