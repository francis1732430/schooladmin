/**
 *    
 */
import {AuthorizationRoleUseCase,AuthorizationRuleUseCase,AuthorizationRuleSetUseCase} from "../../domains"; 
import {ErrorCode, HttpStatus, MessageInfo, Properties} from "../../libs/constants";
import {Utils} from "../../libs/utils";
import {AuthorizationRoleTableSchema,AuthorizationRuleTableSchema,AuthorizationRuleSetTableSchema} from "../../data/schemas";
import {Exception, AuthorizationRoleModel,AuthorizationRuleModel,AuthorizationRuleSetModel} from "../../models";
import * as express from "express";
import {Promise} from "thenfail";
import * as formidable from "formidable";
import {Excel} from "../../libs";
import {BaseHandler} from "../base.handler";
import {BearerObject} from "../../libs/jwt";

export class PermissionHandler extends BaseHandler {

    constructor() {
        super();
    }

    /**
     *
     * @param req
     * @param res
     * @returns {any}
     */
    public static detail(req:express.Request, res:express.Response):any {
        let session:BearerObject = req[Properties.SESSION];
        console.log(session);
        let userId = session.userId;
        console.log(userId);
        return Promise.then(() => {
            
            return AuthorizationRoleUseCase.findByQuery(q => {
                q.where(AuthorizationRoleTableSchema.FIELDS.USER_ID, userId);
                q.limit(1);
            }, []);
            
        })
            .then(object => {                 
                let role = AuthorizationRoleModel.fromDto(object.models[0])
                return AuthorizationRuleUseCase.findByQuery(q => {
                    q.select(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.RULE_ID}`,
                        `${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.PERMISSION}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.RID}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.MODULE_ID}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.MODULE_NAME}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.ACTION}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.ROUTES}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.ICON}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.PARENT_ID}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.LEVEL}`
                        );
                    q.innerJoin(AuthorizationRuleSetTableSchema.TABLE_NAME, `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.MODULE_ID}`, `${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.MODULE_ID}`);
                    q.where(AuthorizationRuleTableSchema.FIELDS.PERMISSION, 'allow');
                    q.where(AuthorizationRuleTableSchema.FIELDS.ROLE_ID, role.parentId);
                    q.orderBy(`${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.MODULE_ID}`, 'asc');
                    //q.limit(13);    
                }, []);
            })
            .then(object => {
                console.log("++++++++++=========================",object.models.length);
                //console.log(AuthorizationRuleModel.fromDto(object.models[0]));
               
                //noinspection TypeScriptUnresolvedVariable
                let ret = [];
                let retKey = 0;
                let retKeySel = 0;
                let retActionKey = 0;
                let retActionKeySel = 0;
               
                //noinspection TypeScriptUnresolvedVariable
                if (object != null && object.models != null) {
                    //noinspection TypeScriptUnresolvedVariable
                    object.models.forEach(obj => {
                       
                        //console.log(AuthorizationRuleModel.fromDto(obj));
                        let rule = AuthorizationRuleModel.fromDto(obj);
                        console.log(rule)
                        if(rule.level==1){
                            ret.push(rule);
                            retKeySel = retKey;
                            console.log("COUNTER ============ ",retKeySel);
                            if(ret[retKeySel]) {
                                ret[retKeySel].submenu = [];
                                ret[retKeySel].action = [];
                            }
                            retActionKey = 0;
                            retKey++;
                        } else if(rule.level==2){
                            if(ret[retKeySel]) {
                                ret[retKeySel].submenu.push(rule);
                                ret[retKeySel].submenu[retActionKey].submenu = [];
                            }
                            retActionKeySel = retActionKey;
                            retActionKey++;

                            if(rule.action==null){
                               
                            } else {
                                if(ret[retKeySel]) {
                                    ret[retKeySel].action.push(rule.action);
                                }
                            }
                        } else if(rule.level==3){
                            if(ret[retKeySel]) {
                                if(rule.action==null){
                                    //console.log(ret[retKeySel].submenu[retActionKeySel])
                                    ret[retKeySel].submenu[retActionKeySel].submenu.push(rule);
                                } else {
                                    ret[retKeySel].action.push(rule.action);
                                }
                            }
                        }
                    });
                    //res.header(Properties.HEADER_TOTAL, total.toString(10));

                   console.log(ret)

                    res.json(ret);
                } else {
                    Utils.responseError(res, new Exception(
                        ErrorCode.RESOURCE.INVALID_REQUEST,
                        MessageInfo.MI_ROLE_NOT_EXIST,
                        false,
                        HttpStatus.BAD_REQUEST
                    ));
                    return Promise.void;
                }
            })
            .catch(err => {
                Utils.responseError(res, err);
            });
    }

    /**
     *
     * @param req
     * @param res
     * @returns {any}
     */
    public static moduleDetail(req:express.Request, res:express.Response):any {
        let session:BearerObject = req[Properties.SESSION];
        console.log(session);
        let userId = session.userId;
        let rid = req.params.rid;
        console.log(userId);
        return Promise.then(() => {
            
            return AuthorizationRoleUseCase.findByQuery(q => {
                q.where(AuthorizationRoleTableSchema.FIELDS.USER_ID, userId);
                q.limit(1);
            }, []);
            
        })
            .then(object => {                 
                let role = AuthorizationRoleModel.fromDto(object.models[0])
                return AuthorizationRuleUseCase.findByQuery(q => {
                    q.select(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.RULE_ID}`,
                        `${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.PERMISSION}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.RID}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.MODULE_ID}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.MODULE_NAME}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.ACTION}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.ROUTES}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.ICON}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.PARENT_ID}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.LEVEL}`
                        );
                    q.innerJoin(AuthorizationRuleSetTableSchema.TABLE_NAME, `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.MODULE_ID}`, `${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.MODULE_ID}`);
                    q.where(AuthorizationRuleTableSchema.FIELDS.PERMISSION, 'allow');
                    q.where(AuthorizationRuleTableSchema.FIELDS.ROLE_ID, role.parentId);
                    q.orderBy(`${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.MODULE_ID}`, 'asc');
                    //q.limit(13);    
                }, []);
            })
            .then(object => {
                console.log("++++++++++=========================",object.models.length);
                //console.log(AuthorizationRuleModel.fromDto(object.models[0]));
               
                //noinspection TypeScriptUnresolvedVariable
                let ret = [];let retNew = [];
                let retKey = 0;
                let retKeySel = 0;
                let retActionKey = 0;
                let retActionKeySel = 0;
               
                //noinspection TypeScriptUnresolvedVariable
                if (object != null && object.models != null) {
                    //noinspection TypeScriptUnresolvedVariable
                    object.models.forEach(obj => {
                        console.log(obj)
                        //console.log(AuthorizationRuleModel.fromDto(obj));
                        let rule = AuthorizationRuleModel.fromDto(obj);
                        console.log(rule)
                        if(rule.level==1){
                            ret.push(rule);
                            retKeySel = retKey;
                            console.log("COUNTER ============ ",retKeySel);
                            if(ret[retKeySel]) {
                                ret[retKeySel].submenu = [];
                                ret[retKeySel].action = [];
                            }
                            retActionKey = 0;
                            retKey++;
                        } else if(rule.level==2){
                            if(ret[retKeySel]) {
                                ret[retKeySel].submenu.push(rule);
                                ret[retKeySel].submenu[retActionKey].submenu = [];
                            }
                            retActionKeySel = retActionKey;
                            retActionKey++;

                            if(rule.action==null){
                               
                            } else {
                                if(ret[retKeySel]) {
                                    ret[retKeySel].action.push(rule.action);
                                }
                            }
                        } else if(rule.level==3){
                            if(ret[retKeySel]) {
                                if(rule.action==null){
                                    //console.log(ret[retKeySel].submenu[retActionKeySel])
                                    ret[retKeySel].submenu[retActionKeySel].submenu.push(rule);
                                } else {
                                    ret[retKeySel].action.push(rule.action);
                                }
                            }
                        }
                    });
                    //res.header(Properties.HEADER_TOTAL, total.toString(10));
                    ret.forEach(obj => {
                        if(obj.rid==rid) {
                            retNew = obj;

                        }
                    });
                   console.log(retNew)

                    res.json(retNew);
                } else {
                    Utils.responseError(res, new Exception(
                        ErrorCode.RESOURCE.INVALID_REQUEST,
                        MessageInfo.MI_ROLE_NOT_EXIST,
                        false,
                        HttpStatus.BAD_REQUEST
                    ));
                    return Promise.void;
                }
            })
            .catch(err => {
                Utils.responseError(res, err);
            });
    }


    /**
     *
     * @param req
     * @param res
     * @returns {any}
     */
    public static master(req:express.Request, res:express.Response):any {
        let session:BearerObject = req[Properties.SESSION];
        console.log(session);
        let userId = session.userId;
        console.log(userId);
        return Promise.then(() => {
            
            return AuthorizationRoleUseCase.findByQuery(q => {
                q.where(AuthorizationRoleTableSchema.FIELDS.USER_ID, userId);
                q.limit(1);
            }, []);
            
        })
            .then(object => {                 
                let role = AuthorizationRoleModel.fromDto(object.models[0])
                return AuthorizationRuleUseCase.findByQuery(q => {
                    q.select(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.RULE_ID}`,
                        //`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.PERMISSION}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.MODULE_ID}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.MODULE_NAME}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.ACTION}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.ROUTES}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.ICON}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.PARENT_ID}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.LEVEL}`
                        );
                    q.innerJoin(AuthorizationRuleSetTableSchema.TABLE_NAME, `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.MODULE_ID}`, `${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.MODULE_ID}`);
                    q.where(AuthorizationRuleTableSchema.FIELDS.PERMISSION, 'allow');
                    q.where(AuthorizationRuleTableSchema.FIELDS.ROLE_ID, role.parentId);
                    q.orderBy(`${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.MODULE_ID}`, 'asc');
                    //q.limit(13);    
                }, []);
            })
            .then(object => {
                
                let ret = [];
               
                //noinspection TypeScriptUnresolvedVariable
                if (object != null && object.models != null) {

                    ret = AuthorizationRuleSetUseCase.permissionFormat(object);
                    

                    res.json(ret);
    
                } else {
                    Utils.responseError(res, new Exception(
                        ErrorCode.RESOURCE.INVALID_REQUEST,
                        MessageInfo.MI_ROLE_NOT_EXIST,
                        false,
                        HttpStatus.BAD_REQUEST
                    ));
                    return Promise.void;
                }
            })
            .catch(err => {
                Utils.responseError(res, err);
            });
    }

    public static selectModule(req:express.Request, res:express.Response):any {
        let session:BearerObject = req[Properties.SESSION];
        console.log(session);
        let userId = session.userId;
        console.log(userId);

        return Promise.then(() => {

            return AuthorizationRoleUseCase.findOne( q => {
                q.where(`${AuthorizationRoleTableSchema.FIELDS.USER_ID}`,userId);
                q.where(`${AuthorizationRoleTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {
            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.INVALID_REQUEST,
                    MessageInfo.MI_USER_NOT_EXIST,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }

            let role = AuthorizationRoleModel.fromDto(object)
            return AuthorizationRoleUseCase.findByQuery( q => {
                q.select(`${AuthorizationRoleTableSchema.TABLE_NAME}.*`,`${AuthorizationRuleSetTableSchema.TABLE_NAME}.*`);
                q.innerJoin(`${AuthorizationRuleTableSchema.TABLE_NAME}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.ROLE_ID}`);
                q.innerJoin(`${AuthorizationRuleSetTableSchema.TABLE_NAME}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.MODULE_ID}`,`${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.MODULE_ID}`);
                q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.ROLE_ID}`,role.roleId);
                q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.PERMISSION}`,"allow");
                q.orderBy(`${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.PARENT_ID}`,"asc");
            })
        }).then((object) => {
     
            if(object.models.length == 0 ) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.INVALID_REQUEST,
                    MessageInfo.MI_MODULE_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }




        })

    }

}

export default PermissionHandler;
