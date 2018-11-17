import { MessageInfo } from '../../libs/constants';
import {ExamTypesUseCase} from "../../domains";
import { ErrorCode, HttpStatus, MessageInfo, Properties, DefaultVal ,DATE_FORMAT} from "../../libs/constants";
import { Utils } from "../../libs/utils";
import {  Mailer } from "../../libs";
import { Exception, ExamTypesModel} from "../../models";
import * as express from "express";
import { Promise } from "thenfail";
import { ExamTypesTableSchema} from "../../data/schemas";
import { BaseHandler } from "../base.handler";
import { BearerObject } from "../../libs/jwt";
import * as formidable from "formidable";
import { Uploader } from "../../libs";
let fs = require('fs');  
var dateFormat = require('dateformat');
let knex=require('knex');
export class ExamTypesHandler extends BaseHandler {
    constructor() {
        super();
    }

    public static create(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
        req.body.schoolId=schoolId;
        req.body.createdBy=session.userId;
        let exams = ExamTypesModel.fromRequest(req);
        let status = req.body.isActive;
        if (!Utils.requiredCheck(exams.typeName)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_EXAM_TYPE_NAME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(exams.dueDate)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_EXAM_START_DATE_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(exams.toDate)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_EXAM_END_DATE_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(exams.startTime)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_EXAM_START_TIME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(exams.totalMark)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_EXAM_TOTAL_MARK_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(exams.minMark)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_EXAM_MIN_MARK_IS_REQUIRED,
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
           return ExamTypesUseCase.findOne( q => {
               q.where(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.SCHOOL_ID}`,exams.schoolId);
               q.where(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.TYPE_NAME}`,exams.typeName);
               q.where(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.IS_DELETED}`,0);            
           })
       }).then((object) => {
           if(object != null){
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.NOT_FOUND,
                MessageInfo.MI_EXAM_TYPE_NAME_ALREADY_EXISTS,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
           }
        return ExamTypesUseCase.create(exams);
       }).then((object) => {
        let examData={};
        examData["message"] = "Exam Types created successfully";
        res.json(examData);
      }).catch(err => {
        Utils.responseError(res, err);
      });
    }

    public static update(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
        let rid = req.params.rid || "";
        let exams = ExamTypesModel.fromRequest(req);
        let status = req.body.isActive;
        if (!Utils.requiredCheck(exams.typeName)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_EXAM_TYPE_NAME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(exams.dueDate)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_EXAM_START_DATE_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(exams.toDate)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_EXAM_END_DATE_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(exams.startTime)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_EXAM_START_TIME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(exams.totalMark)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_EXAM_TOTAL_MARK_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(exams.minMark)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_EXAM_MIN_MARK_IS_REQUIRED,
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
            return ExamTypesUseCase.findOne(q => {
                q.where(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.RID}`,rid);
                q.where(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {

            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_EXAM_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
            return ExamTypesUseCase.findOne( q => {
                q.where(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
                q.where(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.TYPE_NAME}`,exams.typeName);
                q.whereNot(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.RID}`,rid);
                q.where(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.IS_DELETED}`,0);            
            })

        }).then((object) => {
            if(object != null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_EXAM_TYPE_NAME_ALREADY_EXISTS,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
            return ExamTypesUseCase.updateById(rid,exams);
        }).then((object) => {

            let examData=ExamTypesModel.fromDto(object);
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
            return ExamTypesUseCase.countByQuery(q => {
                let condition;
             if(checkuser.roleId != 18) {
             q.where(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.CREATED_BY}`,session.userId);
             }                

             q.where(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
             q.where(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.IS_DELETED}`,0);
                //q.whereRaw(condition);               
                if (searchobj) {
                    for (let key in searchobj) {
                        if(searchobj[key]!=null && searchobj[key]!=''){
                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);
                            if(key=='examTypeId'){
                                condition = `(${ExamTypesTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='typeName'){
                                condition = `(${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.TYPE_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'dueDate') {
                                condition = `(${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.DUE_DATE} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='toDate'){
                                condition = `(${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.TO_DATE} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'noons') {
                                condition = `(${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.NOONS} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='totalMark'){
                                condition = `(${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.TOTAL_MARK} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }  else if (key == 'minMark') {
                                condition = `(${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.MIN_MARK} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='startTime'){
                                condition = `(${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.START_TIME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'isActive') {
                                condition = `(${ExamTypesTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'createdDate') {
                                condition = `(${ExamTypesTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'updatedDate') {
                                condition = `(${ExamTypesTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }
                        }
                    }
                }  
            });
        })
            .then((totalObject) => {
                total = totalObject;
                return ExamTypesUseCase.findByQuery(q => {
                   q.select(`${ExamTypesTableSchema.TABLE_NAME}.*`);
                   let condition;
             if(checkuser.roleId != 18) {
             q.where(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.CREATED_BY}`,session.userId);
             }                

             q.where(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
             q.where(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.IS_DELETED}`,0);
                //q.whereRaw(condition);               
                if (searchobj) {
                    for (let key in searchobj) {
                        if(searchobj[key]!=null && searchobj[key]!=''){
                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);
                            if(key=='examTypeId'){
                                condition = `(${ExamTypesTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='typeName'){
                                condition = `(${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.TYPE_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'dueDate') {
                                condition = `(${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.DUE_DATE} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='toDate'){
                                condition = `(${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.TO_DATE} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'noons') {
                                condition = `(${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.NOONS} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='totalMark'){
                                condition = `(${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.TOTAL_MARK} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }  else if (key == 'minMark') {
                                condition = `(${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.MIN_MARK} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='startTime'){
                                condition = `(${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.START_TIME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'isActive') {
                                condition = `(${ExamTypesTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'createdDate') {
                                condition = `(${ExamTypesTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'updatedDate') {
                                condition = `(${ExamTypesTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
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
                            if (sortKey == 'examTypeId') {
                                q.orderBy(ColumnSortKey, sortValue);
                            } else if (sortKey == 'typeName') {
                                q.orderBy(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.TYPE_NAME}`, sortValue);
                            } else if (sortKey == 'dueDate') {
                                q.orderBy(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.DUE_DATE}`, sortValue);
                            } else if (sortKey == 'toDate') {
                                q.orderBy(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.TO_DATE}`, sortValue);
                            } else if (sortKey == 'noons') {
                                q.orderBy(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.NOONS}`, sortValue);
                            } else if (sortKey == 'totalMark') {
                                q.orderBy(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.TOTAL_MARK}`, sortValue);
                            }  else if (sortKey == 'minMark') {
                                q.orderBy(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.MIN_MARK}`, sortValue);
                            } else if (sortKey == 'startTime') {
                                q.orderBy(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.START_TIME}`, sortValue);
                            }  else if (sortKey == 'isActive') {
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
                        let examData = ExamTypesModel.fromDto(obj, ["createdBy","password"]); 
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
            return ExamTypesUseCase.findOne( q => {
                q.select(`${ExamTypesTableSchema.TABLE_NAME}.*`);
                q.where(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.RID}`,rid);
                q.where(`${ExamTypesTableSchema.TABLE_NAME}.${ExamTypesTableSchema.FIELDS.IS_DELETED}`,0);
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
                let examData = ExamTypesModel.fromDto(adminuser, ["password","createdBy"]);
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
        return ExamTypesUseCase.destroyById(rid,createdBy);
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
                let del = ExamTypesUseCase.destroyById(rid,createdBy);
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
        data["message"] = 'Exam types deleted successfully';
        res.json(data);
    })
    .catch(err => {
        Utils.responseError(res, err);
    });
}

}

export default ExamTypesHandler;
