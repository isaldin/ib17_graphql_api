import { DefaultContext, DefaultState, Middleware } from "koa";
import { Connection } from "mongoose";

export interface IAppContext extends DefaultContext {
  db: Connection;
  sharedVar?: string;
}

// tslint:disable-next-line: no-empty-interface
export interface IAppState extends DefaultState {}

export type MiddlewareType = Middleware<IAppState, IAppContext>;
