import {AuthorizationRuleSetTableSchema} from "../data/schemas";
import BaseModel from "./base";
import * as express from "express";


export class AuthorizationRuleSetModel extends BaseModel {

    public moduleId:Number;
    public moduleNames:String;
    public parentId:Number;
    public action:String;


    public static fromDto(object: any, filters?: string[]): AuthorizationRuleSetModel {
        if (object != null) {
                let moduleId = object.get(AuthorizationRuleSetTableSchema.FIELDS.MODULE_ID);
                let moduleNames = object.get(AuthorizationRuleSetTableSchema.FIELDS.MODULE_NAME);
                let parentId = object.get(AuthorizationRuleSetTableSchema.FIELDS.PARENT_ID);
                let action = object.get(AuthorizationRuleSetTableSchema.FIELDS.ACTION);
                let rid = object.get(AuthorizationRuleSetTableSchema.FIELDS.RID);

                let ret = new AuthorizationRuleSetModel();

                ret.rid = rid != null && rid !== "" ? rid : undefined;

                ret.moduleNames = moduleNames != null && moduleNames !== "" ? moduleNames : undefined;

                ret.moduleId = moduleId != null && moduleId !== "" ? moduleId : undefined;

                ret.parentId = parentId != null && parentId !== "" ? parentId : undefined;

                ret.action = action != null && action !== "" ? action : undefined;
                //ret.permission = permission != null && permission !== "" ? permission : undefined;

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

        return null;
    }

}

export default AuthorizationRuleSetModel;