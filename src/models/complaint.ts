import {ComplaintRegistrationSchema} from "../data/schemas";
import BaseModel from "./base";
import {Request} from "express";

export class ComplaintRegistrationModel extends BaseModel {
    public registrationId:number;
    public studentId:number;
    public districtId:number;
    public cityId:number;
    public schoolId:string;
    public mobileNo:string;
    public email:string;
    public address:string;
    public pin:string;
    public description:string;
    public isActive:number;
    public createdBy:number;

    public static fromRequest(req:Request):ComplaintRegistrationModel {
        if (req != null && req.body) {
            let complaint = new ComplaintRegistrationModel();
            complaint.registrationId=ComplaintRegistrationModel.getNumber(req.body.registrationId);
            complaint.studentId=ComplaintRegistrationModel.getNumber(req.body.userId);
            complaint.districtId=ComplaintRegistrationModel.getNumber(req.body.districtId);
            complaint.cityId=ComplaintRegistrationModel.getNumber(req.body.cityId);
            complaint.schoolId=ComplaintRegistrationModel.getString(req.body.schoolId);
            complaint.mobileNo=ComplaintRegistrationModel.getString(req.body.mobileNo);
            complaint.email=ComplaintRegistrationModel.getString(req.body.email);
            complaint.address=ComplaintRegistrationModel.getString(req.body.address);
            complaint.pin=ComplaintRegistrationModel.getString(req.body.pin);
            complaint.description=ComplaintRegistrationModel.getString(req.body.description)
            complaint.isActive=ComplaintRegistrationModel.getNumber(req.body.isActive);
            complaint.createdBy=ComplaintRegistrationModel.getNumber(req.body.createdBy);
            return complaint;
        }
        return null;
    }

    public static fromDto(object:any, filters?:string[]):ComplaintRegistrationModel {
        if (object != null) {
            let rid = object.get(ComplaintRegistrationSchema.FIELDS.RID);
            let registrationId = object.get(ComplaintRegistrationSchema.FIELDS.REGISTRATION_ID);
            let studentId = object.get(ComplaintRegistrationSchema.FIELDS.STUDENT_ID);
            let districtId = object.get(ComplaintRegistrationSchema.FIELDS.DISTRICT_ID);
            let cityId = object.get(ComplaintRegistrationSchema.FIELDS.CITY_ID);
            let schoolId = object.get(ComplaintRegistrationSchema.FIELDS.SCHOOL_ID);
            let mobileNo = object.get(ComplaintRegistrationSchema.FIELDS.MOBILE_NUMBER);
            let email = object.get(ComplaintRegistrationSchema.FIELDS.EMAIL);
            let address = object.get(ComplaintRegistrationSchema.FIELDS.ADDRESS);
            let pin = object.get(ComplaintRegistrationSchema.FIELDS.PIN);
            let description = object.get(ComplaintRegistrationSchema.FIELDS.DESCRIPTION);
            let isActive = object.get(ComplaintRegistrationSchema.FIELDS.IS_ACTIVE);
            let createdDate = object.get(ComplaintRegistrationSchema.FIELDS.CREATED_DATE);
            let updatedDate = object.get(ComplaintRegistrationSchema.FIELDS.UPDATED_DATE); 
            let ret = new ComplaintRegistrationModel();
            ret.rid = rid != null && rid !== "" ? rid : undefined;
            ret.registrationId = registrationId != null && registrationId !== "" ? registrationId : undefined;
            ret.studentId= studentId != null && studentId !== "" ? studentId : undefined;
            ret.districtId = districtId != null && districtId !== "" ? districtId : undefined;
            ret.cityId = cityId != null && cityId !== "" ? cityId : undefined;
            ret.mobileNo = mobileNo != null && mobileNo !== "" ? mobileNo : undefined;
            ret.email = email != null && email !== "" ? email: undefined;
            ret.schoolId = schoolId != null && schoolId !== "" ? schoolId : undefined;
            ret.address = address != null && address !== "" ? address : undefined;
            ret.pin = pin != null && pin !== "" ? pin: undefined;
            ret.description = description != null && description !== "" ? description : undefined;
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
        obj[ComplaintRegistrationSchema.FIELDS.REGISTRATION_ID] = this.registrationId;
        obj[ComplaintRegistrationSchema.FIELDS.STUDENT_ID] = this.studentId;
        obj[ComplaintRegistrationSchema.FIELDS.DISTRICT_ID] = this.districtId;
        obj[ComplaintRegistrationSchema.FIELDS.CITY_ID] = this.cityId;
        obj[ComplaintRegistrationSchema.FIELDS.MOBILE_NUMBER] = this.mobileNo;
        obj[ComplaintRegistrationSchema.FIELDS.EMAIL] = this.email;
        obj[ComplaintRegistrationSchema.FIELDS.SCHOOL_ID] = this.schoolId;
        obj[ComplaintRegistrationSchema.FIELDS.ADDRESS] = this.address;
        obj[ComplaintRegistrationSchema.FIELDS.PIN] = this.pin;
        obj[ComplaintRegistrationSchema.FIELDS.DESCRIPTION] = this.description;
        obj[ComplaintRegistrationSchema.FIELDS.IS_ACTIVE] = this.isActive;
        obj[ComplaintRegistrationSchema.FIELDS.CREATED_BY] = this.createdBy;
        return obj;
    }
}

export default ComplaintRegistrationModel;
