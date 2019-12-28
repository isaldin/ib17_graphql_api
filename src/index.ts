import * as dotenv from "dotenv";
import * as Koa from "koa";
import { DefaultContext, DefaultState } from "koa";
import * as mount from "koa-mount";
// import * as Router from "koa-router";
import * as mongoose from "mongoose";

// tslint:disable-next-line: no-var-requires
const graphqlHTTP = require("koa-graphql");

import { graphqlSchema } from "./graphql/schema";

const app = new Koa<DefaultState, DefaultContext>();
// const router = new Router();
dotenv.config();

const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;

mongoose
  .connect(uri, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((db: typeof mongoose) => {
    app.context.db = db.connection;
  })
  // tslint:disable-next-line: no-console
  .catch(err => console.error("Something went wrong", err));

mongoose.set("debug", true);

app.use(
  mount(
    "/graphql",
    graphqlHTTP({
      graphiql: true,
      schema: graphqlSchema
    })
  )
);

app.listen(port, () => {
  // tslint:disable-next-line: no-console
  console.log("Server running on port %d", port);
});
