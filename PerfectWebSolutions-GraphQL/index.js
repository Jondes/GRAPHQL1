const express = require("express");
const graphqlHTTP = require("express-graphql");
const { GraphQLSchema,
    GraphQLObjectType,
    GraphQLList,
    GraphQLInt,
    GraphQLString,
    graphql,
} = require('graphql')


const users = [
    { id: 1, name: 'John Doe', age: '23' },
    { id: 2, name: 'Johnson Doe', age: '31' },
    { id: 3, name: 'John Guedes', age: '32' },
    { id: 4, name: 'Jondes Dias', age: '29' },
];
const UserType = new GraphQLObjectType({
    name: 'Users',
    description: '...',
    fields: {
        id: {
            type: GraphQLInt,
        },
        name: {
            type: GraphQLString,
        },
        age: {
            type: GraphQLString,
        }

    }
});
const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: '...',
        fields: () => ({
            users: {
                type: GraphQLList(UserType),
                resolve: (parent, args) => {
                    return users;
                },
            },
            user: {
                type: UserType,
                args: {
                    id: {
                        type: GraphQLInt,
                    },
                },
                resolve: (parent, { id }) => {
                    const user = users.filter(user => user.id == id);
                    return users[0];
                },
            },
        }),
    })

});

const app = express();


app.use('/graphql',
    graphqlHTTP({
        schema,
        graphiql: true,
    }),
);
app.get('/', (req, res) => {
    const query = `query{users{id name age}}`;
    graphql(schema, '{users {id,name,age}}', query).then(response =>
        res.send(response),
    ).catch(err => res.sender(err));
});
app.get('/user/:id', (req, res) => {
    const query = `query{user(id:${req.params.id}) {id,name,age}}`;
    graphql(schema, query)
        .then(response => res.send(response))
        .catch(err => res.send(err));
});
app.listen(5007, () => console.log('Listening at http://localhost:5007')); 