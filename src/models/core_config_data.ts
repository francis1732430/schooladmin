/**
 *        on 5/20/18.
 */
import {CoreConfigDataTableSchema} from "../data/schemas";
import BaseModel from "./base";
import {Request} from "express";
export class CoreConfigDataModel extends BaseModel {
    public countryId:string;
    public configId:string;
    public configKey:string;
    public configValue:string;

    public static fromRequest(req:Request):CoreConfigDataModel {
        if (req != null && req.body) {
            let config = new CoreConfigDataModel();
            config.configId = CoreConfigDataModel.getString(req.body.configId);
            config.countryId = CoreConfigDataModel.getString(req.body.countryId);
            config.configKey = CoreConfigDataModel.getString(req.body.configKey);
            config.configValue = CoreConfigDataModel.getString(req.body.configValue);
            return config;
        }
        return null;
    }

    public static fromDto(object:any, filters?:string[]):CoreConfigDataModel {
        if (object != null) {
            let configId = object.get(CoreConfigDataTableSchema.FIELDS.CONFIG_ID);
            if (configId != null && configId !== "") {
                let createdDate = object.get(CoreConfigDataTableSchema.FIELDS.CREATED_DATE);
                let updatedDate = object.get(CoreConfigDataTableSchema.FIELDS.UPDATED_DATE);
                let countryId = object.get(CoreConfigDataTableSchema.FIELDS.COUNTRY_ID);
                let configKey = object.get(CoreConfigDataTableSchema.FIELDS.CONFIG_KEY);                
                let configValue = object.get(CoreConfigDataTableSchema.FIELDS.CONFIG_VALUE);
                let ret = new CoreConfigDataModel();
                ret.configId = configId;
                ret.createdDate = createdDate != null ? createdDate : undefined;
                ret.updatedDate = updatedDate != null ? updatedDate : undefined;
                ret.countryId = countryId != null && countryId !== "" ? countryId : undefined;
                ret.configKey = configKey != null && configKey !== "" ? configKey : undefined;
                ret.configValue = configValue != null && configValue !== "" ? configValue : undefined;                
                //noinspection TypeScriptUnresolvedVariable
                if (object.relations != null) {
                    //noinspection TypeScriptUnresolvedVariable
                    
                }

                if (filters != null) {
                    filters.forEach(filter => {
                        ret[filter] = undefined;
                    });
                }
                return ret;
            }
        }
        return null;
    }

    public toDto():any {
        let obj = {};
        obj[CoreConfigDataTableSchema.FIELDS.COUNTRY_ID] = this.countryId;
        obj[CoreConfigDataTableSchema.FIELDS.CONFIG_KEY] = this.configKey;
        obj[CoreConfigDataTableSchema.FIELDS.CONFIG_VALUE] = this.configValue;
        return obj;
    }
}

export default CoreConfigDataModel;
