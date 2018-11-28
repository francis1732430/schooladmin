/**
 *    on 22/05/18.
 */
import {AuthorizationRoleDto} from "../data/models";
import {AuthorizationRuleUseCase,AuthorizationRuleSetUseCase} from "../domains"; 
import {Utils} from "../libs/utils";
import {AuthorizationRoleModel,AuthorizationRuleModel} from "../models";
import {Promise} from "thenfail";
import {BaseUseCase} from "./base";
import {ErrorCode, MessageInfo, HttpStatus} from "../libs/constants";
import {Exception} from "../models/exception";
import {Logger} from "../libs";
import {AuthorizationRoleTableSchema,AuthorizationRuleTableSchema,AuthorizationRuleSetTableSchema} from "../data/schemas";


export class AuthorizationRoleUseCase extends BaseUseCase {
    
    constructor() {
        super();
        this.mysqlModel = AuthorizationRoleDto;
    }

    /**
     * Insert new AuthorizationRole to database
     * @param {AuthorizationRoleModel} AuthorizationRole
     * @returns {Promise<any>}
     */
    public create(AuthorizationRole:AuthorizationRoleModel):Promise<any> {
        return Promise.then(() => {
                return AuthorizationRoleDto.create(AuthorizationRoleDto, AuthorizationRole.toDto()).save();
            })
            .catch(err => {
                return Promise.reject(Utils.parseDtoError(err));
            })
            .enclose();
    }

    /**
     * update AuthorizationRole by id to database
     * @param id
     * @param {AuthorizationRoleModel} AuthorizationRole
     * @returns {Promise<any>}
     */
    public updateById(id:string, role:AuthorizationRoleModel):Promise<any> {
        return Promise.then(() => {
            return this.findById(id);
        })
            .then(object => {
                if(object != null && object != undefined) {
                    let userData = AuthorizationRoleModel.fromDto(object);
                    console.log(userData);
                    let data = role.toDto();
                    return object.save(data, {patch: true});
                }  
                  return Promise.void;
            })
            .catch(err => {
                return Promise.reject(Utils.parseDtoError(err));
            })
            .enclose();
    }
    /**
     * update AuthorizationRole by id to database
     * @param roleId
     * @param userId
     * @returns {Promise<any>}
     */
    public updateUserRole(roleId:number, userId:number,user:any):Promise<any> {
        let roleInfo :any;
        return Promise.then(() => {
            return this.findOne(q => {
                q.where(AuthorizationRoleTableSchema.FIELDS.ROLE_ID,roleId);
            });
        })
        .then(object => {
            roleInfo = AuthorizationRoleModel.fromDto(object);
            return this.findOne(q => {
                q.where(AuthorizationRoleTableSchema.FIELDS.USER_ID,userId);
            });
        })
            .then(object => {
                //noinspection TypeScriptUnresolvedVariable
                if (object == null) {
                    let exception = new Exception(
                        ErrorCode.RESOURCE.DUPLICATE_RESOURCE,
                        MessageInfo.MI_OBJECT_ITEM_EXISTED,
                        false,
                        HttpStatus.BAD_REQUEST
                    );
                    return Promise.reject(exception);
                }
                let roleData = AuthorizationRoleModel.fromDto(object);
                console.log(roleData);
                let data = roleData.toDto();
               
                data[AuthorizationRoleTableSchema.FIELDS.DISTRICT_ID] = user.assignedDistrict;
                data[AuthorizationRoleTableSchema.FIELDS.SCHOOL_ID] = user.schoolId;
                console.log(data);
                return object.save(data, {patch: true});
            })
            .catch(err => {
                return Promise.reject(Utils.parseDtoError(err));
            })
            .enclose();
    }

