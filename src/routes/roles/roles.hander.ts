/**
 *    
 */
import {AuthorizationRoleUseCase,AuthorizationRuleUseCase,AuthorizationRuleSetUseCase,AdminUserUseCase,SchoolUseCase} from "../../domains"; 
import {AuthorizationRuleDto} from "../../data/models";
import {ErrorCode, HttpStatus, MessageInfo, Properties,DATE_FORMAT} from "../../libs/constants";
import {Utils} from "../../libs/utils";
import {AuthorizationRoleTableSchema,AuthorizationRuleTableSchema,AuthorizationRuleSetTableSchema, AdminUserTableSchema, SchoolTableSchema, DirectoryDistrictTableSchema, DirectoryTalukTableSchema} from "../../data/schemas";
import {Exception, AuthorizationRoleModel,AuthorizationRuleModel} from "../../models";
import * as express from "express";
import {Promise} from "thenfail";
import * as formidable from "formidable";
import {Excel} from "../../libs";
import {BaseHandler} from "../base.handler";
import {BearerObject} from "../../libs/jwt";
let fs = require('fs'); 
import {Uploader} from "../../libs";
import { checkUser } from "../../middlewares/checkuser";
var dateFormat = require('dateformat');
let knex=require("knex");
export class RoleHandler extends BaseHandler {
    constructor() {
        super();
    }

