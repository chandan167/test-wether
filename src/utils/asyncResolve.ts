import { NextFunction, Request, Response } from "express";

const asyncResolver = (fun:Function) => (req:Request, res:Response, next:NextFunction) => Promise.resolve(fun(req,res,next)).catch(next);
export default asyncResolver;