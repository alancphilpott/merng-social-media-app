// Dependencies
const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

// Relatives
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { MONGODB } = require("./config");

const server = new ApolloServer({
    typeDefs,
    resolvers
});

mongoose
    .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");
        return server.listen({ port: 5000 });
    })
    .then((res) => console.log(`Server Running @ ${res.url}`))
    .catch((err) => console.log(`Error Starting Server => ${err}`));
