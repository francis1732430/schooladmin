import {NeetCenterTableSchema} from "../data/schemas";
import BaseModel from "./base";
import {Request} from "express";

export class NeetCenterModel extends BaseModel {
    public centerId:number;
    public centerName:string;
    public districtId:number;
    public cityId:string;
    public isActive:number;
    public createdBy:number;
    public static fromRequest(req:Request):NeetCenterModel {
        if (req != null && req.body) {
            let neetCenter = new NeetCenterModel();
            neetCenter.standardId=NeetCenterModel.getNumber(req.body.standardId);
            neetCenter.standardName=NeetCenterModel.getString(req.body.standardName);
            neetCenter.schoolId=NeetCenterModel.getNumber(req.body.schoolId);
            neetCenter.subjectIds=NeetCenterModel.getString(req.body.subjectIds);
            neetCenter.isActive=NeetCenterModel.getNumber(req.body.isActive);
            neetCenter.createdBy=NeetCenterModel.getNumber(req.body.createdBy);
            return neetCenter;
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
        obj[StandardEntityTableSchema.FIELDS.CREATED_BY] = this.createdBy;
        return obj;
    }
}

export default StandardEntityModel;
