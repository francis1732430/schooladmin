import { MessageInfo } from '../../libs/constants';
import {SubjectEntityUseCase} from "../../domains";
import { ErrorCode, HttpStatus, MessageInfo, Properties, DefaultVal ,DATE_FORMAT} from "../../libs/constants";
import { Utils } from "../../libs/utils";
import {  Mailer } from "../../libs";
import { Exception, SubjectEntityModel} from "../../models";
import * as express from "express";
import { Promise } from "thenfail";
import { SubjectTableSchema} from "../../data/schemas";
import { BaseHandler } from "../base.handler";
import { BearerObject } from "../../libs/jwt";
import * as formidable from "formidable";
import { Uploader } from "../../libs";
let fs = require('fs');  
var dateFormat = require('dateformat');
let knex=require('knex');
export class SubjectHandler extends BaseHandler {
    constructor() {
        super();
    }

    public static create(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
        req.body.schoolId=schoolId;
        req.body.createdBy=session.userId;
        let subject = SubjectEntityModel.fromRequest(req);
        let status = req.body.status;
        if (!Utils.requiredCheck(subject.subjectName)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_SUBJECT_NAME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        
        if (!Utils.requiredCheck(subject.isActive)) {
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
        return SubjectEntityUseCase.create(subject);
       }).catch(err => {
        Utils.responseError(res, err);
      });
    }

    public static update(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let rid = req.params.rid || "";
        let subject = SubjectEntityModel.fromRequest(req);
        let status = req.body.status;
        if (!Utils.requiredCheck(subject.subjectName)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_SUBJECT_NAME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        
        if (!Utils.requiredCheck(subject.isActive)) {
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
            return SubjectEntityUseCase.findOne(q => {
                q.where(`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.RID}`,rid);
                q.where(`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {

            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_SUBJECT_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
           
         return SubjectEntityUseCase.updateById(rid,subject);

        }).then((object) => {

            let subjectData=SubjectEntityModel.fromDto(object);
            subjectData["message"] = "Subject updated successfully";
            res.json(subjectData);
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
            return SubjectEntityUseCase.countByQuery(q => {
                let condition;
             if(checkuser.roleId != 18) {
             q.where(`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.CREATED_BY}`,session.userId);
             }                

             q.where(`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.SCHOOL_ID}`,schoolId);       
             q.where(`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.IS_DELETED}`,0);
                q.whereRaw(condition);               
                if (searchobj) {
                    for (let key in searchobj) {
                        if(searchobj[key]!=null && searchobj[key]!=''){
                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);
                            if(key=='subjectId'){
                                condition = `(${SubjectTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='subjectName'){
                                condition = `(${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.SUBJECT_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'sylabusUrl') {
                                condition = `(${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.SYLLABUS_URL} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='authorName'){
                                condition = `(${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.AUTHOR_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'materialUrl') {
                                condition = `(${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.MATERIAL_URL} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='refBooks'){
                                condition = `(${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.REF_BOOKS} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'isActive') {
                                condition = `(${SubjectTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'createdDate') {
                                condition = `(${SubjectTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'updatedDate') {
                                condition = `(${SubjectTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }
                        }
                    }
                }  
            });
        })
            .then((totalObject) => {
                total = totalObject;
                return SubjectEntityUseCase.findByQuery(q => {
                   q.select(`${SubjectTableSchema.TABLE_NAME}.*`);
                   let condition;
             if(checkuser.roleId != 18) {
             q.where(`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.CREATED_BY}`,session.userId);
             }                

             q.where(`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
             q.where(`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.IS_DELETED}`,0);
                q.whereRaw(condition);               
                if (searchobj) {
                    for (let key in searchobj) {
                        if(searchobj[key]!=null && searchobj[key]!=''){
                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);
                            if(key=='subjectId'){
                                condition = `(${SubjectTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='subjectName'){
                                condition = `(${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.SUBJECT_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'sylabusUrl') {
                                condition = `(${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.SYLLABUS_URL} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='authorName'){
                                condition = `(${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.AUTHOR_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'materialUrl') {
                                condition = `(${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.MATERIAL_URL} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='refBooks'){
                                condition = `(${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.REF_BOOKS} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'isActive') {
                                condition = `(${SubjectTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'createdDate') {
                                condition = `(${SubjectTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'updatedDate') {
                                condition = `(${SubjectTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
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
                            if (sortKey == 'subjectId') {
                                q.orderBy(ColumnSortKey, sortValue);
                            } else if (sortKey == 'subjectName') {
                                q.orderBy(`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.SUBJECT_NAME}`, sortValue);
                            } else if (sortKey == 'sylabusUrl') {
                                q.orderBy(`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.SYLLABUS_URL}`, sortValue);
                            } else if (sortKey == 'authorName') {
                                q.orderBy(`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.AUTHOR_NAME}`, sortValue);
                            } else if (sortKey == 'materialUrl') {
                                q.orderBy(`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.MATERIAL_URL}`, sortValue);
                            } else if (sortKey == 'refBooks') {
                                q.orderBy(`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.REF_BOOKS}`, sortValue);
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
                        let subjectData = SubjectEntityModel.fromDto(obj, ["createdBy","password"]); 
                        ret.push(subjectData);
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
            return SubjectEntityUseCase.findOne( q => {
                q.select(`${SubjectTableSchema.TABLE_NAME}.*`);
                q.where(`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.RID}`,rid);
                q.where(`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.IS_DELETED}`,0);
            }) 
        })
        .then((object) => {
            adminuser = object;
            
            if (adminuser == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_SUBJECT_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            } else {
                let subjectData = SubjectEntityModel.fromDto(adminuser, ["password","createdBy"]);
                res.json(subjectData);
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
        return SubjectEntityUseCase.destroyById(rid,createdBy);
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
    let subjectRids = [];
    if(rids) {
        subjectRids = JSON.parse(rids);
    }else{
        Utils.responseError(res, new Exception(
            ErrorCode.RESOURCE.NOT_FOUND,
            MessageInfo.MI_SUBJECT_ID_NOT_FOUND,
            false,
            HttpStatus.BAD_REQUEST
        ));
        
    }
    return Promise.then(() => {
        if(subjectRids!=null) {
            let ret = [];
            subjectRids.forEach(rid => {
                let del = SubjectEntityUseCase.destroyById(rid,createdBy);
            });
            console.log(ret);
            return ret;
        } else {
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.NOT_FOUND,
                MessageInfo.MI_SUBJECT_ID_NOT_FOUND,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
        }
    })
    .then((result) => {
        let data ={};
        data["message"] = 'Subject deleted successfully';
        res.json(data);
    })
    .catch(err => {
        Utils.responseError(res, err);
    });
}

}

export default SubjectHandler;
