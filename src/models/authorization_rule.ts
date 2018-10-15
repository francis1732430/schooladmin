/**
 *      on 7/23/16.
 */
import {AuthorizationRuleTableSchema,AuthorizationRuleSetTableSchema} from "../data/schemas";
import BaseModel from "./base";
import * as express from "express";
import {Utils} from "../libs/utils";

/**
 * Class Account
 */
export class AuthorizationRuleModel extends BaseModel {
    public moduleName:string;
    public action:string;
    public icon:string;
    public routes:string;
    public ruleId:number;
    public permission:string;
    public parentId:number;
    public level:number;
    public moduleId:number;
    public roleId:number;
    //public authorizationRule:AuthorizationRuleModel;
    

    /**
     *
     * @param req
     * @returns {any}
     */
    public static fromRequest(req:express.Request):AuthorizationRuleModel {
        if (req != null && req.body) {
            let account = new AuthorizationRuleModel();
            account.ruleId = AuthorizationRuleModel.getNumber(req.body.ruleId);
            account.roleId = AuthorizationRuleModel.getString(req.body.roleId);
            account.moduleId = AuthorizationRuleModel.getString(req.body.moduleId);
            account.permission = AuthorizationRuleModel.getString(req.body.permission);
            //account.roleName = AuthorizationRoleModel.getString(req.body.roleName);
            //account.userId = AuthorizationRoleModel.getNumber(req.body.userId);
            //account.roleType = AuthorizationRoleModel.getString(req.body.roleType);
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
    public static fromDto(object:any, filters?:string[]):AuthorizationRuleModel {
        if (object != null) {
            let ruleId = object.get(AuthorizationRuleTableSchema.FIELDS.RULE_ID);
            if (ruleId != null && ruleId !== "") {
                let createdDate = object.get(AuthorizationRuleTableSchema.FIELDS.CREATED_DATE);
                let updatedDate = object.get(AuthorizationRuleTableSchema.FIELDS.UPDATED_DATE);
                let rid = object.get(AuthorizationRuleSetTableSchema.FIELDS.RID);
                let moduleId = object.get(AuthorizationRuleSetTableSchema.FIELDS.MODULE_ID);
                let moduleName = object.get(AuthorizationRuleSetTableSchema.FIELDS.MODULE_NAME);
                let action = object.get(AuthorizationRuleSetTableSchema.FIELDS.ACTION);
                let icon = object.get(AuthorizationRuleSetTableSchema.FIELDS.ICON);
                let routes = object.get(AuthorizationRuleSetTableSchema.FIELDS.ROUTES);
                let level =  object.get(AuthorizationRuleSetTableSchema.FIELDS.LEVEL);
                let parentId = object.get(AuthorizationRuleSetTableSchema.FIELDS.PARENT_ID);
                let permission =  object.get(AuthorizationRuleTableSchema.FIELDS.PERMISSION);
                let ret = new AuthorizationRuleModel();
                ret.ruleId = ruleId;
                ret.rid = rid != null && rid !== "" ? rid : undefined;
                ret.moduleId = moduleId != null && moduleId !== "" ? moduleId : undefined;
                ret.moduleName = moduleName != null && moduleName !== "" ? moduleName : undefined;
                ret.action = action != null && action !== "" ? action : undefined;
                ret.routes = routes != null && routes !== "" ? routes : undefined;
                ret.icon = icon != null && icon !== "" ? icon : undefined;
                ret.level = level != null && level !== "" ? level : undefined;
                ret.parentId = parentId != null && parentId !== "" ? parentId : undefined;
                ret.permission = permission != null && permission !== "" ? permission : undefined;
        
                
                if (filters != null) {
                    filters.forEach(filter => {
                        ret[filter] = undefined;
                    });
                }
                if (object.relations != null) {
                    //noinspection TypeScriptUnresolvedVariable
                    
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

    public static toDto():any {
        let obj = {};
        obj[AuthorizationRuleTableSchema.FIELDS.ROLE_ID] = this.roleId; 
        obj[AuthorizationRuleTableSchema.FIELDS.MODULE_ID] = this.moduleId;
        obj[AuthorizationRuleTableSchema.FIELDS.PERMISSION] = this.permission;
        return obj;
    }
}

export default AuthorizationRuleModel;
