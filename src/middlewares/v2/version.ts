/**
 *      on 7/21/16.
 */
import {Logger} from "../../libs";
import {ErrorCode, HttpStatus, Properties, MessageInfo} from "../../libs/constants";
import {Exception} from "../../models/exception";
import * as express from "express";


export function version(req: express.Request, res: express.Response, next: express.NextFunction) {
    let lang: string;
    console.log(req.body.version);
    if(req.body.version=='1') {
       next();
    } else {
        let exception = new Exception(ErrorCode.VERSION.INVALID_VERSION, MessageInfo.VERSION_INVALID, false);
        exception.httpStatus = HttpStatus.BAD_REQUEST;
                next(exception);
    }
    
    
}
export default version;

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
