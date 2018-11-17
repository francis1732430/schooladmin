import {ExamTableSchema} from "../data/schemas";
import BaseModel from "./base";
import {Request} from "express";

export class ExamModel extends BaseModel {
    public examId:number;
    public subjectId:string;
    public questionUrl:string;
    public sylabusUrl:string;
    public examType:number;
    public examDate:string;
    public standardId:number;
    public sectionId:number;
    public createdBy:number;
    public startTime:string;
    public schoolId:number;
    public isActive:number;

    public static fromRequest(req:Request):ExamModel  {
        if (req != null && req.body) {
            let exam = new ExamModel();
            exam.examId=ExamModel.getNumber(req.body.examId);
            exam.subjectId=ExamModel.getString(req.body.subjectId);
            exam.questionUrl=ExamModel.getString(req.body.questionUrl);
            exam.sylabusUrl=ExamModel.getString(req.body.sylabusUrl);
            exam.examType=ExamModel.getNumber(req.body.examType);
            exam.examDate=ExamModel.getString(req.body.examDate);
            exam.standardId=ExamModel.getNumber(req.body.standardId);
            exam.sectionId=ExamModel.getNumber(req.body.sectionId);
            exam.startTime=ExamModel.getString(req.body.startTime);
            exam.createdBy=ExamModel.getNumber(req.body.createdBy);
            exam.isActive=ExamModel.getNumber(req.body.isActive);
            exam.schoolId=ExamModel.getNumber(req.body.schoolId);
            return exam;
        }
        return null;
    }

    public static fromDto(object:any, filters?:string[]):ExamModel {
        if (object != null) {
            let rid = object.get(ExamTableSchema.FIELDS.RID);
            let examId = object.get(ExamTableSchema.FIELDS.EXAM_ID);
            let subjectId = object.get(ExamTableSchema.FIELDS.SUBJECT_ID);
            let questionUrl = object.get(ExamTableSchema.FIELDS.QUESTION_URL);
            let sylabusUrl = object.get(ExamTableSchema.FIELDS.SYLLABUS_URL);
            let examType = object.get(ExamTableSchema.FIELDS.EXAM_TYPE);
            let examDate = object.get(ExamTableSchema.FIELDS.EXAM_DATE);
            let standardId = object.get(ExamTableSchema.FIELDS.STANDARD_ID);
            let startTime = object.get(ExamTableSchema.FIELDS.START_TIME);
            let sectionId = object.get(ExamTableSchema.FIELDS.SECTION_ID);
            let createdBy = object.get(ExamTableSchema.FIELDS.CREATED_BY);
            let isActive = object.get(ExamTableSchema.FIELDS.IS_ACTIVE);
            let createdDate = object.get(ExamTableSchema.FIELDS.CREATED_DATE);
            let updatedDate = object.get(ExamTableSchema.FIELDS.UPDATED_DATE); 
            let ret = new ExamModel();
            ret.rid = rid != null && rid !== "" ? rid : undefined;
            ret.examId = examId!= null && examId !== "" ? examId: undefined;
            ret.subjectId = subjectId != null && subjectId !== "" ? subjectId : undefined;
            ret.questionUrl = questionUrl != null && questionUrl !== "" ? questionUrl : undefined;
            ret.sylabusUrl = sylabusUrl != null && sylabusUrl !== "" ? sylabusUrl : undefined;
            ret.examType = examType != null && examType !== "" ? examType : undefined;
            ret.examDate = examDate != null && examDate !== "" ? examDate : undefined;
            ret.standardId = standardId != null && standardId !== "" ? standardId : undefined;
            ret.createdBy= createdBy != null && createdBy !== "" ? createdBy : undefined;
            ret.startTime = startTime != null && startTime !== "" ? startTime : undefined;
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
        obj[ExamTableSchema.FIELDS.EXAM_ID] = this.examId;
        obj[ExamTableSchema.FIELDS.SUBJECT_ID] = this.subjectId;
        obj[ExamTableSchema.FIELDS.QUESTION_URL] = this.questionUrl;
        obj[ExamTableSchema.FIELDS.SYLLABUS_URL] = this.sylabusUrl;
        obj[ExamTableSchema.FIELDS.EXAM_TYPE] = this.examType;
        obj[ExamTableSchema.FIELDS.EXAM_DATE] = this.examDate;
        obj[ExamTableSchema.FIELDS.STANDARD_ID] = this.standardId;
        obj[ExamTableSchema.FIELDS.SECTION_ID] = this.sectionId;
        obj[ExamTableSchema.FIELDS.CREATED_BY] = this.createdBy;
        obj[ExamTableSchema.FIELDS.START_TIME] = this.startTime;
        obj[ExamTableSchema.FIELDS.IS_ACTIVE] = this.isActive;
        obj[ExamTableSchema.FIELDS.SCHOOL_ID] = this.schoolId;
        return obj;
    }
}

export default ExamModel;
