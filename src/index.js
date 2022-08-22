 /**
 * Summary.
 *
 * Description.
 *
 * @file    This file test all mongodb functions.
 * @author  ptts
 * @since   2022-08-19
 */

const {sleep} = require("./thread-mng");
const {connect, createDatabase, isExistDatabase, useDatabase, closeDatabase, showDatabases, useCollection, showCollections, createCollection, deleteCollection, isExistCollection, insertDocument, insertDocuments, updateDocument, updateDocuments, selectDocuments, deleteDocuments, joinCollection} = require("./mongodb-mng");
require("dotenv/config");

async function mongodb_all_test() {

  console.log("======= start all-test =======");

  console.log("======= 01 : environment config =======");

  console.log(`DB_HOST=${process.env.DB_HOST}`);
  console.log(`DB_PORT=${process.env.DB_PORT}`);
  console.log(`DB_USER=${process.env.DB_USER}`);
  console.log(`DB_PASSWORD=${process.env.DB_PASSWORD}`);
  console.log(`DB_DATABASE=${process.env.DB_DATABASE}`);

  console.log("======= 02 : connect =======");

  let conn = await connect(process.env.DB_HOST, process.env.DB_PORT, process.env.DB_USER, process.env.DB_PASSWORD);

  await showDatabases((result) => {
    console.log("=============== showDatabases ===============");
    console.log(result);
  }, process.env.DB_HOST, process.env.DB_PORT, process.env.DB_USER, process.env.DB_PASSWORD);

  console.log("======= 03 : create document =======");

  console.log("isExistDocumet : ", process.env.DB_DATABASE, " : ", await isExistDatabase(conn, process.env.DB_DATABASE));

//  await createDatabase(conn, process.env.DB_DATABASE);

  let db = await useDatabase(conn, process.env.DB_DATABASE);

  await showCollections((result) => {
    console.log("============== showCollections ================");
    console.log(result);
  }, db);

  console.log("======= 04 : use collection =======");

  console.log("isExistCollection : bbb : ", await isExistCollection(db, "bbb"));

  let collection_name = "customers";

  console.log("isExistCollection : ", collection_name, " : ", await isExistCollection(db, collection_name));

//  let collection = await createCollection(db, collection_name);

  let collection = await useCollection(db, collection_name);

//  await deleteCollection(db, "aaa");
/*
  await deleteDocuments(collection);

  await insertDocument(collection, { name: "Company Inc", address: "Highway 37" });

  var values = [
    { name: 'John', address: 'Highway 71'},
    { name: 'Peter', address: 'Lowstreet 4'},
    { name: 'Amy', address: 'Apple st 652'},
    { name: 'Hannah', address: 'Mountain 21'},
    { name: 'Michael', address: 'Valley 345'},
    { name: 'Sandy', address: 'Ocean blvd 2'},
    { name: 'Betty', address: 'Green Grass 1'},
    { name: 'Richard', address: 'Sky st 331'},
    { name: 'Susan', address: 'One way 98'},
    { name: 'Vicky', address: 'Yellow Garden 2'},
    { name: 'Ben', address: 'Park Lane 38'},
    { name: 'William', address: 'Central st 954'},
    { name: 'Chuck', address: 'Main Road 989'},
    { name: 'Viola', address: 'Sideway 1633'}
  ];

  await insertDocuments(collection, values);

  await sleep(1000);

  await updateDocument(collection, { name: "Company Inc", address: "Highway 37" }, { name: "Company Inc", address: "Highway 38" });

  await sleep(1000);

  await updateDocuments(collection, { address: /^S/ }, {name: "Minnie"});

  await sleep(1000);

  await selectDocuments((result) => {
    console.log("=============Find All=================");
    console.log(result);
  }, collection);

  await selectDocuments((result) => {
    console.log("=============Show/Hide Field=================");
    console.log(result);
  }, collection, { projection: { _id: 0, name: 1, address: 1 } });

  await selectDocuments((result) => {
    console.log("==============Filter================");
    console.log(result);
  }, collection, undefined, { address: /^S/ });

  //{ name: 1 } // ascending
  //{ name: -1 } // descending

  await selectDocuments((result) => {
    console.log("===============Sort/Limit===============");
    console.log(result);
  }, collection, undefined , undefined, { name: 1 }, 3, 5);

  await sleep(1000);

  await deleteDocuments(collection, { address: 'Mountain 21' });
*/
//====================================================================

// await createCollection(db, "order");

  let collOrders = await useCollection(db, "orders");

//  await insertDocument(collOrders, { _id: 11, product_id: 154, status: 1 });

// await createCollection(db, "products");

  let collProduct = await useCollection(db, "products");
/*
  await insertDocuments(collProduct, [
    { _id: 154, name: 'Chocolate Heaven' },
    { _id: 155, name: 'Tasty Lemons' },
    { _id: 156, name: 'Vanilla Dreams' }
  ]);
*/
  await sleep(1000);

  await joinCollection((result) => {
    console.log("===============Join===============");
    console.log(result);
  }, 
  collOrders, 
  {
     from: 'products',
     localField: 'product_id',
     foreignField: '_id',
     as: 'orderdetails'
  });

  await sleep(1000);

  await closeDatabase(conn);

  console.log("======= end all-test =======");
}

(async () => {
  await mongodb_all_test();
})();