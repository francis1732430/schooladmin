import {SubjectTableSchema} from "../data/schemas";
import BaseModel from "./base";
import {Request} from "express";

export class SubjectEntityModel extends BaseModel {
    public subjectId:number;
    public subjectName:string;
    public schoolId:number;
    public sylabusUrl:string;
    public authorName:string;
    public materialUrl:string;
    public refBooks:string;
    public isActive:number;
    public createdBy:number;
    public static fromRequest(req:Request):SubjectEntityModel {
        if (req != null && req.body) {
            let Subject = new SubjectEntityModel();
            Subject.subjectId=SubjectEntityModel.getNumber(req.body.subjectId);
            Subject.subjectName=SubjectEntityModel.getString(req.body.subjectName);
            Subject.schoolId=SubjectEntityModel.getNumber(req.body.schoolId);
            Subject.sylabusUrl=SubjectEntityModel.getString(req.body.sulabusUrl);
            Subject.authorName=SubjectEntityModel.getString(req.body.authorName);
            Subject.materialUrl=SubjectEntityModel.getString(req.body.materialUrl);
            Subject.refBooks=SubjectEntityModel.getString(req.body.refBooks);
            Subject.isActive=SubjectEntityModel.getNumber(req.body.isActive);
            return Subject;
        }
        return null;
    }

    public static fromDto(object:any, filters?:string[]):SubjectEntityModel {
        if (object != null) {
            let rid = object.get(SubjectTableSchema.FIELDS.RID);
            let subjectId = object.get(SubjectTableSchema.FIELDS.SUBJECT_ID);
            let standardName = object.get(SubjectTableSchema.FIELDS.SUBJECT_NAME);
            let schoolId = object.get(SubjectTableSchema.FIELDS.SCHOOL_ID);
            let sylabusUrl = object.get(SubjectTableSchema.FIELDS.SYLLABUS_URL);
            let authorName = object.get(SubjectTableSchema.FIELDS.AUTHOR_NAME);
            let materialUrl = object.get(SubjectTableSchema.FIELDS.MATERIAL_URL);
            let refBooks = object.get(SubjectTableSchema.FIELDS.REF_BOOKS);
            let isActive = object.get(SubjectTableSchema.FIELDS.IS_ACTIVE);
            let createdDate = object.get(SubjectTableSchema.FIELDS.CREATED_DATE);
            let updatedDate = object.get(SubjectTableSchema.FIELDS.UPDATED_DATE); 
            let ret = new SubjectEntityModel();
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
