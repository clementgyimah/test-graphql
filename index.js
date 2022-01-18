const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const jwt = require('express-jwt');
const typeDefs = require('./schemas');
const resolvers = require('./resolvers');
const JWT_SECRET = require('./constants');

// async funtion is used here in order to use await for server.start()
(async function () {
const app = express();
const auth = jwt({
    secret: JWT_SECRET,
    credentialsRequired: false,
    // algorithms: ['RS256']
    algorithms: ['sha1', 'RS256', 'HS256'],
});
app.use(auth);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: {
        endpoint: '/graphql',
    },
    context: ({ req }) => {
        const user = req.headers.user
            ? JSON.parse(req.headers.user)
            : req.user
                ? req.user
                : null;
        return { user };
    },
});

await server.start();
server.applyMiddleware({
     app,
     /*
     cors: {
         origin: 'https://studio.apollographql.com',
         credentials: true
     }
     */
    });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('The server started on port ', PORT);
});
})();
