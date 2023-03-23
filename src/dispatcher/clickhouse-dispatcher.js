"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@clickhouse/client");
const winston = require('winston');

// async function clickhouse() {
//   const client = client_1.createClient({
//     host: process.env.CLICKHOUSE_HOST ?? 'http://localhost:8123',
//     username: process.env.CLICKHOUSE_USER ?? 'default',
//     password: process.env.CLICKHOUSE_PASSWORD ?? '1234',
//   })

//   await client.exec({
//     query: `
//     CREATE TABLE IF NOT EXISTS my_table
//     (id UInt64, name String)
//     ENGINE MergeTree()
//     ORDER BY (id)
//   `,
//   })

//   await client.insert({
//     table: 'my_table',
//     // structure should match the desired format, JSONEachRow in this example
//     values: [
//       { id: 42, name: 'foo' },
//       { id: 42, name: 'bar' },
//     ],
//     format: 'JSONEachRow',
//   })


//   const resultSet = await client.query({
//     query: 'SELECT * FROM my_table',
//     format: 'JSONEachRow',
//   })
//   const dataset = await resultSet.json()  SELECT * FROM test_db

//   console.log("dataset", dataset)

// }

//clickhouse();

const client = client_1.createClient({
  // host: process.env.CLICKHOUSE_HOST ?? 'http://localhost:8123',
  // username: process.env.CLICKHOUSE_USER ?? 'default',
  // password: process.env.CLICKHOUSE_PASSWORD ?? '1234',
  // host: process.env.CLICKHOUSE_HOST ,
 // username: process.env.CLICKHOUSE_USER ,
 // password: process.env.CLICKHOUSE_PASSWORD ,
  host:  'http://64.227.185.154:8123',
  username:  'clickhouse',
  password:  '*!73uK*9xLEsnhIR',
})

client.exec({
      query: `
        CREATE TABLE IF NOT EXISTS test_db
        (id UInt64, messages String)
        ENGINE MergeTree()
        ORDER BY (id)
      `,
    }).then(() => {
      console.log("table created successfully!")
    }).catch((error)  => {
      console.log("error while creating db", error);
    });


class ClickhouseDispatcher extends winston.Transport {

  constructor(options) {
    super();
  }
  log(level, msg, meta, callback) {
    
    client.insert({
      table: 'test_db',
      // structure should match the desired format, JSONEachRow in this example
      values: [
        { id: 42, messages: JSON.stringify(msg) }
      ],
      format: 'JSONEachRow',
    }).then(() => {
      console.log("data inserted successfully!", meta)
      callback()
    }).catch((error)  => {
      console.log("error while inserting data", error);
    });
  }
}

async function clickhouse(callback) {

  const resultSet = await client.query({
    query: 'SELECT * FROM test_db',
    format: 'JSONEachRow',
  })
  const dataset = await resultSet.json()

  //console.log("dataset", dataset)
  if(dataset) {
    console.log("93 dataset")
    callback(null, dataset)
  } else {
    console.log("96 dataset")
    callback(null, null)
  }
  
  

}


winston.transports.clickhouse = ClickhouseDispatcher;

module.exports = { ClickhouseDispatcher,  clickhouse};
