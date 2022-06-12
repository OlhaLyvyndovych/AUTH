require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const express = require('express');
const app = express();
const User = require('./db');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const mongoose = require('mongoose');
const isAuth = require('./is-auth');

app.use(isAuth);

const server = new ApolloServer({
    typeDefs,
    resolvers
  });
 
mongoose.connect('mongodb://localhost:27017/Tech', {useNewUrlParser: true});


server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
    });
