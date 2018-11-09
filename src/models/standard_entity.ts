import {StandardEntityTableSchema} from "../data/schemas";
import BaseModel from "./base";
import {Request} from "express";

export class StandardEntityModel extends BaseModel {
    public standardId:number;
    public standardName:string;
    public schoolId:number;
    public subjectIds:number;
    public isActive:number;

    public static fromRequest(req:Request):StandardEntityModel {
        if (req != null && req.body) {
            let Standard = new StandardEntityModel();
            Standard.standardId=StandardEntityModel.getNumber(req.body.standardId);
            Standard.standardName=StandardEntityModel.getString(req.body.standardName);
            Standard.schoolId=StandardEntityModel.getNumber(req.body.schoolId);
            Standard.subjectIds=StandardEntityModel.getNumber(req.body.subjectIds);
            Standard.isActive=StandardEntityModel.getNumber(req.body.isActive);
            return Standard;
        }
        return null;
    }

    public static fromDto(object:any, filters?:string[]):StandardEntityModel {
        if (object != null) {
            let rid = object.get(StandardEntityTableSchema.FIELDS.RID);
            let standardId = object.get(StandardEntityTableSchema.FIELDS.STANDARD_ID);
            let standardName = object.get(StandardEntityTableSchema.FIELDS.STANDARD_NAME);
            let schoolId = object.get(StandardEntityTableSchema.FIELDS.SCHOOL_ID);
            let subjectIds = object.get(StandardEntityTableSchema.FIELDS.SUBJECT_ID);
            let isActive = object.get(StandardEntityTableSchema.FIELDS.IS_ACTIVE);
            let createdDate = object.get(StandardEntityTableSchema.FIELDS.CREATED_DATE);
            let updatedDate = object.get(StandardEntityTableSchema.FIELDS.UPDATED_DATE); 
            let ret = new StandardEntityModel();
            ret.rid = rid != null && rid !== "" ? rid : undefined;
            ret.standardId = standardId != null && standardId !== "" ? standardId : undefined;
            ret.standardName = standardName != null && standardName !== "" ? standardName : undefined;
            ret.schoolId = schoolId != null && schoolId !== "" ? schoolId : undefined;
            ret.subjectIds = subjectIds != null && subjectIds !== "" ? subjectIds : undefined;
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
        obj[StandardEntityTableSchema.FIELDS.STANDARD_ID] = this.standardId;
        obj[StandardEntityTableSchema.FIELDS.STANDARD_NAME] = this.standardName;
        obj[StandardEntityTableSchema.FIELDS.SCHOOL_ID] = this.schoolId;
        obj[StandardEntityTableSchema.FIELDS.SUBJECT_ID] = this.subjectIds;
        obj[StandardEntityTableSchema.FIELDS.IS_ACTIVE] = this.isActive;
        return obj;
    }
}

export default StandardEntityModel;
