import {ClassEntityTableSchema} from "../data/schemas";
import BaseModel from "./base";
import {Request} from "express";

export class ClassEntityModel extends BaseModel {
    public classId:number;
    public sectionName:string;
    public staffId:number;
    public standardId:number;
    public subjectIds:number;
    public schoolId:number;
    public isActive:number;
    public createdBy:number;

    public static fromRequest(req:Request):ClassEntityModel {
        if (req != null && req.body) {
            let Class = new ClassEntityModel();
            Class.classId=ClassEntityModel.getNumber(req.body.classId);
            Class.sectionName=ClassEntityModel.getString(req.body.sectionName);
            Class.staffId=ClassEntityModel.getNumber(req.body.staffId);
            Class.standardId=ClassEntityModel.getNumber(req.body.standardId);
            Class.schoolId=ClassEntityModel.getNumber(req.body.schoolId);
            Class.subjectIds=ClassEntityModel.getNumber(req.body.subjectIds);
            Class.isActive=ClassEntityModel.getNumber(req.body.isActive);
            Class.createdBy=ClassEntityModel.getNumber(req.body.createdBy);
            return Class;
        }
        return null;
    }

    public static fromDto(object:any, filters?:string[]):ClassEntityModel {
        if (object != null) {
            let rid = object.get(ClassEntityTableSchema.FIELDS.RID);
            let classId = object.get(ClassEntityTableSchema.FIELDS.CLASS_ID);
            let className = object.get(ClassEntityTableSchema.FIELDS.CLASS_NAME);
            let staffId = object.get(ClassEntityTableSchema.FIELDS.STAFF_ID);
            let standardId = object.get(ClassEntityTableSchema.FIELDS.STANDARD_ID);
            let schoolId = object.get(ClassEntityTableSchema.FIELDS.SCHOOL_ID);
            let subjectIds = object.get(ClassEntityTableSchema.FIELDS.SUBJECT_ID);
            let isActive = object.get(ClassEntityTableSchema.FIELDS.IS_ACTIVE);
            let createdDate = object.get(ClassEntityTableSchema.FIELDS.CREATED_DATE);
            let updatedDate = object.get(ClassEntityTableSchema.FIELDS.UPDATED_DATE); 
            let ret = new ClassEntityModel();
            ret.rid = rid != null && rid !== "" ? rid : undefined;
            ret.classId = classId != null && classId !== "" ? classId : undefined;
            ret.sectionName = className != null && className !== "" ? className : undefined;
            ret.staffId = staffId != null && staffId !== "" ? staffId : undefined;
            ret.standardId = standardId != null && standardId !== "" ? standardId : undefined;
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
        obj[ClassEntityTableSchema.FIELDS.CLASS_ID] = this.classId;
        obj[ClassEntityTableSchema.FIELDS.CLASS_NAME] = this.sectionName;
        obj[ClassEntityTableSchema.FIELDS.STAFF_ID] = this.staffId;
        obj[ClassEntityTableSchema.FIELDS.STANDARD_ID] = this.standardId;
        obj[ClassEntityTableSchema.FIELDS.SCHOOL_ID] = this.schoolId;
        obj[ClassEntityTableSchema.FIELDS.SUBJECT_ID] = this.subjectIds;
        obj[ClassEntityTableSchema.FIELDS.IS_ACTIVE] = this.isActive;
        obj[ClassEntityTableSchema.FIELDS.CREATED_BY] = this.createdBy;
        return obj;
    }
}

export default ClassEntityModel;
