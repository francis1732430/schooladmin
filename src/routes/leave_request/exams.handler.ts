import { MessageInfo } from '../../libs/constants';
import {LeaveRequestUseCase,AdminUserUseCase} from "../../domains";
import { ErrorCode, HttpStatus, MessageInfo, Properties, DefaultVal ,DATE_FORMAT} from "../../libs/constants";
import { Utils } from "../../libs/utils";
import {  Mailer } from "../../libs";
import { Exception, LeaveRequestModel} from "../../models";
import * as express from "express";
import { Promise } from "thenfail";
import { LeaveRequestTableSchema, AdminUserTableSchema} from "../../data/schemas";
import { BaseHandler } from "../base.handler";
import { BearerObject } from "../../libs/jwt";
import * as formidable from "formidable";
import { Uploader } from "../../libs";
let fs = require('fs');  
var dateFormat = require('dateformat');
let knex=require('knex');
export class LeaveRequestHandler extends BaseHandler {
    constructor() {
        super();
    }

    public static create(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
        req.body.schoolId=schoolId;
        req.body.createdBy=session.userId;
        let leave = LeaveRequestModel.fromRequest(req);
        let status = req.body.status;
        if (!Utils.requiredCheck(leave.leaveType)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_LEAVE_TYPE_ID_NOT_FOUND,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(leave.sentBy)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_SENT_BY_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(leave.sentTo)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_SENT_TO_ID_NOT_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(leave.description)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_DESCRIPTION_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(leave.dueDate)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_DUE_DATE_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        if (!Utils.requiredCheck(leave.toDate)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_TO_DATE_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
       
        if (!Utils.requiredCheck(leave.isActive)) {
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
                q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,leave.sentBy);
                q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {

            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.DUPLICATE_RESOURCE,
                    MessageInfo.MI_SENT_BY_ID_IS_REQUIRED,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;  
            }
            return AdminUserUseCase.findOne( q => {
                q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,leave.sentTo);
                q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}`,0);
            })

        }).then((object) => {

            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.DUPLICATE_RESOURCE,
                    MessageInfo.MI_SENT_TO_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break; 
            }

            return LeaveRequestUseCase.create(leave);
        }).then((object) => {
            let examData={};
            examData["message"] = "Leave request created successfully";
            res.json(examData);
          }).catch(err => {
            Utils.responseError(res, err);
        });
    }

    public static update(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let rid = req.params.rid || "";
        let leave = LeaveRequestModel.fromRequest(req);
        let status = req.body.status;
        if (!Utils.requiredCheck(leave.leaveType)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_LEAVE_TYPE_ID_NOT_FOUND,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(leave.sentBy)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_SENT_BY_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(leave.sentTo)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_SENT_TO_ID_NOT_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(leave.description)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_DESCRIPTION_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(leave.dueDate)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_DUE_DATE_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        if (!Utils.requiredCheck(leave.toDate)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_TO_DATE_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
       
        if (!Utils.requiredCheck(leave.isActive)) {
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

            return LeaveRequestUseCase.findOne((q) => {
                q.where(`${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.RID}`,rid);
                q.where(`${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {

            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.DUPLICATE_RESOURCE,
                    MessageInfo.MI_LEAVE_REQUEST_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break; 
            }
            return AdminUserUseCase.findOne( q => {
                q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,leave.sentBy);
                q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {

            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.DUPLICATE_RESOURCE,
                    MessageInfo.MI_SENT_BY_ID_IS_REQUIRED,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;  
            }
            return AdminUserUseCase.findOne( q => {
                q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,leave.sentTo);
                q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}`,0);
            })

        }).then((object) => {

            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.DUPLICATE_RESOURCE,
                    MessageInfo.MI_SENT_TO_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break; 
            }

            return LeaveRequestUseCase.updateById(rid,leave);
        }).then((object) => {

            let leaveData=LeaveRequestModel.fromDto(object);
            leaveData["message"] = "Leave request updated successfully";
            res.json(leaveData);
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
            return LeaveRequestUseCase.countByQuery(q => {
                let condition;
             if(checkuser.roleId != 18) {
             q.where(`${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.CREATED_BY}`,session.userId);
             }                
             q.leftJoin(`${AdminUserTableSchema.TABLE_NAME} as sentby`,`sentby.${AdminUserTableSchema.FIELDS.USER_ID}`,`${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.SENT_BY}`);
             q.leftJoin(`${AdminUserTableSchema.TABLE_NAME} as sentto`,`sentto.${AdminUserTableSchema.FIELDS.USER_ID}`,`${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.SENT_TO}`);
             q.where(`${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
             q.where(`${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.IS_DELETED}`,0);
                q.whereRaw(condition);               
                if (searchobj) {
                    for (let key in searchobj) {
                        if(searchobj[key]!=null && searchobj[key]!=''){
                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);
                            if(key=='requestId'){
                                condition = `(${LeaveRequestTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='leaveType'){
                                condition = `(${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.LEAVE_TYPE} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'sentBy') {
                                condition = `CONCAT(sentby.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', sentby.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                                q.andWhereRaw(condition);
                            } else if(key=='sentTo'){
                                condition = `CONCAT(sentto.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', sentto.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                                q.andWhereRaw(condition);
                            } else if (key == 'approvalStatus') {
                                condition = `(${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.APPROVAL_STATUS} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='description'){
                                condition = `(${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.DESCRIPTION} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }  else if (key == 'dueDate') {
                                condition = `(${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.DUE_DATE} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='toDate'){
                                condition = `(${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.TO_DATE} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'notified') {
                                condition = `(${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.NOTIFIED} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='approvedBy'){
                                condition = `(${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.APPROVED_BY} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'isActive') {
                                condition = `(${LeaveRequestTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'createdDate') {
                                condition = `(${LeaveRequestTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'updatedDate') {
                                condition = `(${LeaveRequestTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }
                        }
                    }
                }  
            });
        })
            .then((totalObject) => {
                total = totalObject;
                return LeaveRequestUseCase.findByQuery(q => {
                   q.select(`${LeaveRequestTableSchema.TABLE_NAME}.*`);
                   q.select(knex.raw(`CONCAT(sentby.${AdminUserTableSchema.FIELDS.FIRSTNAME}," ",sentby.${AdminUserTableSchema.FIELDS.LASTNAME}) as sentBy`));
                   q.select(knex.raw(`CONCAT(sentto.${AdminUserTableSchema.FIELDS.FIRSTNAME}," ",sentto.${AdminUserTableSchema.FIELDS.LASTNAME}) as sentTo`));
                   let condition;
             if(checkuser.roleId != 18) {
             q.where(`${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.CREATED_BY}`,session.userId);
             }                
             q.leftJoin(`${AdminUserTableSchema.TABLE_NAME} as sentby`,`sentby.${AdminUserTableSchema.FIELDS.USER_ID}`,`${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.SENT_BY}`);
             q.leftJoin(`${AdminUserTableSchema.TABLE_NAME} as sentto`,`sentto.${AdminUserTableSchema.FIELDS.USER_ID}`,`${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.SENT_TO}`);
             q.where(`${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
             q.where(`${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.IS_DELETED}`,0);
                q.whereRaw(condition);               
                if (searchobj) {
                    for (let key in searchobj) {
                        if(searchobj[key]!=null && searchobj[key]!=''){
                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);
                            if(key=='requestId'){
                                condition = `(${LeaveRequestTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='leaveType'){
                                condition = `(${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.LEAVE_TYPE} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'sentBy') {
                                condition = `CONCAT(sentby.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', sentby.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                                q.andWhereRaw(condition);
                            } else if(key=='sentTo'){
                                condition = `CONCAT(sentto.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', sentto.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                                q.andWhereRaw(condition);
                            } else if (key == 'approvalStatus') {
                                condition = `(${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.APPROVAL_STATUS} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='description'){
                                condition = `(${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.DESCRIPTION} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }  else if (key == 'dueDate') {
                                condition = `(${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.DUE_DATE} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='toDate'){
                                condition = `(${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.TO_DATE} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'notified') {
                                condition = `(${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.NOTIFIED} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='approvedBy'){
                                condition = `(${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.APPROVED_BY} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'isActive') {
                                condition = `(${LeaveRequestTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'createdDate') {
                                condition = `(${LeaveRequestTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'updatedDate') {
                                condition = `(${LeaveRequestTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
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
                            if (sortKey == 'requestId') {
                                q.orderBy(ColumnSortKey, sortValue);
                            } else if (sortKey == 'leaveType') {
                                q.orderBy(`${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.LEAVE_TYPE}`, sortValue);
                            } else if (sortKey == 'sentBy') {
                                q.orderBy(`sentby.${AdminUserTableSchema.FIELDS.FIRSTNAME}`, sortValue);
                                q.orderBy(`sentby.${AdminUserTableSchema.FIELDS.LASTNAME}`, sortValue);
                            } else if (sortKey == 'sentTo') {
                                q.orderBy(`sentto.${AdminUserTableSchema.FIELDS.FIRSTNAME}`, sortValue);
                                q.orderBy(`sentto.${AdminUserTableSchema.FIELDS.LASTNAME}`, sortValue);
                            } else if (sortKey == 'approvalStatus') {
                                q.orderBy(`${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.APPROVAL_STATUS}`, sortValue);
                            } else if (sortKey == 'dueDate') {
                                q.orderBy(`${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.DUE_DATE}`, sortValue);
                            }  else if (sortKey == 'toDate') {
                                q.orderBy(`${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.TO_DATE}`, sortValue);
                            } else if (sortKey == 'description') {
                                q.orderBy(`${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.DESCRIPTION}`, sortValue);
                            }   else if (sortKey == 'notified') {
                                q.orderBy(`${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.NOTIFIED}`, sortValue);
                            } else if (sortKey == 'approvedBy') {
                                q.orderBy(`${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.APPROVED_BY}`, sortValue);
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
                        let leaveData = LeaveRequestModel.fromDto(obj, ["createdBy","password"]); 
                        leaveData['sentBy']=object.get('sentBy');
                        leaveData['sentTo']=object.get('sentTo');
                        ret.push(leaveData);
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
            return LeaveRequestUseCase.findOne( q => {
                q.select(`${LeaveRequestTableSchema.TABLE_NAME}.*`);
                   q.select(knex.raw(`CONCAT(sentby.${AdminUserTableSchema.FIELDS.FIRSTNAME}," ",sentby.${AdminUserTableSchema.FIELDS.LASTNAME}) as sentBy`));
                   q.select(knex.raw(`CONCAT(sentto.${AdminUserTableSchema.FIELDS.FIRSTNAME}," ",sentto.${AdminUserTableSchema.FIELDS.LASTNAME}) as sentTo`));               
             q.leftJoin(`${AdminUserTableSchema.TABLE_NAME} as sentby`,`sentby.${AdminUserTableSchema.FIELDS.USER_ID}`,`${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.SENT_BY}`);
             q.leftJoin(`${AdminUserTableSchema.TABLE_NAME} as sentto`,`sentto.${AdminUserTableSchema.FIELDS.USER_ID}`,`${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.SENT_TO}`);
             q.where(`${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.RID}`,rid);
             q.where(`${LeaveRequestTableSchema.TABLE_NAME}.${LeaveRequestTableSchema.FIELDS.IS_DELETED}`,0);
            }) 
        })
        .then((object) => {
            adminuser = object;
            
            if (adminuser == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_LEAVE_REQUEST_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            } else {
                let leaveData = LeaveRequestModel.fromDto(adminuser, ["password","createdBy"]);
                leaveData['sentBy']=object.get('sentBy');
                leaveData['sentTo']=object.get('sentTo');
                res.json(leaveData);
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
        return LeaveRequestUseCase.destroyById(rid,createdBy);
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
    let leaveRids = [];
    if(rids) {
        leaveRids = JSON.parse(rids);
    }else{
        Utils.responseError(res, new Exception(
            ErrorCode.RESOURCE.NOT_FOUND,
            MessageInfo.MI_EXAM_ID_NOT_FOUND,
            false,
            HttpStatus.BAD_REQUEST
        ));
        
    }
    return Promise.then(() => {
        if(leaveRids!=null) {
            let ret = [];
            leaveRids.forEach(rid => {
                let del = LeaveRequestUseCase.destroyById(rid,createdBy);
            });
            console.log(ret);
            return ret;
        } else {
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.NOT_FOUND,
                MessageInfo.MI_LEAVE_REQUEST_ID_NOT_FOUND,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
        }
    })
    .then((result) => {
        let data ={};
        data["message"] = 'Leave request deleted successfully';
        res.json(data);
    })
    .catch(err => {
        Utils.responseError(res, err);
    });
}

}

export default LeaveRequestHandler;