    public verifyRole(userId:string, action:string, checkuser?:any):Promise<any> {
        if (userId == null) {
            return Promise.reject(new Error(MessageInfo.MI_INVALID_PARAMETER));
        }

        return Promise.then(() => {
            return AuthorizationRuleSetUseCase.findByQuery(q => {
                q.where(AuthorizationRuleSetTableSchema.FIELDS.ACTION, action);
                q.limit(1);
            }, []);
        })
        .then(objects => {
            if (objects != null && objects.models != null && objects.models.length != null && objects.models.length === 1) {  
                return Promise.then(() => {
                    return this.findByQuery(q => {
                        q.where(AuthorizationRoleTableSchema.FIELDS.USER_ID, userId);
                        q.limit(1);
                    }, []);
                })
                .then(objects => {
                        let exception;
                        //noinspection TypeScriptUnresolvedVariable
                        if (objects != null && objects.models != null && objects.models.length != null && objects.models.length === 1) {
                            let role = AuthorizationRoleModel.fromDto(objects.models[0])
                            return AuthorizationRuleUseCase.findByQuery(q => {   
                                if(checkuser && checkuser.global == true) {
                                    if(checkuser && checkuser.tmp == true){

                                        q.select(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.RULE_ID}`,
                                        `${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.PERMISSION}`,
                                        `${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID}`,
                                        );
                                        
                                        if(userId != '1'){
                                            q.where(AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID, checkuser.schoolId);
                                            q.where(AuthorizationRuleTableSchema.FIELDS.PERMISSION, 'allow');
                                            q.where(AuthorizationRuleTableSchema.FIELDS.ROLE_ID, role.roleId);
                                        }
                                    }else {
                                        q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.IS_DELETED}`,0);
                                        q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.PERMISSION}`,'allow');
                                        q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.ROLE_ID}`,role.roleId);
                                    }                         
                                        
                                    } else {
                                        q.select(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.RULE_ID}`,
                                    `${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.PERMISSION}`,
                                    `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.MODULE_NAME}`,
                                    `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.ACTION}`,
                                    `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.ROUTES}`,
                                    `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.PARENT_ID}`
                                    );
                                        q.innerJoin(AuthorizationRuleSetTableSchema.TABLE_NAME, `${AuthorizationRuleSetTableSchema.TABLE_NAME}.${AuthorizationRuleSetTableSchema.FIELDS.MODULE_ID}`, `${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.MODULE_ID}`);
                                        q.where(AuthorizationRuleTableSchema.FIELDS.PERMISSION, 'allow');
                                        q.where(AuthorizationRuleTableSchema.FIELDS.ROLE_ID, role.roleId);
                                        q.where(AuthorizationRuleSetTableSchema.FIELDS.ACTION, action);
                                    }
                                //q.limit(1);    
                            }, []);
                        }

                        exception = new Exception(ErrorCode.ROLEAUTHENTICATION.NO_ROLE_ASSIGNED, MessageInfo.NO_ROLE_ASSIGNED, false);
                        exception.httpStatus = HttpStatus.UNAUTHORIZED;
                        return exception;
                    })
                    .then(object => {
                        console.log("vvvvvvvvvvvvvvv",object.models.length);
                        if (object != null && object.models != null && object.model.length != null && object.models.length != 0) {
                            return Promise.void;
                        } else {
                            let exception;
                            exception = new Exception(ErrorCode.ROLEAUTHENTICATION.NO_ROLE_ASSIGNED, MessageInfo.MI_NOT_PERMISSION_ACCESS, false);
                            exception.httpStatus = HttpStatus.UNAUTHORIZED;
                            return exception;
                        }
                    })
                } else {
                    let exception;
                    exception = new Exception(ErrorCode.ROLEAUTHENTICATION.ACTION_NOT_FOUND, MessageInfo.ACTION_NOT_FOUND, false);
                    exception.httpStatus = HttpStatus.UNAUTHORIZED;
                    return exception;

                }
            })
            .catch(err => {
                Logger.error(err.message, err);
                return false;
            })
            .enclose();
    }

    public destroyById(rid:string,createdBy:number):any {
        let userData:any;
        return Promise.then(() => {
            return this.findById(rid);
        }).then(object => {
            if (object) {
                userData = AuthorizationRoleModel.fromDto(object);
                if(userData.createdBy==createdBy || createdBy==1){
                    let adminUser = {};
                    adminUser[AuthorizationRoleTableSchema.FIELDS.IS_DELETED] = 1;
                    return object.save(adminUser, {patch: true});
                } else {
                    return Promise.reject(new Exception(
                        ErrorCode.USER.NOT_ALLOWED_TO_DELETE,
                        MessageInfo.MI_NOT_ALLOWED_TO_DELETE,
                        false,
                        HttpStatus.BAD_REQUEST
                    )); 
                }
                
            } else {
                return Promise.reject(new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_OBJECT_ITEM_NOT_EXIST_OR_DELETED,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
            }
        }).then(object => {
            let conditions = [];
            let updateData = [];                    
            conditions[AuthorizationRoleTableSchema.FIELDS.PARENT_ID] = userData.roleId; 
            updateData[AuthorizationRoleTableSchema.FIELDS.IS_DELETED] = 1;
            return this.updateByCondition(conditions, updateData)
                .catch(err => {
                    return Promise.reject(Utils.parseDtoError(err));
                })
                .enclose();
        }).catch(err => {
            return Promise.reject(Utils.parseDtoError(err));
        }).enclose();
    }

    public list(userId:string,checkuser:any):Promise<any> {
        return Promise.then(() => {
            return this.findOne(q => {
                q.where(AuthorizationRoleTableSchema.FIELDS.USER_ID, userId);
            }, []);
        })
        .then((object) => {
            let role = AuthorizationRoleModel.fromDto(object);
            return this.findByQuery(q => {

                if(checkuser.global && checkuser.global == true) {
                    
                if(checkuser.tmp && checkuser.tmp == true) {
                    q.where(`${AuthorizationRoleTableSchema.FIELDS.SCHOOL_ID}`,checkuser.schoolId);
                }else if(userId!='1') {
                        q.whereRaw(`(${AuthorizationRoleTableSchema.FIELDS.CREATED_BY} = '${userId}')`);
                    }
                }

                if(checkuser.school && checkuser.school == true) {
                   if(userId != "18") {
                        q.whereRaw(`(${AuthorizationRoleTableSchema.FIELDS.CREATED_BY} = '${userId}')`);
                        q.where(`${AuthorizationRoleTableSchema.FIELDS.SCHOOL_ID}`,checkuser.schoolId);
                    }
                 else {
                    q.where(`${AuthorizationRoleTableSchema.FIELDS.SCHOOL_ID}`,checkuser.schoolId);
                }
            }

                q.where(AuthorizationRoleTableSchema.FIELDS.ROLE_TYPE, 'G');
                q.where(AuthorizationRoleTableSchema.FIELDS.IS_DELETED, 0);
               
            }, []);
        })
        .then(objects => {
            if (objects != null && objects.models != null && objects.models.length != null) {
                let ret = [];
                objects.models.forEach(object => {
                    ret.push(AuthorizationRoleModel.fromDto(object));
                });
               return ret;
                
            }
            let exception;
            exception = new Exception(ErrorCode.ROLE.NO_ROLE_FOUND, MessageInfo.MI_NO_ROLE_FOUND, false);
            exception.httpStatus = HttpStatus.BAD_REQUEST;
            return exception;
        })
        .catch(err => {
            Logger.error(err.message, err);
            return false;
        })
        .enclose();
    }

    public getRoleDetailByUserId(userId: number):any {
        return this.findOne(q => {
            q.where(AuthorizationRoleTableSchema.FIELDS.USER_ID, userId);
        }, []);
    }
}

export default new AuthorizationRoleUseCase();
