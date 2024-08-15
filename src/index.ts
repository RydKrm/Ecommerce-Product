// src/index.ts
import { graphqlHTTP } from "express-graphql";
import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import { buildSchema } from "graphql";
import { Product, IProduct } from "../models/product.model";

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/graphql-demo")
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Database not connected", err);
  });

// GraphQL Schema
const schema = buildSchema(`
  input ProductInput {
    productName: String!
    description: String!
    price: Float!
    category: String!
  }

  type Product {
    _id: ID!
    productName: String!
    description: String!
    price: Float!
    category: String!
  }

  type RootQuery {
    products: [Product!]!
  }

  type RootMutation {
    createProduct(product: ProductInput): Product
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);

// Resolvers
const rootValue = {
  products: async () => {
    return await Product.find();
  },
  createProduct: async (args: { product: IProduct }) => {
    const product = new Product({
      productName: args.product.productName,
      description: args.product.description,
      price: args.product.price,
      category: args.product.category,
    });
    await product.save();
    return product;
  },
};

// Middleware for GraphQL
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true,
  })
);

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/graphql`);
});
