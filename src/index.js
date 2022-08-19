 /**
 * Summary.
 *
 * Description.
 *
 * @file    This file test all mongodb functions.
 * @author  ptts
 * @since   2022-08-19
 */

const {connect, createDocument, useDocument, closeDocument, showDocuments, useCollection, showCollections, createCollection, deleteCollection, insertRecord, insertRecords, updateRecords, selectRecords, deleteRecords} = require("./mongodb-mng");
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

  await showDocuments((result) => {
    console.log("=============== showDocuments ===============");
    console.log(result);
  }, process.env.DB_HOST, process.env.DB_PORT, process.env.DB_USER, process.env.DB_PASSWORD);

  console.log("======= 03 : create database =======");

//  await createDocument(conn, process.env.DB_DATABASE);

  let db = await useDocument(conn, process.env.DB_DATABASE);

  await showCollections((result) => {
    console.log("============== showCollections ================");
    console.log(result);
  }, db);

  console.log("======= 04 : create table =======");

  let collection_name = "customers";

//  let collection = await createCollection(db, collection_name);

  let collection = await useCollection(db, collection_name);

//  await deleteCollection(db, "aaa");

  await deleteRecords(collection);

  await insertRecord(collection, { name: "Company Inc", address: "Highway 37" });

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

  await insertRecords(collection, values);

  await selectRecords((result) => {
    console.log("=============Find All=================");
    console.log(result);
  }, collection);
return;
  await selectRecords((result) => {
    console.log("=============Show/Hide Field=================");
    console.log(result);
  }, collection, { projection: { _id: 0, name: 1, address: 1 } });
  
  await selectRecords((result) => {
    console.log("==============Filter================");
    console.log(result);
  }, collection, undefined, { address: /^S/ });

  //{ name: 1 } // ascending
  //{ name: -1 } // descending

  await selectRecords((result) => {
    console.log("===============Sort/Limit===============");
    console.log(result);
  }, collection, undefined , undefined, { name: 1 }, 5, 3);

//  await deleteRecords(collection, { address: 'Mountain 21' });

  await closeDocument(conn);

  console.log("======= end all-test =======");
}

(async () => {
  await mongodb_all_test();
})();