import { randomBytes } from "crypto";
import express from "express";
import { sendResult, getGraphQLParameters, processRequest, renderGraphiQL, shouldRenderGraphiQL } from "graphql-helix";
import helmet from "helmet";
import { schema } from "./schema";

const app = express();

app.use(express.json());

app.use((_req, res, next) => {
  res.locals.cspNonce = randomBytes(16).toString("hex");
  next();
});

app.use((req, res, next) =>
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'", "data:", `'nonce-${res.locals.cspNonce}'`],
      },
    },
  })(req, res, next)
);

app.use("/graphql", async (req, res) => {
  const request = {
    body: req.body,
    headers: req.headers,
    method: req.method,
    query: req.query,
  };

  if (shouldRenderGraphiQL(request)) {
    res.send(renderGraphiQL({ nonce: res.locals.cspNonce }));
  } else {
    const { operationName, query, variables } = getGraphQLParameters(request);

    const result = await processRequest({
      operationName,
      query,
      variables,
      request,
      schema,
    });

    sendResult(result, res);
  }
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`GraphQL server is running on port ${port}.`);
});
