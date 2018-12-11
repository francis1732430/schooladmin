import {NeetCenterTableSchema} from "../data/schemas";
import BaseModel from "./base";
import {Request} from "express";

export class NeetCenterModel extends BaseModel {
    public centerId:number;
    public centerName:string;
    public districtId:number;
    public cityId:number;
    public coordinates:string;
    public mobileNumber:string;
    public representativeName:string;
    public address:string;
    public isActive:number;
    public createdBy:number;
    public static fromRequest(req:Request):NeetCenterModel {
        if (req != null && req.body) {
            let neetCenter = new NeetCenterModel();
            neetCenter.centerId=NeetCenterModel.getNumber(req.body.centerId);
            neetCenter.centerName=NeetCenterModel.getString(req.body.centerName);
            neetCenter.districtId=NeetCenterModel.getNumber(req.body.districtId);
            neetCenter.cityId=NeetCenterModel.getNumber(req.body.cityId);
            neetCenter.coordinates=NeetCenterModel.getString(req.body.coordinates);
            neetCenter.mobileNumber=NeetCenterModel.getString(req.body.mobileNumber);
            neetCenter.representativeName=NeetCenterModel.getString(req.body.representativeName);
            neetCenter.address=NeetCenterModel.getString(req.body.address);
            neetCenter.isActive=NeetCenterModel.getNumber(req.body.isActive);
            neetCenter.createdBy=NeetCenterModel.getNumber(req.body.createdBy);
            return neetCenter;
        }
        return null;
    }

    public static fromDto(object:any, filters?:string[]):NeetCenterModel {
        if (object != null) {
            let rid = object.get(NeetCenterTableSchema.FIELDS.RID);
            let centerId = object.get(NeetCenterTableSchema.FIELDS.CENTER_ID);
            let centerName = object.get(NeetCenterTableSchema.FIELDS.CENTER_NAME);
            let districtId = object.get(NeetCenterTableSchema.FIELDS.DISTRICT_ID);
            let cityId = object.get(NeetCenterTableSchema.FIELDS.CITY_ID);
            let coordinates = object.get(NeetCenterTableSchema.FIELDS.CO_ORDINATES);
            let mobileNumber = object.get(NeetCenterTableSchema.FIELDS.MOBILE_NUMBER);
            let representativeName = object.get(NeetCenterTableSchema.FIELDS.REPRESENTATIVE_NAME);
            let address = object.get(NeetCenterTableSchema.FIELDS.ADDRESS);
            let isActive = object.get(NeetCenterTableSchema.FIELDS.IS_ACTIVE);
            let createdDate = object.get(NeetCenterTableSchema.FIELDS.CREATED_DATE);
            let updatedDate = object.get(NeetCenterTableSchema.FIELDS.UPDATED_DATE); 
            let ret = new NeetCenterModel();
            ret.rid = rid != null && rid !== "" ? rid : undefined;
            ret.centerId = centerId != null && centerId !== "" ? centerId : undefined;
            ret.centerName = centerName != null && centerName !== "" ? centerName : undefined;
            ret.districtId = districtId != null && districtId !== "" ? districtId : undefined;
            ret.cityId = cityId != null && cityId !== "" ? cityId : undefined;
            ret.coordinates = coordinates != null && coordinates !== "" ? coordinates : undefined;
            ret.mobileNumber = mobileNumber != null && mobileNumber !== "" ? mobileNumber : undefined;
            ret.representativeName = representativeName != null && representativeName !== "" ? representativeName : undefined;
            ret.address = address != null && address !== "" ? address : undefined;
            ret.isActive = isActive != null && isActive !== "" ? isActive : undefined;
            ret.createdDate = createdDate != null && createdDate !== "" ? createdDate : undefined;
            ret.updatedDate = updatedDate != null && updatedDate !== "" ? updatedDate : undefined;
            if (object.relations != null) {
                
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
        obj[NeetCenterTableSchema.FIELDS.CENTER_ID] = this.centerId;
        obj[NeetCenterTableSchema.FIELDS.CENTER_NAME] = this.centerName;
        obj[NeetCenterTableSchema.FIELDS.DISTRICT_ID] = this.districtId;
        obj[NeetCenterTableSchema.FIELDS.CITY_ID] = this.cityId;
        obj[NeetCenterTableSchema.FIELDS.CO_ORDINATES] = this.coordinates;
        obj[NeetCenterTableSchema.FIELDS.MOBILE_NUMBER] = this.mobileNumber;
        obj[NeetCenterTableSchema.FIELDS.REPRESENTATIVE_NAME] = this.representativeName;
        obj[NeetCenterTableSchema.FIELDS.ADDRESS] = this.address;
        obj[NeetCenterTableSchema.FIELDS.IS_ACTIVE] = this.isActive;
        obj[NeetCenterTableSchema.FIELDS.CREATED_BY] = this.createdBy;
        return obj;
    }
}

export default NeetCenterModel;
