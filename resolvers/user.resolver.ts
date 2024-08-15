// src/schema.ts
import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
} from "graphql";
import { User, IUser } from "../models/user.model";

// Define UserType
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});

// Define Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve: async () => {
        return await User.find({});
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve: async (parent, args) => {
        return await User.findById(args.id);
      },
    },
  },
});

// Define Mutation
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        const user = new User({
          name: args.name,
          email: args.email,
        });
        return await user.save();
      },
    },
  },
});

// Export the schema
export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
