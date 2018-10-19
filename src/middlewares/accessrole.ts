/**
 *      on 7/21/16.
 */
import {AuthorizationRoleUseCase} from "../domains";
import {Jwt, Logger} from "../libs";
import {ErrorCode, HttpStatus, Properties, MessageInfo} from "../libs/constants";
import {Exception} from "../models/exception";
import * as express from "express";
import {BearerObject} from "../libs/jwt";

const queryKey = "access_token";
const bodyKey = "access_token";
const headerKey = "Bearer";
const sessionKey = "session";
const tokenKey = "token";

export function accessrole(req: express.Request, res: express.Response, next: express.NextFunction) {
    let action: string;
    let error: boolean;

    if (req.header("action") != null) {
        action = req.header("action");
    } else {
        error = true;
    }

    // RFC6750 states the access_token MUST NOT be provided
    // in more than one place in a single request.
    if (error) {
        let exception = new Exception(ErrorCode.ROLEAUTHENTICATION.INVALID_ACTION_HEADER, MessageInfo.INVALID_ACTION_HEADER, false);
        exception.httpStatus = HttpStatus.UNAUTHORIZED;
        next(exception);
    } else {
        let session:BearerObject = req[Properties.SESSION];
        let checkuser:BearerObject = req[Properties.CHECK_USER];
        console.log(session);
        let userId = session.userId;
        try {
            if (userId!=null) {    
                        
                AuthorizationRoleUseCase.verifyRole(userId, action,checkuser)
                        .then(object => {
                            if (object != null) {
                                next(object);
                            } else {
                                
                                next();
                            }
                        });
            } else {
                let exception = new Exception(ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND, MessageInfo.MI_USER_NOT_EXIST, false);
                exception.httpStatus = HttpStatus.BAD_REQUEST;
                next(exception);
            }
        } catch (err) {
            Logger.error(err.message, err);
            let exception = new Exception(ErrorCode.AUTHENTICATION.INVALID_ACTION_HEADER,  MessageInfo.INVALID_ACTION_HEADER, false);
            exception.httpStatus = HttpStatus.UNAUTHORIZED;
            next(exception);
        }
    }
}
export default accessrole;

