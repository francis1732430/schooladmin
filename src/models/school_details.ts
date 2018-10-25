
import {SchoolTableSchema} from "../data/schemas";
import BaseModel from "./base";
import {Request} from "express";

export class SchoolModel extends BaseModel {
    public schoolId:string;
    public schoolName:string;
    public districtId:string;
    public cityId:string;
    public startedDate:string;
    public principleName:string;
    public representativeName:string;
    public approvalStatus:number;
    public schoolPhoneNumber:string;
    public representativePhoneNumber:string;
    public schoolEmail:string;
    public representativeEmail:string;
    public PIN:string;
    public address:string;
    public isActive:number;
    public image:string;
    public createdDate:string;
    public updatedDate:string;
    public createdBy:number;

    public static fromRequest(req:Request):SchoolModel {
        if (req != null && req.body) {
            let school = new SchoolModel();
            school.schoolId = SchoolModel.getString(req.body.schoolId);
            school.schoolName = SchoolModel.getString(req.body.schoolName);
            school.districtId = SchoolModel.getString(req.body.districtId);
            school.cityId = SchoolModel.getString(req.body.cityId);
            school.startedDate = SchoolModel.getString(req.body.startedDate);
            school.principleName = SchoolModel.getString(req.body.principleName);
            school.representativeName = SchoolModel.getString(req.body.representativeName);
            school.approvalStatus = SchoolModel.getNumber(req.body.approvalStatus);
            school.schoolPhoneNumber = SchoolModel.getString(req.body.schoolPhoneNumber);
            school.representativePhoneNumber = SchoolModel.getString(req.body.representativePhoneNumber);
            school.schoolEmail = SchoolModel.getString(req.body.schoolEmail);
            school.representativeEmail = SchoolModel.getString(req.body.representativeEmail);
            school.PIN = SchoolModel.getString(req.body.PIN);
            school.image = SchoolModel.getString(req.body.image);
            school.address = SchoolModel.getString(req.body.address);
            school.isActive = SchoolModel.getNumber(req.body.isActive);
            school.createdBy = SchoolModel.getNumber(req.body.createdBy);
            return school;
        }
        return null;
    }

    public static fromDto(object:any, filters?:string[]):SchoolModel {
        if (object != null) {
            let schoolId = object.get(SchoolTableSchema.FIELDS.SCHOOL_ID);
            let schoolName = object.get(SchoolTableSchema.FIELDS.SCHOOL_NAME);
            let districtId = object.get(SchoolTableSchema.FIELDS.DISTRICT_ID);
            let cityId = object.get(SchoolTableSchema.FIELDS.CITY_ID);
            let startedDate = object.get(SchoolTableSchema.FIELDS.STARTED_DATE);
            let principleName = object.get(SchoolTableSchema.FIELDS.PRNICIPLE_NAME);
            let representativeName = object.get(SchoolTableSchema.FIELDS.REPRESENTATIVE_NAME);
            let approvalStatus = object.get(SchoolTableSchema.FIELDS.APPROVAL_STATUS);
            let schoolPhoneNumber = object.get(SchoolTableSchema.FIELDS.SCHOOL_PHONE_NUMBER);
            let representativePhoneNumber = object.get(SchoolTableSchema.FIELDS.REPRESENTATIVE_PHONE_NUMBER);
            let schoolEmail = object.get(SchoolTableSchema.FIELDS.SCHOOL_EMAIL);
            let representativeEmail = object.get(SchoolTableSchema.FIELDS.REPRESENTATIVE_EMAIL);
            let PIN = object.get(SchoolTableSchema.FIELDS.POSTAL_CODE);
            let address = object.get(SchoolTableSchema.FIELDS.ADDRESS);
            let image = object.get(SchoolTableSchema.FIELDS.IMAGE_URL);
            let isActive = object.get(SchoolTableSchema.FIELDS.IS_ACTIVE);
            let createdDate = object.get(SchoolTableSchema.FIELDS.CREATED_DATE);
            let updatedDate = object.get(SchoolTableSchema.FIELDS.UPDATED_DATE);
            let createdBy = object.get(SchoolTableSchema.FIELDS.CREATED_BY);
            let ret = new SchoolModel();
            ret.schoolId = schoolId != null && schoolId !== "" ? schoolId : undefined;
            ret.schoolName = schoolName != null && schoolName !== "" ? schoolName : undefined;
            ret.districtId = districtId != null && districtId !== "" ? districtId : undefined;
            ret.cityId = cityId != null && cityId !== "" ? cityId : undefined;
            ret.startedDate = startedDate != null && startedDate !== "" ? startedDate : undefined;
            ret.principleName = principleName != null && principleName !== "" ? principleName : undefined;            
            ret.representativeName = representativeName != null && representativeName !== "" ? representativeName : undefined;
            ret.approvalStatus = approvalStatus != null && approvalStatus !== "" ? approvalStatus : undefined;
            ret.schoolPhoneNumber = schoolPhoneNumber != null && schoolPhoneNumber !== "" ? schoolPhoneNumber : undefined;
            ret.representativePhoneNumber = representativePhoneNumber != null && representativePhoneNumber !== "" ? representativePhoneNumber : undefined;
            ret.schoolEmail = schoolEmail != null && schoolEmail !== "" ? schoolEmail : undefined;
            ret.representativeEmail = representativeEmail != null && representativeEmail !== "" ? representativeEmail : undefined;
            ret.PIN = PIN != null && PIN !== "" ? PIN : undefined;
            ret.image = image != null && image !== "" ? image : undefined;
            ret.address = address != null && address !== "" ? address : undefined;
            ret.isActive = isActive != null && isActive !== "" ? isActive : undefined;
            ret.createdBy = createdBy != null && createdBy !== "" ? createdBy : undefined;
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
        obj[SchoolTableSchema.FIELDS.SCHOOL_ID] = this.schoolId;
        obj[SchoolTableSchema.FIELDS.SCHOOL_NAME] = this.schoolName;
        obj[SchoolTableSchema.FIELDS.DISTRICT_ID] = this.districtId;
        obj[SchoolTableSchema.FIELDS.CITY_ID] = this.cityId;
        obj[SchoolTableSchema.FIELDS.STARTED_DATE] = this.startedDate;
        obj[SchoolTableSchema.FIELDS.PRNICIPLE_NAME] = this.principleName;
        obj[SchoolTableSchema.FIELDS.REPRESENTATIVE_NAME] = this.representativeName;
        obj[SchoolTableSchema.FIELDS.APPROVAL_STATUS] = this.approvalStatus;
        obj[SchoolTableSchema.FIELDS.SCHOOL_PHONE_NUMBER] = this.schoolPhoneNumber;
        obj[SchoolTableSchema.FIELDS.REPRESENTATIVE_PHONE_NUMBER] = this.representativePhoneNumber;
        obj[SchoolTableSchema.FIELDS.SCHOOL_EMAIL] = this.schoolEmail;
        obj[SchoolTableSchema.FIELDS.REPRESENTATIVE_EMAIL] = this.representativeEmail;
        obj[SchoolTableSchema.FIELDS.POSTAL_CODE] = this.PIN;
        obj[SchoolTableSchema.FIELDS.ADDRESS] = this.address;
        obj[SchoolTableSchema.FIELDS.IS_ACTIVE] = this.isActive;
        obj[SchoolTableSchema.FIELDS.IMAGE_URL] = this.image;
        obj[SchoolTableSchema.FIELDS.CREATED_BY] = this.createdBy;
        return obj;
    }
}

export default SchoolModel;
