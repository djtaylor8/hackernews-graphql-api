const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const { getUserId } = require('./utils');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();


const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews clone`,
        feed: async (parent, args, context) => {
            return context.prisma.link.findMany()
        },
        // link: (_, {id}) => {
        //     const link = links.find(link => link.id === id)
        //     return link;
        // }
    },
    Mutation: {
        post: (parent,args,context,info) => {
            const newLink = context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.descriptions,
                },
            })
            return newLink;
        },
        // updateLink: (parent,args) => {
        //     const link = links.find(link => link.id === args.id);
        //     if (!link) {
        //         throw new Error(`Couldn't find link with id ${args.id}`);
        //     }
        //     if (args.description !== undefined) {
        //         link.description = args.description;
        //     }
        //     if (args.url !== undefined) {
        //         link.url = args.url;
        //     }
        //     return link;
        // },
    //     deleteLink: (parent,args) => {
    //         const link = links.find(link => link.id === args.id);
    //         if (!link) {
    //             throw new Error(`Couldn't find link with id ${args.id}`);
    //         }
    //         const linkIdx = links.findIndex(link => link.id === args.id);
    //         links.splice(linkIdx, 1);
    //         return link;
    //     }
     },
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    context: ({ req }) => {
        return {
            ...req,
            prisma,
            userId:
                req && req.headers.authorization ? getUserId(req) : null
        };
    }
});

server
    .listen()
    .then(({ url }) =>
    console.log(`Server is running on ${url}`)
    );