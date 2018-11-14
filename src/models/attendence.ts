import {AttendenceTableSchema} from "../data/schemas";
import BaseModel from "./base";
import {Request} from "express";

export class AttendenceModel extends BaseModel {
    public attendenceId:number;
    public standardId:number;
    public classId:number;
    public userId:number;
    public status:number;
    public isNotified:number;
    public schoolId:number;
    public reason:string;
    public isActive:number;
    public createdBy:number;
    public static fromRequest(obj:any):AttendenceModel {
        if (obj != null && obj) {
            let attendence = new AttendenceModel();
            attendence.standardId=AttendenceModel.getNumber(obj.standardId);
            attendence.attendenceId=AttendenceModel.getNumber(obj.attendenceId);
            attendence.schoolId=AttendenceModel.getNumber(obj.schoolId);
            attendence.classId=AttendenceModel.getNumber(obj.classId);
            attendence.userId=AttendenceModel.getNumber(obj.userId);
            attendence.status=AttendenceModel.getNumber(obj.status);
            attendence.isNotified=AttendenceModel.getNumber(obj.isNotified);
            attendence.reason=AttendenceModel.getString(obj.reason);
            attendence.isActive=AttendenceModel.getNumber(obj.isActive);
            attendence.createdBy=AttendenceModel.getNumber(obj.createdBy);
            return attendence;
        }
        return null;
    }

    public static fromDto(object:any, filters?:string[]):AttendenceModel {
        if (object != null) {
            let rid = object.get(AttendenceTableSchema.FIELDS.RID);
            let standardId = object.get(AttendenceTableSchema.FIELDS.STANDARD_ID);
            let attendenceId = object.get(AttendenceTableSchema.FIELDS.ATTENDENCE_ID);
            let schoolId = object.get(AttendenceTableSchema.FIELDS.SCHOOL_ID);
            let classId = object.get(AttendenceTableSchema.FIELDS.CLASS_ID);
            let userId = object.get(AttendenceTableSchema.FIELDS.USER_ID);
            let status = object.get(AttendenceTableSchema.FIELDS.STATUS);
            let isNotified = object.get(AttendenceTableSchema.FIELDS.NOTIFIED);
            let reason = object.get(AttendenceTableSchema.FIELDS.REASON);
            let isActive = object.get(AttendenceTableSchema.FIELDS.IS_ACTIVE);
            let createdDate = object.get(AttendenceTableSchema.FIELDS.CREATED_DATE);
            let updatedDate = object.get(AttendenceTableSchema.FIELDS.UPDATED_DATE); 
            let ret = new AttendenceModel();
            ret.rid = rid != null && rid !== "" ? rid : undefined;
            ret.standardId = standardId != null && standardId !== "" ? standardId : undefined;
            ret.attendenceId = attendenceId != null && attendenceId !== "" ? attendenceId : undefined;
            ret.schoolId = schoolId != null && schoolId !== "" ? schoolId : undefined;
            ret.classId = classId != null && classId !== "" ? classId : undefined;
            ret.userId = userId != null && userId !== "" ? userId : undefined;
            ret.status = status != null && status !== "" ? status : undefined;
            ret.isNotified = isNotified != null && isNotified !== "" ? isNotified : undefined;
            ret.reason = reason != null && reason !== "" ? reason : undefined;
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
        obj[AttendenceTableSchema.FIELDS.STANDARD_ID] = this.standardId;
        obj[AttendenceTableSchema.FIELDS.ATTENDENCE_ID] = this.attendenceId;
        obj[AttendenceTableSchema.FIELDS.SCHOOL_ID] = this.schoolId;
        obj[AttendenceTableSchema.FIELDS.CLASS_ID] = this.classId;
        obj[AttendenceTableSchema.FIELDS.USER_ID] = this.userId;
        obj[AttendenceTableSchema.FIELDS.STATUS] = this.status;
        obj[AttendenceTableSchema.FIELDS.NOTIFIED] = this.isNotified;
        obj[AttendenceTableSchema.FIELDS.REASON] = this.reason;
        obj[AttendenceTableSchema.FIELDS.CREATED_BY] = this.createdBy;
        obj[AttendenceTableSchema.FIELDS.IS_ACTIVE] = this.isActive;
        return obj;
    }
}

export default AttendenceModel;
