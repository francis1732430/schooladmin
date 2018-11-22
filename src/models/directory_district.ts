
import {DirectoryDistrictTableSchema} from "../data/schemas";
import BaseModel from "./base";
import {Request} from "express";

export class DirectoryDistrictModel extends BaseModel {
    public districtId:string;
    public districtName:string;
    //public stateName:string;
    public isActive:number;
    public createdDate:string;
    public updatedDate:string;
    public static fromRequest(req:Request):DirectoryDistrictModel {
        if (req != null && req.body) {
            let district = new DirectoryDistrictModel();
            district.districtId = DirectoryDistrictModel.getString(req.body.districtId);
            district.districtName = DirectoryDistrictModel.getString(req.body.districtName);
            district.isActive = DirectoryDistrictModel.getNumber(req.body.isActive);
            return district;
        }
        return null;
    }
    public static objRequest(req:any):DirectoryDistrictModel {
            let district = new DirectoryDistrictModel();
            district.districtId = DirectoryDistrictModel.getString(req.districtId);
            district.districtName = DirectoryDistrictModel.getString(req.districtName);
            district.isActive = DirectoryDistrictModel.getNumber(req.isActive);
            return district;
        
        return null;
    }
    public static fromDto(object:any, filters?:string[]):DirectoryDistrictModel {
        if (object != null) {
            let districtId = object.get(DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID);
            let districtName = object.get(DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME);
            //let stateName = object.get(DirectoryDistrictTableSchema.FIELDS.STATE_NAME);
            let isActive = object.get(DirectoryDistrictTableSchema.FIELDS.IS_ACTIVE);
            let createdDate = object.get(DirectoryDistrictTableSchema.FIELDS.CREATED_DATE);
            let updatedDate = object.get(DirectoryDistrictTableSchema.FIELDS.UPDATED_DATE);
            let ret = new DirectoryDistrictModel();
            ret.districtId = districtId != null && districtId !== "" ? districtId : undefined;
            ret.districtName = districtName != null && districtName !== "" ? districtName : undefined;
            //ret.stateName = stateName != null && stateName !== "" ? stateName : undefined;
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
        obj[DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID] = this.districtId;
        obj[DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME] = this.districtName;
        //obj[DirectoryDistrictTableSchema.FIELDS.STATE_NAME] = this.stateName;
        obj[DirectoryDistrictTableSchema.FIELDS.IS_ACTIVE] = this.isActive;
        return obj;
    }
}

export default DirectoryDistrictModel;
