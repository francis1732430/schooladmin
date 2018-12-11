import { MessageInfo } from '../../libs/constants';
import {ExamUseCase,ExamTypesUseCase,StandardEntityUseCase,ClassEntityUseCase,SubjectEntityUseCase} from "../../domains";
import { ErrorCode, HttpStatus, MessageInfo, Properties, DefaultVal ,DATE_FORMAT} from "../../libs/constants";
import { Utils } from "../../libs/utils";
import {  Mailer } from "../../libs";
import { Exception, ExamModel} from "../../models";
import * as express from "express";
import { Promise } from "thenfail";
import { ExamTableSchema,ExamTypesTableSchema,StandardEntityTableSchema,ClassEntityTableSchema,SubjectTableSchema} from "../../data/schemas";
import { BaseHandler } from "../base.handler";
import { BearerObject } from "../../libs/jwt";
import * as formidable from "formidable";
import { Uploader } from "../../libs";
let fs = require('fs');  
var dateFormat = require('dateformat');
let knex=require('knex');
export class ExamsHandler extends BaseHandler {
    constructor() {
        super();
    }

    public static create(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
        req.body.schoolId=schoolId;
        req.body.createdBy=session.userId;
        let exams = ExamModel.fromRequest(req);
        let status = req.body.isActive;
        let examName;
        if (!Utils.requiredCheck(exams.subjectId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_SUBJECT_NAME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(exams.examType)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_EXAM_TYPE_NAME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(exams.examDate)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_EXAM_DATE_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(exams.standardId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_STANDARD_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(exams.sectionId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_SECTION_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
       
        if (!Utils.requiredCheck(exams.isActive)) {
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

            return SubjectEntityUseCase.findOne( q => {
                q.where(`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.SUBJECT_ID}`,exams.subjectId);
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
            return ExamTypesUseCase.findOne( q => {
                q.where(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.EXAM_TYPE_ID}`,exams.examType);
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
            examName=object.get('type_name');
            return StandardEntityUseCase.findOne( q => {
                q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_ID}`,exams.standardId);
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
                q.where(`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_ID}`,exams.sectionId);
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

            if(exams.questionUrl != undefined && exams.questionUrl != null) {
            
                return SubjectEntityUseCase.materialUpload(exams.questionUrl,schoolId,examName);
            } else {
                // return SubjectEntityUseCase.materialUpload(subject.materialUrl,schoolId,subject.subjectName);
                return null;
            }
            
           }).then((obj) => {
               console.log("kkkk",obj);
            if(exams.questionUrl != undefined && exams.questionUrl != null) {
                exams.questionUrl=obj;
            } if(exams.sylabusUrl != undefined && exams.sylabusUrl != null){
       
                return SubjectEntityUseCase.materialUpload(exams.sylabusUrl,schoolId,'exam1');
            }
            return null;
          }).then((obj) => {
            console.log("kkkk1",obj);
             if(exams.sylabusUrl != undefined && exams.sylabusUrl!= null){
                
                exams.sylabusUrl=obj;
            }
    
            return ExamUseCase.create(exams);
        }).then((object) => {
            let examData={};
            examData["message"] = "Exam created successfully";
            res.json(examData);
          }).catch(err => {
            Utils.responseError(res, err);
        });
    }

    public static update(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
        let rid = req.params.rid || "";
        let exams = ExamModel.fromRequest(req);
        let status = req.body.isActive;
        let examName;
        if (!Utils.requiredCheck(exams.subjectId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_SUBJECT_NAME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(exams.examType)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_EXAM_TYPE_NAME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(exams.examDate)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_EXAM_DATE_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(exams.standardId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_STANDARD_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(exams.sectionId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_SECTION_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
       
        if (!Utils.requiredCheck(exams.isActive)) {
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

            return ExamUseCase.findOne((q) => {
                q.where(`${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.RID}`,rid);
                q.where(`${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {

            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.DUPLICATE_RESOURCE,
                    MessageInfo.MI_EXAM_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break; 
            }
            return SubjectEntityUseCase.findOne( q => {
                q.where(`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.SUBJECT_ID}`,exams.subjectId);
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
            return ExamTypesUseCase.findOne( q => {
                q.where(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.EXAM_TYPE_ID}`,exams.examType);
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
            examName=object.get('type_name');
            return StandardEntityUseCase.findOne( q => {
                q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_ID}`,exams.standardId);
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
                q.where(`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_ID}`,exams.sectionId);
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

            if(exams.questionUrl != undefined && exams.questionUrl != null) {
            
                return SubjectEntityUseCase.materialUpload(exams.questionUrl,schoolId,examName);
            } else {
                // return SubjectEntityUseCase.materialUpload(subject.materialUrl,schoolId,subject.subjectName);
                return null;
            }
            
           }).then((obj) => {
               console.log("kkkk",obj);
            if(exams.questionUrl != undefined && exams.questionUrl != null) {
                exams.questionUrl=obj;
            } if(exams.sylabusUrl != undefined && exams.sylabusUrl != null){
       
                return SubjectEntityUseCase.materialUpload(exams.sylabusUrl,schoolId,'exam1');
            }
            return null;
          }).then((obj) => {
            console.log("kkkk1",obj);
             if(exams.sylabusUrl != undefined && exams.sylabusUrl!= null){
                
                exams.sylabusUrl=obj;
            }
            return ExamUseCase.updateById(rid,exams);
        }).then((object) => {

            let examData=ExamModel.fromDto(object);
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
            return ExamUseCase.countByQuery(q => {
                let condition;
             if(checkuser.roleId != 18) {
             q.where(`${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.CREATED_BY}`,session.userId);
             }                
             q.leftJoin(`${ExamTypesTableSchema.TABLE_NAME}`,`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.EXAM_TYPE_ID}`,`${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.EXAM_TYPE}`);
             q.leftJoin(`${StandardEntityTableSchema.TABLE_NAME}`,`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_ID}`,`${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.STANDARD_ID}`);
             q.leftJoin(`${ClassEntityTableSchema.TABLE_NAME}`,`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_ID}`,`${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.SECTION_ID}`);
             q.where(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
             q.where(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.IS_DELETED}`,0);
               // q.whereRaw(condition);               
                if (searchobj) {
                    for (let key in searchobj) {
                        if(searchobj[key]!=null && searchobj[key]!=''){
                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);
                            if(key=='examId'){
                                condition = `(${ExamTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='subjectName'){
                                condition = `(${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.SUBJECT_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'questionUrl') {
                                condition = `(${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.QUESTION_URL} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='subjectUrl'){
                                condition = `(${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.SYLLABUS_URL} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'examType') {
                                condition = `(${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.EXAM_TYPE} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='examDate'){
                                condition = `(${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.EXAM_DATE} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }  else if (key == 'standardId') {
                                condition = `(${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.STANDARD_ID} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='sectionId'){
                                condition = `(${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.SECTION_ID} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'standardName') {
                                condition = `(${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='sectionName'){
                                condition = `(${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'isActive') {
                                condition = `(${ExamTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'createdDate') {
                                condition = `(${ExamTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'updatedDate') {
                                condition = `(${ExamTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }
                        }
                    }
                }  
            });
        })
            .then((totalObject) => {
                total = totalObject;
                return ExamUseCase.findByQuery(q => {
                   q.select(`${ExamTableSchema.TABLE_NAME}.*`,`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.TYPE_NAME}`);
                   let condition;
                   if(checkuser.roleId != 18) {
                   q.where(`${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.CREATED_BY}`,session.userId);
                   }                
                   q.leftJoin(`${ExamTypesTableSchema.TABLE_NAME}`,`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.EXAM_TYPE_ID}`,`${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.EXAM_TYPE}`);
                   q.leftJoin(`${StandardEntityTableSchema.TABLE_NAME}`,`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_ID}`,`${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.STANDARD_ID}`);
                   q.leftJoin(`${ClassEntityTableSchema.TABLE_NAME}`,`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_ID}`,`${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.SECTION_ID}`);
                   q.where(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
                   q.where(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.IS_DELETED}`,0);
                     // q.whereRaw(condition);               
                      if (searchobj) {
                          for (let key in searchobj) {
                              if(searchobj[key]!=null && searchobj[key]!=''){
                                  console.log(searchobj[key]);
                                  let searchval = searchobj[key];
                                  let ColumnKey = Utils.changeSearchKey(key);
                                  if(key=='examId'){
                                      condition = `(${ExamTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                      q.andWhereRaw(condition);
                                  } else if(key=='subjectName'){
                                      condition = `(${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.SUBJECT_NAME} LIKE "%${searchval}%")`;
                                      q.andWhereRaw(condition);
                                  } else if (key == 'questionUrl') {
                                      condition = `(${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.QUESTION_URL} LIKE "%${searchval}%")`;
                                      q.andWhereRaw(condition);
                                  } else if(key=='subjectUrl'){
                                      condition = `(${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.SYLLABUS_URL} LIKE "%${searchval}%")`;
                                      q.andWhereRaw(condition);
                                  } else if (key == 'examType') {
                                      condition = `(${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.EXAM_TYPE} LIKE "%${searchval}%")`;
                                      q.andWhereRaw(condition);
                                  } else if(key=='examDate'){
                                      condition = `(${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.EXAM_DATE} LIKE "%${searchval}%")`;
                                      q.andWhereRaw(condition);
                                  }  else if (key == 'standardId') {
                                      condition = `(${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.STANDARD_ID} LIKE "%${searchval}%")`;
                                      q.andWhereRaw(condition);
                                  } else if(key=='sectionId'){
                                      condition = `(${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.SECTION_ID} LIKE "%${searchval}%")`;
                                      q.andWhereRaw(condition);
                                  } else if (key == 'standardName') {
                                      condition = `(${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_NAME} LIKE "%${searchval}%")`;
                                      q.andWhereRaw(condition);
                                  } else if(key=='sectionName'){
                                      condition = `(${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_NAME} LIKE "%${searchval}%")`;
                                      q.andWhereRaw(condition);
                                  } else if(key == 'isActive') {
                                      condition = `(${ExamTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                      q.andWhereRaw(condition);
                                  } else if(key == 'createdDate') {
                                      condition = `(${ExamTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                      q.andWhereRaw(condition);
                                  } else if(key == 'updatedDate') {
                                      condition = `(${ExamTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
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
                            if (sortKey == 'examId') {
                                q.orderBy(ColumnSortKey, sortValue);
                            } else if (sortKey == 'subjectName') {
                                q.orderBy(`${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.SUBJECT_NAME}`, sortValue);
                            } else if (sortKey == 'questionUrl') {
                                q.orderBy(`${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.QUESTION_URL}`, sortValue);
                            } else if (sortKey == 'sylabusUrl') {
                                q.orderBy(`${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.SYLLABUS_URL}`, sortValue);
                            } else if (sortKey == 'examType') {
                                q.orderBy(`${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.EXAM_TYPE}`, sortValue);
                            } else if (sortKey == 'examDate') {
                                q.orderBy(`${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.EXAM_DATE}`, sortValue);
                            }  else if (sortKey == 'standardId') {
                                q.orderBy(`${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.STANDARD_ID}`, sortValue);
                            } else if (sortKey == 'sectionId') {
                                q.orderBy(`${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.SECTION_ID}`, sortValue);
                            }   else if (sortKey == 'standardName') {
                                q.orderBy(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_NAME}`, sortValue);
                            } else if (sortKey == 'sectionName') {
                                q.orderBy(`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_NAME}`, sortValue);
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
                        let examData = ExamModel.fromDto(obj, ["createdBy","password"]); 
                        examData["typeName"]=obj.get('type_name');
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
            return ExamUseCase.findOne( q => {
                q.select(`${ExamTableSchema.TABLE_NAME}.*`,`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_NAME}`);
                q.leftJoin(`${ExamTypesTableSchema.TABLE_NAME}`,`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.EXAM_TYPE_ID}`,`${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.EXAM_TYPE}`);
                q.leftJoin(`${StandardEntityTableSchema.TABLE_NAME}`,`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_ID}`,`${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.STANDARD_ID}`);
                q.leftJoin(`${ClassEntityTableSchema.TABLE_NAME}`,`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_ID}`,`${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.SECTION_ID}`);
                q.where(`${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.RID}`,rid);
                q.where(`${ExamTableSchema.TABLE_NAME}.${ExamTableSchema.FIELDS.IS_DELETED}`,0);
            }) 
        })
        .then((object) => {
            adminuser = object;
            
            if (adminuser == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_EXAM_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            } else {
                let examData = ExamModel.fromDto(adminuser, ["password","createdBy"]);
                examData['examTypeName']=object.get('type_name');
                examData['standardName']=object.get('standard_name');
                examData['sectionName']=object.get('class_name');
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
        return ExamUseCase.destroyById(rid,createdBy);
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
    let examRids = [];
    if(rids) {
        examRids = JSON.parse(rids);
    }else{
        Utils.responseError(res, new Exception(
            ErrorCode.RESOURCE.NOT_FOUND,
            MessageInfo.MI_EXAM_ID_NOT_FOUND,
            false,
            HttpStatus.BAD_REQUEST
        ));
        
    }
    return Promise.then(() => {
        if(examRids!=null) {
            let ret = [];
            examRids.forEach(rid => {
                let del = ExamUseCase.destroyById(rid,createdBy);
            });
            console.log(ret);
            return ret;
        } else {
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.NOT_FOUND,
                MessageInfo.MI_EXAM_ID_NOT_FOUND,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
        }
    })
    .then((result) => {
        let data ={};
        data["message"] = 'Exams deleted successfully';
        res.json(data);
    })
    .catch(err => {
        Utils.responseError(res, err);
    });
}

}

export default ExamsHandler;
