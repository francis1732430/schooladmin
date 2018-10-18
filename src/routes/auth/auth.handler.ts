import { MessageInfo } from './../../libs/constants';
/**
 *    on 22/05/18.
 */
import {AdminUserSessionUseCase, AdminUserUseCase} from "../../domains";
import {AdminUserTableSchema,AdminUserSessionTableSchema,AuthorizationRoleTableSchema} from "../../data/schemas";
import {BearerObject, Jwt, Logger, Mailer} from "../../libs";
import {ErrorCode, HttpStatus, Properties, MessageInfo,WebUrl} from "../../libs/constants";
import {Utils} from "../../libs/utils";
import {Exception, AdminUserSessionModel} from "../../models";
import {Request, Response} from "express";
import {Promise} from "thenfail";
import {BaseHandler,languge} from "../base.handler";
import {AdminUserModel} from "../../models/admin_user";
const Something = '../../locale/my';
import {Language} from '../../locale/my';
let util = require('util'); 


export class AuthHandler extends BaseHandler {
    
    constructor() {
        super();
    }

    /**
     *
     * @param req
     * @param res
     * @returns {Promise<TResult>}
     */
    public static logout(req:Request, res:Response):any {
        let session:BearerObject = req[Properties.SESSION];
        return Promise.then(() => {
            return AdminUserSessionUseCase.disableToken(session.token);
        })
            .then(() => {   
                res.message = MessageInfo.MI_LOGOUT;
                res.end();
            })
            .catch(err => {
                Utils.responseError(res, err);
            });
    }

