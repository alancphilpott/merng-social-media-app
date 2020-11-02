// Dependencies
const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

// Relatives
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { MONGODB } = require("./config");

const pubSub = new PubSub();

const PORT = process.env.port || 5000;

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, pubSub })
});

mongoose
    .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("⚽ Connected to MongoDB");
        return server.listen({ port: PORT });
    })
    .then((res) => console.log(`⚡ Server Running @ ${res.url}`))
    .catch((err) => console.log(`Error Starting Server => ${err}`));
