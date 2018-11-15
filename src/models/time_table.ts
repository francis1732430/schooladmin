import {TimeTableTableSchema} from "../data/schemas";
import BaseModel from "./base";
import {Request} from "express";

export class TimeTableModel extends BaseModel {
    public timeTableId:number;
    public classId:number;
    public standardId:number;
    public startTime:number;
    public endTime:number;
    public weakId:number;
    public staffId:number;
    public schoolId:number;
    public isActive:number;
    public createdBy:number;
    public static fromRequest(req:Request):TimeTableModel {
        if (req != null && req.body) {
            let time = new TimeTableModel();
            time.timeTableId=TimeTableModel.getNumber(req.body.timeTableId);
            time.classId=TimeTableModel.getNumber(req.body.classId);
            time.schoolId=TimeTableModel.getNumber(req.body.schoolId);
            time.standardId=TimeTableModel.getNumber(req.body.standardId);
            time.startTime=TimeTableModel.getNumber(req.body.startTime);
            time.endTime=TimeTableModel.getNumber(req.body.endTime);
            time.weakId=TimeTableModel.getNumber(req.body.weakId);
            time.staffId=TimeTableModel.getNumber(req.body.staffId);
            time.isActive=TimeTableModel.getNumber(req.body.isActive);
            return time;
        }
        return null;
    }

    public static fromDto(object:any, filters?:string[]):TimeTableModel {
        if (object != null) {
            let rid = object.get(TimeTableTableSchema.FIELDS.RID);
            let timeTableId = object.get(TimeTableTableSchema.FIELDS.TIME_TABLE_ID);
            let standardId = object.get(TimeTableTableSchema.FIELDS.STANDARD_ID);
            let schoolId = object.get(TimeTableTableSchema.FIELDS.SCHOOL_ID);
            let startTime = object.get(TimeTableTableSchema.FIELDS.START_TIME);
            let endTime = object.get(TimeTableTableSchema.FIELDS.END_TIME);
            let weakId = object.get(TimeTableTableSchema.FIELDS.WEAK_ID);
            let staffId = object.get(TimeTableTableSchema.FIELDS.STAFF_ID);
            let isActive = object.get(TimeTableTableSchema.FIELDS.IS_ACTIVE);
            let createdDate = object.get(TimeTableTableSchema.FIELDS.CREATED_DATE);
            let updatedDate = object.get(TimeTableTableSchema.FIELDS.UPDATED_DATE); 
            let ret = new TimeTableModel();
            ret.rid = rid != null && rid !== "" ? rid : undefined;
            ret.timeTableId = timeTableId!= null && timeTableId !== "" ? timeTableId : undefined;
            ret.standardId = standardId != null && standardId !== "" ? standardId : undefined;
            ret.schoolId = schoolId != null && schoolId !== "" ? schoolId : undefined;
            ret.startTime = startTime != null && startTime !== "" ? startTime : undefined;
            ret.endTime = endTime != null && endTime !== "" ? endTime : undefined;
            ret.weakId = weakId != null && weakId !== "" ? weakId : undefined;
            ret.staffId = staffId != null && staffId !== "" ? staffId : undefined;
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
        obj[TimeTableTableSchema.FIELDS.TIME_TABLE_ID] = this.timeTableId;
        obj[TimeTableTableSchema.FIELDS.STANDARD_ID] = this.standardId;
        obj[TimeTableTableSchema.FIELDS.SCHOOL_ID] = this.schoolId;
        obj[TimeTableTableSchema.FIELDS.START_TIME] = this.startTime;
        obj[TimeTableTableSchema.FIELDS.END_TIME] = this.endTime;
        obj[TimeTableTableSchema.FIELDS.WEAK_ID] = this.weakId;
        obj[TimeTableTableSchema.FIELDS.STAFF_ID] = this.staffId;
        obj[TimeTableTableSchema.FIELDS.IS_ACTIVE] = this.isActive;
        return obj;
    }
}

export default TimeTableModel;
