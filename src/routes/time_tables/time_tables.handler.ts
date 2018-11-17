import { MessageInfo } from '../../libs/constants';
import {TimeTableUseCase,StandardEntityUseCase,ClassEntityUseCase,AdminUserUseCase,WeakDayUseCase,TimingDayUseCase} from "../../domains";
import { ErrorCode, HttpStatus, MessageInfo, Properties, DefaultVal ,DATE_FORMAT} from "../../libs/constants";
import { Utils } from "../../libs/utils";
import {  Mailer } from "../../libs";
import { Exception, TimeTableModel} from "../../models";
import * as express from "express";
import { Promise } from "thenfail";
import { TimeTableTableSchema,AdminUserTableSchema,StandardEntityTableSchema,ClassEntityTableSchema,AuthorizationRoleTableSchema,WeakTableSchema,TimingTableSchema} from "../../data/schemas";
import { BaseHandler } from "../base.handler";
import { BearerObject } from "../../libs/jwt";
import * as formidable from "formidable";
import { Uploader } from "../../libs";
let fs = require('fs');  
var dateFormat = require('dateformat');
let knex=require('knex');
export class TimeTableHandler extends BaseHandler {
    constructor() {
        super();
    }

    public static create(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
        req.body.schoolId=schoolId;
        req.body.createdBy=session.userId;
        let time = TimeTableModel.fromRequest(req);
        let status = req.body.isActive;
        if (!Utils.requiredCheck(time.staffId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_USER_NOT_EXIST,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        if (!Utils.requiredCheck(time.standardId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_STANDARD_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        if (!Utils.requiredCheck(time.classId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_CLASS_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        if (!Utils.requiredCheck(time.weakId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_WEAK_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        if (!Utils.requiredCheck(time.startTime)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_START_TIME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(time.endTime)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_END_TIME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        
        if (!Utils.requiredCheck(time.isActive)) {
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
        return StandardEntityUseCase.findOne(q => {
            q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_ID}`,time.standardId);
            q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
               q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.IS_DELETED}`,0);
            });
       }).then((object) => {

        if(object == null ){
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.NOT_FOUND,
                MessageInfo.MI_STANDARD_ID_NOT_FOUND,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
        }
        return AdminUserUseCase.findOne( q => {
            q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,time.staffId);
            q.innerJoin(`${AuthorizationRoleTableSchema.TABLE_NAME}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.USER_ID}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`);
            q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
            q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}`,0);
        })
       }).then((object) => {
        if(object == null){
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.NOT_FOUND,
                MessageInfo.MI_USER_NOT_EXIST,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
        }

       return ClassEntityUseCase.findOne(q => {
        q.where(`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_ID}`,time.classId);
        q.where(`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
        q.where(`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.IS_DELETED}`,0);
        });
   }).then((object) => {

    if(object == null ){
        Utils.responseError(res, new Exception(
            ErrorCode.RESOURCE.NOT_FOUND,
            MessageInfo.MI_CLASS_ID_NOT_FOUND,
            false,
            HttpStatus.BAD_REQUEST
        ));
        return Promise.break;
    }

    return WeakDayUseCase.findOne(q => {
        q.where(`${WeakTableSchema.TABLE_NAME}.${WeakTableSchema.FIELDS.WEAK_ID}`,time.weakId);
        q.where(`${WeakTableSchema.TABLE_NAME}.${WeakTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
           q.where(`${WeakTableSchema.TABLE_NAME}.${WeakTableSchema.FIELDS.IS_DELETED}`,0);
        });
   }).then((object) => {

    if(object == null ){
        Utils.responseError(res, new Exception(
            ErrorCode.RESOURCE.NOT_FOUND,
            MessageInfo.MI_WEAK_ID_IS_REQUIRED,
            false,
            HttpStatus.BAD_REQUEST
        ));
        return Promise.break;
    }

    return TimingDayUseCase.findOne(q => {
        q.where(`${TimingTableSchema.TABLE_NAME}.${TimingTableSchema.FIELDS.TIME_ID}`,time.startTime);
        q.where(`${TimingTableSchema.TABLE_NAME}.${TimingTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
           q.where(`${TimingTableSchema.TABLE_NAME}.${TimingTableSchema.FIELDS.IS_DELETED}`,0);
        });
   }).then((object) => {

    if(object == null ){
        Utils.responseError(res, new Exception(
            ErrorCode.RESOURCE.NOT_FOUND,
            MessageInfo.MI_START_TIME_IS_REQUIRED,
            false,
            HttpStatus.BAD_REQUEST
        ));
        return Promise.break;
    }

    return TimingDayUseCase.findOne(q => {
        q.where(`${TimingTableSchema.TABLE_NAME}.${TimingTableSchema.FIELDS.TIME_ID}`,time.endTime);
        q.where(`${TimingTableSchema.TABLE_NAME}.${TimingTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
           q.where(`${TimingTableSchema.TABLE_NAME}.${TimingTableSchema.FIELDS.IS_DELETED}`,0);
        });
   }).then((object) => {

    if(object == null ){
        Utils.responseError(res, new Exception(
            ErrorCode.RESOURCE.NOT_FOUND,
            MessageInfo.MI_END_TIME_IS_REQUIRED,
            false,
            HttpStatus.BAD_REQUEST
        ));
        return Promise.break;
    }

      return TimeTableUseCase.create(time);
       }).then((object) => {
          let timeTable={};
        timeTable["message"] = "Calender created successfully";
        res.json(timeTable);
    }).catch(err => {
        Utils.responseError(res, err);
      });
    }

    public static update(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
        let rid = req.params.rid || "";
        let time = TimeTableModel.fromRequest(req);
        let status = req.body.isActive;
        if (!Utils.requiredCheck(time.staffId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_USER_NOT_EXIST,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        if (!Utils.requiredCheck(time.standardId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_STANDARD_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        if (!Utils.requiredCheck(time.classId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_CLASS_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        if (!Utils.requiredCheck(time.weakId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_WEAK_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        if (!Utils.requiredCheck(time.startTime)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_START_TIME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(time.endTime)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_END_TIME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        
        if (!Utils.requiredCheck(time.isActive)) {
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
            return TimeTableUseCase.findOne(q => {
                q.where(`${TimeTableTableSchema.TABLE_NAME}.${TimeTableTableSchema.FIELDS.RID}`,rid);
                q.where(`${TimeTableTableSchema.TABLE_NAME}.${TimeTableTableSchema.FIELDS.IS_DELETED}`,0);
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
            return StandardEntityUseCase.findOne(q => {
                q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_ID}`,time.standardId);
                q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
                   q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.IS_DELETED}`,0);
                });
           }).then((object) => {
    
            if(object == null ){
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_STANDARD_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
            return AdminUserUseCase.findOne( q => {
                q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,time.staffId);
                q.innerJoin(`${AuthorizationRoleTableSchema.TABLE_NAME}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.USER_ID}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`);
                q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
                q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}`,0);
            })
           }).then((object) => {
            if(object == null){
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_USER_NOT_EXIST,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
    
           return ClassEntityUseCase.findOne(q => {
            q.where(`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_ID}`,time.classId);
            q.where(`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
            q.where(`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.IS_DELETED}`,0);
            });
       }).then((object) => {
    
        if(object == null ){
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.NOT_FOUND,
                MessageInfo.MI_CLASS_ID_NOT_FOUND,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
        }
    
        return WeakDayUseCase.findOne(q => {
            q.where(`${WeakTableSchema.TABLE_NAME}.${WeakTableSchema.FIELDS.WEAK_ID}`,time.weakId);
            q.where(`${WeakTableSchema.TABLE_NAME}.${WeakTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
               q.where(`${WeakTableSchema.TABLE_NAME}.${WeakTableSchema.FIELDS.IS_DELETED}`,0);
            });
       }).then((object) => {
    
        if(object == null ){
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.NOT_FOUND,
                MessageInfo.MI_WEAK_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
        }
    
        return TimingDayUseCase.findOne(q => {
            q.where(`${TimingTableSchema.TABLE_NAME}.${TimingTableSchema.FIELDS.TIME_ID}`,time.startTime);
            q.where(`${TimingTableSchema.TABLE_NAME}.${TimingTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
               q.where(`${TimingTableSchema.TABLE_NAME}.${TimingTableSchema.FIELDS.IS_DELETED}`,0);
            });
       }).then((object) => {
    
        if(object == null ){
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.NOT_FOUND,
                MessageInfo.MI_START_TIME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
        }
    
        return TimingDayUseCase.findOne(q => {
            q.where(`${TimingTableSchema.TABLE_NAME}.${TimingTableSchema.FIELDS.TIME_ID}`,time.endTime);
            q.where(`${TimingTableSchema.TABLE_NAME}.${TimingTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
               q.where(`${TimingTableSchema.TABLE_NAME}.${TimingTableSchema.FIELDS.IS_DELETED}`,0);
            });
       }).then((object) => {
    
        if(object == null ){
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.NOT_FOUND,
                MessageInfo.MI_END_TIME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
        }
         return TimeTableUseCase.updateById(rid,time);

        }).then((object) => {

            let subjectData=TimeTableModel.fromDto(object);
            subjectData["message"] = "Calender updated successfully";
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
            return TimeTableUseCase.countByQuery(q => {
                let condition;
             if(checkuser.roleId != 18) {
             q.where(`${TimeTableTableSchema.TABLE_NAME}.${TimeTableTableSchema.FIELDS.CREATED_BY}`,session.userId);
             }                
             q.leftJoin(`${ClassEntityTableSchema.TABLE_NAME}`,`${TimeTableTableSchema.TABLE_NAME}.${TimeTableTableSchema.FIELDS.CLASS_ID}`,`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_ID}`);
             q.leftJoin(`${StandardEntityTableSchema.TABLE_NAME}`,`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_ID}`,`${TimeTableTableSchema.TABLE_NAME}.${TimeTableTableSchema.FIELDS.STANDARD_ID}`);
             q.leftJoin(`${AdminUserTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${TimeTableTableSchema.TABLE_NAME}.${TimeTableTableSchema.FIELDS.STAFF_ID}`);
             q.leftJoin(`${WeakTableSchema.TABLE_NAME}`,`${TimeTableTableSchema.TABLE_NAME}.${TimeTableTableSchema.FIELDS.WEAK_ID}`,`${WeakTableSchema.TABLE_NAME}.${WeakTableSchema.FIELDS.WEAK_ID}`);
             q.leftJoin(`${TimingTableSchema.TABLE_NAME} as starttime`,`starttime.${TimingTableSchema.FIELDS.TIME_ID}`,`${TimeTableTableSchema.TABLE_NAME}.${TimeTableTableSchema.FIELDS.START_TIME}`);
             q.leftJoin(`${TimingTableSchema.TABLE_NAME} as endtime`,`endtime.${TimingTableSchema.FIELDS.TIME_ID}`,`${TimeTableTableSchema.TABLE_NAME}.${TimeTableTableSchema.FIELDS.END_TIME}`);
             q.where(`${TimeTableTableSchema.TABLE_NAME}.${TimeTableTableSchema.FIELDS.SCHOOL_ID}`,schoolId);       
             q.where(`${TimeTableTableSchema.TABLE_NAME}.${TimeTableTableSchema.FIELDS.IS_DELETED}`,0);
               // q.whereRaw(condition);               
                if (searchobj) {
                    for (let key in searchobj) {
                        if(searchobj[key]!=null && searchobj[key]!=''){
                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);
                            if(key=='className'){
                                condition = `(${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='standardName'){
                                condition = `(${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'startTime') {
                                condition = `(${TimeTableTableSchema.TABLE_NAME}.${TimeTableTableSchema.FIELDS.START_TIME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='endTime'){
                                condition = `(${TimeTableTableSchema.TABLE_NAME}.${TimeTableTableSchema.FIELDS.END_TIME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'weakName') {
                                condition = `(${TimeTableTableSchema.TABLE_NAME}.${TimeTableTableSchema.FIELDS.WEAK_ID} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='staffName'){
                                condition = `CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                                q.andWhereRaw(condition);
                            } else if (key == 'startTime') {
                                condition = `(starttime.${TimingTableSchema.FIELDS.TIME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='endTime'){
                                condition = `(endtime.${TimingTableSchema.FIELDS.TIME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'weakName') {
                                condition = `(${WeakTableSchema.TABLE_NAME}.${WeakTableSchema.FIELDS.WEAK_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'isActive') {
                                condition = `(${TimeTableTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'createdDate') {
                                condition = `(${TimeTableTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'updatedDate') {
                                condition = `(${TimeTableTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }
                        }
                    }
                }  
            });
        })
            .then((totalObject) => {
                total = totalObject;
                return TimeTableUseCase.findByQuery(q => {
                   
                   q.select(`${TimeTableTableSchema.TABLE_NAME}.*`,`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_NAME}`,`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_NAME}`,`${WeakTableSchema.TABLE_NAME}.${WeakTableSchema.FIELDS.WEAK_NAME}`,`starttime.${TimingTableSchema.FIELDS.TIME} as starttime`,`endtime.${TimingTableSchema.FIELDS.TIME} as endtime`);
                   q.select(knex.raw(`CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME}," ",${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) as staffName`));
                   let condition;
                   q.leftJoin(`${ClassEntityTableSchema.TABLE_NAME}`,`${TimeTableTableSchema.TABLE_NAME}.${TimeTableTableSchema.FIELDS.CLASS_ID}`,`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_ID}`);
             q.leftJoin(`${StandardEntityTableSchema.TABLE_NAME}`,`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_ID}`,`${TimeTableTableSchema.TABLE_NAME}.${TimeTableTableSchema.FIELDS.STANDARD_ID}`);
             q.leftJoin(`${AdminUserTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${TimeTableTableSchema.TABLE_NAME}.${TimeTableTableSchema.FIELDS.STAFF_ID}`);
             q.leftJoin(`${WeakTableSchema.TABLE_NAME}`,`${TimeTableTableSchema.TABLE_NAME}.${TimeTableTableSchema.FIELDS.WEAK_ID}`,`${WeakTableSchema.TABLE_NAME}.${WeakTableSchema.FIELDS.WEAK_ID}`);
             q.leftJoin(`${TimingTableSchema.TABLE_NAME} as starttime`,`starttime.${TimingTableSchema.FIELDS.TIME_ID}`,`${TimeTableTableSchema.TABLE_NAME}.${TimeTableTableSchema.FIELDS.START_TIME}`);
             q.leftJoin(`${TimingTableSchema.TABLE_NAME} as endtime`,`endtime.${TimingTableSchema.FIELDS.TIME_ID}`,`${TimeTableTableSchema.TABLE_NAME}.${TimeTableTableSchema.FIELDS.END_TIME}`);
             q.where(`${TimeTableTableSchema.TABLE_NAME}.${TimeTableTableSchema.FIELDS.SCHOOL_ID}`,schoolId);       
             q.where(`${TimeTableTableSchema.TABLE_NAME}.${TimeTableTableSchema.FIELDS.IS_DELETED}`,0);
                      // q.whereRaw(condition);               
                       if (searchobj) {
                           for (let key in searchobj) {
                               if(searchobj[key]!=null && searchobj[key]!=''){
                                   console.log(searchobj[key]);
                                   let searchval = searchobj[key];
                                   let ColumnKey = Utils.changeSearchKey(key);
                                   if(key=='className'){
                                       condition = `(${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_NAME} LIKE "%${searchval}%")`;
                                       q.andWhereRaw(condition);
                                   } else if(key=='standardName'){
                                       condition = `(${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_NAME} LIKE "%${searchval}%")`;
                                       q.andWhereRaw(condition);
                                   } else if (key == 'startTime') {
                                       condition = `(starttime.${TimingTableSchema.FIELDS.TIME} LIKE "%${searchval}%")`;
                                       q.andWhereRaw(condition);
                                   } else if(key=='endTime'){
                                       condition = `(endtime.${TimingTableSchema.FIELDS.TIME} LIKE "%${searchval}%")`;
                                       q.andWhereRaw(condition);
                                   } else if (key == 'weakName') {
                                       condition = `(${WeakTableSchema.TABLE_NAME}.${WeakTableSchema.FIELDS.WEAK_NAME} LIKE "%${searchval}%")`;
                                       q.andWhereRaw(condition);
                                   } else if(key=='staffName'){
                                       condition = `CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                                       q.andWhereRaw(condition);
                                   } else if(key == 'isActive') {
                                       condition = `(${TimeTableTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                       q.andWhereRaw(condition);
                                   } else if(key == 'createdDate') {
                                       condition = `(${TimeTableTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                       q.andWhereRaw(condition);
                                   } else if(key == 'updatedDate') {
                                       condition = `(${TimeTableTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
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
                            if (sortKey == 'className') {
                                q.orderBy(ColumnSortKey, sortValue);
                            } else if (sortKey == 'standardName') {
                                q.orderBy(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_NAME}`, sortValue);
                            } else if (sortKey == 'startTime') {
                                q.orderBy(`starttime.${TimingTableSchema.FIELDS.TIME}`, sortValue);
                            } else if (sortKey == 'endTime') {
                                q.orderBy(`endtime.${TimingTableSchema.FIELDS.TIME}`, sortValue);
                            } else if (sortKey == 'weakName') {
                                q.orderBy(`${WeakTableSchema.TABLE_NAME}.${WeakTableSchema.FIELDS.WEAK_NAME}`, sortValue);
                            } else if (sortKey == 'staffName') {
                                q.orderBy(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME}`, sortValue);
                                q.orderBy(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}`, sortValue);
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
                let root=[];
                let standardid={};
                let classid={};
                let weakid={};
               // console.log(object);
                //noinspection TypeScriptUnresolvedVariable
                if (object != null && object.models != null) {
                    //noinspection TypeScriptUnresolvedVariable

                        object.models.forEach(obj => {

                            let standardId=obj.get("standard_id");
                            let classId=obj.get("class_id");
                            let weakId=obj.get('weak_id');
                        
                            if(standardid[standardId] != undefined && standardid[standardId] != null && classid[classId] != undefined && classid[classId] !=null && weakid[weakId] != undefined && weakid[weakId] !=null){
                            console.log('tttttt11111111',weakId,weakid);
                            if(standardId == standardid[standardId]['standardId'] && classId == classid[classId]['classId'] && weakId == weakid[weakId]['weakId']){
                                let timeTableData = TimeTableModel.fromDto(obj, ["createdBy","password"])
                               // attenenceData['staffName']=obj.get('staffName');
                                //attenenceData['standardName']=obj.get('standard_name');
                                delete timeTableData['standardId'];
                                delete timeTableData['schoolId'];
                                delete timeTableData['classId'];
                                delete timeTableData['starTime'];
                                delete timeTableData['endTime'];
                                delete timeTableData['weakId'];
                                timeTableData['startTime']=obj.get('starttime');
                                timeTableData['endTime']=obj.get('endtime');
                                timeTableData['weakName']=obj.get('weak_name');
                                timeTableData['staffName']=obj.get('staffName');
                                standardid[standardId].timeTable.push(timeTableData);
                            }
                           
                            }else {
    
                                let attenenceData = TimeTableModel.fromDto(obj, ["createdBy","password"])
                                attenenceData["timeTable"]=[];
                                attenenceData['standardName']=obj.get('standard_name');
                                attenenceData['studentName']=obj.get('studentName');
                                attenenceData['className']=obj.get('class_name');
                                attenenceData['startTime']=obj.get('starttime');
                                attenenceData['endTime']=obj.get('endtime');
                                attenenceData['weakName']=obj.get('weak_name');
                                attenenceData['staffName']=obj.get('staffName');
                                console.log("userId",attenenceData);
                                standardid[standardId]=attenenceData;
                                classid[classId]=attenenceData;
                                weakid[weakId]=attenenceData;
                                root.push(attenenceData);
                            }
                    });
                }
                res.header(Properties.HEADER_TOTAL, total.toString(10));

                if (offset != null) {
                    res.header(Properties.HEADER_OFFSET, offset.toString(10));
                }
                if (limit != null) {
                    res.header(Properties.HEADER_LIMIT, limit.toString(10));
                }

                res.json(root);
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
            return TimeTableUseCase.findOne( q => {
                q.select(`${TimeTableTableSchema.TABLE_NAME}.*`,`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_NAME}`,`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_NAME}`,`${WeakTableSchema.TABLE_NAME}.${WeakTableSchema.FIELDS.WEAK_NAME}`,`starttime.${TimingTableSchema.FIELDS.TIME} as starttime`,`endtime.${TimingTableSchema.FIELDS.TIME} as endtime`);
                   q.select(knex.raw(`CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME}," ",${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) as staffName`));
                   let condition;
                   q.leftJoin(`${ClassEntityTableSchema.TABLE_NAME}`,`${TimeTableTableSchema.TABLE_NAME}.${TimeTableTableSchema.FIELDS.CLASS_ID}`,`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_ID}`);
             q.leftJoin(`${StandardEntityTableSchema.TABLE_NAME}`,`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_ID}`,`${TimeTableTableSchema.TABLE_NAME}.${TimeTableTableSchema.FIELDS.STANDARD_ID}`);
             q.leftJoin(`${AdminUserTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${TimeTableTableSchema.TABLE_NAME}.${TimeTableTableSchema.FIELDS.STAFF_ID}`);
             q.leftJoin(`${WeakTableSchema.TABLE_NAME}`,`${TimeTableTableSchema.TABLE_NAME}.${TimeTableTableSchema.FIELDS.WEAK_ID}`,`${WeakTableSchema.TABLE_NAME}.${WeakTableSchema.FIELDS.WEAK_ID}`);
             q.leftJoin(`${TimingTableSchema.TABLE_NAME} as starttime`,`starttime.${TimingTableSchema.FIELDS.TIME_ID}`,`${TimeTableTableSchema.TABLE_NAME}.${TimeTableTableSchema.FIELDS.START_TIME}`);
             q.leftJoin(`${TimingTableSchema.TABLE_NAME} as endtime`,`endtime.${TimingTableSchema.FIELDS.TIME_ID}`,`${TimeTableTableSchema.TABLE_NAME}.${TimeTableTableSchema.FIELDS.END_TIME}`);
             q.where(`${TimeTableTableSchema.TABLE_NAME}.${TimeTableTableSchema.FIELDS.RID}`,rid);       
             q.where(`${TimeTableTableSchema.TABLE_NAME}.${TimeTableTableSchema.FIELDS.IS_DELETED}`,0);
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
                let timeTableData = TimeTableModel.fromDto(adminuser, ["password","createdBy"]);
                res.json(timeTableData);
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
        return TimeTableUseCase.destroyById(rid,createdBy);
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
    let timeTableRids = [];
    if(rids) {
        timeTableRids = JSON.parse(rids);
    }else{
        Utils.responseError(res, new Exception(
            ErrorCode.RESOURCE.NOT_FOUND,
            MessageInfo.MI_SUBJECT_ID_NOT_FOUND,
            false,
            HttpStatus.BAD_REQUEST
        ));
        
    }
    return Promise.then(() => {
        if(timeTableRids!=null) {
            let ret = [];
            timeTableRids.forEach(rid => {
                let del = TimeTableUseCase.destroyById(rid,createdBy);
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
        data["message"] = 'Time table deleted successfully';
        res.json(data);
    })
    .catch(err => {
        Utils.responseError(res, err);
    });
}

}

export default TimeTableHandler;
