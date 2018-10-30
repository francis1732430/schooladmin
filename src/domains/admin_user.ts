/**
 *      on 7/21/16.
 */
import {AdminUserDto,AuthorizationRoleDto} from "../data/models";
import {AuthorizationRoleUseCase} from "../domains";
import {Utils} from "../libs/utils";
import {AdminUserModel, AuthorizationRoleModel, Exception} from "../models";
import {AdminUserTableSchema,AuthorizationRoleTableSchema} from "../data/schemas";
import {Promise} from "thenfail";
import * as Bookshelf from "bookshelf";
import {BaseUseCase} from "./base";
import {HttpStatus, ErrorCode, MessageInfo} from "../libs/constants";

export class AdminUserUseCase extends BaseUseCase {

    constructor() {
        super();
        this.mysqlModel = AdminUserDto;
    }

    public create(user:AdminUserModel):Promise<any> {
        let roleInfo:any;
        let roleId;
        return Promise.then(() => {
            return this.findByQuery(q => {
                //q.where(AdminUserTableSchema.FIELDS.USER_ID, user.createdBy);
                q.select(`${AdminUserTableSchema.TABLE_NAME}.*`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID}`);
                q.innerJoin(`${AuthorizationRoleTableSchema.TABLE_NAME}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.USER_ID}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`)
               q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.USER_ID}`,user.createdBy);
                q.limit(1);
            }, []);
        })
        .then(object => {
            if (object != null && object.models != null && object.models[0] != null) {
                 roleId=object.models[0].get('role_id');
                return this.findByQuery(q => {
                    q.where(AdminUserTableSchema.FIELDS.EMAIL, user.email);
                    q.where(AdminUserTableSchema.FIELDS.IS_DELETED, 0);
                    q.limit(1);
                }, []);
             }

            return Promise.reject(new Exception(
                ErrorCode.RESOURCE.USER_NOT_FOUND,
                MessageInfo.MI_USER_NOT_EXIST,
                false,
                HttpStatus.BAD_REQUEST
            ));
        })
        .then(object => {

            if (object != null && object.models.length == 0) {
            if(user.roleId && user.roleId != undefined && user.roleId != null){

                return AuthorizationRoleUseCase.findOne(q => {
                    q.where(AuthorizationRoleTableSchema.FIELDS.ROLE_ID, user.roleId);
                    q.where(AuthorizationRoleTableSchema.FIELDS.ROLE_TYPE, 'G');
                }, []);
            }
            return Promise.void;
        }
        
            return Promise.reject(new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_EMAIL_ALREADY_USE,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }).then((object) => {

            if(object != null){
               let roleName=object.get('role_name');
               user.roleName=roleName;
            }
              return AuthorizationRoleUseCase.findByQuery(q => {
                     q.where(AuthorizationRoleTableSchema.FIELDS.ROLE_ID, roleId);
                     q.where(AuthorizationRoleTableSchema.FIELDS.IS_DELETED, 0);
                     q.limit(1);
                 }, []);
        })
        .then(object => {
            if (object != null && object.models != null && object.models[0] != null) {
                roleInfo = AuthorizationRoleModel.fromDto(object.models[0]);
                console.log(roleInfo);
                return AdminUserDto.create(AdminUserDto, user.toDto()).save();
            }
            return Promise.reject(new Exception(
                ErrorCode.ROLE.NO_ROLE_FOUND,
                MessageInfo.MI_ROLE_NOT_EXIST,
                false,
                HttpStatus.BAD_REQUEST
            ));
        })
        .then(object => {
            console.log(object.id);
            if (object != null) {
                return this.findByQuery(q => {
                    q.where(AdminUserTableSchema.FIELDS.RID, object.id);
                    q.limit(1);
                }, []);
            }
            return Promise.reject(new Exception(
                ErrorCode.USER.CREATE_USER_FAILED,
                MessageInfo.MI_CREATE_USER_FAILED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        })
        .then(object => {
            if (object != null && object.models != null && object.models[0] != null) {
                let userData = AdminUserModel.fromDto(object.models[0]);
                console.log(userData);
                let authRole = new AuthorizationRoleModel();
                authRole.level=roleInfo["level"]+1;
                authRole.userId = userData.userId;
                authRole.roleType = 'U';
                authRole.createdBy = user.createdBy;
                if(user.createdBy == 1){
                    authRole.parentId = user.roleId;
                }else {
                    authRole.parentId = roleId;
                }
                
                authRole.roleName = user.roleName;
                authRole.assignedDistrict = user.assignedDistrict;
                if(user.roleId && user.schoolId){
                    authRole.schoolId=user.schoolId;
                }
                console.log("eeeeeeee",roleInfo);
                if(!user.roleId || user.roleId == undefined || user.roleId == null){
                    console.log("eeeeeeee1",roleInfo);
                    authRole.schoolId=user.schoolId;
                }
                AuthorizationRoleDto.create(AuthorizationRoleDto, authRole.toDto()).save();
                return  authRole.toDto();
            }
            return Promise.reject(new Exception(
                ErrorCode.USER.CREATE_USER_FAILED,
                MessageInfo.MI_CREATE_USER_FAILED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        })
        .catch(err => {
            return Promise.reject(Utils.parseDtoError(err));
        })
        .enclose();
    }

    public find(limit?:number, related?:string[]):Promise<any> {
        return Promise.then(() => {
            let sub = related != null ? related : [];
            return AdminUserDto.create(AdminUserDto).query(q => {
                if (limit != null) {
                    q.limit(limit);
                }
            }).fetchAll({withRelated: sub});
        })
            .catch(err => {
                return Promise.reject(Utils.parseDtoError(err));
            })
            .enclose();
    }

    public updateById(id:string, user:AdminUserModel):Promise<any> {
        let adminuser:any;
        return Promise.then(() => {
            return this.findById(id);
        })
        .then(object => {
            adminuser = object;
            return this.findByQuery(q => {
                q.where(AdminUserTableSchema.FIELDS.EMAIL, user.email);
                q.whereNot(AdminUserTableSchema.FIELDS.RID, id);
                q.where(AdminUserTableSchema.FIELDS.IS_DELETED, 0);
                q.limit(1);
            }, []);
        })
        .then(object => {
            if (object != null && object.models.length ==0 ) {
                let userData = AdminUserModel.fromDto(adminuser);
                console.log(userData);
                console.log(user);
                if(userData.createdBy == user.createdBy || user.createdBy==1 || user.userId == userData.userId) {
                    let data = user.toDto();
                    return adminuser.save(data, {patch: true});
                }
                return Promise.reject(new Exception(
                    ErrorCode.USER.NOT_ALLOWED_TO_UPDATE,
                    MessageInfo.MI_NOT_ALLOWED_TO_UPDATE,
                    false,
                    HttpStatus.BAD_REQUEST
                )); 
            }
            return Promise.reject(new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_EMAIL_ALREADY_USE,
                false,
                HttpStatus.BAD_REQUEST
            ));
        })
        .catch(err => {
            return Promise.reject(Utils.parseDtoError(err));
        })
        .enclose();
    }

    public updateByPid(id:string, user:AdminUserModel):Promise<any> {
        let userData:any;
        return Promise.then(() => {
            return this.findByQuery(q => {
                q.where(AdminUserTableSchema.FIELDS.USER_ID, id);
                q.where(AdminUserTableSchema.FIELDS.IS_DELETED, 0);
                q.limit(1);
            }, []);
        })
        .then(object => {
            if(object.models[0]!=null) {
                userData = object.models[0];
                let data = user.toDto();   
                return this.findByQuery(q => {
                    q.where(AdminUserTableSchema.FIELDS.EMAIL, data[AdminUserTableSchema.FIELDS.EMAIL]);
                    q.where(AdminUserTableSchema.FIELDS.IS_DELETED, 0);
                    q.whereNot(AdminUserTableSchema.FIELDS.USER_ID, id);                    
                    q.limit(1);
                }, []);
            }
            return Promise.reject(new Exception(
                ErrorCode.RESOURCE.NOT_FOUND,
                MessageInfo.MI_OBJECT_ITEM_NOT_EXIST_OR_DELETED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        })
        .then(object => {
            if(object.models[0]==null) {               
                let data = user.toDto();                
                let adminUserData = {};
                adminUserData[AdminUserTableSchema.FIELDS.FIRSTNAME] = data[AdminUserTableSchema.FIELDS.FIRSTNAME];
                adminUserData[AdminUserTableSchema.FIELDS.LASTNAME] = data[AdminUserTableSchema.FIELDS.LASTNAME];
                adminUserData[AdminUserTableSchema.FIELDS.EMAIL] = data[AdminUserTableSchema.FIELDS.EMAIL];
                adminUserData[AdminUserTableSchema.FIELDS.PHONE_NUMBER1] = data[AdminUserTableSchema.FIELDS.PHONE_NUMBER1];
                adminUserData[AdminUserTableSchema.FIELDS.PHONE_NUMBER2] = data[AdminUserTableSchema.FIELDS.PHONE_NUMBER2];
                console.log("user Data ==================")
                console.log(adminUserData)
                return userData.save(adminUserData, {patch: true});
            }
            return Promise.reject(new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_EMAIL_WAS_BE_USED,
                false,
                HttpStatus.BAD_REQUEST
            )); 
                
        })
        .catch(err => {
            return Promise.reject(Utils.parseDtoError(err));
        })
        .enclose();
    }

    public updateForApproval(rid:string, status: number):any {
        return Promise.then(() => {
            return this.findById(rid);
        }).then(object => {
            if (object) {
                let userData = AdminUserModel.fromDto(object);

                    let adminUser = {};
                    adminUser[AdminUserTableSchema.FIELDS.APPROVAL_STATUS] = status;
                    return object.save(adminUser, {patch: true});
                
            } else {
                return Promise.reject(new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_OBJECT_ITEM_NOT_EXIST_OR_DELETED,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
            }
        }).catch(err => {
            return Promise.reject(Utils.parseDtoError(err));
        }).enclose();
    }

    public destroyById(rid:string,createdBy:number):any {
        return Promise.then(() => {
            return this.findById(rid);
        }).then(object => {
            if (object) {
                let userData = AdminUserModel.fromDto(object);
                if(userData.createdBy==createdBy || createdBy==1){
                    let adminUser = {};
                    adminUser[AdminUserTableSchema.FIELDS.IS_DELETED] = 1;
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
        }).catch(err => {
            return Promise.reject(Utils.parseDtoError(err));
        }).enclose();
    }

    public updatePasswordById(id: string, oldPassword: string, newPassword: string): Promise<any> {
        let adminuser: Bookshelf.Model<any>;
        return Promise.then(() => {
                return this.findByQuery(q => {
                    q.where(AdminUserTableSchema.FIELDS.USER_ID, id);
                    q.where(AdminUserTableSchema.FIELDS.IS_DELETED, 0);
                    q.limit(1);
                }, []);
            })
            .then(object => {
                
                let adminuserData = AdminUserModel.fromDto(object.models[0]);
                console.log(adminuserData);
                adminuser = object.models[0];
                let hash = adminuserData.password;
                console.log(hash);
                return Utils.compareHash(oldPassword, hash);
            })
            .then(object => {
                if (!object) {
                    return Promise.reject(new Exception(
                        ErrorCode.AUTHENTICATION.WRONG_USER_NAME_OR_PASSWORD,
                        MessageInfo.MI_INCORRECT_OLD_PASSWORD,
                        false,
                        HttpStatus.BAD_REQUEST
                    ));
                }

                let data = {};
                data[AdminUserTableSchema.FIELDS.PASSWORD] = Utils.hashPassword(newPassword);
                return adminuser.save(data, {patch: true});
            })
            .catch(err => {
                return Promise.reject(Utils.parseDtoError(err));
            })
            .enclose();
    }

    public resetPassword(id: string, newPassword: string): Promise<any> {
        let adminuser: Bookshelf.Model<any>;
        return Promise.then(() => {
                return this.findByQuery(q => {
                    q.where(AdminUserTableSchema.FIELDS.USER_ID, id);
                    q.where(AdminUserTableSchema.FIELDS.IS_DELETED, 0);
                    q.limit(1);
                }, []);
            })
            .then(object => {                
                adminuser = object.models[0];
                let data = {};
                data[AdminUserTableSchema.FIELDS.PASSWORD] = Utils.hashPassword(newPassword);
                return adminuser.save(data, {patch: true});
            })
            .catch(err => {
                return Promise.reject(Utils.parseDtoError(err));
            })
            .enclose();
    }

    public createMerchant(user:AdminUserModel):Promise<any> {
        let roleInfo:any;
        return Promise.then(() => {
            return this.findByQuery(q => {
                q.where(AdminUserTableSchema.FIELDS.USER_ID, user.createdBy);
                q.limit(1);
            }, []);
        })
        .then(object => {
            if (object != null && object.models != null && object.models[0] != null) {
                return this.findByQuery(q => {
                    q.where(AdminUserTableSchema.FIELDS.EMAIL, user.email);
                    q.where(AdminUserTableSchema.FIELDS.IS_DELETED, 0);
                    q.limit(1);
                }, []);
            }

            return Promise.reject(new Exception(
                ErrorCode.RESOURCE.USER_NOT_FOUND,
                MessageInfo.MI_USER_NOT_EXIST,
                false,
                HttpStatus.BAD_REQUEST
            ));
        })
        .then(object => {
            if (object != null && object.models.length == 0) {
                return AuthorizationRoleUseCase.findByQuery(q => {
                    q.where(AuthorizationRoleTableSchema.FIELDS.ROLE_ID, user.roleId);
                    q.where(AuthorizationRoleTableSchema.FIELDS.ROLE_TYPE, 'G');
                    q.limit(1);
                }, []);
            }

            return Promise.reject(new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_EMAIL_ALREADY_USE,
                false,
                HttpStatus.BAD_REQUEST
            ));
        })
        .then(object => {
            if (object != null && object.models != null && object.models[0] != null) {
                roleInfo = AuthorizationRoleModel.fromDto(object.models[0]);
                console.log(roleInfo);
                user.approvalStatus = -1;
                user.status = 0;
                return AdminUserDto.create(AdminUserDto, user.toDto()).save();
            }
            return Promise.reject(new Exception(
                ErrorCode.ROLE.NO_ROLE_FOUND,
                MessageInfo.MI_ROLE_NOT_EXIST,
                false,
                HttpStatus.BAD_REQUEST
            ));
        })
        .then(object => {
            console.log(object.id);
            if (object != null) {
                return this.findByQuery(q => {
                    q.where(AdminUserTableSchema.FIELDS.RID, object.id);
                    q.limit(1);
                }, []);
            }
            return Promise.reject(new Exception(
                ErrorCode.USER.CREATE_USER_FAILED,
                MessageInfo.MI_CREATE_USER_FAILED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        })
        .then(object => {
           
            if (object != null && object.models != null && object.models[0] != null) {
                let userData = AdminUserModel.fromDto(object.models[0]);
                console.log(userData);
                let authRole = new AuthorizationRoleModel();
                authRole.userId = userData.userId;
                authRole.roleType = 'U';
                authRole.createdBy = user.createdBy;
                authRole.parentId = user.roleId;
                authRole.roleName = roleInfo["roleName"];
                AuthorizationRoleDto.create(AuthorizationRoleDto, authRole.toDto()).save();
                let data = {};
                data["userId"] = userData.userId;
                data["rid"] = userData.rid;
                return  data;
            }
            return Promise.reject(new Exception(
                ErrorCode.USER.CREATE_USER_FAILED,
                MessageInfo.MI_CREATE_USER_FAILED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        })
        .catch(err => {
            return Promise.reject(Utils.parseDtoError(err));
        })
        .enclose();
    }


    public updateMerchant(user:AdminUserModel):Promise<any> {
        let userInfo:any;
        return Promise.then(() => {
            return this.findByQuery(q => {
                q.where(AdminUserTableSchema.FIELDS.USER_ID, user.createdBy);
                q.limit(1);
            }, []);
        })
        .then(object => {
            if (object != null && object.models != null && object.models[0] != null) {
                return this.findOne(q => {
                    q.where(AdminUserTableSchema.FIELDS.RID, user.rid)
                }, []);
            }

            return Promise.reject(new Exception(
                ErrorCode.RESOURCE.USER_NOT_FOUND,
                MessageInfo.MI_USER_NOT_EXIST,
                false,
                HttpStatus.BAD_REQUEST
            ));
        })
        .then(object=> {
            if (object != null) {  
                userInfo =   object;
                return this.findOne(q => {
                    q.where(AdminUserTableSchema.FIELDS.EMAIL, user.email);
                    q.whereNot(AdminUserTableSchema.FIELDS.RID, user.rid);
                    q.where(AdminUserTableSchema.FIELDS.IS_DELETED, 0);
                    q.limit(1);
                }, []);
            }
            return Promise.reject(new Exception(
                ErrorCode.RESOURCE.USER_NOT_FOUND,
                MessageInfo.MI_USER_NOT_EXIST,
                false,
                HttpStatus.BAD_REQUEST
            ));
        })
        .then(object => {
            console.log("dsszsad");
            console.log(object);
            if (object == null) {               
                if(userInfo.get(AdminUserTableSchema.FIELDS.APPROVAL_STATUS)==-1 || userInfo.get(AdminUserTableSchema.FIELDS.APPROVAL_STATUS)==4) {
                    let data = user.toDto();

                    return userInfo.save(data, {patch: true});
                } else  {
                    return Promise.reject(new Exception(
                        ErrorCode.RESOURCE.INVALID_EMAIL,
                        MessageInfo.MI_MERCHANT_NOT_UPDATE,
                        false,
                        HttpStatus.BAD_REQUEST
                    )); 
                }
            
                
            }
            return Promise.reject(new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_EMAIL_WAS_BE_USED,
                false,
                HttpStatus.BAD_REQUEST
            )); 
        })
        .catch(err => {
            return Promise.reject(Utils.parseDtoError(err));
        })
        .enclose();
    }

    public getMerchantRoleId():any {

           return "18";
    }

    public checkStoreId(rid: string):any {
        return this.findOne(q => {
            q.where(AdminUserTableSchema.FIELDS.RID, rid);
            q.where(AdminUserTableSchema.FIELDS.IS_DELETED, 0);
        }, []);
    }

    public getUserInfo(userId: any):any {
        return this.findOne(q => {
            q.where(AdminUserTableSchema.FIELDS.USER_ID, userId);
            q.where(AdminUserTableSchema.FIELDS.IS_DELETED, 0);
        }, []);
    }

    public getUserDetail(rid: string):any {
        return this.findOne(q => {
            q.where(AdminUserTableSchema.FIELDS.RID, rid);
            q.where(AdminUserTableSchema.FIELDS.IS_DELETED, 0);
        }, []);
    }

    public updateApprovalStatus(rid: string, status: number): any {
        return Promise.then(() => {
            return this.findById(rid);
        }).then(object => {
            if (object) {
                console.log(AdminUserModel.fromDto(object));
                let userData = AdminUserModel.fromDto(object);
                let adminUser = {};
                adminUser[AdminUserTableSchema.FIELDS.APPROVAL_STATUS] = status;
                return object.save(adminUser, { patch: true });
            } else {
                return Promise.reject(new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_OBJECT_ITEM_NOT_EXIST_OR_DELETED,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
            }
        }).catch(err => {
            return Promise.reject(Utils.parseDtoError(err));
        }).enclose();
    }
    public checkUser(userid:any,schoolId?:any):Promise<any> {
        return Promise.then(() => {
     
            return this.findOne(q => {
            q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,userid);
            q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}`,0);
            
            })

        }).then((object) => {

            if(object == null && object == undefined) {
                return null;
            }
            let obj:any={};
            let adminuser=AdminUserModel.fromDto(object);
            let schoolid=adminuser.schoolId;

            if(schoolid) {
            obj.school=true
            } else {
             obj.global=true;
             if(schoolId) {
                 obj.tmp=true;
                 obj.schoolId=schoolId;
             }
            }
            console.log("nnnnnnnn",obj);
            return obj;

        })
            .catch(err => {
                return Promise.reject(Utils.parseDtoError(err));
            })
            .enclose();
    }


}

export default new AdminUserUseCase();
