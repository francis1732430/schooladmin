/**
 *    
 */
import {AuthorizationRoleUseCase,AuthorizationRuleUseCase,AuthorizationRuleSetUseCase,AdminUserUseCase,SchoolUseCase} from "../../domains"; 
import {AuthorizationRuleDto} from "../../data/models";
import {ErrorCode, HttpStatus, MessageInfo, Properties,DATE_FORMAT} from "../../libs/constants";
import {Utils} from "../../libs/utils";
import {AuthorizationRoleTableSchema,AuthorizationRuleTableSchema,AuthorizationRuleSetTableSchema, AdminUserTableSchema, SchoolTableSchema} from "../../data/schemas";
import {Exception, AuthorizationRoleModel,AuthorizationRuleModel} from "../../models";
import * as express from "express";
import {Promise} from "thenfail";
import * as formidable from "formidable";
import {Excel} from "../../libs";
import {BaseHandler} from "../base.handler";
import {BearerObject} from "../../libs/jwt";
let fs = require('fs'); 
import {Uploader} from "../../libs";
var dateFormat = require('dateformat');

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
        let checkuser:BearerObject = req[Properties.SESSION];
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
        let permission= JSON.parse(req.body.permission);

        return Promise.then(() => {
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
           if(checkuser.school != null && checkuser.school != undefined && checkuser.school == true) {
                 authorizationRole.schoolId=checkuser.schoolId
           }
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
            } else {
                return AuthorizationRoleUseCase.findOne(q => {
                    q.where(`${AuthorizationRoleTableSchema.FIELDS.ROLE_TYPE}`,'G');
                    q.where(`${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME}`,authorizationRole.roleName);
                    q.where(`${AuthorizationRoleTableSchema.FIELDS.IS_DELETED}`,0);
                },[]);
            }
        }).then(object => {
            if (object!=null) {

                return AuthorizationRoleUseCase.create(authorizationRole);
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
                    return AuthorizationRuleUseCase.savepermission(roleId,permission,roleData.schoolId);
                }
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

    /**
     *
     * @param req
     * @param res
     * @returns {any}
     */
    public static update(req:express.Request, res:express.Response):any {
        let session:BearerObject = req[Properties.SESSION];
        let currentUserId = parseInt(session.userId);
        req.body.roleType = 'U';
        let authorizationRole = AuthorizationRoleModel.fromRequest(req);
        let rid = req.params.rid;
        let school=false;
        let global=false;
        let id=req.schoolId;
        let currentUserRole=id != null ?global=true:school=true;
        if (authorizationRole == null || authorizationRole.roleName == null) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.GENERIC,
                MessageInfo.MI_ROLE_NAME_NOT_EMPTY,
                false, HttpStatus.BAD_REQUEST
            ));
        }

        if (authorizationRole.permissionType != 1 && authorizationRole.permissionType != 2) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.GENERIC,
                MessageInfo.MI_PERMISSION_TYPE_NOT_EMPTY,
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

                return Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.GENERIC,
                    MessageInfo.MI_PERMISSION_NAME_NOT_EMPTY,
                    false, HttpStatus.BAD_REQUEST
                ));
            } else { 
                return AdminUserUseCase.findOne( q => {
                    q.whereIn(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,[authorizationRole.userId,req.body.userId]);
                    q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}`,0);
                  })
            }
        })
        .then((objects) => {
            if(objects != null && objects != undefined) {
                let assignedUser;
                let createdByUser;
                let createdBySchoolId;
                let assignedSchoolId;
                let createdBy1;
                let assignedBy1;
                objects.filter((obj1) => {
                    if(school){
                        if(obj1.attributes.createdBy == req.body.createdBy){
                            authorizationRole.schoolId=id;
                            createdByUser=obj1;
                            createdBySchoolId=obj1.attributes.schoolId;
                        }else {
                            authorizationRole.schoolId=id;
                            assignedUser=obj1
                            assignedSchoolId=obj1.attributes.schoolId;
                        }
                    } else {
                        if(obj1.attributes.createdBy == req.body.createdBy){
                            createdByUser=obj1;
                            createdBy1=obj1.attributes.userId;
                        }else {
                            assignedUser=obj1
                            assignedBy1=obj1.attributes.userId;
                        }
                    
                }})
                if(school && (createdBySchoolId != 18 || createdByUser.attributes.created_by != req.body.createdBy)){
                    if(assignedSchoolId == null && assignedSchoolId != undefined){
                            Utils.responseError(res, new Exception(
                            ErrorCode.RESOURCE.INVALID_REQUEST,
                            MessageInfo.MI_YOU_ARE_NOT_ALLOWED,
                            false,
                            HttpStatus.BAD_REQUEST
                        ));
                        return Promise.break;
                    }
               
               }else  if(global && ( req.body.createdBy!= 1 || createdByUser.attributes.created_by != req.body.createdBy)){
                  
                if(assignedBy1 != null && assignedBy1 != undefined){
                    Utils.responseError(res, new Exception(
                        ErrorCode.RESOURCE.INVALID_REQUEST,
                        MessageInfo.MI_YOU_ARE_NOT_ALLOWED,
                        false,
                        HttpStatus.BAD_REQUEST
                    ));
                    return Promise.break;
                }
              
              } 
                  return AuthorizationRoleUseCase.findOne(q => {
                    q.where(`${AuthorizationRoleTableSchema.FIELDS.RID}`,rid);
                    q.where(`${AuthorizationRoleTableSchema.FIELDS.IS_DELETED}`,0);
                },[]);

            } else {
                    Utils.responseError(res, new Exception(
                        ErrorCode.RESOURCE.INVALID_REQUEST,
                        MessageInfo.MI_ROLEID_NOT_EMPTY,
                        false,
                        HttpStatus.BAD_REQUEST
                    ));
                    return Promise.break;

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
            
                return AuthorizationRoleUseCase.findOne(q => {
                    q.where(`${AuthorizationRoleTableSchema.FIELDS.ROLE_TYPE}`,'G');
                    q.where(`${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME}`,authorizationRole.roleName);
                    q.where(`${AuthorizationRoleTableSchema.FIELDS.IS_DELETED}`,0);
                },[]);      
            }
        }).then((object) => {
            if (object!=null) {

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
                        q.select(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.RULE_ID}`,
                        `${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.PERMISSION}`,
                        `${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID}`,       
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.MODULE_ID}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.MODULE_NAME}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.ACTION}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.ROUTES}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.ICON}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.PARENT_ID}`,
                        `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.LEVEL}`
                        );
                    q.innerJoin(AuthorizationRuleSetTableSchema.TABLE_NAME, `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.MODULE_ID}`, `${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.MODULE_ID}`); 
                    q.where(AuthorizationRuleTableSchema.FIELDS.ROLE_ID, role.roleId);
                    q.orderBy(`${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.LEVEL}`, 'asc');
                    //q.limit(13);    
                }, []);
            }
        })
        .then(object => {
            
            let ret = [];
            role.permission = {};
            if (object != null && object.models != null) {
                console.log(object);
                ret = AuthorizationRuleSetUseCase.permissionFormat(object);
                role.permission = ret;
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
            return AuthorizationRoleUseCase.countByQuery(q => {
                q.where(AuthorizationRoleTableSchema.FIELDS.IS_DELETED, 0);
                if(checkuser.global != null && checkuser.global != undefined && checkuser.global == true) {
                  if(checkuser.tmp != null && checkuser.tmp != undefined && checkuser.tmp == true){
                    q.whereRaw(`(${AuthorizationRoleTableSchema.FIELDS.CREATED_BY} = '${userId}')`);
                    let condition=`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.SCHOOL_ID}=${checkuser.schoolId}`;
                    q.whereRaw(condition);
                    }
                    else if(userId != "1") {
                        //q.innerJoin(`${AuthorizationRuleTableSchema.TABLE_NAME}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.ROLE_ID}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID}`);
                        //q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.PERMISSION}`,"allow");      
                   //     let condition=`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.SCHOOL_ID}  NULL`;
                     //   q.where(condition);
                        q.whereRaw(`(${AuthorizationRoleTableSchema.FIELDS.CREATED_BY} = '${userId}')`);
                    } else {
                        //q.innerJoin(`${AuthorizationRuleTableSchema.TABLE_NAME}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.ROLE_ID}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID}`);
                        //q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.PERMISSION}`,"allow");      
                        let condition=`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.SCHOOL_ID}  NULL`;
                        q.where(condition);
                    }
                } else if(checkuser.school != null && checkuser.school != undefined && checkuser.school == true) {
                    if(userId != "18") {
                        q.whereRaw(`(${AuthorizationRoleTableSchema.FIELDS.CREATED_BY} = '${userId}')`);
                        let condition=`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.SCHOOL_ID}=${checkuser.schoolId}`;
                        q.whereRaw(condition);
                    } else {
                        let condition=`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.SCHOOL_ID}=${checkuser.schoolId}`;
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
                            }
                        }
                    }
                } 
                
            });
        })
        .then((totalObject) => {
            total = totalObject;
            return AuthorizationRoleUseCase.findByQuery(q => {
                q.where(AuthorizationRoleTableSchema.FIELDS.IS_DELETED, 0);
                q.where(AuthorizationRoleTableSchema.FIELDS.IS_DELETED, 0);
                if(checkuser.global != null && checkuser.global != undefined && checkuser.global == true) {
                  if(checkuser.tmp != null && checkuser.tmp != undefined && checkuser.tmp == true){
                    q.whereRaw(`(${AuthorizationRoleTableSchema.FIELDS.CREATED_BY} = '${userId}')`);
                    let condition=`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.SCHOOL_ID}=${checkuser.schoolId}`;
                    q.whereRaw(condition);
                    }
                    else if(userId != "1") {
                        //q.innerJoin(`${AuthorizationRuleTableSchema.TABLE_NAME}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.ROLE_ID}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID}`);
                        //q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.PERMISSION}`,"allow");      
                   //     let condition=`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.SCHOOL_ID}  NULL`;
                     //   q.where(condition);
                        q.whereRaw(`(${AuthorizationRoleTableSchema.FIELDS.CREATED_BY} = '${userId}')`);
                    } else {
                        //q.innerJoin(`${AuthorizationRuleTableSchema.TABLE_NAME}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.ROLE_ID}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID}`);
                        //q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.PERMISSION}`,"allow");      
                        let condition=`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.SCHOOL_ID}  NULL`;
                        q.where(condition);
                    }
                } else if(checkuser.school != null && checkuser.school != undefined && checkuser.school == true) {
                    if(userId != "18") {
                        q.whereRaw(`(${AuthorizationRoleTableSchema.FIELDS.CREATED_BY} = '${userId}')`);
                        let condition=`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.SCHOOL_ID}=${checkuser.schoolId}`;
                        q.whereRaw(condition);
                    } else {
                        let condition=`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.SCHOOL_ID}=${checkuser.schoolId}`;
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
                    ret.push(AuthorizationRoleModel.fromDto(object));
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
        //let checkuser:BearerObject=req[Properties.CHECK_USER];
       // req.body.createdBy = session.userId;
       let checkuser={};
       checkuser.global=true;
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
            // return AuthorizationRoleUseCase.findOne( q => {
            //     q.where(`${AuthorizationRoleTableSchema.FIELDS.USER_ID}`,authorizationRole.userId);
            //     q.where(`${AuthorizationRoleTableSchema.FIELDS.IS_DELETED}`,0);

            // })
        }).then((object) => {

        //    if(object == null) {
        //     Utils.responseError(res, new Exception(
        //         ErrorCode.RESOURCE.INVALID_REQUEST,
        //         MessageInfo.MI_PARENT_ROLE_NOT_FOUND,
        //         false,
        //         HttpStatus.BAD_REQUEST
        //     ));
        //     return Promise.break;
        //    }
        let parentRole=AuthorizationRoleModel.fromDto(object);
       // authorizationRole.level=parentRole.level+1;
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
        let count=0;
        let roleId=req.body.roleId;
        let authorizationRole = AuthorizationRoleModel.fromRequest(req);
            
        if (authorizationRole == null || authorizationRole.roleName == null) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.GENERIC,
                MessageInfo.MI_ROLE_NAME_NOT_EMPTY,
                false, HttpStatus.BAD_REQUEST
            ));
        }
        
            
              if (checkuser.schoolId == null || checkuser.schoolId != undefined) {
                return Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.GENERIC,
                    MessageInfo.MI_SCHOOL_ID_NOT_FOUND,
                    false, HttpStatus.BAD_REQUEST
                ));
                }
                if (roleId == null || roleId != undefined) {
                    return Utils.responseError(res, new Exception(
                        ErrorCode.RESOURCE.GENERIC,
                        MessageInfo.MI_ROLE_NOT_EXIST,
                        false, HttpStatus.BAD_REQUEST
                    ));
                    }
            permission.forEach(Rule => {
                checkschoolId =  Rule.schoolId == null && Rule.schoolId == undefined ? count++ : count;
                checkpermission = Rule.isChecked == null && Rule.isChecked == undefined ? count++ : count;

            });

        return Promise.then(() => {
            return AuthorizationRoleUseCase.findOne( q => {
                q.where(`${AuthorizationRoleTableSchema.FIELDS.USER_ID}`,authorizationRole.userId);
                q.where(`${AuthorizationRoleTableSchema.FIELDS.IS_DELETED}`,0);

            })
        }).then((object) => {

           if(object == null) {
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_REQUEST,
                MessageInfo.MI_PARENT_ROLE_NOT_FOUND,
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

        return SchoolUseCase.findOne( q => {
            q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_ID}`,checkuser.schoolId);
            q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.IS_DELETED}`,0);
        })
        }).then((object) => {
            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_SCHOOL_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
          return AuthorizationRoleUseCase.create(authorizationRole);

        }).then((object) => {
            if (object && object !== null && object.attributes !== null){
                let rid = object.attributes.rid;
                return AuthorizationRoleUseCase.findByQuery(q => {
                    q.where(`${AuthorizationRoleTableSchema.FIELDS.RID}`,rid);
                },[]);
            }
        })
        .then((object) => {
            if (object && object !== null && object.models.length>0) {  
                let roleData = AuthorizationRoleModel.fromDto(object.models[0]);
                roleId = roleData.roleId;
                return AuthorizationRuleUseCase.saveSchoolPermission(roleId,checkuser.schoolId,permission); 
                
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
                q.where(AuthorizationRoleTableSchema.FIELDS.IS_DELETED, 0);
                q.select(`${AuthorizationRoleTableSchema.TABLE_NAME}*`,`${AuthorizationRuleTableSchema.TABLE_NAME}.*`);
                if(checkuser.global != null && checkuser.global != undefined && checkuser.global == true) {
                    if(userId != "1") {
                        q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.CREATED_BY}`,userId);
                        q.innerJoin(`${AuthorizationRuleTableSchema.TABLE_NAME}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.ROLE_ID}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID}`);
                        q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.PERMISSION}`,"allow");      
                        let condition=`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID} IS NOT NULL`;
                        q.where(condition);
                      } else {
                       q.innerJoin(`${AuthorizationRuleTableSchema.TABLE_NAME}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.ROLE_ID}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID}`);
                       //q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.PERMISSION}`,"allow");      
                       let condition=`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID} NOT NULL`;
                       q.where(condition);
                      }
                }else {
                    q.andWhere(AuthorizationRoleTableSchema.FIELDS.IS_DELETED, 2);
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
                            }
                        }
                    }
                } 
                
            });
        })
        .then((totalObject) => {
            total = totalObject;
            return AuthorizationRoleUseCase.findByQuery(q => {
                q.where(AuthorizationRoleTableSchema.FIELDS.IS_DELETED, 0);
                q.select(`${AuthorizationRoleTableSchema.TABLE_NAME}*`,`${AuthorizationRuleTableSchema.TABLE_NAME}.*`);
                if(checkuser.global != null && checkuser.global != undefined && checkuser.global == true) {
                    if(userId != "1") {
                        q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.PARENT_ID}`,userId);
                        q.innerJoin(`${AuthorizationRuleTableSchema.TABLE_NAME}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.ROLE_ID}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID}`);
                        q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.PERMISSION}`,"allow");      
                        let condition=`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID} NOT NULL`;
                        q.where(condition);
                      } else {
                       q.innerJoin(`${AuthorizationRuleTableSchema.TABLE_NAME}`,`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.ROLE_ID}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID}`);
                       //q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.PERMISSION}`,"allow");      
                       let condition=`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID} NOT NULL`;
                       q.where(condition);
                      }
                }else {
                    q.andWhere(AuthorizationRoleTableSchema.FIELDS.IS_DELETED, 2);
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
                    ret.push(AuthorizationRoleModel.fromDto(object));
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

}

export default RoleHandler;
