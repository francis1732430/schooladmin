/**
 *      on 7/23/16.
 */
import {AuthorizationRoleTableSchema} from "../data/schemas";
import AuthorizationRuleModel from "./authorization_rule";
import BaseModel from "./base";
import * as express from "express";
import {Utils} from "../libs/utils";

/**
 * Class Account
 */
export class AuthorizationRoleModel extends BaseModel {
    public roleName:string;
    public userId:number;
    public roleType:string;
    public roleId:number;
    public parentId:number;
    public authorizationRule:AuthorizationRuleModel;
    public createdBy:number;
    public permissionType:number;
    public defaultRole:number;
    public level:number;
    public schoolId:number;
    public tmpId:number;

    /**
     *
     * @param req
     * @returns {any}
     */
    public static fromRequest(req:express.Request):AuthorizationRoleModel {
        if (req != null && req.body) {
            let account = new AuthorizationRoleModel();
            account.roleId = AuthorizationRoleModel.getNumber(req.body.roleId);
            account.roleName = AuthorizationRoleModel.getString(req.body.roleName);
            account.userId = AuthorizationRoleModel.getNumber(req.body.userId);
            account.roleType = AuthorizationRoleModel.getString(req.body.roleType);
            account.createdBy = AuthorizationRoleModel.getNumber(req.body.createdBy);
            account.parentId = AuthorizationRoleModel.getNumber(req.body.parentId);
            account.schoolId = AuthorizationRoleModel.getNumber(req.body.schoolId);
            //account.permissionType = AuthorizationRoleModel.getNumber(req.body.permissionType);
            account.level = AuthorizationRoleModel.getNumber(req.body.level);
            return account;
        }
        return null;
    }

    /**
     *
     * @param object
     * @param filters
     * @returns {any}
     */
    public static fromDto(object:any, filters?:string[]):AuthorizationRoleModel {
        if (object != null) {
            let roleId = object.get(AuthorizationRoleTableSchema.FIELDS.ROLE_ID);
            if (roleId != null && roleId !== "") {
                let rid = object.get(AuthorizationRoleTableSchema.FIELDS.RID);
                let createdDate = object.get(AuthorizationRoleTableSchema.FIELDS.CREATED_DATE);
                let updatedDate = object.get(AuthorizationRoleTableSchema.FIELDS.UPDATED_DATE);
                let roleName = object.get(AuthorizationRoleTableSchema.FIELDS.ROLE_NAME);
                let userId = object.get(AuthorizationRoleTableSchema.FIELDS.USER_ID);
                let roleType = object.get(AuthorizationRoleTableSchema.FIELDS.ROLE_TYPE);
                let parentId =  object.get(AuthorizationRoleTableSchema.FIELDS.PARENT_ID);
                let createdBy =  object.get(AuthorizationRoleTableSchema.FIELDS.CREATED_BY);
                let schoolId =  object.get(AuthorizationRoleTableSchema.FIELDS.SCHOOL_ID);
                //let permissionType =  object.get(AuthorizationRoleTableSchema.FIELDS.PERMISSION_TYPE);
                let defaultRole =  object.get(AuthorizationRoleTableSchema.FIELDS.DEFAULT_ROLE);
                let level =  object.get(AuthorizationRoleTableSchema.FIELDS.TREE_LEVEL);
                let tmpId =  object.get(AuthorizationRoleTableSchema.FIELDS.SCHOOL_TMP_ID);
                let ret = new AuthorizationRoleModel();
                ret.rid = rid != null && rid !== "" ? rid : undefined;
                ret.roleId = roleId != null && roleId !== "" ? roleId : undefined;
                ret.roleName = roleName != null && roleName !== "" ? roleName : undefined;
                ret.roleType = roleType != null && roleType !== "" ? roleType : undefined;
                ret.parentId = parentId != null && parentId !== "" ? parentId : undefined;
                ret.userId = userId != null && userId !== "" ? userId : undefined;
                ret.createdBy = createdBy != null && createdBy !== "" ? createdBy : undefined;
                ret.createdDate = createdDate != null ? createdDate : undefined;
                ret.updatedDate = updatedDate != null ? updatedDate : undefined;
                ret.schoolId = schoolId != null ? schoolId : undefined;
                //ret.permissionType = permissionType != null ? permissionType : undefined;
                ret.defaultRole = defaultRole != null ? defaultRole : undefined;
                ret.level = level != null ? level : undefined;
                ret.tmpId = tmpId != null ? tmpId : undefined;
                //console.log("sdddd");
                //console.log(filters);
                if (filters != null) {
                    filters.forEach(filter => {
                        ret[filter] = undefined;
                    });
                }
                if (object.relations != null) {
                    //noinspection TypeScriptUnresolvedVariable
                    if (object.relations.authorizationrule != null) {
                        ret.authorizationRule = null;
                        //noinspection TypeScriptUnresolvedVariable
                        let authorizationrule = AuthorizationRuleModel.fromDto(object.relations.authorizationrule, filters);
                        //if (authorizationrule != null) {
                            ret.authorizationRule = authorizationrule;
                        //}
                    }
                }
                return ret;
            }
        }
        return null;
    }

    /**
     *
     * @returns {{}}
     */

    public toDto():any {
        let obj = {};
        obj[AuthorizationRoleTableSchema.FIELDS.ROLE_NAME] = this.roleName;
        obj[AuthorizationRoleTableSchema.FIELDS.USER_ID] = this.userId;
        obj[AuthorizationRoleTableSchema.FIELDS.ROLE_ID] = this.roleId;
        obj[AuthorizationRoleTableSchema.FIELDS.ROLE_TYPE] = this.roleType;
        obj[AuthorizationRoleTableSchema.FIELDS.PARENT_ID] = this.parentId;
        obj[AuthorizationRoleTableSchema.FIELDS.CREATED_BY] = this.createdBy;
        //obj[AuthorizationRoleTableSchema.FIELDS.PERMISSION_TYPE] = this.permissionType;
        obj[AuthorizationRoleTableSchema.FIELDS.TREE_LEVEL] = this.level;
        obj[AuthorizationRoleTableSchema.FIELDS.SCHOOL_TMP_ID] = this.tmpId;
        if(this.schoolId)
         {
            obj[AuthorizationRoleTableSchema.FIELDS.SCHOOL_ID] = this.schoolId;
         }
        return obj;
    }
}

export default AuthorizationRoleModel;
