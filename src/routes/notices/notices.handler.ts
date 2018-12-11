import { MessageInfo } from '../../libs/constants';
import {NoticesUseCase,AdminUserUseCase,SchoolUseCase,StandardEntityUseCase} from "../../domains";
import { ErrorCode, HttpStatus, MessageInfo, Properties, DefaultVal ,DATE_FORMAT} from "../../libs/constants";
import { Utils } from "../../libs/utils";
import {  Mailer } from "../../libs";
import { Exception, NoticesModel} from "../../models";
import * as express from "express";
import { Promise } from "thenfail";
import { NoticesTableSchema,AdminUserTableSchema,SchoolTableSchema,StandardEntityTableSchema} from "../../data/schemas";
import { BaseHandler } from "../base.handler";
import { BearerObject } from "../../libs/jwt";
import * as formidable from "formidable";
import { Uploader } from "../../libs";
import { readdir } from 'fs';
let fs = require('fs');  
var dateFormat = require('dateformat');
let knex=require('knex');
export class NoticesHandler extends BaseHandler {
    constructor() {
        super();
    }

    public static create(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
        req.body.schoolId=schoolId;
        req.body.sentBy=session.userId;
        let notices = NoticesModel.fromRequest(req);
        let status = req.body.isActive;
        if (!Utils.requiredCheck(notices.title)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_TITLE_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
      

        if (!Utils.requiredCheck(notices.sentBy)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_SENT_BY_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }


        if (!Utils.requiredCheck(notices.sentToSchool) && !Utils.requiredCheck(notices.sentTo) && !Utils.requiredCheck(notices.sectionId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_SENT_TO_ID_NOT_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
       
        if (!Utils.requiredCheck(notices.isActive)) {
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

        if(notices.sentToSchool != null && notices.sentToSchool != undefined && notices.sectionId != null && notices.sectionId != undefined){
            return StandardEntityUseCase.findOne(q => {
                q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_ID}`,notices.sectionId);
                q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }
       else if(notices.sentToSchool != null && notices.sentToSchool != undefined){
            return SchoolUseCase.findOne(q => {
                q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_ID}`,notices.sentToSchool);
                q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.IS_DELETED}`,0);
            })
        } else if(notices.sentTo != null && notices.sentTo != undefined){
            return AdminUserUseCase.findOne(q => {
                q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,notices.sentTo);
                q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }  if(schoolId != null && schoolId != undefined && notices.sectionId != null && notices.sectionId != undefined){
            return StandardEntityUseCase.findOne(q => {
                q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_ID}`,notices.sectionId);
                q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }
            
       }).then((object) => {
           if( object == null) {
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.NOT_FOUND,
                MessageInfo.MI_SENT_TO_ID_NOT_FOUND,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
           }
          
           if(notices.imageUrl != undefined && notices.imageUrl != null) {
          
            if(notices.sentToSchool != null && notices.sentToSchool != undefined){
                return NoticesUseCase.materialUpload(notices.imageUrl,notices.sentToSchool,notices.title);
            }
            return NoticesUseCase.materialUpload(notices.imageUrl,schoolId,notices.title);
        } else {
            // return SubjectEntityUseCase.materialUpload(subject.materialUrl,schoolId,subject.subjectName);
            return null;
        }
        
       }).then((obj) => {
        console.log("kkkk1",obj);
         if(notices.imageUrl != undefined && notices.imageUrl != null){
            
            notices.imageUrl=obj;
        }

        return NoticesUseCase.create(notices);
       }).then((object) => {

        let noticesData={}
        noticesData["message"] = "Notices created successfully";
        res.json(noticesData);
    }).catch(err => {
        Utils.responseError(res, err);
      });
    }

