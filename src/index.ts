import * as dotenv from "dotenv";
import * as Koa from "koa";
import { DefaultContext, DefaultState } from "koa";
import * as mount from "koa-mount";
import * as Router from "koa-router";
import * as mongoose from "mongoose";

const graphqlHTTP = require("koa-graphql");

import artistsController from "./controllers/artist.controller";
import { graphqlSchema } from "./graphql/schema";

type Mongoose = typeof mongoose.connection;

interface IAppContext extends DefaultContext {
  db: Mongoose;
}

const app = new Koa<DefaultState, DefaultContext>();
const router = new Router();
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

router.get("/", async ctx => {
  ctx.body = "Hello World!";
});

router.get("/artists", async ctx => {
  ctx.body = await artistsController.allArtists({
    limit: parseInt(ctx.query.limit || 10, 10),
    offset: parseInt(ctx.query.offset || 0, 10),
    search: ctx.query.search || ""
  });
});

router.get("/artist/:id", async ctx => {
  const response = await artistsController.artistById(ctx.params.id);
  if (!response) {
    return (ctx.status = 404);
  }

  ctx.body = response;
});

app.use(router.routes());

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
  console.log("Server running on port 3000");
});