    /**
     *
     * @param req
     * @param res
     * @returns {any}
     */
    public static create(req:express.Request, res:express.Response):any {
        let session:BearerObject = req[Properties.SESSION];
        let checkuser:BearerObject = req[Properties.CHECK_USER];
        let school:BearerObject=req[Properties.SCHOOL_ID];
        req.body.createdBy = session.userId;
        req.body.roleType = 'U';
        req.body.schoolId=school;
        let authorizationRole = AuthorizationRoleModel.fromRequest(req);
        if (authorizationRole == null || authorizationRole.roleName == null) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.GENERIC,
                MessageInfo.MI_ROLE_NAME_NOT_EMPTY,
                false, HttpStatus.BAD_REQUEST
            ));
        }

        // if (authorizationRole.permissionType != 1 && authorizationRole.permissionType != 2) {
        //     return Utils.responseError(res, new Exception(
        //         ErrorCode.RESOURCE.GENERIC,
        //         MessageInfo.MI_PERMISSION_TYPE_NOT_EMPTY,
        //         false, HttpStatus.BAD_REQUEST
        //     ));
        // }


        if (req.body.permission == null && req.body.permission == undefined){
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.GENERIC,
                MessageInfo.MI_PERMISSION_NAME_NOT_EMPTY,
                false, HttpStatus.BAD_REQUEST
            ));

        }

        let checkmoduleId: any;
        let checkpermission: any;
        let count = 0;
        let roleId:number;
        let permission= req.body.permission;

        return Promise.then(() => {
            return AuthorizationRoleUseCase.findOne((q) => {
                q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.USER_ID}`,authorizationRole.createdBy);
                q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {
           authorizationRole.parentId=object.get('parent_id');
        return AdminUserUseCase.findOne( q => {
            q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,authorizationRole.userId);
            q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}`,0);
          })
        }).then((objects) => {
            if(objects == null && objects == undefined) {
                
                   Utils.responseError(res, new Exception(
                       ErrorCode.RESOURCE.INVALID_REQUEST,
                       MessageInfo.MI_USER_NOT_EXIST,
                       false,
                       HttpStatus.BAD_REQUEST
                   ));
                   return Promise.break;

           }
        //    if(checkuser && checkuser.school == true) {
        //          authorizationRole.schoolId=checkuser.schoolId
        //    }
            return Promise.void;
        }).then(() => {
            
            permission.forEach(Rule => {
                checkmoduleId =  Rule.moduleId == null && Rule.moduleId == undefined ? count++ : count;
                checkpermission = Rule.isChecked == null && Rule.isChecked == undefined ? count++ : count;

            });

        }).then(obj => {

            if (count > 0) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.GENERIC,
                    MessageInfo.MI_PERMISSION_NAME_NOT_EMPTY,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
        return AuthorizationRoleUseCase.findOne(q => {
            q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.USER_ID}`,authorizationRole.userId);
            q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME}`,authorizationRole.roleName);
            q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.IS_DELETED}`,0);
        })
        }).then((object) => {

            
         //else {
        //         return AuthorizationRoleUseCase.findOne(q => {
        //             q.where(`${AuthorizationRoleTableSchema.FIELDS.ROLE_TYPE}`,'G');
        //             q.where(`${AuthorizationRoleTableSchema.FIELDS.ROLE_ID}`,authorizationRole.parentId);
        //             q.where(`${AuthorizationRoleTableSchema.FIELDS.IS_DELETED}`,0);
        //         },[]);
        //     }
        // }).then((object) => {
        //     if (object!=null) {
        //         //authorizationRole.parentId=object.get("role_id");
        //         authorizationRole.roleName=object.get("role_name");
        //    return AuthorizationRoleUseCase.findOne(q => {
        //     q.where(`${AuthorizationRoleTableSchema.FIELDS.ROLE_TYPE}`,'U');
        //     q.where(`${AuthorizationRoleTableSchema.FIELDS.PARENT_ID}`,authorizationRole.parentId);
        //     q.where(`${AuthorizationRoleTableSchema.FIELDS.USER_ID}`,authorizationRole.userId);
        //     q.where(`${AuthorizationRoleTableSchema.FIELDS.IS_DELETED}`,0);
        // },[]);
        //     } else {
        //         Utils.responseError(res, new Exception(
        //             ErrorCode.RESOURCE.GENERIC,
        //             MessageInfo.MI_ROLE_NAME_NOT_FOUND,
        //             false,
        //             HttpStatus.BAD_REQUEST
        //         ));
        //         return Promise.break;
               
        //     }
        // }).then((object) => {
          
        //     if(object != null){
        //         Utils.responseError(res, new Exception(
        //             ErrorCode.RESOURCE.GENERIC,
        //             MessageInfo.MI_ROLE_ALREADY_ASSIGNED,
        //             false,
        //             HttpStatus.BAD_REQUEST
        //         ));
        //         return Promise.break;
        //     }

        if(object != null){
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.GENERIC,
                    MessageInfo.MI_ROLE_ALREADY_ASSIGNED,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
        }
            return AuthorizationRoleUseCase.create(authorizationRole);
        }).then(object => {

            if (object && object !== null && object.attributes !== null){
                let rid = object.attributes.rid;
                return AuthorizationRoleUseCase.findByQuery(q => {
                    q.where(`${AuthorizationRoleTableSchema.FIELDS.RID}`,rid);
                },[]);
            }

        }).then(object => {
            if (object && object !== null && object.models.length>0) {  
                let roleData = AuthorizationRoleModel.fromDto(object.models[0]);
                roleId = roleData.roleId;
                if(checkuser.school == true){
                    return AuthorizationRuleUseCase.savepermission(roleId,permission);
                }
                   
            }

        }).then(object => {
            console.log(object);
            let data  = {};
            data["message"] = MessageInfo.MI_ROLE_ADDED;
            res.json(data);


        }).catch(err => {
            Utils.responseError(res, err);
        });
    }

    /**
     *
     * @param req
     * @param res
     * @returns {any}
     */
    public static update(req:express.Request, res:express.Response):any {
        let session:BearerObject = req[Properties.SESSION];
        let checkuser:BearerObject = req[Properties.CHECK_USER];
        let authorizationRole = AuthorizationRoleModel.fromRequest(req);
        let rid = req.params.rid;
        // if (authorizationRole == null || authorizationRole.parentId == null) {
        //     return Utils.responseError(res, new Exception(
        //         ErrorCode.RESOURCE.GENERIC,
        //         MessageInfo.MI_ROLE_NAME_NOT_EMPTY,
        //         false, HttpStatus.BAD_REQUEST
        //     ));
        // }
        if (authorizationRole == null || authorizationRole.roleName == null) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.GENERIC,
                MessageInfo.MI_ROLE_NAME_NOT_EMPTY,
                false, HttpStatus.BAD_REQUEST
            ));
        }
        if (req.body.permission == null && req.body.permission == undefined){
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.GENERIC,
                MessageInfo.MI_PERMISSION_NAME_NOT_EMPTY,
                false, HttpStatus.BAD_REQUEST
            ));

        }

        let checkmoduleId: any;
        let checkpermission: any;
        let count = 0;
        let roleId:number;
        let permission= req.body.permission;
        

        return Promise.then(() => {
            
            permission.forEach(Rule => {
                checkmoduleId =  Rule.moduleId == null && Rule.moduleId == undefined ? count++ : count;
                checkpermission = Rule.isChecked == null && Rule.isChecked == undefined ? count++ : count;

            });

        }).then(obj => {
            if (count > 0) {

                return Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.GENERIC,
                    MessageInfo.MI_PERMISSION_NAME_NOT_EMPTY,
                    false, HttpStatus.BAD_REQUEST
                ));
            } else { 
    
                  return AuthorizationRoleUseCase.findOne(q => {
                    q.where(`${AuthorizationRoleTableSchema.FIELDS.RID}`,rid);
                    q.where(`${AuthorizationRoleTableSchema.FIELDS.IS_DELETED}`,0);
                },[]);
            }

        })
        .then(object => {
            if (object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND,
                    MessageInfo.MI_USER_NOT_EXIST,
                    false, 
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            } else {
                //let role_Id=object.get("role_id");   
                // return AuthorizationRoleUseCase.findOne(q => {
                //     q.where(`${AuthorizationRoleTableSchema.FIELDS.ROLE_TYPE}`,'G');
                //     q.where(`${AuthorizationRoleTableSchema.FIELDS.ROLE_ID}`,authorizationRole.parentId);
                //     q.where(`${AuthorizationRoleTableSchema.FIELDS.IS_DELETED}`,0);
                // },[]);
           
                // return AuthorizationRoleUseCase.findOne(q => {
                //     q.whereNot(`${AuthorizationRoleTableSchema.FIELDS.RID}`,rid);
                //     q.where(`${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME}`,authorizationRole.roleName);
                //     q.where(`${AuthorizationRoleTableSchema.FIELDS.IS_DELETED}`,0);
                // },[]);
                return Promise.void;
            }
        }).then((object) => {
            if (object == null) {
                return AuthorizationRoleUseCase.updateById(rid,authorizationRole);
            } else {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.GENERIC,
                    MessageInfo.MI_ROLE_NAME_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
               
            }

        }).then(object => {

            if (object && object !== null && object.attributes !== null){
                return AuthorizationRoleUseCase.findByQuery(q => {
                    q.where(`${AuthorizationRoleTableSchema.FIELDS.RID}`,rid);
                },[]);
            }


        }).then(object => {
            if (object && object !== null && object.models.length>0) {  
                let roleData = AuthorizationRoleModel.fromDto(object.models[0]);
                roleId = roleData.roleId;
                return AuthorizationRuleUseCase.savepermission(roleId,permission);
              
            }
        }).then(object => {
            console.log(object);
            let data  = {};
            data["message"] = MessageInfo.MI_ROLE_UPDATED;
            res.json(data);


        }).catch(err => {
            Utils.responseError(res, err);
        });
    }


    /**
     *
     * @param req
     * @param res
     * @returns {any}
     */

    public static view(req:express.Request, res:express.Response):any {
        let session:BearerObject = req[Properties.SESSION];
        let checkuser:BearerObject = req[Properties.CHECK_USER];
        let rid = req.params.rid;
        let role :any;

        return Promise.then(() => {    
            return AuthorizationRoleUseCase.findById(rid);
        })
        .then(object => {
            if (object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND,
                    MessageInfo.MI_ROLE_NOT_EXIST,
                    false, 
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            } else {
                role = AuthorizationRoleModel.fromDto(object);
                let tmpId=role.tmpId;
                return AuthorizationRuleUseCase.findByQuery(q => {
                    if(checkuser.global && checkuser.global == true){

                        q.select(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.RULE_ID}`,
                        `${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.PERMISSION}`,
                        `${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID}`,
                        `${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME}`,
                        `${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_NAME}`,
                        `${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_NAME}`,     
                        );
                        q.select(knex.raw(`CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME}," ",${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) as asigneeName`));
                        q.innerJoin(`${AuthorizationRoleTableSchema.TABLE_NAME}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.ROLE_ID}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID}`);
                        q.innerJoin(`${SchoolTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_ID}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID}`);
                        q.innerJoin(`${DirectoryDistrictTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.DISTRICT_ID}`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`);
                        q.innerJoin(`${DirectoryTalukTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.CITY_ID}`,`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_ID}`);
                        q.innerJoin(`${AdminUserTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.CREATED_BY}`);
                        q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.PERMISSION}`,"allow");
                        q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.ROLE_ID}`, role.roleId);
                       // q.groupBy(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.RULE_ID}`);      
                        let condition=`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID} IS NOT NULL`;
                        q.whereRaw(condition);
                    }   else {
                        q.select(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.RULE_ID}`,
                        `${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.PERMISSION}`,
                        `${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID}`,       
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.MODULE_ID}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.MODULE_NAME}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.ACTION}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.ROUTES}`,
                       // `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.ICON}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.PARENT_ID}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.LEVEL}`
                        );
                    q.innerJoin(AuthorizationRuleSetTableSchema.TABLE_NAME, `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.MODULE_ID}`, `${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.MODULE_ID}`); 
                    q.where(AuthorizationRuleTableSchema.FIELDS.ROLE_ID, role.roleId);
                    q.orderBy(`${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.LEVEL}`, 'asc');
                    //q.limit(13); 
                    }   
                }, []);
            }
        })
        .then(object => {
            
            let ret = [];
            role.permission = {};
            if (object != null && object.models != null) {
    if(checkuser.global && checkuser.global == true){
        ret = AuthorizationRuleSetUseCase.global_permission_format(object);
        role.permission = ret;
    } else {
        ret = AuthorizationRuleSetUseCase.permissionFormat(object);
        role.permission = ret;
    }
            }
            res.json(role);
            
        }).catch(err => {
            Utils.responseError(res, err);
        });
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
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.MODULE_NAME}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.ACTION}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.ROUTES}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.PARENT_ID}`
                        );
                    q.innerJoin(AuthorizationRuleSetTableSchema.TABLE_NAME, `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.MODULE_ID}`, `${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.MODULE_ID}`);
                    q.where(AuthorizationRuleTableSchema.FIELDS.PERMISSION, 'allow');
                    q.where(AuthorizationRuleTableSchema.FIELDS.ROLE_ID, role.parentId);
                    //q.limit(1);    
                }, []);
            })
            .then(object => {
                //console.log(object.models[0])
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
                        if(rule.parentId==0){
                            ret.push(rule);
                            retKeySel = retKey;
                            ret[retKeySel].submenu = [];
                            ret[retKeySel].action = [];
                            retActionKey = 0;
                        } else {
                            console.log(ret[retKeySel]);
                            if(rule.action==null){
                                ret[retKeySel].submenu.push(rule);
                            } else {
                                ret[retKeySel].action.push(rule.action);
                            }
                        }
                        retKey++;
                    });
                    //res.header(Properties.HEADER_TOTAL, total.toString(10));

                   

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
    public static selectList(req:express.Request, res:express.Response):any {
        let session:BearerObject = req[Properties.SESSION];
        let userId = session.userId;
        return Promise.then(() => {            
            return AuthorizationRoleUseCase.list(userId);   
        })
        .then(object => {
            res.json(object);
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
    public static list(req:express.Request, res:express.Response):any {
        let session:BearerObject = req[Properties.SESSION];
        let checkuser:BearerObject = req[Properties.CHECK_USER];
        let school:BearerObject = req[Properties.SCHOOL_ID];
        let userId = session.userId;
        let role:any;
        let offset = parseInt(req.query.offset) || null;
        let limit = parseInt(req.query.limit) || null;
        let sortKey;
        let sortValue;
        let searchobj = [];
        let total = 0;
        let searchValue = req.query.searchValue;
        for (let key in req.query) {
            console.log(req.query[key]);
            if(key=='sortKey'){
                sortKey = req.query[key];
            }
            else if(key=='sortValue'){
                sortValue = req.query[key];
            } else if(req.query[key]!='' && key!='limit' && key!='offset' && key!='sortKey' && key!='sortValue'){
                searchobj[key] = req.query[key];
            }
        }
        console.log(searchobj);
        return Promise.then(() => {
            return AuthorizationRoleUseCase.findOne(q => {
                q.where(AuthorizationRoleTableSchema.FIELDS.USER_ID, userId);
            }, []);
        })
        .then((object) => {
            role = AuthorizationRoleModel.fromDto(object);
            return AuthorizationRoleUseCase.countByQuery(q => {
                q.leftJoin(`${AdminUserTableSchema.TABLE_NAME}`, `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`, `${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.USER_ID}`);
                q.leftJoin(`${AdminUserTableSchema.TABLE_NAME} as createdUser`, `createdUser.${AdminUserTableSchema.FIELDS.USER_ID}`, `${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.CREATED_BY}`);
                q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.IS_DELETED}`, 0);
                if(checkuser && checkuser.global == true) {
                  if(checkuser && checkuser.tmp == true){
  //                  q.whereRaw(`(${AuthorizationRoleTableSchema.FIELDS.CREATED_BY} = '${userId}')`);
                    let condition=`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.SCHOOL_ID}=${checkuser.schoolId}`;
                    q.whereRaw(condition);
                    } else {
                        q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.SCHOOL_ID}`, 0);
                    }
                } else  {
                    if(userId != "18") {
                        q.whereRaw(`(${AuthorizationRoleTableSchema.FIELDS.CREATED_BY} = '${userId}')`);
                        let condition=`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.SCHOOL_ID}=${school}`;
                        q.whereRaw(condition);
                    } else {
                        let condition=`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.SCHOOL_ID}=${school}`;
                        q.whereRaw(condition);
                    }
                }
                let condition;
                if (searchobj) {
                    for (let key in searchobj) { 
                        if(searchobj[key]!=null && searchobj[key]!=''){
                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);

                            if(key === "roleId"){
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key === "roleName"){
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key === "updatedDate") {
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key === "createdDate") {
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else {
                                searchval = searchValue; 
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                            }
                        }
                    }
                } 
                
            });
        })
        .then((totalObject) => {
            total = totalObject;
            return AuthorizationRoleUseCase.findByQuery(q => {
                q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.IS_DELETED}`, 0);
                q.select(`${AuthorizationRoleTableSchema.TABLE_NAME}.*`);
                q.select(knex.raw(`CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME}," ",${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) as userName`));
                q.select(knex.raw(`CONCAT(createdUser.${AdminUserTableSchema.FIELDS.FIRSTNAME}," ",createdUser.${AdminUserTableSchema.FIELDS.LASTNAME}) as createdByName`))
                q.leftJoin(`${AdminUserTableSchema.TABLE_NAME}`, `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`, `${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.USER_ID}`);
                q.leftJoin(`${AdminUserTableSchema.TABLE_NAME} as createdUser`, `createdUser.${AdminUserTableSchema.FIELDS.USER_ID}`, `${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.CREATED_BY}`);
                if(checkuser && checkuser.global == true) {
                    if(checkuser && checkuser.tmp == true){
    //                  q.whereRaw(`(${AuthorizationRoleTableSchema.FIELDS.CREATED_BY} = '${userId}')`);
                      let condition=`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.SCHOOL_ID}=${checkuser.schoolId}`;
                      q.whereRaw(condition);
                      }else {
                        q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.SCHOOL_ID}`, 0);
                    }
                  } else  {
                      if(userId != "18") {
                          q.whereRaw(`(${AuthorizationRoleTableSchema.FIELDS.CREATED_BY} = '${userId}')`);
                          let condition=`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.SCHOOL_ID}=${school}`;
                          q.whereRaw(condition);
                      } else {
                          let condition=`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.SCHOOL_ID}=${school}`;
                          q.whereRaw(condition);
                      }
                  }
                let condition;
                if (searchobj) {
                    for (let key in searchobj) { 
                        if(searchobj[key]!=null && searchobj[key]!=''){
                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);
                            if(key === "roleId"){
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key === "roleName"){
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key === "updatedDate") {
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key === "createdDate") {
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else {
                                searchval = searchValue; 
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                            }
                        }
                    }
                } 

                if (offset != null) {
                    q.offset(offset);
                }
                if (limit != null) {
                    q.limit(limit);
                }
                if (sortKey != null && sortValue != '') {
                    if (sortKey != null && (sortValue == 'ASC' || sortValue == 'DESC' || sortValue == 'asc' || sortValue == 'desc')) {
                        let ColumnSortKey = Utils.changeSearchKey(sortKey);
                        if (sortKey === "roleId") {
                            q.orderBy(ColumnSortKey, sortValue);
                        } else if (sortKey === "roleName") {
                            q.orderBy(ColumnSortKey, sortValue);
                        } else if (sortKey === "updatedDate") {
                            q.orderBy(ColumnSortKey, sortValue);
                        } else if (sortKey === "createdDate") {
                            q.orderBy(ColumnSortKey, sortValue);
                        }
                    }
                }
            });
        })
        .then(objects => {
            if (objects != null && objects.models != null && objects.models.length != null) {
                let ret = [];
                objects.models.forEach(object => {
                    let role = AuthorizationRoleModel.fromDto(object);
                    role["createdBy"] = object.get('createdByName');
                    role["userName"] = object.get('userName');
                    ret.push(role);
                });
                res.header(Properties.HEADER_TOTAL, total.toString(10));

                if (offset != null) {
                    res.header(Properties.HEADER_OFFSET, offset.toString(10));
                }
                if (limit != null) {
                    res.header(Properties.HEADER_LIMIT, limit.toString(10));
                }
    
                res.json(ret);
                
            }
            let exception;
            exception = new Exception(ErrorCode.ROLE.NO_ROLE_FOUND, MessageInfo.MI_NO_ROLE_FOUND, false);
            exception.httpStatus = HttpStatus.BAD_REQUEST;
            return exception;
        })
        .catch(err => {
            Utils.responseError(res, err);
        })
        .enclose();
    }

    public static export(req:express.Request, res:express.Response):any {
        let session:BearerObject = req[Properties.SESSION];
        let userId = session.userId;
        let role:any;
        let sortKey;
        let sortValue;
        let searchobj = [];
        for (let key in req.query) {
            console.log(req.query[key]);
            if(key=='sortKey'){
                sortKey = req.query[key];
            }
            else if(key=='sortValue'){
                sortValue = req.query[key];
            } else if(req.query[key]!='' && key!='limit' && key!='offset' && key!='sortKey' && key!='sortValue'){
                searchobj[key] = req.query[key];
            }
        }
        console.log(searchobj);
        return Promise.then(() => {
            return AuthorizationRoleUseCase.findOne(q => {
                q.where(AuthorizationRoleTableSchema.FIELDS.USER_ID, userId);
            }, []);
        })
        .then((object) => {
            role = AuthorizationRoleModel.fromDto(object);
            return AuthorizationRoleUseCase.findByQuery(q => {
                q.where(AuthorizationRoleTableSchema.FIELDS.ROLE_TYPE, 'G');
                if(userId!='1') {
                    q.whereRaw(`(${AuthorizationRoleTableSchema.FIELDS.CREATED_BY} = '${userId}' OR ${AuthorizationRoleTableSchema.FIELDS.ROLE_ID} = '${role.parentId}')`);
                }

                let condition;
                if (searchobj) {
                    for (let key in searchobj) { 
                        if(searchobj[key]!=null && searchobj[key]!=''){
                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);
                            condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        }
                    }
                } 
                if(sortKey!=null && sortValue!='') {
                    let ColumnSortKey = Utils.changeSearchKey(sortKey);
                    q.orderBy(ColumnSortKey, sortValue);
                }
                
            });
        })
        .then(objects => {
            console.log(objects);
            let csvdata:string;
            csvdata = "Role Id,Role Name,Created On,Last Updated On"+'\n';
            if (objects != null && objects.models != null) {
                objects.models.forEach(obj => {
                    let roleData = AuthorizationRoleModel.fromDto(obj);
                    csvdata += roleData["roleId"]+","+roleData["roleName"]+","+dateFormat(roleData["createdDate"], DATE_FORMAT.DEFAULT)+","+dateFormat(roleData["updatedDate"], DATE_FORMAT.DEFAULT)+'\n';
                });
            }
            let now = dateFormat(new Date(), "yyyy_mm_dd_h_MM_ss");
            let fileName = `Roles_${now}.csv`;
            let filePath = 'export/'+fileName;
            fs.writeFile(filePath, csvdata, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
            return Uploader.uploadCSV(filePath,fileName);
        })
        .then((exportLink) => {
            console.log(exportLink.Location);
            let data = {};
            data["link"] = exportLink.Location;
            res.json(data);
        })  
        .catch(err => {
            Utils.responseError(res, err);
        })
        .enclose();
    }

    public static destroy(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let createdBy = parseInt(session.userId);
        let rid = req.params.rid || "";
        return Promise.then(() => {
            return AuthorizationRoleUseCase.destroyById(rid,createdBy);
        })
        .then(() => {
            res.status(HttpStatus.NO_CONTENT);
            res.json({});
        })
        .catch(err => {
            Utils.responseError(res, err);
        });
    }

    public static massDelete(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let createdBy = parseInt(session.userId);
        let rids = req.body.rids || "";
        let userRids = [];
        if(rids) {
            userRids = JSON.parse(rids);
        }else{
            Utils.responseError(res, new Exception(
                ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND,
                MessageInfo.MI_ROLE_NOT_EXIST,
                false,
                HttpStatus.BAD_REQUEST
            ));
            
        }
        return Promise.then(() => {
            console.log(rids);
            console.log(userRids);
            if(userRids!=null) {
                let ret = [];
                userRids.forEach(rid => {
                    let del = AuthorizationRoleUseCase.destroyById(rid,createdBy);
                    //console.log("====================fdgdfgdfg",del);
                    //ret.push());
                });
                console.log(ret);
                return ret;
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
        .then((result) => {
            let data ={};
            data["message"] = MessageInfo.MI_ROLES_DELETED;
            res.json(data);
        })
        .catch(err => {
            Utils.responseError(res, err);
        });
    }

    public static exportSelected(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let userId = session.userId;
        let rids = req.body.rids || "";
        let roleRids = [];
        let role:any;
        if (rids) {
            roleRids = JSON.parse(rids);
        } else {
           return Utils.responseError(res, new Exception(
                ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND,
                MessageInfo.MI_ROLE_NOT_EXIST,
                false,
                HttpStatus.BAD_REQUEST
            ));

        }
        let adminUser:any;
        return Promise.then(() => {
            return AuthorizationRoleUseCase.findOne(q => {
                q.where(AuthorizationRoleTableSchema.FIELDS.USER_ID, userId);
            }, []);

        }).then((object) =>{
            role = AuthorizationRoleModel.fromDto(object);
            return AuthorizationRoleUseCase.findByQuery( q => {
                q.where(AuthorizationRoleTableSchema.FIELDS.ROLE_TYPE, 'G');
                q.where(AuthorizationRoleTableSchema.FIELDS.IS_DELETED, 0);
                if(userId!='1') {
                    q.whereRaw(`(${AuthorizationRoleTableSchema.FIELDS.CREATED_BY} = '${userId}' OR ${AuthorizationRoleTableSchema.FIELDS.ROLE_ID} = '${role.parentId}')`);
                }
                q.whereIn(AuthorizationRoleTableSchema.FIELDS.RID, roleRids);
            });
        })
            .then((objects) => {
                let csvdata:string;
                adminUser = objects;
                csvdata = "Role Id,Role Name,Created On,Last Updated On"+'\n';
                if (adminUser != null && adminUser.models != null) {
                    adminUser.models.forEach(obj => {
                        let roleData = AuthorizationRoleModel.fromDto(obj);
                        csvdata += roleData["roleId"]+","+roleData["roleName"]+","+dateFormat(roleData["createdDate"], DATE_FORMAT.DEFAULT)+","+dateFormat(roleData["updatedDate"], DATE_FORMAT.DEFAULT)+'\n';
                    });
                }
                let now = dateFormat(new Date(), "yyyy_mm_dd_h_MM_ss");
                let fileName = `Roles_${now}.csv`;
                let filePath = 'export/'+fileName;
                fs.writeFile(filePath, csvdata, (err) => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                });
                return Uploader.uploadCSV(filePath,fileName);
            })
            .then((exportLink) => {
                 console.log(exportLink.Location);
                 let data = {};
                 data["link"] = exportLink.Location;
                res.json(data);
            })
            .catch(err => {
                Utils.responseError(res, err);
            })
            .enclose();
    }
    public static createMasterRole(req:express.Request, res:express.Response):any {
        let session:BearerObject = req[Properties.SESSION];
        let checkuser:BearerObject=req[Properties.CHECK_USER];
         req.body.createdBy = session.userId;
        req.body.roleType = 'G';
        req.body.parentId = '0';
        if(checkuser.school == true) {
            req.body.schoolId=checkuser.schoolId;
          }
        let authorizationRole = AuthorizationRoleModel.fromRequest(req);
        if (authorizationRole == null || authorizationRole.roleName == null) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.GENERIC,
                MessageInfo.MI_ROLE_NAME_NOT_EMPTY,
                false, HttpStatus.BAD_REQUEST
            ));
        }

        return Promise.then(() => {
            
            return AuthorizationRoleUseCase.findOne( q => {
              q.where(`${AuthorizationRoleTableSchema.FIELDS.ROLE_TYPE}`,req.body.roleType);
              q.where(`${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME}`,authorizationRole.roleName);
            })
        })
        .then((object) => {
           
            if(object != null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.INVALID_REQUEST,
                    MessageInfo.MI_ROLE_NAME_EXIST,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
            if(checkuser.school == true){
                return SchoolUseCase.findOne( q => {
                    q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_ID}`,checkuser.schoolId);
                    q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.IS_DELETED}`,0);
                })
            }
            return Promise.void;
        }).then((object) => {
            if(checkuser.school == true){
            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_SCHOOL_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
        }
            return AuthorizationRoleUseCase.create(authorizationRole);
        }).then((object) => {
    
            if(object == null){
                if(object != null) {
                    Utils.responseError(res, new Exception(
                        ErrorCode.RESOURCE.INVALID_REQUEST,
                        MessageInfo.MI_ROLE_CREATEION_FAILED,
                        false,
                        HttpStatus.BAD_REQUEST
                    ));
                    return Promise.break;
                }
            }
                let data={};
                data.message=MessageInfo.MI_ROLE_NAME_CREATED_SUCCESSFULLY
                res.json(data);
            

        })
    }

    public static attachPolicy(req:express.Request, res:express.Response):any {
        let session:BearerObject = req[Properties.SESSION];
        req.body.createdBy = session.userId;
        req.body.roleType = 'U';
        let authorizationRole = AuthorizationRoleModel.fromRequest(req);
        if (authorizationRole == null || authorizationRole.roleName == null) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.GENERIC,
                MessageInfo.MI_ROLE_NAME_NOT_EMPTY,
                false, HttpStatus.BAD_REQUEST
            ));
        }


        if (req.body.permission == null && req.body.permission == undefined){
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.GENERIC,
                MessageInfo.MI_PERMISSION_NAME_NOT_EMPTY,
                false, HttpStatus.BAD_REQUEST
            ));

        }

        let checkmoduleId: any;
        let checkpermission: any;
        let count = 0;
        let roleId:number;
        let permission= JSON.parse(req.body.permission);

        return Promise.then(() => {
            
            permission.forEach(Rule => {
                checkmoduleId =  Rule.moduleId == null && Rule.moduleId == undefined ? count++ : count;
                checkpermission = Rule.isChecked == null && Rule.isChecked == undefined ? count++ : count;

            });

        }).then(obj => {

            if (count > 0) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.GENERIC,
                    MessageInfo.MI_PERMISSION_NAME_NOT_EMPTY,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            } 

            return AuthorizationRoleUseCase.findOne( q => {
              q.where(`${AuthorizationRoleTableSchema.FIELDS.ROLE_TYPE}`,'G');
              q.where(`${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME}`,authorizationRole.roleName);
            })
        
        }).then((object) => {
         
            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.GENERIC,
                    MessageInfo.MI_ROLE_NOT_EXIST,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }

            return AuthorizationRoleUseCase.create(authorizationRole);

        }).then(object => {
            
            if(object == null){
                    Utils.responseError(res, new Exception(
                        ErrorCode.RESOURCE.INVALID_REQUEST,
                        MessageInfo.MI_ROLE_CREATEION_FAILED,
                        false,
                        HttpStatus.BAD_REQUEST
                    ));
                    return Promise.break;
                }
            if (object && object !== null && object.attributes !== null){
                let rid = object.attributes.rid;
                return AuthorizationRoleUseCase.findByQuery(q => {
                    q.where(`${AuthorizationRoleTableSchema.FIELDS.RID}`,rid);
                },[]);
            }


        }).then(object => {
            if (object && object !== null && object.models.length>0) {  
                let roleData = AuthorizationRoleModel.fromDto(object.models[0]);
                roleId = roleData.roleId;
                return AuthorizationRuleUseCase.savepermission(roleId,permission);
              
            }

        }).then(object => {
            console.log(object);
            let data  = {};
            data["message"] = MessageInfo.MI_ROLE_ADDED;
            res.json(data);


        }).catch(err => {
            Utils.responseError(res, err);
        });
    }

    public static masterRoles(req:express.Request, res:express.Response):any {
        let session:BearerObject = req[Properties.SESSION];
        let checkuser:BearerObject = req[Properties.CHECK_USER];
        let userId = session.userId;
        return Promise.then(() => {            
            return AuthorizationRoleUseCase.list(userId,checkuser);   
        })
        .then(object => {
            res.json(object);
        })
        .catch(err => {
            Utils.responseError(res, err);
        });
    }

    
    public static updateMasterRole(req:express.Request, res:express.Response):any {
        let session:BearerObject = req[Properties.SESSION];
        let currentUserId = parseInt(session.userId);
        let rid=req.body.rid;
        let authorizationRole = AuthorizationRoleModel.fromRequest(req);
        if (authorizationRole == null || authorizationRole.roleName == null) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.GENERIC,
                MessageInfo.MI_ROLE_NAME_NOT_EMPTY,
                false, HttpStatus.BAD_REQUEST
            ));
        }

        return Promise.then(() => {
            return AuthorizationRoleUseCase.findOne( q => {
                q.where(`${AuthorizationRoleTableSchema.FIELDS.RID}`,authorizationRole.rid);
                q.where(`${AuthorizationRoleTableSchema.FIELDS.IS_DELETED}`,0);

            })
        }).then((object) => {

           if(object == null) {
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_REQUEST,
                MessageInfo.MI_ROLE_NOT_FOUND,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
           }
        let roleUser=AuthorizationRoleModel.fromDto(object);
        if(currentUserId != 1 || currentUserId != roleUser.createdBy) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.INVALID_REQUEST,
                    MessageInfo.MI_YOU_ARE_NOT_ALLOWED,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
               
        }
            return AuthorizationRoleUseCase.findOne( q => {
              q.where(`${AuthorizationRoleTableSchema.FIELDS.ROLE_TYPE}`,'G');
              q.where(`${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME}`,authorizationRole.roleName);
            })
        })
        .then((object) => {
           
            if(object != null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.INVALID_REQUEST,
                    MessageInfo.MI_ROLE_NAME_EXIST,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
            
            return AuthorizationRoleUseCase.updateById(rid,authorizationRole);  
        }).then((object) => {
    
            if(object == null){
                if(object != null) {
                    Utils.responseError(res, new Exception(
                        ErrorCode.RESOURCE.INVALID_REQUEST,
                        MessageInfo.MI_ROLE_CREATEION_FAILED,
                        false,
                        HttpStatus.BAD_REQUEST
                    ));
                    return Promise.break;
                }
            }
                let data={};
                data.message=MessageInfo.MI_ROLE_NAME_CREATED_SUCCESSFULLY
                res.json(data);
            

        })
    }

    public static schoolCreate(req:express.Request, res:express.Response):any {
        let session:BearerObject = req[Properties.SESSION];
        let checkuser:BearerObject = req[Properties.CHECK_USER];
        req.body.createdBy = session.userId;
        let permission=req.body.permission;
        let checkschoolId;
        let checkpermission;
        let parentId;
        let count=0;
        let userId=req.body.userId;
        //let schoolId=req.body.schoolId;
        let authorizationRole = AuthorizationRoleModel.fromRequest(req);
            permission.forEach(Rule => {
                checkschoolId =  Rule.schoolId == null && Rule.schoolId == undefined ? count++ : count;
                checkpermission = Rule.isChecked == null && Rule.isChecked == undefined ? count++ : count;

            });

        return Promise.then(() => {
             return AuthorizationRoleUseCase.findOne( q => {
                q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.USER_ID}`,session.userId);
                q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {
            console.log("object",object);
          parentId=object.get("parent_id");     
        if(count > 0) {
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.GENERIC,
                MessageInfo.MI_PERMISSION_NAME_NOT_EMPTY,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
        }
        return SchoolUseCase.checkSchool(permission);
        }).then((object) => {
            if(object == 2) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.GENERIC,
                    MessageInfo.MI_SCHOOL_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
            return AuthorizationRoleUseCase.findOne( q => {
                q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.USER_ID}`,userId);
                q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.IS_DELETED}`,0);
            })                 

        }).then((object) => {

            if(object == null){
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.GENERIC,
                    MessageInfo.MI_USER_NOT_EXIST,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
            let roleId=object.get("role_id")
            if(checkuser && checkuser.global == true){
                if(session.userId == "1" || parentId == "32" || parentId == "33"){
                    return AuthorizationRuleUseCase.saveSchoolPermission(roleId,permission,session.userId);
                }
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.GENERIC,
                    MessageInfo.MI_PERMISSION_DENIED,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }else {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.GENERIC,
                    MessageInfo.MI_PERMISSION_DENIED,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }

        }).then((object) => {
    
            if(object == null){
                
                    Utils.responseError(res, new Exception(
                        ErrorCode.RESOURCE.INVALID_REQUEST,
                        MessageInfo.MI_ROLE_CREATEION_FAILED,
                        false,
                        HttpStatus.BAD_REQUEST
                    ));
                    return Promise.break;
                
            }
                let data={};
                data.message=MessageInfo.MI_ROLE_NAME_CREATED_SUCCESSFULLY
                res.json(data);
            

        })
    }

    public static schoolUpdate(req:express.Request, res:express.Response):any {
        let session:BearerObject = req[Properties.SESSION];
        let checkuser:BearerObject = req[Properties.CHECK_USER];
        req.body.createdBy = session.userId;
        let permission=req.body.permission;
        let checkschoolId;
        let checkpermission;
        let count=0;
        let rid=req.params.rid;
        //let schoolId=req.body.schoolId;
        let authorizationRole = AuthorizationRoleModel.fromRequest(req);
        if(authorizationRole == null || authorizationRole.roleName == null){
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.GENERIC,
                MessageInfo.MI_PERMISSION_NAME_NOT_EMPTY,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
        }
       
            permission.forEach(Rule => {
                checkschoolId =  Rule.schoolId == null && Rule.schoolId == undefined ? count++ : count;
                checkpermission = Rule.isChecked == null && Rule.isChecked == undefined ? count++ : count;

            });

        return Promise.then(() => {

            return AuthorizationRoleUseCase.findOne( q => {
                q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.IS_DELETED}`,0);
                q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.RID}`,rid);
            })
        }).then((object) => {
            
            if(object == null){
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.GENERIC,
                    MessageInfo.MI_ROLE_NOT_EXIST,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
            
        if(count > 0) {
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.GENERIC,
                MessageInfo.MI_PERMISSION_NAME_NOT_EMPTY,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
        }
        return SchoolUseCase.checkSchool(permission);
        }).then((object) => {
            if(object == 2) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.GENERIC,
                    MessageInfo.MI_SCHOOL_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
            if(checkuser && checkuser.global == true){
                if(session.userId == "1" || session.userId == "32"){
                    return AuthorizationRuleUseCase.saveSchoolPermission(roleId,permission,session.userId);
                }
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.GENERIC,
                    MessageInfo.MI_PERMISSION_DENIED,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }else {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.GENERIC,
                    MessageInfo.MI_PERMISSION_DENIED,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
             
                      

        }).then((object) => {
    
            if(object == null){
                if(object != null) {
                    Utils.responseError(res, new Exception(
                        ErrorCode.RESOURCE.INVALID_REQUEST,
                        MessageInfo.MI_ROLE_CREATEION_FAILED,
                        false,
                        HttpStatus.BAD_REQUEST
                    ));
                    return Promise.break;
                }
            }
                let data={};
                data.message=MessageInfo.MI_ROLE_NAME_CREATED_SUCCESSFULLY
                res.json(data);
            

        })
    }

    public static schoolList(req:express.Request, res:express.Response):any {
        let session:BearerObject = req[Properties.SESSION];
        let checkuser:BearerObject=req[Properties.CHECK_USER];
        let userId = session.userId;
        let role:any;
        let offset = parseInt(req.query.offset) || null;
        let limit = parseInt(req.query.limit) || null;
        let sortKey;
        let sortValue;
        let searchobj = [];
        let total = 0;
        let schoolIds:any[];
        let searchValue = req.query.searchValue;
        console.log('searchvalue', searchValue);
        for (let key in req.query) {
            console.log(req.query[key]);
            if(key=='sortKey'){
                sortKey = req.query[key];
            }
            else if(key=='sortValue'){
                sortValue = req.query[key];
            } else if(req.query[key]!='' && key!='limit' && key!='offset' && key!='sortKey' && key!='sortValue'){
                searchobj[key] = req.query[key];
            }
        }
        console.log(searchobj);
        return Promise.then(() => {
            return AuthorizationRoleUseCase.findOne(q => {
                q.where(AuthorizationRoleTableSchema.FIELDS.USER_ID, userId);
            }, []);
        }).then((object) => {
            role = AuthorizationRoleModel.fromDto(object);
            if(userId != '1'){
                return AuthorizationRuleUseCase.findSchool(role.roleId);
            }
            return Promise.void;
        })
        .then((object) => {
            schoolIds=object;
            return AuthorizationRuleUseCase.countByQuery(q => {
                q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.IS_DELETED}`, 0);
          //      q.select(`${AuthorizationRoleTableSchema.TABLE_NAME}.*`,`${AuthorizationRuleTableSchema.TABLE_NAME}.*`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_NAME}`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME}`,`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}`);
       //   q.select(`${AuthorizationRuleTableSchema.TABLE_NAME}.*`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME}`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME}`);     
        //   q.groupBy(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.RULE_ID}`);
                // q.select(knex.raw(`CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME}," ",${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) as createdByName`))
                if(userId != "1") {
                    q.innerJoin(`${AuthorizationRoleTableSchema.TABLE_NAME}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.ROLE_ID}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID}`);
                //q.innerJoin(`${AuthorizationRuleTableSchema.TABLE_NAME} as school`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID}`,`school.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID}`);
               q.whereIn(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID}`,schoolIds);
               if(role.parentId != 32){
                q.whereIn(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.PARENT_ID}`,[221]);    
               }else {
               q.whereIn(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.PARENT_ID}`,[33,221]);
               }  
               q.innerJoin(`${SchoolTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_ID}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID}`);
                 q.innerJoin(`${DirectoryDistrictTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.DISTRICT_ID}`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`);
                 q.innerJoin(`${DirectoryTalukTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.CITY_ID}`,`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_ID}`);
                 q.innerJoin(`${AdminUserTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.CREATED_BY}`);
                 q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.PERMISSION}`,"allow");      
                 let condition=`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID} IS NOT NULL`;
                 q.whereRaw(condition);
                      } else {
                       q.innerJoin(`${AuthorizationRoleTableSchema.TABLE_NAME}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.ROLE_ID}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID}`);
                       q.innerJoin(`${SchoolTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_ID}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID}`);
                       q.innerJoin(`${DirectoryDistrictTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.DISTRICT_ID}`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`);
                       q.innerJoin(`${DirectoryTalukTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.CITY_ID}`,`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_ID}`);
                       q.innerJoin(`${AdminUserTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.CREATED_BY}`);
                       //q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.PERMISSION}`,"allow");      
                       let condition=`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID} IS NOT NULL`;
                       q.whereRaw(condition);
                       //q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.CREATED_BY}`,userId);
                        // q.groupBy(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID}`);
                      }
                
               
                let condition;
                if (searchobj) {
                    for (let key in searchobj) { 
                        if(searchobj[key]!=null && searchobj[key]!=''){
                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);
                            searchval = searchValue;
                            if(key === "roleId"){
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key === "ruleId"){
                                condition = `(${AuthorizationRuleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }else if(key=='createdByName'){
                                condition = `CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                                q.andWhereRaw(condition);
                            } else if(key === "roleName"){
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key === "districtName"){
                                condition = `(${DirectoryDistrictTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }
                            else if(key === "cityName"){
                                condition = `(${DirectoryTalukTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key === "schoolName"){
                                condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key === "updatedDate") {
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key === "createdDate") {
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else {
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                                condition = `(${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.RULE_ID} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                                condition = `CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                                q.orWhereRaw(condition);
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                                condition = `(${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                                condition = `(${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_NAME} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                                condition = `(${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_NAME} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.CREATED_DATE} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.UPDATED_DATE} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                            }
                        }
                    }
                } 
                
            });
        })
        .then((totalObject) => {
            total = totalObject;
            return AuthorizationRuleUseCase.findByQuery(q => {
                q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.IS_DELETED}`, 0);
          //      q.select(`${AuthorizationRoleTableSchema.TABLE_NAME}.*`,`${AuthorizationRuleTableSchema.TABLE_NAME}.*`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_NAME}`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME}`,`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}`);
          q.select(`${AuthorizationRuleTableSchema.TABLE_NAME}.*`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME}`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME}`,`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_NAME}`);     
          //q.groupBy(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.RULE_ID}`);
                q.select(knex.raw(`CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME}," ",${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) as createdByName`))
                if(userId != "1") {
                    q.innerJoin(`${AuthorizationRoleTableSchema.TABLE_NAME}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.ROLE_ID}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID}`);
                //q.innerJoin(`${AuthorizationRuleTableSchema.TABLE_NAME} as school`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID}`,`school.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID}`);
               q.whereIn(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID}`,schoolIds);
               if(role.parentId != 32){
                q.whereIn(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.PARENT_ID}`,[221]);    
               }else {
               q.whereIn(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.PARENT_ID}`,[33,221]);
               }  
                 q.innerJoin(`${SchoolTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_ID}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID}`);
                 q.innerJoin(`${DirectoryDistrictTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.DISTRICT_ID}`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`);
                 q.innerJoin(`${DirectoryTalukTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.CITY_ID}`,`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_ID}`);
                 q.innerJoin(`${AdminUserTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.CREATED_BY}`);
                 q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.PERMISSION}`,"allow");      
                 let condition=`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID} IS NOT NULL`;
                 q.whereRaw(condition);

                  } else {
                   q.innerJoin(`${AuthorizationRoleTableSchema.TABLE_NAME}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.ROLE_ID}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID}`);
                   q.innerJoin(`${SchoolTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_ID}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID}`);
                   q.innerJoin(`${DirectoryDistrictTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.DISTRICT_ID}`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`);
                   q.innerJoin(`${DirectoryTalukTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.CITY_ID}`,`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_ID}`);
                   q.innerJoin(`${AdminUserTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.CREATED_BY}`);
                 //  q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.PERMISSION}`,"allow");      
                   let condition=`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID} IS NOT NULL`;
                   q.whereRaw(condition);
                   //q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.CREATED_BY}`,userId);
                    // q.groupBy(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.RULE_ID}`);
                  }

                let condition;
                if (searchobj) {
                    for (let key in searchobj) { 
                        if(searchobj[key]!=null && searchobj[key]!=''){
                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            searchval = searchValue;
                            let ColumnKey = Utils.changeSearchKey(key);
                            if(key === "roleId"){
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key === "ruleId"){
                                condition = `(${AuthorizationRuleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }else if(key=='createdByName'){
                                condition = `CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                                q.andWhereRaw(condition);
                            } else if(key === "roleName"){
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key === "districtName"){
                                condition = `(${DirectoryDistrictTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }
                            else if(key === "cityName"){
                                condition = `(${DirectoryTalukTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key === "schoolName"){
                                condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key === "updatedDate") {
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key === "createdDate") {
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else {
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                                condition = `(${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.RULE_ID} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                                condition = `CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                                q.orWhereRaw(condition);
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                                condition = `(${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                                condition = `(${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_NAME} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                                condition = `(${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_NAME} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.CREATED_DATE} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.UPDATED_DATE} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                            }
                        }
                    }
                } 

                if (offset != null) {
                    q.offset(offset);
                }
                if (limit != null) {
                    q.limit(limit);
                }
                if (sortKey != null && sortValue != '') {
                    if (sortKey != null && (sortValue == 'ASC' || sortValue == 'DESC' || sortValue == 'asc' || sortValue == 'desc')) {
                        let ColumnSortKey = Utils.changeSearchKey(sortKey);
                        if (sortKey === "roleId") {
                            q.orderBy(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID}`, sortValue);
                        } if (sortKey === "ruleId") {
                            q.orderBy(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.RULE_ID}`, sortValue);
                        } else if (sortKey === "roleName") {
                            q.orderBy(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME}`, sortValue);
                        }else if (sortKey === "districtName") {
                            q.orderBy(`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME}`, sortValue);
                        } else if (sortKey === "cityName") {
                            q.orderBy(`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_NAME}`, sortValue);
                        }else if (sortKey === "schoolName") {
                            q.orderBy(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_NAME}`, sortValue);
                        } else if (sortKey == 'createdByName') {
                            q.orderBy(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME}`, sortValue);
                            q.orderBy(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}`, sortValue);
                        }else if (sortKey === "updatedDate") {
                            q.orderBy(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.UPDATED_DATE}`, sortValue);
                        } else if (sortKey === "createdDate") {
                            q.orderBy(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.CREATED_DATE}`, sortValue);
                        }
                    }
                }
            });
        })
        .then(objects => {
            if (objects != null && objects.models != null && objects.models.length != null) {
                let ret = [];
                 //ret.push(objects.models);
                objects.models.forEach(object => {
                    let rules=AuthorizationRoleModel.fromDto(object);
                    rules["createdbyname"]=object.get("createdByName");
                    rules["districtName"]=object.get("district_name");
                    rules["schoolName"]=object.get("school_name");
                    rules["cityName"]=object.get("city_name");
                     ret.push(rules);
                });
                res.header(Properties.HEADER_TOTAL, total.toString(10));

                if (offset != null) {
                    res.header(Properties.HEADER_OFFSET, offset.toString(10));
                }
                if (limit != null) {
                    res.header(Properties.HEADER_LIMIT, limit.toString(10));
                }
    
                res.json(ret);
                
            }
            let exception;
            exception = new Exception(ErrorCode.ROLE.NO_ROLE_FOUND, MessageInfo.MI_NO_ROLE_FOUND, false);
            exception.httpStatus = HttpStatus.BAD_REQUEST;
            return exception;
        })
        .catch(err => {
            Utils.responseError(res, err);
        })
        .enclose();
    }

    public static assignedSchoolList(req:express.Request, res:express.Response):any {
        let session:BearerObject = req[Properties.SESSION];
        let checkuser:BearerObject=req[Properties.CHECK_USER];
        let userId = session.userId;
        let role:any;
        let offset = parseInt(req.query.offset) || null;
        let limit = parseInt(req.query.limit) || null;
        let sortKey;
        let sortValue;
        let searchobj = [];
        let total = 0;
        let searchValue = req.query.searchValue;
        for (let key in req.query) {
            console.log(req.query[key]);
            if(key=='sortKey'){
                sortKey = req.query[key];
            }
            else if(key=='sortValue'){
                sortValue = req.query[key];
            } else if(req.query[key]!='' && key!='limit' && key!='offset' && key!='sortKey' && key!='sortValue'){
                searchobj[key] = req.query[key];
            }
        }
        console.log(searchobj);
        return Promise.then(() => {
            return AuthorizationRoleUseCase.findOne(q => {
                q.where(AuthorizationRoleTableSchema.FIELDS.USER_ID, userId);
            }, []);
        })
        .then((object) => {
            role = AuthorizationRoleModel.fromDto(object);
            return AuthorizationRoleUseCase.countByQuery(q => {
                q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.IS_DELETED}`, 0); 
                     if(userId != "1") {
                        q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.ROLE_ID}`,role.roleId);
                        q.innerJoin(`${AuthorizationRuleTableSchema.TABLE_NAME}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.ROLE_ID}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID}`);
                        q.innerJoin(`${SchoolTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_ID}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID}`);
                        q.innerJoin(`${DirectoryDistrictTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.DISTRICT_ID}`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`);
                        q.innerJoin(`${DirectoryTalukTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.CITY_ID}`,`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_ID}`);
                        q.innerJoin(`${AdminUserTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.CREATED_BY}`);
                        q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.PERMISSION}`,"allow");      
                        let condition=`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID} IS NOT NULL`;
                        q.whereRaw(condition);
                      } else {
                       q.innerJoin(`${AuthorizationRuleTableSchema.TABLE_NAME}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.ROLE_ID}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID}`);
                       q.innerJoin(`${SchoolTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_ID}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID}`);
                       q.innerJoin(`${DirectoryDistrictTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.DISTRICT_ID}`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`);
                       q.innerJoin(`${DirectoryTalukTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.CITY_ID}`,`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_ID}`);
                       q.innerJoin(`${AdminUserTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.CREATED_BY}`);
                       //q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.PERMISSION}`,"allow");      
                       let condition=`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID} IS NOT NULL`;
                       q.whereRaw(condition);
                       //q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.CREATED_BY}`,userId);
                      // q.groupBy(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.RULE_ID}`);
                      }
                
               
                let condition;
                if (searchobj) {
                    for (let key in searchobj) { 
                        if(searchobj[key]!=null && searchobj[key]!=''){
                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);
                            searchval = searchValue;
                            if(key === "roleId"){
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key === "ruleId"){
                                condition = `(${AuthorizationRuleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }else if(key=='createdByName'){
                                condition = `CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                                q.andWhereRaw(condition);
                            } else if(key === "roleName"){
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key === "districtName"){
                                condition = `(${DirectoryDistrictTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }
                            else if(key === "cityName"){
                                condition = `(${DirectoryTalukTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key === "schoolName"){
                                condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key === "updatedDate") {
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key === "createdDate") {
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else {
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                                condition = `(${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.RULE_ID} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                                condition = `CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                                q.orWhereRaw(condition);
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                                condition = `(${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                                condition = `(${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_NAME} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.CREATED_DATE} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.UPDATED_DATE} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                            }
                        }
                    }
                } 
                
            });
        })
        .then((totalObject) => {
            total = totalObject;
            return AuthorizationRoleUseCase.findByQuery(q => {
                q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.IS_DELETED}`, 0);
                q.select(`${AuthorizationRoleTableSchema.TABLE_NAME}.*`,`${AuthorizationRuleTableSchema.TABLE_NAME}.*`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_NAME}`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME}`,`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}`);
                //q.groupBy(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.RULE_ID}`);
                q.select(knex.raw(`CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME}," ",${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) as createdByName`))
                if(userId != "1") {
                    q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.ROLE_ID}`,role.roleId);
                    q.innerJoin(`${AuthorizationRuleTableSchema.TABLE_NAME}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.ROLE_ID}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID}`);
                    q.innerJoin(`${SchoolTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_ID}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID}`);
                    q.innerJoin(`${DirectoryDistrictTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.DISTRICT_ID}`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`);
                    q.innerJoin(`${DirectoryTalukTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.CITY_ID}`,`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_ID}`);
                    q.innerJoin(`${AdminUserTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.CREATED_BY}`);
                    q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.PERMISSION}`,"allow");      
                    let condition=`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID} IS NOT NULL`;
                    q.whereRaw(condition);
                  } else {
                   q.innerJoin(`${AuthorizationRuleTableSchema.TABLE_NAME}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.ROLE_ID}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID}`);
                   q.innerJoin(`${SchoolTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_ID}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID}`);
                   q.innerJoin(`${DirectoryDistrictTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.DISTRICT_ID}`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`);
                   q.innerJoin(`${DirectoryTalukTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.CITY_ID}`,`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_ID}`);
                   q.innerJoin(`${AdminUserTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.CREATED_BY}`);
                 //  q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.PERMISSION}`,"allow");      
                   let condition=`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID} IS NOT NULL`;
                   q.whereRaw(condition);
                   //q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.CREATED_BY}`,userId);
                    q.groupBy(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.RULE_ID}`);
                  }

                let condition;
                if (searchobj) {
                    for (let key in searchobj) { 
                        if(searchobj[key]!=null && searchobj[key]!=''){
                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            searchval = searchValue;
                            let ColumnKey = Utils.changeSearchKey(key);
                            if(key === "roleId"){
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key === "ruleId"){
                                condition = `(${AuthorizationRuleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }else if(key=='createdByName'){
                                condition = `CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                                q.andWhereRaw(condition);
                            } else if(key === "roleName"){
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key === "districtName"){
                                condition = `(${DirectoryDistrictTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }
                            else if(key === "cityName"){
                                condition = `(${DirectoryTalukTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key === "schoolName"){
                                condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key === "updatedDate") {
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key === "createdDate") {
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else {
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                                condition = `(${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.RULE_ID} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                                condition = `CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                                q.orWhereRaw(condition);
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                                condition = `(${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                                condition = `(${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_NAME} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.CREATED_DATE} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                                condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.UPDATED_DATE} LIKE "%${searchval}%")`;
                                q.orWhereRaw(condition);
                            }
                        }
                    }
                } 

                if (offset != null) {
                    q.offset(offset);
                }
                if (limit != null) {
                    q.limit(limit);
                }
                if (sortKey != null && sortValue != '') {
                    if (sortKey != null && (sortValue == 'ASC' || sortValue == 'DESC' || sortValue == 'asc' || sortValue == 'desc')) {
                        let ColumnSortKey = Utils.changeSearchKey(sortKey);
                        if (sortKey === "roleId") {
                            q.orderBy(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID}`, sortValue);
                        } if (sortKey === "ruleId") {
                            q.orderBy(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.RULE_ID}`, sortValue);
                        } else if (sortKey === "roleName") {
                            q.orderBy(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME}`, sortValue);
                        }else if (sortKey === "districtName") {
                            q.orderBy(`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME}`, sortValue);
                        } else if (sortKey === "cityName") {
                            q.orderBy(`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_NAME}`, sortValue);
                        }else if (sortKey === "schoolName") {
                            q.orderBy(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_NAME}`, sortValue);
                        } else if (sortKey == 'createdByName') {
                            q.orderBy(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME}`, sortValue);
                            q.orderBy(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}`, sortValue);
                        }else if (sortKey === "updatedDate") {
                            q.orderBy(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.UPDATED_DATE}`, sortValue);
                        } else if (sortKey === "createdDate") {
                            q.orderBy(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.CREATED_DATE}`, sortValue);
                        }
                    }
                }
            });
        })
        .then(objects => {
            if (objects != null && objects.models != null && objects.models.length != null) {
                let ret = [];
                objects.models.forEach(object => {
                    let rules=AuthorizationRoleModel.fromDto(object);
                    rules["ruleId"]=object.get("rule_id");
                    rules["createdbyname"]=object.get("createdByName");
                    rules["districtName"]=object.get("district_name");
                    rules["schoolName"]=object.get("school_name");
                    rules["cityName"]=object.get("city_name");
                    ret.push(rules);
                });
                res.header(Properties.HEADER_TOTAL, total.toString(10));

                if (offset != null) {
                    res.header(Properties.HEADER_OFFSET, offset.toString(10));
                }
                if (limit != null) {
                    res.header(Properties.HEADER_LIMIT, limit.toString(10));
                }
    
                res.json(ret);
                
            }
            let exception;
            exception = new Exception(ErrorCode.ROLE.NO_ROLE_FOUND, MessageInfo.MI_NO_ROLE_FOUND, false);
            exception.httpStatus = HttpStatus.BAD_REQUEST;
            return exception;
        })
        .catch(err => {
            Utils.responseError(res, err);
        })
        .enclose();
}


