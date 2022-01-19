# jest-mysql ![](https://github.com/Daniel-Yonkov/jest-mysql/workflows/Build/badge.svg) [![codecov](https://codecov.io/gh/Daniel-Yonkov/jest-mysql/branch/master/graph/badge.svg)](https://codecov.io/gh/Daniel-Yonkov/jest-mysql)

> Jest preset for easier setup of MySQL storage.

## Resume

- Allows MySQL schema import for testing database before tests are run - See [option definition](#21-option-definitions)
- Allows custom action hooks after [globalSetup](https://jestjs.io/docs/en/next/configuration#globalsetup-string) - See [Setup Hooks](#4-setup-hooks)
- Allows database truncation after tests have finished ([globalTeardown](https://jestjs.io/docs/en/next/configuration#globalsetup-string)) - See [option definition](#21-option-definitions)

## Install

```bash
npm install jest-mysql --save-dev
```

Or if you use `yarn`

```bash
yarn add jest-mysql --dev
```

Make sure `jest` and `mysql` are installed as well in the project, as they are required as peer dependencies.

### 1. Configure `jest` to use preset

In order for `jest` to know about this preset, you needs to configure it.
You could choose one of the following methods, for further reference checkout the jest documentation on [configuration](https://jestjs.io/docs/en/next/configuration) and [presets](https://jestjs.io/docs/en/next/configuration#preset-string)

- Within `package.json`

```js
{
  "jest": {
        "preset": "jest-mysql",
        //any other jest configurations
    },
    //rest of package.json configuration
}
```

- Create `jest.config.js` into your root directory

```js
module.exports = {
  preset: "jest-mysql"
  //any other configuration
};
```

If you have a custom `jest.config.js` make sure you remove `testEnvironment` property, otherwise it will conflict with the preset.

### 2. Create `jest-mysql-config.js`

Within the current working directory, create `jest-mysql-config.js`.
I.E.

```js
module.exports = {
  databaseOptions: {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "test"
  },
  createDatabase: true,
  dbSchema: "DB_creation.sql",
  truncateDatabase: false
};
```

#### 2.1 Option definitions:

- `databaseOptions` - **Required** {Object} Connection options used to be used by the MySQL client
  For further info regarding what parameters are supported, check [this reference](https://github.com/mysqljs/mysql#connection-options)
- `createDatabase` - **Optional** {Boolean} If this is set to true, a database will be created if database with such name does not exist in your MySQL instance
- `dbSchema` - **Optional** {String} Path to the MySQL dump schema for the database (this can be any database dump; regardless if data is exported or only the tables structure).
- `truncateDatabase`: **Optional** {Boolean} If this is set to true, the database will be truncated upon tests finishing, see [globalTeardown](https://jestjs.io/docs/en/next/configuration#globalsetup-string) for further reference

### 3. Database connection

For utility purposes, the connection to the database has been made available within the `global` context
and it can be accessed as follows:

```js
global.db;
```

### 4. Setup Hooks

If you need further customization after the database has been created and schema imported,
you could provide a custom hooks file which will be exectuted after the initial setup has been completed ( if [createDatabase](#21-option-definitions) - the database has been created and the connection has been established to the database).

- Create within the current working directory `setupHooks.js`
- The provided functions must be `async` or `Promise` based
  Example structure:

```js
const { setupDummyUsers } = require("tests/fixtures/dummyUser");

async function postSetup() {
  await setupDummyUsers();
}

module.exports = {
  postSetup
};
```

### 5. All done!

You should be able to access the connection to the database and query if needed.
Enjoy!

```js
it("should have created a database with User table and 3 dummy user records", done => {
  const users = global.db.query(
    "SELECT * FROM users",
    (error, results, fields) => {
      if (error) {
        throw error;
      }
      expect(results).toHaveLength(3);
      done();
    }
  );
});
```

You can enable debug logs by setting environment variable `DEBUG=jest-mysql:*`

## License

MIT
