import { MessageInfo } from '../../libs/constants';
import {ExamResultUseCase,ExamTypesUseCase,StandardEntityUseCase,ClassEntityUseCase,AdminUserUseCase,SubjectEntityUseCase} from "../../domains";
import { ErrorCode, HttpStatus, MessageInfo, Properties, DefaultVal ,DATE_FORMAT} from "../../libs/constants";
import { Utils } from "../../libs/utils";
import {  Mailer } from "../../libs";
import { Exception, ExamResultModel} from "../../models";
import * as express from "express";
import { Promise } from "thenfail";
import { ExamResultTableSchema,ExamTypesTableSchema,StandardEntityTableSchema,ClassEntityTableSchema,AdminUserTableSchema,SubjectTableSchema} from "../../data/schemas";
import { BaseHandler } from "../base.handler";
import { BearerObject } from "../../libs/jwt";
import * as formidable from "formidable";
import { Uploader } from "../../libs";
let fs = require('fs');  
var dateFormat = require('dateformat');
let knex=require('knex');
export class ExamResultHandler extends BaseHandler {
    constructor() {
        super();
    }

    public static create(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
        req.body.schoolId=schoolId;
        req.body.createdBy=session.userId;
        let result = ExamResultModel.fromRequest(req);
        let status = req.body.isActive;
        if (!Utils.requiredCheck(result.studentId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_STUDENT_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(result.standardId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_STANDARD_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(result.sectionId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_SECTION_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(result.examTypeId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_EXAM_TYPE_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(result.subjectId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_SUBJECT_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(result.marks)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_EXAM_MARKS_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        if (!Utils.requiredCheck(result.status)) { let schoolId:BearerObject = req[Properties.SCHOOL_ID];
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_EXAM_RESULT_STATUS_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
       
        if (!Utils.requiredCheck(result.isActive)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_STATUS_NOT_EMPTY,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        if (!status || status != 0 && status != 1) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.GENERIC,
                MessageInfo.MI_STATUS_ERROR,
                false,
                HttpStatus.BAD_REQUEST
            ));

        }
      

        return Promise.then(() => {

            return AdminUserUseCase.findOne( q => {
                q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,result.studentId);
                q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {

            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.DUPLICATE_RESOURCE,
                    MessageInfo.MI_USER_NOT_EXIST,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;  
            }
            return ExamTypesUseCase.findOne( q => {
                q.where(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.EXAM_TYPE_ID}`,result.examTypeId);
                q.where(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
                q.where(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.IS_DELETED}`,0);
            })

        }).then((object) => {

            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.DUPLICATE_RESOURCE,
                    MessageInfo.MI_EXAM_TYPE_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break; 
            }
            return StandardEntityUseCase.findOne( q => {
                q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_ID}`,result.standardId);
                q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
                q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.IS_DELETED}`,0);
            })

        }).then((object) => {
            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.DUPLICATE_RESOURCE,
                    MessageInfo.MI_STANDARD_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break; 
            }
            return ClassEntityUseCase.findOne( q => {
                q.where(`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_ID}`,result.sectionId);
                q.where(`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
                q.where(`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {
            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.DUPLICATE_RESOURCE,
                    MessageInfo.MI_CLASS_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break; 
            }
            return SubjectEntityUseCase.findOne( q => {
                q.where(`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.SUBJECT_ID}`,result.subjectId);
                q.where(`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
                q.where(`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {
            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.DUPLICATE_RESOURCE,
                    MessageInfo.MI_SUBJECT_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break; 
            }
            return ExamResultUseCase.create(result);

        }).then((object) => {
            let examData={};
            examData["message"] = "Exam result created successfully";
            res.json(examData);
          }).catch(err => {
            Utils.responseError(res, err);
        });
    }

    public static update(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
        let rid = req.params.rid || "";
        let result = ExamResultModel.fromRequest(req);
        let status = req.body.isActive;
        if (!Utils.requiredCheck(result.studentId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_STUDENT_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(result.standardId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_STANDARD_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(result.sectionId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_SECTION_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(result.examTypeId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_EXAM_TYPE_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(result.subjectId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_SUBJECT_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(result.marks)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_EXAM_MARKS_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
       
        if (!Utils.requiredCheck(result.status)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_EXAM_RESULT_STATUS_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        if (!Utils.requiredCheck(result.isActive)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_STATUS_NOT_EMPTY,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        if (!status || status != 0 && status != 1) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.GENERIC,
                MessageInfo.MI_STATUS_ERROR,
                false,
                HttpStatus.BAD_REQUEST
            ));

        }
       
        return Promise.then(() => {

            return ExamResultUseCase.findOne((q) => {
                q.where(`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.RID}`,rid);
                q.where(`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {

            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.DUPLICATE_RESOURCE,
                    MessageInfo.MI_EXAM_RESULT_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break; 
            }
           return AdminUserUseCase.findOne( q => {
                q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,result.studentId);
                q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {

            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.DUPLICATE_RESOURCE,
                    MessageInfo.MI_USER_NOT_EXIST,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;  
            }
            return ExamTypesUseCase.findOne( q => {
                q.where(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.EXAM_TYPE_ID}`,result.examTypeId);
                q.where(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
                q.where(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.IS_DELETED}`,0);
            })

        }).then((object) => {

            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.DUPLICATE_RESOURCE,
                    MessageInfo.MI_EXAM_TYPE_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break; 
            }
            return StandardEntityUseCase.findOne( q => {
                q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_ID}`,result.standardId);
                q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
                q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.IS_DELETED}`,0);
            })

        }).then((object) => {
            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.DUPLICATE_RESOURCE,
                    MessageInfo.MI_STANDARD_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break; 
            }
            return ClassEntityUseCase.findOne( q => {
                q.where(`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_ID}`,result.sectionId);
                q.where(`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
                q.where(`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {
            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.DUPLICATE_RESOURCE,
                    MessageInfo.MI_CLASS_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break; 
            }
            return SubjectEntityUseCase.findOne( q => {
                q.where(`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.SUBJECT_ID}`,result.subjectId);
                q.where(`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
                q.where(`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {
            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.DUPLICATE_RESOURCE,
                    MessageInfo.MI_SUBJECT_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break; 
            }
            return ExamResultUseCase.updateById(rid,result);
        }).then((object) => {

            let examData=ExamResultModel.fromDto(object);
            examData["message"] = "Exam updated successfully";
            res.json(examData);
        })
        .catch(err => {
            Utils.responseError(res, err);
        });
    }
 
    
    public static list(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let checkuser:BearerObject = req[Properties.CHECK_USER];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
        let offset = parseInt(req.query.offset) || null;
        let limit = parseInt(req.query.limit) || null;
        let sortKey;
        let sortValue;
        let searchobj = [];
        for (let key in req.query) {
            console.log(req.query[key]);
            if(key=='sortKey'){
                sortKey = req.query[key];
            }
            else if(key=='sortValue'){
                sortValue = req.query[key];
            } else if(req.query[key]!='' && key!='limit' && key!='offset' && key!='sortKey' && key!='sortValue'){
                searchobj[key] = req.query[key];
            }
        }
        console.log(searchobj);
        let adminuser:any;

        let total = 0;
        return Promise.then(() => {
            return ExamResultUseCase.countByQuery(q => {
                let condition;
             if(checkuser.roleId != 18) {
             q.where(`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.CREATED_BY}`,session.userId);
             }                
             q.leftJoin(`${ExamTypesTableSchema.TABLE_NAME}`,`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.EXAM_TYPE_ID}`,`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.EXAM_TYPE_ID}`);
             q.leftJoin(`${StandardEntityTableSchema.TABLE_NAME}`,`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_ID}`,`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.STANDARD_ID}`);
             q.leftJoin(`${ClassEntityTableSchema.TABLE_NAME}`,`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_ID}`,`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.CLASS_ID}`);
             q.leftJoin(`${AdminUserTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.STUDENT_ID}`);
             q.leftJoin(`${SubjectTableSchema.TABLE_NAME}`,`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.SUBJECT_ID}`,`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.SUBJECT_ID}`);
             q.where(`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
             q.where(`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.IS_DELETED}`,0);
                //q.whereRaw(condition);               
                if (searchobj) {
                    for (let key in searchobj) {
                        if(searchobj[key]!=null && searchobj[key]!=''){
                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);
                            if(key=='examResultId'){
                                condition = `(${ExamResultTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='studentId'){
                                condition = `(${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.STUDENT_ID} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'subjectId') {
                                condition = `(${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.SUBJECT_ID} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='marks'){
                                condition = `(${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.MARKS} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'examTypeId') {
                                condition = `(${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.EXAM_TYPE_ID} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='status'){
                                condition = `(${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.STATUS} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }  else if (key == 'standardId') {
                                condition = `(${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.STANDARD_ID} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='sectionId'){
                                condition = `(${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.CLASS_ID} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'standardName') {
                                condition = `(${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='sectionName'){
                                condition = `(${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'studentName') {
                                condition = `CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                                    q.andWhereRaw(condition);
                            } else if(key=='subjectName'){
                                condition = `(${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.SUBJECT_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'isActive') {
                                condition = `(${ExamResultTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'createdDate') {
                                condition = `(${ExamResultTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'updatedDate') {
                                condition = `(${ExamResultTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }
                        }
                    }
                }  
            });
        })
            .then((totalObject) => {
                total = totalObject;
                return ExamResultUseCase.findByQuery(q => {
                   q.select(`${ExamResultTableSchema.TABLE_NAME}.*`,`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_NAME}`,`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_NAME}`,`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.SUBJECT_NAME}`,`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.TYPE_NAME}`);
                   q.select(knex.raw(`CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME}," ",${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) as studentName`));
                   let condition;
             if(checkuser.roleId != 18) {
             q.where(`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.CREATED_BY}`,session.userId);
             }                
             q.leftJoin(`${ExamTypesTableSchema.TABLE_NAME}`,`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.EXAM_TYPE_ID}`,`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.EXAM_TYPE_ID}`);
             q.leftJoin(`${StandardEntityTableSchema.TABLE_NAME}`,`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_ID}`,`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.STANDARD_ID}`);
             q.leftJoin(`${ClassEntityTableSchema.TABLE_NAME}`,`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_ID}`,`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.CLASS_ID}`);
             q.leftJoin(`${AdminUserTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.STUDENT_ID}`);
             q.leftJoin(`${SubjectTableSchema.TABLE_NAME}`,`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.SUBJECT_ID}`,`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.SUBJECT_ID}`);
             q.where(`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
             q.where(`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.IS_DELETED}`,0);
               // q.whereRaw(condition);               
                if (searchobj) {
                    for (let key in searchobj) {
                        if(searchobj[key]!=null && searchobj[key]!=''){
                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);
                            if(key=='examResultId'){
                                condition = `(${ExamResultTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='studentId'){
                                condition = `(${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.STUDENT_ID} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'subjectId') {
                                condition = `(${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.SUBJECT_ID} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='marks'){
                                condition = `(${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.MARKS} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'examTypeId') {
                                condition = `(${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.EXAM_TYPE_ID} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='status'){
                                condition = `(${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.STATUS} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }  else if (key == 'standardId') {
                                condition = `(${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.STANDARD_ID} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='sectionId'){
                                condition = `(${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.CLASS_ID} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'standardName') {
                                condition = `(${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='sectionName'){
                                condition = `(${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'studentName') {
                                condition = `CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                                    q.andWhereRaw(condition);
                            } else if(key=='subjectName'){
                                condition = `(${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.SUBJECT_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'isActive') {
                                condition = `(${ExamResultTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'createdDate') {
                                condition = `(${ExamResultTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'updatedDate') {
                                condition = `(${ExamResultTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }
                        }
                    }
                }  

                    if (offset != null) {
                        q.offset(offset);
                    }
                    if (limit != null) {
                        q.limit(limit);
                    }
                    if (sortKey != null && sortValue != '') {
                        if (sortKey != null && (sortValue == 'ASC' || sortValue == 'DESC' || sortValue == 'asc' || sortValue == 'desc')) {
                            let ColumnSortKey = Utils.changeSearchKey(sortKey);
                            if (sortKey == 'examResultId') {
                                q.orderBy(ColumnSortKey, sortValue);
                            } else if (sortKey == 'studentId') {
                                q.orderBy(`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.STUDENT_ID}`, sortValue);
                            } else if (sortKey == 'subjectId') {
                                q.orderBy(`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.SUBJECT_ID}`, sortValue);
                            } else if (sortKey == 'marks') {
                                q.orderBy(`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.MARKS}`, sortValue);
                            } else if (sortKey == 'examTypeId') {
                                q.orderBy(`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.EXAM_TYPE_ID}`, sortValue);
                            } else if (sortKey == 'status') {
                                q.orderBy(`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.STATUS}`, sortValue);
                            }  else if (sortKey == 'standardId') {
                                q.orderBy(`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.STANDARD_ID}`, sortValue);
                            } else if (sortKey == 'sectionId') {
                                q.orderBy(`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.CLASS_ID}`, sortValue);
                            }   else if (sortKey == 'standardName') {
                                q.orderBy(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_NAME}`, sortValue);
                            } else if (sortKey == 'sectionName') {
                                q.orderBy(`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_NAME}`, sortValue);
                            }  else if (sortKey == 'studentName') {
                                q.orderBy(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME}`, sortValue);
                                q.orderBy(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}`, sortValue);
                            } else if (sortKey == 'SubjectName') {
                                q.orderBy(`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.SUBJECT_NAME}`, sortValue);
                            } else if (sortKey == 'isActive') {
                                q.orderBy(ColumnSortKey, sortValue);
                            } else if (sortKey == 'createdDate') {
                                q.orderBy(ColumnSortKey, sortValue);
                            } else if (sortKey == 'updatedDate') {
                                q.orderBy(ColumnSortKey, sortValue);
                            }
                        }
                    }

                }, []);
            })
            .then((object) => {
                let ret = [];
               // console.log(object);
                //noinspection TypeScriptUnresolvedVariable
                if (object != null && object.models != null) {
                    //noinspection TypeScriptUnresolvedVariable
                    object.models.forEach(obj => {
                        let examData = ExamResultModel.fromDto(obj, ["createdBy","password"]); 
                         examData['examTypeName']=obj.get('type_name');
                         examData['studentName']=obj.get('studentName'); 
                         examData['standardName']=obj.get('standard_name');
                         examData['sectionName']=obj.get('class_name');
                         examData['subjectName']=obj.get('subject_name');
                        ret.push(examData);
                    });
                }
                res.header(Properties.HEADER_TOTAL, total.toString(10));

                if (offset != null) {
                    res.header(Properties.HEADER_OFFSET, offset.toString(10));
                }
                if (limit != null) {
                    res.header(Properties.HEADER_LIMIT, limit.toString(10));
                }

                res.json(ret);
            })
            .catch(err => {
                Utils.responseError(res, err);
            });
    }


    public static view(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let rid = req.params.rid || "";
        let userId=session.userId;
        let adminuser:any;
        let role:any;
        let result;
        return Promise.then(() =>{
            return ExamResultUseCase.findOne( q => {
                q.select(`${ExamResultTableSchema.TABLE_NAME}.*`,`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_NAME}`,`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_NAME}`,`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.SUBJECT_NAME}`,`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.TYPE_NAME}`);
                q.select(knex.raw(`CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME}," ",${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) as studentName`));               
          q.leftJoin(`${ExamTypesTableSchema.TABLE_NAME}`,`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.EXAM_TYPE_ID}`,`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.EXAM_TYPE_ID}`);
          q.leftJoin(`${StandardEntityTableSchema.TABLE_NAME}`,`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_ID}`,`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.STANDARD_ID}`);
          q.leftJoin(`${ClassEntityTableSchema.TABLE_NAME}`,`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_ID}`,`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.CLASS_ID}`);
          q.leftJoin(`${AdminUserTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.STUDENT_ID}`);
          q.leftJoin(`${SubjectTableSchema.TABLE_NAME}`,`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.SUBJECT_ID}`,`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.SUBJECT_ID}`);
          q.where(`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.RID}`,rid);
          q.where(`${ExamResultTableSchema.TABLE_NAME}.${ExamResultTableSchema.FIELDS.IS_DELETED}`,0);
            }) 
        })
        .then((object) => {
            adminuser = object;
            
            if (adminuser == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_EXAM_RESULT_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            } else {
                let examData = ExamResultModel.fromDto(adminuser, ["password","createdBy"]);
                examData['examTypeName']=object.get('type_name');
                examData['studentName']=object.get('studentName');
                examData['standardName']=object.get('standard_name');
                examData['sectionName']=object.get('class_name');
                examData['subjectName']=object.get('subject_name');
                res.json(examData);
            }
        })
        .catch(err => {
            Utils.responseError(res, err);
        });
}

public static destroy(req: express.Request, res: express.Response): any {
    let session: BearerObject = req[Properties.SESSION];
    let createdBy = parseInt(session.userId);
    let rid = req.params.rid || "";
    return Promise.then(() => {
        return ExamResultUseCase.destroyById(rid,createdBy);
    })
    .then(() => {
        res.status(HttpStatus.NO_CONTENT);
        res.json({});
    })
    .catch(err => {
        Utils.responseError(res, err);
    });
}

public static massDelete(req: express.Request, res: express.Response): any {
    let session: BearerObject = req[Properties.SESSION];
    let createdBy = parseInt(session.userId);
    let rids = req.body.rids || "";
    let resultRids = [];
    if(rids) {
        resultRids = JSON.parse(rids);
    }else{
        Utils.responseError(res, new Exception(
            ErrorCode.RESOURCE.NOT_FOUND,
            MessageInfo.MI_EXAM_RESULT_ID_NOT_FOUND,
            false,
            HttpStatus.BAD_REQUEST
        ));
        
    }
    return Promise.then(() => {
        if(resultRids!=null) {
            let ret = [];
            resultRids.forEach(rid => {
                let del = ExamResultUseCase.destroyById(rid,createdBy);
            });
            console.log(ret);
            return ret;
        } else {
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.NOT_FOUND,
                MessageInfo.MI_EXAM_RESULT_ID_NOT_FOUND,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
        }
    })
    .then((result) => {
        let data ={};
        data["message"] = 'Exams Results deleted successfully';
        res.json(data);
    })
    .catch(err => {
        Utils.responseError(res, err);
    });
}

}

export default ExamResultHandler;