    public static update(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
        let rid = req.params.rid || "";
        let notices = NoticesModel.fromRequest(req);
        let status = req.body.isActive;
        if (!Utils.requiredCheck(notices.title)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_TITLE_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
      

        if (!Utils.requiredCheck(notices.sentBy)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_SENT_BY_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        if (!Utils.requiredCheck(notices.sentToSchool) && !Utils.requiredCheck(notices.sentTo) && !Utils.requiredCheck(notices.sectionId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_SENT_TO_ID_NOT_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
       
        if (!Utils.requiredCheck(notices.isActive)) {
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
            return NoticesUseCase.findOne(q => {
                q.where(`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.RID}`,rid);
                q.where(`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {

            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_NOTICES_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
            if(notices.sentToSchool != null && notices.sentToSchool != undefined && notices.sectionId != null && notices.sectionId != undefined){
                return StandardEntityUseCase.findOne(q => {
                    q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_ID}`,notices.sectionId);
                    q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.IS_DELETED}`,0);
                })
            }
           else if(notices.sentToSchool != null && notices.sentToSchool != undefined){
                return SchoolUseCase.findOne(q => {
                    q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_ID}`,notices.sentToSchool);
                    q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.IS_DELETED}`,0);
                })
            } else if(notices.sentTo != null && notices.sentTo != undefined){
                return AdminUserUseCase.findOne(q => {
                    q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,notices.sentTo);
                    q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}`,0);
                })
            }  if(schoolId != null && schoolId != undefined && notices.sectionId != null && notices.sectionId != undefined){
                return StandardEntityUseCase.findOne(q => {
                    q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_ID}`,notices.sectionId);
                    q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.IS_DELETED}`,0);
                })
            }
                
           }).then((object) => {
               if( object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_SENT_TO_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
               }
              
               if(notices.imageUrl != undefined && notices.imageUrl != null) {
              
                if(notices.sentToSchool != null && notices.sentToSchool != undefined){
                    return NoticesUseCase.materialUpload(notices.imageUrl,notices.sentToSchool,notices.title);
                }
                return NoticesUseCase.materialUpload(notices.imageUrl,schoolId,notices.title);
            } else {
                return null;
            }
            
           }).then((obj) => {
            console.log("kkkk1",obj);
             if(notices.imageUrl != undefined && notices.imageUrl != null){
                
                notices.imageUrl=obj;
            }
         return NoticesUseCase.updateById(rid,notices);

        }).then((object) => {

            let noticesData=NoticesModel.fromDto(object);
            noticesData["message"] = "Notices updated successfully";
            res.json(noticesData);
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
        let standardId = parseInt(req.query.sectionId) || null;
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
            return NoticesUseCase.countByQuery(q => {
                let condition;
             if(checkuser.roleId != 18) {
                 if(standardId != null && standardId != undefined){
                    q.where(`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.SECTION_ID}`,standardId);
                 }else {
                    q.where(`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.SENT_BY}`,session.userId);
                 }
             }else if(checkuser.roleId == 18) {
                 condition=`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.SENT_TO} IS  NULL`;
                q.whereRaw(condition);
                q.orWhere(`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.SENT_TO_SCHOOL}`,schoolId);
                q.where(`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
            }   
            q.leftJoin(`${AdminUserTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.SENT_BY}`);
            q.leftJoin(`${AdminUserTableSchema.TABLE_NAME} as sentto`,`sentto.${AdminUserTableSchema.FIELDS.USER_ID}`,`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.SENT_TO}`);
            q.leftJoin(`${StandardEntityTableSchema.TABLE_NAME}`,`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_ID}`,`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.SECTION_ID}`);          
            q.leftJoin(`${SchoolTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_ID}`,`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.SENT_TO_SCHOOL}`); 
            q.where(`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.IS_DELETED}`,0);       
               // q.whereRaw(condition);               
                if (searchobj) {
                    for (let key in searchobj) {
                        if(searchobj[key]!=null && searchobj[key]!=''){
                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);
                            if(key=='noticeId'){
                                condition = `(${NoticesTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='title'){
                                condition = `(${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.TITLE} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'description') {
                                condition = `(${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.DESCRIPTION} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='levels'){
                                condition = `(${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.LEVELS} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='sentBy'){
                                condition = `CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                                q.andWhereRaw(condition);
                            } else if(key=='sentTo'){
                                condition = `CONCAT(sento.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', sentto.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                                q.andWhereRaw(condition);
                            } 
                            else if (key == 'standardName') {
                                condition = `(${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='imageUrl'){
                                condition = `(${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.IMAGE_URL} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='sentToSchool'){
                                condition = `(${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'isActive') {
                                condition = `(${NoticesTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'createdDate') {
                                condition = `(${NoticesTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'updatedDate') {
                                condition = `(${NoticesTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }
                        }
                    }
                }  
            });
        })
            .then((totalObject) => {
                total = totalObject;
                return NoticesUseCase.findByQuery(q => {
                   q.select(`${NoticesTableSchema.TABLE_NAME}.*`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_NAME}`,`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_NAME}`);
                   q.select(knex.raw(`CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME}," ",${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) as sentBy`));
                   q.select(knex.raw(`CONCAT(sentto.${AdminUserTableSchema.FIELDS.FIRSTNAME}," ",sentto.${AdminUserTableSchema.FIELDS.LASTNAME}) as sentTo`));
                   let condition;
                   if(checkuser.roleId != 18) {
                    if(standardId != null && standardId != undefined){
                       q.where(`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.SECTION_ID}`,standardId);
                    }else {
                       q.where(`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.SENT_BY}`,session.userId);
                    }
                }else if(checkuser.roleId == 18) {
                    condition=`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.SENT_TO} IS  NULL`;
                   q.whereRaw(condition);
                   q.where(`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
                   q.orWhere(`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.SENT_TO_SCHOOL}`,schoolId);
               }   
               q.leftJoin(`${AdminUserTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.SENT_BY}`);
               q.leftJoin(`${AdminUserTableSchema.TABLE_NAME} as sentto`,`sentto.${AdminUserTableSchema.FIELDS.USER_ID}`,`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.SENT_TO}`);
               q.leftJoin(`${StandardEntityTableSchema.TABLE_NAME}`,`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_ID}`,`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.SECTION_ID}`);          
               q.leftJoin(`${SchoolTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_ID}`,`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.SENT_TO_SCHOOL}`); 
               q.where(`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.IS_DELETED}`,0);       
                  // q.whereRaw(condition);               
                   if (searchobj) {
                       for (let key in searchobj) {
                           if(searchobj[key]!=null && searchobj[key]!=''){
                               console.log(searchobj[key]);
                               let searchval = searchobj[key];
                               let ColumnKey = Utils.changeSearchKey(key);
                               if(key=='noticeId'){
                                   condition = `(${NoticesTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                   q.andWhereRaw(condition);
                               } else if(key=='title'){
                                   condition = `(${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.TITLE} LIKE "%${searchval}%")`;
                                   q.andWhereRaw(condition);
                               } else if (key == 'description') {
                                   condition = `(${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.DESCRIPTION} LIKE "%${searchval}%")`;
                                   q.andWhereRaw(condition);
                               } else if(key=='levels'){
                                   condition = `(${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.LEVELS} LIKE "%${searchval}%")`;
                                   q.andWhereRaw(condition);
                               } else if(key=='sentBy'){
                                   condition = `CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                                   q.andWhereRaw(condition);
                               } else if(key=='sentTo'){
                                   condition = `CONCAT(sento.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', sentto.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                                   q.andWhereRaw(condition);
                               } 
                               else if (key == 'standardName') {
                                   condition = `(${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_NAME} LIKE "%${searchval}%")`;
                                   q.andWhereRaw(condition);
                               } else if(key=='imageUrl'){
                                   condition = `(${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.IMAGE_URL} LIKE "%${searchval}%")`;
                                   q.andWhereRaw(condition);
                               } else if(key=='sentToSchool'){
                                   condition = `(${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_NAME} LIKE "%${searchval}%")`;
                                   q.andWhereRaw(condition);
                               } else if(key == 'isActive') {
                                   condition = `(${NoticesTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                   q.andWhereRaw(condition);
                               } else if(key == 'createdDate') {
                                   condition = `(${NoticesTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                   q.andWhereRaw(condition);
                               } else if(key == 'updatedDate') {
                                   condition = `(${NoticesTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
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
                            if (sortKey == 'noticeId') {
                                q.orderBy(ColumnSortKey, sortValue);
                            } else if (sortKey == 'title') {
                                q.orderBy(`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.TITLE}`, sortValue);
                            } else if (sortKey == 'description') {
                                q.orderBy(`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.DESCRIPTION}`, sortValue);
                            } else if (sortKey == 'levels') {
                                q.orderBy(`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.LEVELS}`, sortValue);
                            } else if (sortKey == 'sentBy') {
                                q.orderBy(`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.SENT_BY}`, sortValue);
                            } else if (sortKey == 'sentTo') {
                                q.orderBy(`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.SENT_TO}`, sortValue);
                            } else if (sortKey == 'standardId') {
                                q.orderBy(`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.SECTION_ID}`, sortValue);
                            } else if (sortKey == 'imageUrl') {
                                q.orderBy(`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.IMAGE_URL}`, sortValue);
                            } else if (sortKey == 'sentToSchool') {
                                q.orderBy(`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.SENT_TO_SCHOOL}`, sortValue);
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
                        let noticesData = NoticesModel.fromDto(obj, ["createdBy","password"]); 
                        noticesData["standardName"]=obj.get('standard_name');
                        noticesData["sentBy"]=obj.get("sentBy");
                        noticesData["sentTo"]=obj.get("sentTo");
                        noticesData["schoolName"]=obj.get("school_name");
                        ret.push(noticesData);
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
            return NoticesUseCase.findOne( q => {
                q.select(`${NoticesTableSchema.TABLE_NAME}.*`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_NAME}`,`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_NAME}`);
                q.select(knex.raw(`CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME}," ",${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) as sentBy`));
                q.select(knex.raw(`CONCAT(sentto.${AdminUserTableSchema.FIELDS.FIRSTNAME}," ",sentto.${AdminUserTableSchema.FIELDS.LASTNAME}) as sentTo`));
                q.leftJoin(`${AdminUserTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.SENT_BY}`);
                q.leftJoin(`${AdminUserTableSchema.TABLE_NAME} as sentto`,`sentto.${AdminUserTableSchema.FIELDS.USER_ID}`,`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.SENT_TO}`);
                q.leftJoin(`${StandardEntityTableSchema.TABLE_NAME}`,`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_ID}`,`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.SECTION_ID}`);          
                q.leftJoin(`${SchoolTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_ID}`,`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.SENT_TO_SCHOOL}`); 
                q.where(`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.RID}`,rid); 
                q.where(`${NoticesTableSchema.TABLE_NAME}.${NoticesTableSchema.FIELDS.IS_DELETED}`,0);       
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
                let noticesData = NoticesModel.fromDto(adminuser, ["password","createdBy"]);
                noticesData["standardName"]=object.get('standard_name');
                noticesData["sentBy"]=object.get("sentBy");
                noticesData["sentTo"]=object.get("sentTo");
                res.json(noticesData);
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
        return NoticesUseCase.destroyById(rid,createdBy);
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
    let noticeRids = [];
    if(rids) {
        noticeRids = JSON.parse(rids);
    }else{
        Utils.responseError(res, new Exception(
            ErrorCode.RESOURCE.NOT_FOUND,
            MessageInfo.MI_SUBJECT_ID_NOT_FOUND,
            false,
            HttpStatus.BAD_REQUEST
        ));
        
    }
    return Promise.then(() => {
        if(noticeRids!=null) {
            let ret = [];
            noticeRids.forEach(rid => {
                let del = NoticesUseCase.destroyById(rid,createdBy);
            });
            console.log(ret);
            return ret;
        } else {
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.NOT_FOUND,
                MessageInfo.MI_NOTICES_ID_NOT_FOUND,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
        }
    })
    .then((result) => {
        let data ={};
        data["message"] = 'Notices deleted successfully';
        res.json(data);
    })
    .catch(err => {
        Utils.responseError(res, err);
    });
}

}

export default NoticesHandler;
