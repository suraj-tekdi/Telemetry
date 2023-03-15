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
//   const dataset = await resultSet.json()

//   console.log("dataset", dataset)

// }

//clickhouse();

const client = client_1.createClient({
  host: process.env.CLICKHOUSE_HOST ?? 'http://localhost:8123',
  username: process.env.CLICKHOUSE_USER ?? 'default',
  password: process.env.CLICKHOUSE_PASSWORD ?? '1234',
})


class ClickhouseDispatcher extends winston.Transport {

  constructor(options) {
    super();

    client.exec({
      query: `
        CREATE TABLE IF NOT EXISTS test_db
        (id UInt64, messages String)
        ENGINE MergeTree()
        ORDER BY (id)
      `,
    }).then(() => {
      console.log("table created successfully!")
    })
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
    })
  }
}

winston.transports.clickhouse = ClickhouseDispatcher;

module.exports = { ClickhouseDispatcher };
