import * as Koa from "koa";
import { DefaultContext, DefaultState } from "koa";
import * as Router from "koa-router";
import * as mongoose from "mongoose";

import ArtistsController from "./controllers/artist.controller";

type Mongoose = typeof mongoose.connection;

interface IAppContext extends DefaultContext {
  db: Mongoose;
}

const app = new Koa<DefaultState, DefaultContext>();
const router = new Router();

const port = process.env.PORT || 3000;
const uri = "";

mongoose
  .connect(uri, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((db: typeof mongoose) => {
    app.context.db = db.connection;
  })
  .catch(err => console.error("Something went wrong", err));

router.get("/", async ctx => {
  ctx.body = "Hello World!";
});

router.get("/artists", async ctx => {
  ctx.body = await ArtistsController.AllArtists({
    limit: parseInt(ctx.query.limit || 10, 10),
    offset: parseInt(ctx.query.offset || 0, 10),
    search: ctx.query.search || ""
  });
});

app.use(router.routes());

app.listen(port, () => {
  console.log("Server running on port 3000");
});
