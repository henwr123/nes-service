const config = require("../config");

const db = require("knex")({
    client: "pg",
    connection: {
      host: config.db.host,
      user: config.db.user,
      password: config.db.password
    }
  });

  /*
  db.schema
  .hasTable("developers")
  .then((exists) => {
    if (!exists) {
      console.log(`Creating table 'developers'`);
      return db.schema.createTable("developers", (table) => {
        table.increments();
        table.string("name").notNullable();
        table.timestamps(true, true);
      });
    }
  })
  .then(() => {
    console.log(`Tables created succesfully`);
    process.exit(0);
  })
  .catch(err => {
    console.log(`Unable to init tables : ${err}`);
    process.exit(1);
  });
  */