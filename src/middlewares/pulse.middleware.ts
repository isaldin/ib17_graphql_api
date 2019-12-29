import { MiddlewareType } from "./types";

const middleware: MiddlewareType = async (ctx, next) => {
  if (ctx.request.path === "/pulse") {
    if (ctx.request.headers.pulsetoken === "asdfqwer1234") {
      ctx.response.status = 200;
      next();
    } else {
      ctx.response.status = 404;
    }
  } else {
    next();
  }
};

export default middleware;