public static adminList(req:express.Request, res:express.Response):any {
    let session:BearerObject = req[Properties.SESSION];
    let checkuser:BearerObject=req[Properties.CHECK_USER];
    let userId = session.userId;
    let role:any;
    let offset = parseInt(req.query.offset) || null;
    let limit = parseInt(req.query.limit) || null;
    let sortKey;
    let sortValue;
    let searchobj = [];
    let total = 0;
    for (let key in req.query) {
        console.log(req.query[key]);
        if(key=='sortKey'){
            sortKey = req.query[key];
        }
        else if(key=='sortValue'){
            sortValue = req.query[key];
        } else if(req.query[key]!='' && key!='limit' && key!='offset' && key!='sortKey' && key!='sortValue'){
            searchobj[key] = req.query[key];
        }
    }
    console.log(searchobj);
    return Promise.then(() => {
        return AuthorizationRoleUseCase.findOne(q => {
            q.where(AuthorizationRoleTableSchema.FIELDS.USER_ID, userId);
        }, []);
    })
    .then((object) => {
        role = AuthorizationRoleModel.fromDto(object);
        role["sub"]=[];
        console.log("rolesssssssssssss",role);
        return AuthorizationRoleUseCase.countByQuery(q => {
            q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.IS_DELETED}`, 0); 
                 if(userId != "1") {
                    
                    if(role.parentId == '32'){
                        q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.DISTRICT_ID}`,role.assignedDistrict);
                        // q.innerJoin(`${AuthorizationRoleTableSchema.TABLE_NAME} as parent`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.DISTRICT_ID}`,`parent.${AuthorizationRoleTableSchema.FIELDS.DISTRICT_ID}`);
                        q.whereIn(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.PARENT_ID}`,['33','221']);
                    }if(role.parentId == '33'){
                        q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.DISTRICT_ID}`,role.assignedDistrict);
                        // q.innerJoin(`${AuthorizationRoleTableSchema.TABLE_NAME} as parent`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.DISTRICT_ID}`,`parent.${AuthorizationRoleTableSchema.FIELDS.DISTRICT_ID}`);
                        q.whereIn(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.PARENT_ID}`,['221']);
                    }
                  } else {
                    // q.innerJoin(`${AuthorizationRoleTableSchema.TABLE_NAME} as parent`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.DISTRICT_ID}`,`parent.${AuthorizationRoleTableSchema.FIELDS.DISTRICT_ID}`);
                  }
                  q.innerJoin(`${DirectoryDistrictTableSchema.TABLE_NAME}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.DISTRICT_ID}`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`);
                //   q.innerJoin(`${DirectoryTalukTableSchema.TABLE_NAME}`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`,`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.DISTRICT_ID}`);
                  q.innerJoin(`${AdminUserTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.CREATED_BY}`);
            let condition;
            if (searchobj) {
                for (let key in searchobj) { 
                    if(searchobj[key]!=null && searchobj[key]!=''){
                        console.log(searchobj[key]);
                        let searchval = searchobj[key];
                        let ColumnKey = Utils.changeSearchKey(key);

                        if(key === "roleId"){
                            condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        } else if(key=='createdByName'){
                            condition = `CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                            q.andWhereRaw(condition);
                        } else if(key === "roleName"){
                            condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        }  else if(key === "districtName"){
                            condition = `(${DirectoryDistrictTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        }
                        else if(key === "cityName"){
                            condition = `(${DirectoryTalukTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        }  else if(key === "updatedDate") {
                            condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        } else if(key === "createdDate") {
                            condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        }
                    }
                }
            } 
            
        });
    })
    .then((totalObject) => {
        total = totalObject;
        return AuthorizationRoleUseCase.findByQuery(q => {
            q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.IS_DELETED}`, 0);
            q.select(`${AuthorizationRoleTableSchema.TABLE_NAME}.*`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}`);
            //q.groupBy(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.RULE_ID}`);
            q.select(knex.raw(`CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME}," ",${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) as createdByName`))
            q.select(knex.raw(`CONCAT(user.${AdminUserTableSchema.FIELDS.FIRSTNAME}," ",user.${AdminUserTableSchema.FIELDS.LASTNAME}) as userName`))
            if(userId != "1") {
                    
                if(role.parentId == '32'){
                    q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.DISTRICT_ID}`,role.assignedDistrict);
                    // q.innerJoin(`${AuthorizationRoleTableSchema.TABLE_NAME} as parent`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.DISTRICT_ID}`,`parent.${AuthorizationRoleTableSchema.FIELDS.DISTRICT_ID}`);
                    q.whereIn(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.PARENT_ID}`,['33','221']);
                }if(role.parentId == '33'){
                    q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.DISTRICT_ID}`,role.assignedDistrict);
                    // q.innerJoin(`${AuthorizationRoleTableSchema.TABLE_NAME} as parent`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.DISTRICT_ID}`,`parent.${AuthorizationRoleTableSchema.FIELDS.DISTRICT_ID}`);
                    q.whereIn(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.PARENT_ID}`,['221']);
                }
              } else {
                // q.innerJoin(`${AuthorizationRoleTableSchema.TABLE_NAME} as parent`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.DISTRICT_ID}`,`parent.${AuthorizationRoleTableSchema.FIELDS.DISTRICT_ID}`);
              }
              q.innerJoin(`${DirectoryDistrictTableSchema.TABLE_NAME}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.DISTRICT_ID}`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`);
            //   q.innerJoin(`${DirectoryTalukTableSchema.TABLE_NAME}`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`,`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.DISTRICT_ID}`);
              q.innerJoin(`${AdminUserTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.CREATED_BY}`);
              q.innerJoin(`${AdminUserTableSchema.TABLE_NAME} as user`,`user.${AdminUserTableSchema.FIELDS.USER_ID}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.USER_ID}`);
        let condition;
        if (searchobj) {
            for (let key in searchobj) { 
                if(searchobj[key]!=null && searchobj[key]!=''){
                    console.log(searchobj[key]);
                    let searchval = searchobj[key];
                    let ColumnKey = Utils.changeSearchKey(key);

                    if(key === "roleId"){
                        condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                        q.andWhereRaw(condition);
                    } else if(key=='createdByName'){
                        condition = `CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                        q.andWhereRaw(condition);
                    } else if(key === "roleName"){
                        condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                        q.andWhereRaw(condition);
                    } else if(key === "subroleName"){
                        condition = `(parent.${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME} LIKE "%${searchval}%")`;
                        q.andWhereRaw(condition);
                    } else if(key === "districtName"){
                        condition = `(${DirectoryDistrictTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                        q.andWhereRaw(condition);
                    }
                    else if(key === "cityName"){
                        condition = `(${DirectoryTalukTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                        q.andWhereRaw(condition);
                    }  else if(key === "updatedDate") {
                        condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                        q.andWhereRaw(condition);
                    } else if(key === "createdDate") {
                        condition = `(${AuthorizationRoleTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                        q.andWhereRaw(condition);
                    }
                }
            }
        } 

            if (offset != null) {
                q.offset(offset);
            }
            if (limit != null) {
                q.limit(limit);
            }
            if (sortKey != null && sortValue != '') {
                if (sortKey != null && (sortValue == 'ASC' || sortValue == 'DESC' || sortValue == 'asc' || sortValue == 'desc')) {
                    let ColumnSortKey = Utils.changeSearchKey(sortKey);
                    if (sortKey === "roleId") {
                        q.orderBy(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID}`, sortValue);
                    } if (sortKey === "ruleId") {
                        q.orderBy(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.RULE_ID}`, sortValue);
                    } else if (sortKey === "roleName") {
                        q.orderBy(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME}`, sortValue);
                    } else if (sortKey === "subroleName") {
                        q.orderBy(`parent.${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME}`, sortValue);
                    }else if (sortKey === "districtName") {
                        q.orderBy(`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME}`, sortValue);
                    } else if (sortKey === "cityName") {
                        q.orderBy(`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_NAME}`, sortValue);
                    }else if (sortKey === "schoolName") {
                        q.orderBy(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_NAME}`, sortValue);
                    } else if (sortKey == 'createdByName') {
                        q.orderBy(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME}`, sortValue);
                        q.orderBy(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}`, sortValue);
                    }else if (sortKey === "updatedDate") {
                        q.orderBy(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.UPDATED_DATE}`, sortValue);
                    } else if (sortKey === "createdDate") {
                        q.orderBy(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.CREATED_DATE}`, sortValue);
                    }
                }
            }
        });
    })
    .then(objects => {
        if (objects != null && objects.models != null && objects.models.length != null) {
            let ret = [];
        //    console.log(objects.models);
            objects.models.forEach(object => {
                let rules=AuthorizationRoleModel.fromDto(object);
                rules["districtName"]=object.get("district_name");
                rules["username"]=object.get("userName");
                role["sub"].push(rules);
            });
            ret.push(role);
            res.header(Properties.HEADER_TOTAL, total.toString(10));

            if (offset != null) {
                res.header(Properties.HEADER_OFFSET, offset.toString(10));
            }
            if (limit != null) {
                res.header(Properties.HEADER_LIMIT, limit.toString(10));
            }

            res.json(ret);
            
        }
        let exception;
        exception = new Exception(ErrorCode.ROLE.NO_ROLE_FOUND, MessageInfo.MI_NO_ROLE_FOUND, false);
        exception.httpStatus = HttpStatus.BAD_REQUEST;
        return exception;
    })
    .catch(err => {
        Utils.responseError(res, err);
    })
    .enclose();
}

