import express from "express";
import { ExecutionResult, GraphQLError } from "graphql";
import { getGraphQLParameters, processRequest, renderGraphiQL, shouldRenderGraphiQL, sendResult } from "graphql-helix";
import { schema } from "./schema";

const formatResult = (result: ExecutionResult) => {
  const formattedResult: ExecutionResult = {
    data: result.data,
  };

  if (result.errors) {
    formattedResult.errors = result.errors.map((error) => {
      // Log the error using the logger of your choice
      console.log(error);

      // Return a generic error message instead
      return new GraphQLError("Sorry, something went wrong", error.nodes, error.source, error.positions, error.path, null, {
        // Adding some metadata to the error
        timestamp: Date.now(),
      });
    });
  }

  return formattedResult;
};

const app = express();

app.use(express.json());

app.use("/graphql", async (req, res) => {
  const request = {
    body: req.body,
    headers: req.headers,
    method: req.method,
    query: req.query,
  };

  if (shouldRenderGraphiQL(request)) {
    res.send(renderGraphiQL());
  } else {
    const { operationName, query, variables } = getGraphQLParameters(request);

    const result = await processRequest({
      operationName,
      query,
      variables,
      request,
      schema,
    });

    sendResult(result, res, formatResult);
  }
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`GraphQL server is running on port ${port}.`);
});
