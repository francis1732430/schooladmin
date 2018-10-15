/**
 *      on 7/21/16.
 */
import {AdminUserSessionUseCase} from "../domains";
import {Jwt, Logger} from "../libs";
import {ErrorCode, HttpStatus, Properties, MessageInfo} from "../libs/constants";
import {Exception} from "../models/exception";
import * as express from "express";

const queryKey = "access_token";
const bodyKey = "access_token";
const headerKey = "Bearer";
const sessionKey = "session";
const tokenKey = "token";

export function authentication(req: express.Request, res: express.Response, next: express.NextFunction) {
    let token: string;
    let error: boolean;

    if (req.query && req.query[queryKey]) {
        token = req.query[queryKey];
    }

    if (req.body && req.body[bodyKey]) {
        if (token) {
            error = true;
        }
        token = req.body[bodyKey];
    }

    if (req.header("authorization") != null) {
        let parts = req.header("authorization").split(" ");
        if (parts.length === 2 && parts[0] === headerKey) {
            if (token) {
                error = true;
            }
            token = parts[1];
        }
    }

    // RFC6750 states the access_token MUST NOT be provided
    // in more than one place in a single request.
    if (error) {
        let exception = new Exception(ErrorCode.AUTHENTICATION.VIOLATE_RFC6750, MessageInfo.MI_DUPLICATE_ACCESS_TOKEN, false);
        exception.httpStatus = HttpStatus.BAD_REQUEST;
        next(exception);
    } else if (token == null || token === "") {
        let exception = new Exception(ErrorCode.AUTHENTICATION.INVALID_AUTHORIZATION_HEADER, MessageInfo.MI_MISSING_ACCESS_TOKEN, false);
        exception.httpStatus = HttpStatus.UNAUTHORIZED;
        next(exception);
    } else {
        try {
            console.log("======================gfhgfh================================"); 
            Jwt.verify(token, req.header(Properties.HEADER_DEVICE_ID));
            let jwtObject = Jwt.decode(token);
            let current = Date.now();
            if (current < jwtObject.exp) {
                console.log("======================================================"); 
                console.log(AdminUserSessionUseCase); 
                console.log("======================================================");
                AdminUserSessionUseCase.verifyToken(jwtObject, token, req.originalUrl)
                    .then(object => {
                        if (object != null) {
                            next(object);
                        } else {
                            jwtObject[tokenKey] = token;
                            req[sessionKey] = jwtObject;
                            next();
                        }
                    });
            } else {
                let exception = new Exception(ErrorCode.AUTHENTICATION.TOKEN_EXPIRE, MessageInfo.MI_TOKEN_EXPIRED, false);
                exception.httpStatus = HttpStatus.BAD_REQUEST;
                next(exception);
            }
        } catch (err) {
            Logger.error(err.message, err);
            let exception = new Exception(ErrorCode.AUTHENTICATION.INVALID_TOKEN,  MessageInfo.MI_INVALID_TOKEN, false);
            exception.httpStatus = HttpStatus.UNAUTHORIZED;
            next(exception);
        }
    }
}
export default authentication;

// TODO: Should integrated with PassportJS
//import * as Passport from "passport";
//import {Strategy as BearerStrategy} from "passport-http-bearer";

//
//let bearer = new BearerStrategy((token:string, done:any) => {
//    done(token);
//});
//Passport.use(bearer);
//export const IsAuthenticate = (req, res, next) => {
//    Passport.authenticate("bearer", (err, user, info) => {
//        if (err) {
//            res.json(err);
//            return;
//        }
//
//        // access-token header is missing, reject the connection.
//        if (!user) {
//            let exception = new Exception(1000, "Token does not exist");
//            next(exception);
//            return;
//        }
//
//        req.user = user;
//        next();
//    })(req, res, next);
//};

//class Authorization {
//    private opts;
//    private passport;
//
//    constructor(opts) {
//        this.opts = opts || {};
//        //this.passport = Passport;
//        let bearer = new BearerStrategy(
//            (token, done) => {
//                process.nextTick(() => {
//                    done(null, token);
//                });
//            }
//        );
//        this.passport = Passport.use("bearer", bearer);
//    }
//
//    /**
//     * Authentication MiddleWare
//     * @param {IncomingMessage} req
//     * @param {ServerResponse} res
//     * @param {Function} next
//     */
//    images authenticate(req, res, next) {
//        this.passport.authenticate("bearer", {session: false}, (err, user, info) => {
//            if (err) {
//                res.json(err);
//                return;
//            }
//
//            // access-token header is missing, reject the connection.
//            if (!user) {
//                let exception = new Exception(1000, "Token does not exist", false);
//                next(exception);
//                return;
//            }
//
//            req.user = user;
//            next();
//        })(req, res, next);
//    }
//}
//
//export default new Authorization(null);
