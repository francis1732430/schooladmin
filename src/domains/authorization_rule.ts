/**
 *    on 22/05/18.
 */
import {AuthorizationRuleDto} from "../data/models";
import {Utils} from "../libs/utils";
import {AuthorizationRuleModel} from "../models";
import {Promise} from "thenfail";
import {BaseUseCase} from "./base";
import {ErrorCode, MessageInfo, HttpStatus} from "../libs/constants";
import {Exception} from "../models/exception";
import {AuthorizationRoleTableSchema,AuthorizationRuleTableSchema} from "../data/schemas";
import * as UUID from "node-uuid";

export class AuthorizationRuleUseCase extends BaseUseCase {
    constructor() {
        super();
        this.mysqlModel = AuthorizationRuleDto;
    }

    /**
     * Insert new AuthorizationRole to database
     * @param {AuthorizationRuleModel} AuthorizationRole
     * @returns {Promise<any>}
     */
    public savepermission(roleId:number,permission:any):Promise<any> {
        console.log(permission);
       let permissionVal:any;
        return Promise.each(permission, (perm: any) => {
            console.log(perm);
            return Promise.then(() => {
                permissionVal = perm;
                return this.findOne(q => {
                    q.where(AuthorizationRuleTableSchema.FIELDS.MODULE_ID, perm.moduleId);                 
                    q.where(AuthorizationRuleTableSchema.FIELDS.ROLE_ID, roleId);  
                }, []);
            
            }).then((object) => {
                console.log(object);                
                    if(object!=null) {                    
                        let conditions = [];
                        let updateData = [];
                        let rule = AuthorizationRuleModel.fromDto(object);                     
                        conditions[AuthorizationRuleTableSchema.FIELDS.RULE_ID] = rule.ruleId; 
                        updateData[AuthorizationRuleTableSchema.FIELDS.PERMISSION] = permissionVal.isChecked?"allow":"deny";
                        return this.updateByCondition(conditions, updateData)
                            .catch(err => {
                                return Promise.reject(Utils.parseDtoError(err));
                            })
                            .enclose();
                    }else {
                        let data = [];                
                        data[AuthorizationRuleTableSchema.FIELDS.ROLE_ID] = roleId;
                        data[AuthorizationRuleTableSchema.FIELDS.MODULE_ID] = permissionVal.moduleId;
                        data[AuthorizationRuleTableSchema.FIELDS.PERMISSION] = permissionVal.isChecked?"allow":"deny";
                        data[AuthorizationRuleTableSchema.FIELDS.RULE_ID] = null;
                        console.log(data);
                        return AuthorizationRuleDto.create(AuthorizationRuleDto, data).save();
                    }
               
            }).catch(err => {
                return Promise.reject(Utils.parseDtoError(err));
            });
        });
    }
    public saveSchoolPermission(roleId:number,permission,userId:any):Promise<any> {
        console.log(permission);
       let permissionVal:any;
        return Promise.each(permission, (perm: any) => {
            console.log(perm);
            return Promise.then(() => {
                permissionVal = perm;
                return this.findOne(q => {
                    q.where(AuthorizationRuleTableSchema.FIELDS.SCHOOL_ID, perm.schoolId);                 
                    q.where(AuthorizationRuleTableSchema.FIELDS.ROLE_ID, roleId);  
                }, []);
            
            }).then((object) => {
                console.log(object);                
                    if(object!=null) {                    
                        let conditions = [];
                        let updateData = [];
                        let rule = AuthorizationRuleModel.fromDto(object);                     
                        conditions[AuthorizationRuleTableSchema.FIELDS.RULE_ID] = rule.ruleId; 
                        conditions[AuthorizationRoleTableSchema.FIELDS.SCHOOL_ID]=permissionVal.schoolId;
                        updateData[AuthorizationRuleTableSchema.FIELDS.PERMISSION] = permissionVal.isChecked?"allow":"deny";
                        return this.updateByCondition(conditions, updateData)
                            .catch(err => {
                                return Promise.reject(Utils.parseDtoError(err));
                            })
                            .enclose();
                    }else {
                        let data = [];                
                        data[AuthorizationRuleTableSchema.FIELDS.ROLE_ID] = roleId;
                        data[AuthorizationRoleTableSchema.FIELDS.SCHOOL_ID]=permissionVal.schoolId;
                        data[AuthorizationRuleTableSchema.FIELDS.PERMISSION] = permissionVal.isChecked?"allow":"deny";
                        data[AuthorizationRuleTableSchema.FIELDS.RULE_ID] = null;
                        data[AuthorizationRoleTableSchema.FIELDS.CREATED_BY]=userId;
                        console.log(data);
                        return AuthorizationRuleDto.create(AuthorizationRuleDto, data).save();
                    }
               
            }).catch(err => {
                return Promise.reject(Utils.parseDtoError(err));
            });
        });
    }
    public findSchool(roleId:number):Promise<any> {
       let ret=[0];
        return Promise.then(() => {
        return this.findByQuery(q => {
            q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.ROLE_ID}`,roleId);
            q.where(`${AuthorizationRuleTableSchema.TABLE_NAME}.${AuthorizationRuleTableSchema.FIELDS.IS_DELETED}`,0);
        })
       }).then((objects) => {

        if(objects.models != null && objects.models.length > 0){
           ret=[];
            objects.models.forEach(obj => {
                ret.push(obj.get('school_id'));
            });
            return ret;
        }else {
            return ret;
        }

       })
    }
}

export default new AuthorizationRuleUseCase();
