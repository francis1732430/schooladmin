import {ExamTypesTableSchema} from "../data/schemas";
import BaseModel from "./base";
import {Request} from "express";

export class ExamTypesModel extends BaseModel {
    public examTypeId:number;
    public typeName:string;
    public dueDate:string;
    public toDate:string;
    public noons:string;
    public totalMark:string;
    public minMark:string;
    public isActive:number;
    public createdBy:number;
    public startTime:string;
    public schoolId:number;
    public static fromRequest(req:Request):ExamTypesModel {
        if (req != null && req.body) {
            let exam = new ExamTypesModel();
            exam.examTypeId=ExamTypesModel.getNumber(req.body.examTypeId);
            exam.typeName=ExamTypesModel.getString(req.body.typeName);
            exam.dueDate=ExamTypesModel.getString(req.body.dueDate);
            exam.toDate=ExamTypesModel.getString(req.body.toDate);
            exam.noons=ExamTypesModel.getString(req.body.noons);
            exam.totalMark=ExamTypesModel.getString(req.body.totalMark);
            exam.minMark=ExamTypesModel.getString(req.body.minMark);
            exam.startTime=ExamTypesModel.getString(req.body.startTime);
            exam.createdBy=ExamTypesModel.getNumber(req.body.createdBy);
            exam.isActive=ExamTypesModel.getNumber(req.body.isActive);
            exam.schoolId=ExamTypesModel.getNumber(req.body.schoolId);
            return exam;
        }
        return null;
    }

    public static fromDto(object:any, filters?:string[]):ExamTypesModel {
        if (object != null) {
            let rid = object.get(ExamTypesTableSchema.FIELDS.RID);
            let examTypeId = object.get(ExamTypesTableSchema.FIELDS.EXAM_TYPE_ID);
            let typeName = object.get(ExamTypesTableSchema.FIELDS.TYPE_NAME);
            let dueDate = object.get(ExamTypesTableSchema.FIELDS.DUE_DATE);
            let toDate = object.get(ExamTypesTableSchema.FIELDS.TO_DATE);
            let noons = object.get(ExamTypesTableSchema.FIELDS.NOONS);
            let totalMark = object.get(ExamTypesTableSchema.FIELDS.TOTAL_MARK);
            let minMark = object.get(ExamTypesTableSchema.FIELDS.MIN_MARK);
            let startTime = object.get(ExamTypesTableSchema.FIELDS.START_TIME);
            let createdBy = object.get(ExamTypesTableSchema.FIELDS.CREATED_BY);
            let isActive = object.get(ExamTypesTableSchema.FIELDS.IS_ACTIVE);
            let createdDate = object.get(ExamTypesTableSchema.FIELDS.CREATED_DATE);
            let updatedDate = object.get(ExamTypesTableSchema.FIELDS.UPDATED_DATE); 
            let ret = new ExamTypesModel();
            ret.rid = rid != null && rid !== "" ? rid : undefined;
            ret.examTypeId = examTypeId!= null && examTypeId !== "" ? examTypeId: undefined;
            ret.typeName = typeName != null && typeName !== "" ? typeName : undefined;
            ret.dueDate = dueDate != null && dueDate !== "" ? dueDate : undefined;
            ret.toDate = toDate != null && toDate !== "" ? toDate : undefined;
            ret.noons = noons != null && noons !== "" ? noons : undefined;
            ret.totalMark = totalMark != null && totalMark !== "" ? totalMark : undefined;
            ret.minMark = minMark != null && minMark !== "" ? minMark : undefined;
            ret.createdBy= createdBy != null && createdBy !== "" ? createdBy : undefined;
            ret.startTime = startTime != null && startTime !== "" ? startTime : undefined;
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
        obj[ExamTypesTableSchema.FIELDS.EXAM_TYPE_ID] = this.examTypeId;
        obj[ExamTypesTableSchema.FIELDS.TYPE_NAME] = this.typeName;
        obj[ExamTypesTableSchema.FIELDS.SCHOOL_ID] = this.schoolId;
        obj[ExamTypesTableSchema.FIELDS.DUE_DATE] = this.dueDate;
        obj[ExamTypesTableSchema.FIELDS.TO_DATE] = this.toDate;
        obj[ExamTypesTableSchema.FIELDS.NOONS] = this.noons;
        obj[ExamTypesTableSchema.FIELDS.TOTAL_MARK] = this.totalMark;
        obj[ExamTypesTableSchema.FIELDS.MIN_MARK] = this.minMark;
        obj[ExamTypesTableSchema.FIELDS.CREATED_BY] = this.createdBy;
        obj[ExamTypesTableSchema.FIELDS.START_TIME] = this.startTime;
        obj[ExamTypesTableSchema.FIELDS.IS_ACTIVE] = this.isActive;
        return obj;
    }
}

export default ExamTypesModel;