    public static login(req:Request, res:Response):any {
        let emailOrPhone = req.body.email || "";
        let password = req.body.password || "";
        if (!Utils.requiredCheck(emailOrPhone)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_INVALID_EMAIL,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        
        let cond=Utils.validateNumber(emailOrPhone);

        if (!cond && !Utils.validateEmail(emailOrPhone)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_INVALID_EMAIL,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        let userId;
        let userInfo;
        let userName;
        let userRole;
        let firstname;
        let lastname;
        let email;
        let phoneNumber;
        return Promise.then(() => {
            console.log("userInfo");
           return AdminUserUseCase.findByQuery(q => {
                q.select(`${AdminUserTableSchema.TABLE_NAME}.*`,
                `${AuthorizationRoleTableSchema.TABLE_NAME}.*`
                );
                let condition=`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.EMAIL}=${emailOrPhone} or ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.PHONE_NUMBER1} =${emailOrPhone}`;
                q.where(condition)
                q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}`, 0);
                q.innerJoin(AuthorizationRoleTableSchema.TABLE_NAME, `${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.USER_ID}`, `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`);
                q.limit(1);
            }, []);
            
        })
            .then(object => {
                console.log("UserInfo");
                console.log(object);
                //noinspection TypeScriptUnresolvedVariable
                if (object != null && object.models != null && object.models[0] != null && object.models[0].relations != null) {
                    userInfo = AdminUserModel.fromDto(object.models[0]);
                    console.log(userInfo);
                    if(object.models[0].get(AdminUserTableSchema.FIELDS.IS_ACTIVE)==1) {
                        if(object.models[0].get(AuthorizationRoleTableSchema.FIELDS.IS_DELETED)==0) {
                            //noinspection TypeScriptUnresolvedVariable
                            userId = object.models[0].get(AdminUserTableSchema.FIELDS.USER_ID);
                            email = object.models[0].get(AdminUserTableSchema.FIELDS.EMAIL);
                            phoneNumber = object.models[0].get(AdminUserTableSchema.FIELDS.PHONE_NUMBER1);
                            firstname = object.models[0].get(AdminUserTableSchema.FIELDS.FIRSTNAME);
                            lastname = object.models[0].get(AdminUserTableSchema.FIELDS.LASTNAME);
                            let hash = object.models[0].get(AdminUserTableSchema.FIELDS.PASSWORD);
                            console.log(Utils.hashPassword(password));
                            return Utils.compareHash(password, hash);
                        } else {
                            Utils.responseError(res, new Exception(
                                ErrorCode.AUTHENTICATION.NOT_ACTIVE,
                                MessageInfo.MI_ASSIGNED_ROLE_NOT_FOUND,
                                false,
                                HttpStatus.BAD_REQUEST
                            ));
                            return Promise.break;
                        }

                    } else {
                        Utils.responseError(res, new Exception(
                            ErrorCode.AUTHENTICATION.NOT_ACTIVE,
                            MessageInfo.MI_USER_NOT_ACTIVE,
                            false,
                            HttpStatus.BAD_REQUEST
                        ));
                        return Promise.break;
                    }
                    
                } else {
                    Utils.responseError(res, new Exception(
                        ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND,
                        MessageInfo.MI_USER_NOT_EXIST,
                        false,
                        HttpStatus.BAD_REQUEST
                    ));
                    return Promise.break;
                }
            })
            .then(object => {
                if (object == null || !object) {
                    Utils.responseError(res, new Exception(
                        ErrorCode.AUTHENTICATION.WRONG_USER_NAME_OR_PASSWORD,
                        MessageInfo.MI_WRONG_USERNAME_OR_PASSWORD,
                        false,
                        HttpStatus.BAD_REQUEST
                    ));
                    return Promise.break;
                }
                //console.log("Saving session");
                return AdminUserSessionUseCase.findByQuery(q => {
                    q.where(AdminUserSessionTableSchema.FIELDS.USER_ID, userId);
                    q.limit(1);
                }, []);
            })
            .then(object => {
                if (object != null && object.models != null && object.models[0] != null) {
                   let data = AdminUserSessionModel.fromDto(object.models[0]);
                    AdminUserSessionUseCase.enableToken(data.sessionId);
                    return object.models[0];
                } else {       
                    let adminUserSession = new AdminUserSessionModel();
                    adminUserSession.userId = userId;
                    adminUserSession.status = 1;
                    adminUserSession.deviceId = '1';
                    adminUserSession.ip = '127.0.0.1';
                    adminUserSession.sessionId = Jwt.encode(adminUserSession, req.header(Properties.HEADER_DEVICE_ID));
                    adminUserSession.platform = platform;
                    adminUserSession.deviceId = deviceId;
                    adminUserSession.deviceToken = deviceToken;
                    //console.log(adminUserSession);
                    return AdminUserSessionUseCase.create(adminUserSession);

                }
            })
            .then(object => {
                console.log("Saved session");
                console.log(object);
                let data = AdminUserSessionModel.fromDto(object);
                data.userInfo = {};//firstname+' '+lastname;
                data.userInfo.firstName = firstname; 
                data.userInfo.lastName = lastname;
                data.userInfo.email = email;
                data.userInfo.role = userInfo['roleName'];
                data.message = MessageInfo.MI_LOGIN;
                res.json(data);

                
            })
            .catch(err => {
                Utils.responseError(res, err);
            });
    }

    public static forgetPassword(req:Request, res:Response):any {
        let email = req.body.email || "";
        if (email == null || email === "") {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_EMAIL_NOT_EMPTY,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.validateEmail(email)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_INVALID_EMAIL,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        let user: any;
        let userName: string;
        let userId: string;
        return Promise.then(() => {
                return AdminUserUseCase.findByQuery(q => {
                    q.where(AdminUserTableSchema.FIELDS.EMAIL, email);
                    q.where(AdminUserTableSchema.FIELDS.IS_DELETED, 0);
                }, []);
            })
            .then(object => {
                if (object != null && object.models != null && object.models[0] != null) {
                    user = object.models[0];
                    userId = user.get(AdminUserTableSchema.FIELDS.USER_ID);
                    userName = user.get(AdminUserTableSchema.FIELDS.FIRSTNAME);
                    
                    return Jwt.encodeResetToken(userId);
                }

                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.USER_NOT_FOUND,
                    MessageInfo.MI_EMAIL_NOT_DB,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            })
            .then(token => {              
                let adminUserData = {};
                adminUserData[AdminUserTableSchema.FIELDS.RP_TOKEN] = token;
                adminUserData[AdminUserTableSchema.FIELDS.RP_TOKEN_CREATED_AT] = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                user.save(adminUserData, {patch: true});

                let host = (req.get("x-forwarded-host")) ? req.get("x-forwarded-host") : req.get("host");
                let link = `${WebUrl.WEBSITE_URL}${WebUrl.RESETPASSWORD_URL}${token}`;
                
                Mailer.resetPassword(email, userName, link);
                // res.status(HttpStatus.NO_CONTENT);
                res.json({status: 1, message: MessageInfo.MI_SEND_RESETPWD_EMAIL});
            })
            .catch(err => {
                Utils.responseError(res, err);
            });
    }

    public static forgetPasswordToken(req:Request, res:Response):any {
        let rpToken = req.params.rpToken || "";
        if (rpToken == null || rpToken === "") {
            return Utils.responseError(res, new Exception(
                ErrorCode.AUTHENTICATION.INVALID_TOKEN,
                MessageInfo.MI_TOKEN_NOT_FOUND,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        let user: any;
        return Promise.then(() => {
                return AdminUserUseCase.findByQuery(q => {
                    q.where(AdminUserTableSchema.FIELDS.RP_TOKEN, rpToken);
                    q.where(AdminUserTableSchema.FIELDS.IS_DELETED, 0);
                }, []);
            })
            .then(object => {
                if (object != null && object.models != null && object.models[0] != null) {
                    user = object.models[0];
                    let current = Date.now();
                    let jwtObject = Jwt.decode(rpToken);
                    if (current < jwtObject.exp) {
                        let data = {} ;
                        data['status'] = 1;
                        res.json(data);
                    } else {
                        Utils.responseError(res, new Exception(
                            ErrorCode.AUTHENTICATION.TOKEN_EXPIRE,
                            MessageInfo.MI_TOKEN_EXPIRED,
                            false,
                            HttpStatus.BAD_REQUEST
                        ));
                    }
                }

                Utils.responseError(res, new Exception(
                    ErrorCode.AUTHENTICATION.INVALID_TOKEN,
                    MessageInfo.MI_TOKEN_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            })
            .catch(err => {
                Utils.responseError(res, err);
            });
    }

    public static resetPassword(req:Request, res:Response):any {
        let session:BearerObject = req[Properties.SESSION];
        let newPassword = req.body.newPassword || "";
        let rpToken = req.params.rpToken || "";
        if (rpToken == null || rpToken === "") {
            return Utils.responseError(res, new Exception(
                ErrorCode.AUTHENTICATION.INVALID_TOKEN,
                MessageInfo.MI_TOKEN_NOT_FOUND,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (newPassword === "") {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_PASSWORD,
                MessageInfo.MI_NEW_PASSWORD_NOT_EMPTY,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        let user: any;
        let userId: string;
        return Promise.then(() => {
                return AdminUserUseCase.findByQuery(q => {
                    q.where(AdminUserTableSchema.FIELDS.RP_TOKEN, rpToken);
                    q.where(AdminUserTableSchema.FIELDS.IS_DELETED, 0);
                }, []);
            })
            .then(object => {
                if (object != null && object.models != null && object.models[0] != null) {
                    user = object.models[0];
                    userId = user.get(AdminUserTableSchema.FIELDS.USER_ID);
                    let current = Date.now();
                    let jwtObject = Jwt.decode(rpToken);
                    if (current < jwtObject.exp) {
                        return true;
                    } else {
                        Utils.responseError(res, new Exception(
                            ErrorCode.AUTHENTICATION.TOKEN_EXPIRE,
                            MessageInfo.MI_TOKEN_EXPIRED,
                            false,
                            HttpStatus.BAD_REQUEST
                        ));
                    }
                }

                Utils.responseError(res, new Exception(
                    ErrorCode.AUTHENTICATION.INVALID_TOKEN,
                    MessageInfo.MI_TOKEN_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            })
            .then(() => {
                AdminUserUseCase.resetPassword(userId, newPassword);
            })
            .then(() => {
                let data = {} ;
                data['message'] = MessageInfo.MI_PASSWORD_UPDATED;
                res.json(data);
            })
            .catch(err => {
                Utils.responseError(res, err);
            });
    }

    public static sendOtp(req:Request, res:Response):any {
        let emailOrPhone = req.body.emailOrPhone || "";
        if (emailOrPhone == null || emailOrPhone === "") {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_EMAIL_NOT_EMPTY,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        let user: any;
        let userName: string;
        let userId: string;
        let otp:string;
        let email: string;
        return Promise.then(() => {
                return AdminUserUseCase.findByQuery(q => {
                    q.where(AdminUserTableSchema.FIELDS.EMAIL, emailOrPhone)
                     .orWhere(AdminUserTableSchema.FIELDS.PHONE_NUMBER1, emailOrPhone)
                     .orWhere(AdminUserTableSchema.FIELDS.PHONE_NUMBER2, emailOrPhone);
                    q.where(AdminUserTableSchema.FIELDS.IS_DELETED, 0);
                }, []);
            })
            .then(object => {
                if (object != null && object.models != null && object.models[0] != null) {
                    user = object.models[0];
                    userId = user.get(AdminUserTableSchema.FIELDS.USER_ID);
                    userName = user.get(AdminUserTableSchema.FIELDS.FIRSTNAME);
                    email = user.get(AdminUserTableSchema.FIELDS.EMAIL);
                    otp = userId+Math.floor(Math.random() * (9999 - 1111 + 1)) + 1111;
                    
                    return Jwt.encodeResetOtp(userId,otp,0);
                }

                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.USER_NOT_FOUND,
                    MessageInfo.MI_EMAIL_NOT_DB,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            })
            .then(token => {              
                let adminUserData = {};
                adminUserData[AdminUserTableSchema.FIELDS.RP_TOKEN] = token;
                adminUserData[AdminUserTableSchema.FIELDS.RP_TOKEN_CREATED_AT] = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                user.save(adminUserData, {patch: true});

                Mailer.sendPin(email, userName, otp);
                // res.status(HttpStatus.NO_CONTENT);
                res.json({token: token, message: MessageInfo.MI_SEND_RESETPWD_TOKEN});
            })
            .catch(err => {
                Utils.responseError(res, err);
            });
    }

    public static resendOtp(req:Request, res:Response):any {

        let rpToken = req.params.rpToken || "";
        if (rpToken == null || rpToken === "") {
            return Utils.responseError(res, new Exception(
                ErrorCode.AUTHENTICATION.INVALID_TOKEN,
                MessageInfo.MI_TOKEN_NOT_FOUND,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        let user: any;
        let userId:string;
        let otp:string;
        let email:string;
        let userName:string;
        return Promise.then(() => {
                return AdminUserUseCase.findByQuery(q => {
                    q.where(AdminUserTableSchema.FIELDS.RP_TOKEN, rpToken);
                    q.where(AdminUserTableSchema.FIELDS.IS_DELETED, 0);
                }, []);
            })
            .then(object => {
                if (object != null && object.models != null && object.models[0] != null) {
                    user = object.models[0];
                    userId = user.get(AdminUserTableSchema.FIELDS.USER_ID);
                    userName = user.get(AdminUserTableSchema.FIELDS.FIRSTNAME);
                    email = user.get(AdminUserTableSchema.FIELDS.EMAIL);
                    let jwtObject = Jwt.decode(rpToken);
                    userId = jwtObject.userId;
                    otp = userId+Math.floor(Math.random() * (9999 - 1111 + 1)) + 1111;
                    return Jwt.encodeResetOtp(userId,otp,0);
                    
                }

                Utils.responseError(res, new Exception(
                    ErrorCode.AUTHENTICATION.INVALID_TOKEN,
                    MessageInfo.MI_TOKEN_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            })
            .then(token => {              
                let adminUserData = {};
                adminUserData[AdminUserTableSchema.FIELDS.RP_TOKEN] = token;
                adminUserData[AdminUserTableSchema.FIELDS.RP_TOKEN_CREATED_AT] = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                user.save(adminUserData, {patch: true});

               Mailer.sendPin(email, userName, otp);
                // res.status(HttpStatus.NO_CONTENT);
                res.json({token: token, message: MessageInfo.MI_SEND_RESETPWD_TOKEN});
            })
            .catch(err => {
                Utils.responseError(res, err);
            });
    }

    public static verifyOtp(req:Request, res:Response):any {
        let rpToken = req.params.rpToken || "";
        if (rpToken == null || rpToken === "") {
            return Utils.responseError(res, new Exception(
                ErrorCode.AUTHENTICATION.INVALID_TOKEN,
                MessageInfo.MI_TOKEN_NOT_FOUND,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        let otpText = req.body.otpText || "";
        if (otpText == null || otpText === "") {
            return Utils.responseError(res, new Exception(
                ErrorCode.AUTHENTICATION.INVALID_CODE,
                MessageInfo.MI_OTP_EMPTY,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        
        let user: any;
        let userId:string;
        let otp:string;
        let email:string;
        let userName:string;
        return Promise.then(() => {
                return AdminUserUseCase.findByQuery(q => {
                    q.where(AdminUserTableSchema.FIELDS.RP_TOKEN, rpToken);
                    q.where(AdminUserTableSchema.FIELDS.IS_DELETED, 0);
                }, []);
            })
            .then(object => {
                if (object != null && object.models != null && object.models[0] != null) {
                    user = object.models[0];
                    userId = user.get(AdminUserTableSchema.FIELDS.USER_ID);
                    userName = user.get(AdminUserTableSchema.FIELDS.FIRSTNAME);
                    email = user.get(AdminUserTableSchema.FIELDS.EMAIL);
                    let jwtObject = Jwt.decode(rpToken);
                    let current = Date.now();
                    if(jwtObject.otp == otpText) {
                        if (current < jwtObject.exp) {
                            return Jwt.encodeResetOtp(userId,jwtObject.otp,1);
                            
                        } else {
                            Utils.responseError(res, new Exception(
                                ErrorCode.AUTHENTICATION.TOKEN_EXPIRE,
                                MessageInfo.MI_TOKEN_EXPIRED,
                                false,
                                HttpStatus.BAD_REQUEST
                            ));
                        }
                        
                    }
                    Utils.responseError(res, new Exception(
                        ErrorCode.AUTHENTICATION.INVALID_TOKEN,
                        MessageInfo.MI_INCORRECT_OTP,
                        false,
                        HttpStatus.BAD_REQUEST
                    ));
                    return Promise.break;
                    
                }

                Utils.responseError(res, new Exception(
                    ErrorCode.AUTHENTICATION.INVALID_TOKEN,
                    MessageInfo.MI_TOKEN_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            })
            .then(token => {              
                let adminUserData = {};
                adminUserData[AdminUserTableSchema.FIELDS.RP_TOKEN] = token;
                adminUserData[AdminUserTableSchema.FIELDS.RP_TOKEN_CREATED_AT] = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                user.save(adminUserData, {patch: true});

                let data = {} ;
                data['status'] = 1;
                data['token'] = token;
                res.json(data);
                // res.status(HttpStatus.NO_CONTENT);
                res.json(data);
            })
            .catch(err => {
                Utils.responseError(res, err);
            });
    }

    public static resetPasswordWithOtp(req:Request, res:Response):any {
        let session:BearerObject = req[Properties.SESSION];
        let newPassword = req.body.newPassword || "";
        let rpToken = req.params.rpToken || "";
        if (rpToken == null || rpToken === "") {
            return Utils.responseError(res, new Exception(
                ErrorCode.AUTHENTICATION.INVALID_TOKEN,
                MessageInfo.MI_TOKEN_NOT_FOUND,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (newPassword === "") {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_PASSWORD,
                MessageInfo.MI_NEW_PASSWORD_NOT_EMPTY,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        let user: any;
        let userId: string;
        return Promise.then(() => {
                return AdminUserUseCase.findByQuery(q => {
                    q.where(AdminUserTableSchema.FIELDS.RP_TOKEN, rpToken);
                    q.where(AdminUserTableSchema.FIELDS.IS_DELETED, 0);
                }, []);
            })
            .then(object => {
                if (object != null && object.models != null && object.models[0] != null) {
                    user = object.models[0];
                    userId = user.get(AdminUserTableSchema.FIELDS.USER_ID);
                    let current = Date.now();
                    let jwtObject = Jwt.decode(rpToken);
                    if (current < jwtObject.exp && jwtObject.otpVerify==1) {
                        return Jwt.encodeResetOtp(userId,jwtObject.otp,2);
                    } else {
                        if (current < jwtObject.exp) {
                            Utils.responseError(res, new Exception(
                                ErrorCode.AUTHENTICATION.TOKEN_EXPIRE,
                                MessageInfo.MI_TOKEN_EXPIRED,
                                false,
                                HttpStatus.BAD_REQUEST
                            ));
                        }
                        if ( jwtObject.otpVerify==1) {
                            Utils.responseError(res, new Exception(
                                ErrorCode.AUTHENTICATION.INVALID_CODE,
                                MessageInfo.MI_OTP_NOT_VERIFIED,
                                false,
                                HttpStatus.BAD_REQUEST
                            ));
                        }
                    }
                }

                Utils.responseError(res, new Exception(
                    ErrorCode.AUTHENTICATION.INVALID_TOKEN,
                    MessageInfo.MI_TOKEN_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            })
            .then((token) => {
                let adminUserData = {};
                adminUserData[AdminUserTableSchema.FIELDS.RP_TOKEN] = token;
                adminUserData[AdminUserTableSchema.FIELDS.RP_TOKEN_CREATED_AT] = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                user.save(adminUserData, {patch: true});
                AdminUserUseCase.resetPassword(userId, newPassword);
            })
            .then(() => {
                let data = {} ;
                data['message'] = MessageInfo.MI_PASSWORD_UPDATED;
                res.json(data);
            })
            .catch(err => {
                Utils.responseError(res, err);
            });
    }
    
}

export default new AuthHandler();
