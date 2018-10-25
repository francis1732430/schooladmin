
import {AdminUserSessionUseCase} from "../domains";
import {Jwt, Logger} from "../libs";
import {ErrorCode, HttpStatus, Properties, MessageInfo} from "../libs/constants";
import {Exception} from "../models/exception";
import * as express from "express";
import {BearerObject} from "../libs/jwt";
import { AdminUserUseCase } from "../domains";
export function checkUser(req: express.Request, res: express.Response, next: express.NextFunction) {
    
    let session:BearerObject = req[Properties.SESSION];
        console.log(session);
        let userId = session.userId;
        let school:BearerObject=req[Properties.SCHOOL_ID];
        console.log("tyyyyyy",school);
        if(userId != null) {
 
            AdminUserUseCase.checkUser(userId,school).then((obj) => {
              if(obj == null) {
                let exception = new Exception(ErrorCode.AUTHENTICATION.TOKEN_EXPIRE, MessageInfo.MI_USER_NOT_EXIST, false);
                exception.httpStatus = HttpStatus.BAD_REQUEST;
                next(exception);
              }

                req[Properties.CHECK_USER]=obj;
                next()  
            })
        
        }else {
            let exception = new Exception(ErrorCode.AUTHENTICATION.TOKEN_EXPIRE, MessageInfo.MI_USER_NOT_EXIST, false);
                exception.httpStatus = HttpStatus.BAD_REQUEST;
                next(exception);
        }
}
