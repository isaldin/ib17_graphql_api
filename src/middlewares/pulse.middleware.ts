import { MiddlewareType } from "./types";

const pulseMiddleware: MiddlewareType = async (ctx, next) => {
  if (ctx.request.path === "/pulse") {
    if (ctx.request.headers.pulsetoken === "asdfqwer1234") {
      ctx.response.status = 200;
    } else {
      ctx.throw(404, `${ctx.path} : Endpoint not found`);
    }
  } else {
    await next();
  }
};

export default pulseMiddleware;
