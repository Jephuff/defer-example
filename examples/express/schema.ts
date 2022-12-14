import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  
} from "graphql";

export const schema = new GraphQLSchema({
  mutation: new GraphQLObjectType({
    name: "Mutation",
    fields: () => ({
      echo: {
        args: {
          text: {
            type: GraphQLString,
          },
        },
        type: GraphQLString,
        resolve: (_root, args) => {
          return args.text;
        },
      },
    }),
  }),
  query: new GraphQLObjectType({
    name: "Query",
    fields: () => ({
      alphabet: {
        type: new GraphQLList(GraphQLString),
        resolve: async function* () {
          for (let letter = 65; letter <= 90; letter++) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            yield String.fromCharCode(letter);
          }
        },
      },
      song: {
        type: new GraphQLObjectType({
          name: "Song",
          fields: () => ({
            verse: {
              args: {
                delay: {
                  type: GraphQLInt,
                },
                throw: {
                  type: GraphQLBoolean,
                },
              },
              type: GraphQLString,
              resolve: (_source, args) => {
                const delay: number = args.delay ?? 0
                return new Promise((resolve, reject) =>
                  setTimeout(
                    () => {
                      if(args.throw) {
                        reject( new Error(`delayed ${delay}.`))
                      } else {
                        resolve(`delayed ${delay}.`);
                      }
                      
                    },
                    delay
                  )
                )
              },
            },

            firstVerse: {
              type: GraphQLString,
              resolve: () => "Now I know my ABC's.",
            },
            secondVerse: {
              type: GraphQLString,
              resolve: () =>
                new Promise((resolve) =>
                  setTimeout(
                    () => {
                      resolve("Next time won't you sing with me?");
                    },
                    1000
                  )
                ),
            },
            thirdVerse: {
              type: GraphQLString,
              resolve: () =>
                new Promise((resolve) =>
                  setTimeout(
                    () => {
                      resolve("No... I will not!");
                    },
                    5000
                  )
                ),
            },
            fourth: {
              type: GraphQLString,
              resolve: () =>
                new Promise((resolve) =>
                  setTimeout(
                    () => {
                      resolve("Ok, maybe. But only if you pick a different song");
                    },
                    5500
                  )
                ),
            },
            five: {
              type: GraphQLString,
              resolve: () =>
                new Promise((resolve) =>
                  setTimeout(
                    () => {
                      resolve("Ok, maybe. But only if you pick a different song");
                    },
                    10000
                  )
                ),
            },
          }),
        }),
        resolve: () => ({}),
      },
    }),
  }),
  subscription: new GraphQLObjectType({
    name: "Subscription",
    fields: () => ({
      count: {
        type: GraphQLInt,
        args: {
          to: {
            type: GraphQLInt,
          },
        },
        subscribe: async function* (_root, args) {
          for (let count = 1; count <= args.to; count++) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            yield { count };
          }
        },
      },
    }),
  }),
});
