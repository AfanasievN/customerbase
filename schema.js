const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');


//Hard coded data
// const customers = [
//     {id: '1', name: 'John Doe', email: ' jdoe@example.com', age: 35},
//     {id: '2', name: 'Smith Steve', email: ' smith@example.com', age: 35},
//     {id: '3', name: 'Sara Williams', email: ' sarah@example.com', age: 35},
// ];

// Customer type
const CustomerType = new GraphQLObjectType({
   name: 'Customer',
   fields: () => ({
       id: { type: GraphQLString },
       name: { type: GraphQLString },
       email: { type: GraphQLString },
       age: { type: GraphQLInt },
   })
});

//Root query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        customer: {
            type: CustomerType,
            args:{
                id:{ type: GraphQLString }
            },
            resolve(parentValue, args){
                /*
                Query for hard coded data
                 for(let i = 0;i < customers.length; i++){
                     if(customers[i].id === args.id){
                         return customers[i];
                     }
                }
                */

                return axios.get('http://localhost:3000/customers/' + args.id)
                    .then(response => response.data);
            }
        },
        customers: {
            type: new GraphQLList(CustomerType),
            resolve(parentValue, args){
                // return customers;

                return axios.get('http://localhost:3000/customers')
                    .then(response => response.data);
            }
        }
    }
});

// Mutations
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addCustomer: {
            type: CustomerType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parentValue, args){
                return axios.post('http://localhost:3000/customers',{
                    name: args.name,
                    email: args.email,
                    age: args.age
                })
                    .then(response => response.data);
            }
        },
        deleteCustomer: {
            type: CustomerType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, args){
                return axios.delete('http://localhost:3000/customers/' + args.id)
                    .then(response => response.data);
            }
        },
        editCustomer: {
            type: CustomerType,
            args: {
                id: { type: GraphQLString },
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                age: { type: GraphQLInt }
            },
            resolve(parentValue, args){
                return axios.patch('http://localhost:3000/customers/' + args.id, args,{
                    name: args.name,
                    email: args.email,
                    age: args.age
                })
                    .then(response => response.data);
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});