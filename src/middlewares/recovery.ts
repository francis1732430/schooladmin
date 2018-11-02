/**
 *      on 7/20/16.
 */
import {Utils} from "../libs/utils";
import * as express from "express";
export function recovery(error:any, req:express.Request, res:express.Response, next:express.NextFunction) {
    Utils.responseError(res, error);
}

export default recovery;
