const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');

let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
}]

//2
const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews clone`,
        feed: () => links,
        link: (_, {id}) => {
            const link = links.find(link => link.id === id)
            return link;
        }
    },
    Mutation: {
        post: (parent,args) => {
            let idCount = links.length 

                const link = {
                    id: `link-${idCount++}`,
                    description: args.description,
                    url: args.url,
                }
                links.push(link)
                return link
        },
        updateLink: (parent,args) => {
            const link = links.find(link => link.id === args.id);
            if (!link) {
                throw new Error(`Couldn't find link with id ${args.id}`);
            }
            if (args.description !== undefined) {
                link.description = args.description;
            }
            if (args.url !== undefined) {
                link.url = args.url;
            }
            return link;
        },
        deleteLink: (parent,args) => {
            const link = links.find(link => link.id === args.id);
            if (!link) {
                throw new Error(`Couldn't find link with id ${args.id}`);
            }
            const linkIdx = links.findIndex(link => link.id === args.id);
            links.splice(linkIdx, 1);
            return link;
        }
    },
}

//3
const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
})

server
    .listen()
    .then(({ url }) =>
    console.log(`Server is running on ${url}`)
    );