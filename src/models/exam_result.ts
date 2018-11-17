import {ExamResultTableSchema} from "../data/schemas";
import BaseModel from "./base";
import {Request} from "express";

export class ExamResultModel extends BaseModel {
    public examResultId:number;
    public studentId:number;
    public standardId:number;
    public sectionId:number;
    public examTypeId:number;
    public subjectId:number;
    public marks:string;
    public status:number;
    public createdBy:number;
    public schoolId:number;
    public isActive:number;

    public static fromRequest(req:Request):ExamResultModel  {
        if (req != null && req.body) {
            let exam = new ExamResultModel();
            exam.examResultId=ExamResultModel.getNumber(req.body.examResultId);
            exam.studentId=ExamResultModel.getNumber(req.body.studentId);
            exam.standardId=ExamResultModel.getNumber(req.body.standardId);
            exam.sectionId=ExamResultModel.getNumber(req.body.sectionId);
            exam.examTypeId=ExamResultModel.getNumber(req.body.examTypeId);
            exam.subjectId=ExamResultModel.getNumber(req.body.subjectId);
            exam.marks=ExamResultModel.getString(req.body.marks);
            exam.status=ExamResultModel.getNumber(req.body.status);
            exam.createdBy=ExamResultModel.getNumber(req.body.createdBy);
            exam.isActive=ExamResultModel.getNumber(req.body.isActive);
            exam.schoolId=ExamResultModel.getNumber(req.body.schoolId);
            return exam;
        }
        return null;
    }

    public static fromDto(object:any, filters?:string[]):ExamResultModel {
        if (object != null) {
            let rid = object.get(ExamResultTableSchema.FIELDS.RID);
            let examResultId = object.get(ExamResultTableSchema.FIELDS.EXAM_RESULT_ID);
            let studentId = object.get(ExamResultTableSchema.FIELDS.STUDENT_ID);
            let standardId = object.get(ExamResultTableSchema.FIELDS.STANDARD_ID);
            let sectionId = object.get(ExamResultTableSchema.FIELDS.CLASS_ID);
            let examTypeId = object.get(ExamResultTableSchema.FIELDS.EXAM_TYPE_ID);
            let subjectId = object.get(ExamResultTableSchema.FIELDS.SUBJECT_ID);
            let marks = object.get(ExamResultTableSchema.FIELDS.MARKS);
            let status = object.get(ExamResultTableSchema.FIELDS.STATUS);
            let createdBy = object.get(ExamResultTableSchema.FIELDS.CREATED_BY);
            let isActive = object.get(ExamResultTableSchema.FIELDS.IS_ACTIVE);
            let createdDate = object.get(ExamResultTableSchema.FIELDS.CREATED_DATE);
            let updatedDate = object.get(ExamResultTableSchema.FIELDS.UPDATED_DATE); 
            let ret = new ExamResultModel();
            ret.rid = rid != null && rid !== "" ? rid : undefined;
            ret.examResultId = examResultId!= null && examResultId !== "" ? examResultId: undefined;
            ret.studentId = studentId != null && studentId !== "" ? studentId : undefined;
            ret.standardId = standardId != null && standardId !== "" ? standardId : undefined;
            ret.examTypeId = examTypeId != null && examTypeId !== "" ? examTypeId : undefined;
            ret.subjectId = subjectId != null && subjectId !== "" ? subjectId : undefined;
            ret.marks = marks != null && marks !== "" ? marks : undefined;
            ret.status = status != null && status !== "" ? status : undefined;
            ret.createdBy= createdBy != null && createdBy !== "" ? createdBy : undefined;
            ret.sectionId = sectionId != null && sectionId !== "" ? sectionId : undefined;
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
        obj[ExamResultTableSchema.FIELDS.EXAM_RESULT_ID] = this.examResultId;
        obj[ExamResultTableSchema.FIELDS.STUDENT_ID] = this.studentId;
        obj[ExamResultTableSchema.FIELDS.STANDARD_ID] = this.standardId;
        obj[ExamResultTableSchema.FIELDS.EXAM_TYPE_ID] = this.examTypeId;
        obj[ExamResultTableSchema.FIELDS.SUBJECT_ID] = this.subjectId;
        obj[ExamResultTableSchema.FIELDS.MARKS] = this.marks;
        obj[ExamResultTableSchema.FIELDS.STATUS] = this.status;
        obj[ExamResultTableSchema.FIELDS.CLASS_ID] = this.sectionId;
        obj[ExamResultTableSchema.FIELDS.CREATED_BY] = this.createdBy;
        obj[ExamResultTableSchema.FIELDS.IS_ACTIVE] = this.isActive;
        obj[ExamResultTableSchema.FIELDS.SCHOOL_ID] = this.schoolId;
        return obj;
    }
}

export default ExamResultModel;
