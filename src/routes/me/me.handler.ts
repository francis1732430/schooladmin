import { MessageInfo } from './../../libs/constants';
/**
 *    
 */
import {AdminUserUseCase} from "../../domains"; 
import {ErrorCode, HttpStatus, MessageInfo, Properties} from "../../libs/constants";
import {Utils} from "../../libs/utils";
import {AdminUserTableSchema} from "../../data/schemas";
import {Exception, AdminUserModel} from "../../models";
import * as express from "express";
import {Promise} from "thenfail";
import * as formidable from "formidable";
import {Excel} from "../../libs";
import {BaseHandler} from "../base.handler";
import {BearerObject} from "../../libs/jwt";

export class MeHandler extends BaseHandler {
    
    constructor() {
        super();
    }

    public static changePassword(req:express.Request, res:express.Response):any {
        let session:BearerObject = req[Properties.SESSION];
        //noinspection TypeScriptUnresolvedVariable
        let oldPassword = req.body.oldPassword || "";  
        //noinspection TypeScriptUnresolvedVariable
        let newPassword = req.body.newPassword || "";
        if (oldPassword === "") {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_PASSWORD,
                MessageInfo.MI_OLD_PASSWORD_NOT_EMPTY,
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
        return Promise.then(() => {
            return AdminUserUseCase.updatePasswordById(session.userId, oldPassword, newPassword);
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

    public static editProfile(req:express.Request, res:any):any {
        let adminUser = AdminUserModel.fromRequest(req);
        let session:BearerObject = req[Properties.SESSION];
        if (!Utils.requiredCheck(adminUser.email)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_INVALID_EMAIL,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.validateEmail(adminUser.email)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_INVALID_EMAIL,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(adminUser.firstname)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.USER.FIRSTNAME_EMPTY,
                MessageInfo.MI_FIRSTNAME_NOT_EMPTY,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(adminUser.lastname)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.USER.LASTNAME_EMPTY,
                MessageInfo.MI_LASTNAME_NOT_EMPTY,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        

        return Promise.then(() => {
            return AdminUserUseCase.updateByPid(session.userId, adminUser);
        })
            .then(() => {
                let adminUser;
                adminUser = AdminUserUseCase.findByQuery(q => {
                    q.where(AdminUserTableSchema.FIELDS.USER_ID, session.userId);
                    q.where(AdminUserTableSchema.FIELDS.IS_DELETED, 0);
                    q.limit(1);
                }, []);
                adminUser.message = MessageInfo.MI_PROFILE_UPDATED;
                return adminUser;
            })
            .then(object => {
                //let data = {} ;
                //data['message'] = MessageInfo.MI_UPDATE_SUCCESSFUL;
                let data = AdminUserModel.fromDto(object.models[0], ["createdDate","updatedDate","userId","rid","createdBy","password"]);
                data['message'] = MessageInfo.MI_UPDATE_SUCCESSFUL;
                res.json(data);
            })
            .catch(err => {
                Utils.responseError(res, err);
            });
    }

    public static getMyProfile(req:express.Request, res:express.Response):any {
        let session:BearerObject = req[Properties.SESSION];
        return Promise.then(() => {
            return AdminUserUseCase.findByQuery(q => {
                q.where(AdminUserTableSchema.FIELDS.USER_ID, session.userId);
                q.where(AdminUserTableSchema.FIELDS.IS_DELETED, 0);
                q.limit(1);
            }, []);
        })
            .then(object => {
                let obj;
                obj = AdminUserModel.fromDto(object.models[0], ["password","userId"]);
                if (obj == null) {
                    Utils.responseError(res, new Exception(
                        ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND,
                        MessageInfo.MI_USER_NOT_EXIST,
                        false,
                        HttpStatus.BAD_REQUEST
                    ));
                    return Promise.break;
                } else {
                    res.json(obj);
                }
            })
            .catch(err => {
                Utils.responseError(res, err);
            });
    }
}

export default MeHandler;