public static userList(req:express.Request, res:express.Response):any {
    let session:BearerObject = req[Properties.SESSION];
    let schoolId:BearerObject = req[Properties.SCHOOL_ID];
    let userId = session.userId;
    return Promise.then(() => {            
        return AuthorizationRoleUseCase.list1(schoolId);   
    })
    .then(object => {
        res.json(object);
    })
    .catch(err => {
        Utils.responseError(res, err);
    });
}

public static updateRoles(req:express.Request, res:express.Response):any {
    let session:BearerObject = req[Properties.SESSION];
    let schoolId:BearerObject = req[Properties.SCHOOL_ID];
    let rid = req.params.rid;
    let role = AuthorizationRoleModel.fromRequest(req);
    if (!Utils.requiredCheck(role.parentId)) {
        return Utils.responseError(res, new Exception(
            ErrorCode.RESOURCE.REQUIRED_ERROR,
            MessageInfo.MI_ROLE_NOT_FOUND,
            false,
            HttpStatus.BAD_REQUEST
        ));
    }
    return Promise.then(() => {
        return AuthorizationRoleUseCase.findOne((q) => {
         q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.RID}`, rid);
         q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.IS_DELETED}`, 0);
        })
    }).then((object) => {
     if(object == null) {
        Utils.responseError(res, new Exception(
            ErrorCode.RESOURCE.GENERIC,
            MessageInfo.MI_NO_ROLE_FOUND,
            false,
            HttpStatus.BAD_REQUEST
        ));
        return Promise.break;
     }
     return AuthorizationRoleUseCase.findOne((q) => {
         q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID}`,role.parentId);
         q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.IS_DELETED}`,0);
         q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_TYPE}`,'G');
     })
    }).then((object) => {
        if(!object) {
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.GENERIC,
                MessageInfo.MI_NO_ROLE_FOUND,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
         }
         role["roleName"] = object.get("role_name");
         console.log('rolename', role);
         return AuthorizationRoleUseCase.findOne((q) => {
            q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.USER_ID}`,session.userId);
            q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.IS_DELETED}`,0);
        }) 
    }).then((object) => {
     if(!object) {
        Utils.responseError(res, new Exception(
            ErrorCode.RESOURCE.GENERIC,
            MessageInfo.MI_NO_ROLE_FOUND,
            false,
            HttpStatus.BAD_REQUEST
        ));
        return Promise.break;
     } 
     let roles = AuthorizationRoleModel.fromDto(object);
     if(roles.parentId != 18) {
        Utils.responseError(res, new Exception(
            ErrorCode.RESOURCE.GENERIC,
            MessageInfo.MI_PARENT_ROLE_NOT_FOUND,
            false,
            HttpStatus.BAD_REQUEST
        ));
        return Promise.break;
     }
     return AuthorizationRoleUseCase.updateById(rid, role);
    }).then(() => {
        res.json({message: "role updated successfully"});
    }).catch(err => {
        Utils.responseError(res, err);
    })
}
}
export default RoleHandler;
