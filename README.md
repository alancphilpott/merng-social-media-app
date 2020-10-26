# Social Media App

A user can register which allows them to post on the site. Users can like each others posts and comment on them.

## Installation

After cloning, cd into the project and run...

```bash
npm install # you can also run just `npm i`
```

## Usage

The app requires a `config.js` file to be created in the root of the project.

Here is some boilerplate code to paste into the config and use in development.

```JS
module.exports = {
    MONGODB: "<your_connection_string_here>",
    SECRET_KEY: "<random_secret_key_here>"
}
```

Run the usual command in both `/` and `/client` directories.

```bash
npm install
```

To start the application, you'll require 2 terminal tabs.

```bash
npm run serve # server
npm start # client
```

See the scripts property inside package.json to view available scripts.

## Built With

-   MongoDB
-   Express
-   React
-   GraphQL
-   Apollo
