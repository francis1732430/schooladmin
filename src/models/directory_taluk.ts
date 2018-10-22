
import {DirectoryTalukTableSchema} from "../data/schemas";
import BaseModel from "./base";
import {Request} from "express";

export class DirectoryTalukModel extends BaseModel {
    public cityId:string;
    public cityName:string;
    public districtId:string;
    public isActive:number;
    public createdDate:string;
    public updatedDate:string;
    public static fromRequest(req:Request):DirectoryTalukModel {
        if (req != null && req.body) {
            let city = new DirectoryTalukModel();
            city.cityId = DirectoryTalukModel.getString(req.body.cityId);
            city.cityName = DirectoryTalukModel.getString(req.body.cityName);
            city.districtId = DirectoryTalukModel.getString(req.body.districtId);
            city.isActive = DirectoryTalukModel.getNumber(req.body.isActive);
            return city;
        }
        return null;
    }

    public static fromDto(object:any, filters?:string[]):DirectoryTalukModel {
        if (object != null) {
            let cityId = object.get(DirectoryTalukTableSchema.FIELDS.CITY_ID);
            let cityName = object.get(DirectoryTalukTableSchema.FIELDS.CITY_NAME);
            let districtId = object.get(DirectoryTalukTableSchema.FIELDS.DISTRICT_ID);
            let isActive = object.get(DirectoryTalukTableSchema.FIELDS.IS_ACTIVE);
            let createdDate = object.get(DirectoryTalukTableSchema.FIELDS.CREATED_DATE);
            let updatedDate = object.get(DirectoryTalukTableSchema.FIELDS.UPDATED_DATE);
            let ret = new DirectoryTalukModel();
            ret.cityId = cityId != null && cityId !== "" ? cityId : undefined;
            ret.cityName = cityName != null && cityName !== "" ? cityName : undefined;
            ret.districtId = districtId != null && districtId !== "" ? districtId : undefined;
            ret.isActive = isActive != null && isActive !== "" ? isActive : undefined;
            ret.createdDate = createdDate != null && createdDate !== "" ? createdDate : undefined;
            ret.updatedDate = updatedDate != null && updatedDate !== "" ? updatedDate : undefined;
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
        return null;
    }

    public toDto():any {
        let obj = {};
        obj[DirectoryTalukTableSchema.FIELDS.CITY_ID] = this.cityId;
        obj[DirectoryTalukTableSchema.FIELDS.CITY_NAME] = this.cityName;
        obj[DirectoryTalukTableSchema.FIELDS.DISTRICT_ID] = this.districtId;
        obj[DirectoryTalukTableSchema.FIELDS.IS_ACTIVE] = this.isActive;
        return obj;
    }
}

export default DirectoryTalukModel;
