import { MessageInfo } from '../../libs/constants';
import {AttendenceUseCase,ClassEntityUseCase,StandardEntityUseCase,AdminUserUseCase} from "../../domains";
import { ErrorCode, HttpStatus, MessageInfo, Properties, DefaultVal ,DATE_FORMAT} from "../../libs/constants";
import { Utils } from "../../libs/utils";
import {  Mailer } from "../../libs";
import { Exception, AttendenceModel} from "../../models";
import * as express from "express";
import { Promise } from "thenfail";
import { AttendenceTableSchema,ClassEntityTableSchema, StandardEntityTableSchema,AdminUserTableSchema,AuthorizationRoleTableSchema} from "../../data/schemas";
import { BaseHandler } from "../base.handler";
import { BearerObject } from "../../libs/jwt";
import * as formidable from "formidable";
import { Uploader } from "../../libs";
let fs = require('fs');  
var dateFormat = require('dateformat');
let knex=require('knex');
export class AttendenceHandler extends BaseHandler {
    constructor() {
        super();
    }

    public static create(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
       // req.body.schoolId=schoolId;
       // req.body.createdBy=session.userId;
        console.log(req.body);
        let standcount=0;
        let classcount=0;
        let usercount=0;
        let statuscount=0;
        let reasoncount=0;
        let userId1;
        let attendences=req.body.attendence;
        // if(attendences.length == 0){

        // }
        attendences.forEach((objects) => {
            let j=0;
            objects.forEach((obj,i) =>{
                let attendence = AttendenceModel.fromRequest(obj);
                if(standcount==1 ||(i== 0 && attendence.standardId == 0 )){
                    standcount=1;
                    userId1=attendence.userId;  
                  }
                  if(classcount==1 ||(i== 1 && attendence.classId == 0)){
                    classcount=1;  
                    userId1=attendence.userId;
                  }
                  if(usercount==1 ||(i== 2 && attendence.userId == 0)){
                    usercount=1;
                    userId1=attendence.userId;  
                  }
                  if(statuscount==1 ||(i== 3 && attendence.status == 0 )){
                    statuscount=1;  
                    userId1=attendence.userId;
                  }
                  if(reasoncount==1 ||(i== 4 && attendence.reason == undefined )){
                    reasoncount=1;  
                    userId1=attendence.userId;
                  }
            })
        })
        
       
        if (standcount == 1) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_STANDARD_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (classcount == 1) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_CLASS_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (usercount == 1) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_USER_NOT_EXIST,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (statuscount == 1) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_ATTENDENCE_STATUS_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        // if (reasoncount == 1) {
        //     return Utils.responseError(res, new Exception(
        //         ErrorCode.RESOURCE.INVALID_EMAIL,
        //         MessageInfo.MI_REASON_IS_REQUIRED,
        //         false,
        //         HttpStatus.BAD_REQUEST
        //     ));
        // }

        return Promise.then(() => {

            return AttendenceUseCase.findStandardId(attendences);
        } ).then((obj) => {
            if(obj == 1){
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_STANDARD_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break; 
            }
            return AttendenceUseCase.findClassId(attendences);
        }).then((obj) => {
            if(obj == 1){
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_CLASS_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break; 
            }
            return AttendenceUseCase.findUserId(attendences);
        }).then((obj) => {
            if(obj == 1){
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_USER_NOT_EXIST,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break; 
            }
        }).then(()=>{
            
        })
    }

    public static update(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let rid = req.params.rid || "";
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
        let attendence = AttendenceModel.fromRequest(req);
        let status = req.body.status;
        if (!Utils.requiredCheck(attendence.attendenceId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_ATTENDENCE_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        
        
        if (!Utils.requiredCheck(attendence.standardId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_STANDARD_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(attendence.classId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_CLASS_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(attendence.userId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_USER_NOT_EXIST,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(attendence.status)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_ATTENDENCE_STATUS_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(attendence.reason)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_STANDARD_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
       
        return Promise.then(() => {
            return AttendenceUseCase.findOne(q => {
                q.where(`${AttendenceTableSchema.TABLE_NAME}.${AttendenceTableSchema.FIELDS.RID}`,rid);
                q.where(`${AttendenceTableSchema.TABLE_NAME}.${AttendenceTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {

            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_ATTENDENCE_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
            return StandardEntityUseCase.findOne(q => {
                q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_ID}`,attendence.standardId);
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
                q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,attendence.userId);
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
            q.where(`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_ID}`,attendence.classId);
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
         return AttendenceUseCase.updateById(rid,attendence);

        }).then((object) => {

            let attendenceData=AttendenceModel.fromDto(object);
            attendenceData["message"] = "Attendence updated successfully";
            res.json(attendenceData);
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
            return AttendenceUseCase.countByQuery(q => {
                q.leftJoin(`${AdminUserTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.STAFF_ID}`);
                q.leftJoin(`${StandardEntityTableSchema.TABLE_NAME}`,`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_ID}`,`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.STANDARD_ID}`);
                let condition;
             if(checkuser.roleId != 18) {
             q.where(`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CREATED_BY}`,session.userId);
             }                

             q.where(`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
             q.where(`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.IS_DELETED}`,0);
                q.whereRaw(condition);               
                if (searchobj) {
                    for (let key in searchobj) {
                        if(searchobj[key]!=null && searchobj[key]!=''){
                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);
                            if(key=='classId'){
                                condition = `(${ClassEntityTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='staffName'){
                                condition = `CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                                q.andWhereRaw(condition);
                            } else if(key == 'sectionName') {
                                condition = `(${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'standardName'){
                                condition = `(${StandardEntityTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }  else if(key == 'isActive') {
                                condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'createdDate') {
                                condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'updatedDate') {
                                condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }
                        }
                    }
                }  
            });
        })
            .then((totalObject) => {
                total = totalObject;
                return AdminUserUseCase.findByQuery(q => {
                   q.select(`${ClassEntityTableSchema.TABLE_NAME}.*`,`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_NAME}`);
                   q.select(knex.raw(`CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME}," ",${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) as staffName`));
                    q.leftJoin(`${AdminUserTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.STAFF_ID}`);
                    q.leftJoin(`${StandardEntityTableSchema.TABLE_NAME}`,`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_ID}`,`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.STANDARD_ID}`);
                    let condition;
                 if(checkuser.roleId != 18) {
                 q.where(`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CREATED_BY}`,session.userId);
                 }                
    
                 q.where(`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
                 q.where(`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.IS_DELETED}`,0);
                    q.whereRaw(condition);               
                    if (searchobj) {
                        for (let key in searchobj) {
                            if(searchobj[key]!=null && searchobj[key]!=''){
                                console.log(searchobj[key]);
                                let searchval = searchobj[key];
                                let ColumnKey = Utils.changeSearchKey(key);
                                if(key=='classId'){
                                    condition = `(${ClassEntityTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key=='staffName'){
                                    condition = `CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                                    q.andWhereRaw(condition);
                                } else if(key == 'sectionName') {
                                    condition = `(${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_NAME} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key == 'standardName'){
                                    condition = `(${StandardEntityTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                }  else if(key == 'isActive') {
                                    condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key == 'createdDate') {
                                    condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key == 'updatedDate') {
                                    condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
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
                            if (sortKey == 'classId') {
                                q.orderBy(ColumnSortKey, sortValue);
                            } else if (sortKey == 'standardName') {
                                q.orderBy(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_NAME}`, sortValue);
                            } else if (sortKey == 'sectionName') {
                                q.orderBy(`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_NAME}`, sortValue);
                            } else if (sortKey == 'staffName') {
                                q.orderBy(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME}`, sortValue);
                                q.orderBy(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}`, sortValue);
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
                        let adminUseData = ClassEntityModel.fromDto(obj, ["createdBy","password"])
                        
                        adminUseData['staffName']=obj.get('staffName');
                        adminUseData['standardName']=obj.get('standard_name');                       //adminUseData["roleName"] = roles[adminUseData["roleId"]]; 
                        ret.push(adminUseData);
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
        return Promise.then(() =>{
            return ClassEntityUseCase.findOne( q => {
                q.select(`${ClassEntityTableSchema.TABLE_NAME}.*`,`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_NAME}`);
                q.select(knex.raw(`CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME}," ",${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) as staffName`));
                q.leftJoin(`${AdminUserTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.STAFF_ID}`);
                q.leftJoin(`${StandardEntityTableSchema.TABLE_NAME}`,`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_ID}`,`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.STANDARD_ID}`);
                q.where(`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.RID}`,rid);
                q.where(`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.IS_DELETED}`,0);
            }) 
        })
        .then((object) => {
            adminuser = object;
            
            if (adminuser == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_CLASS_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            } else {
                let classData = ClassEntityModel.fromDto(adminuser, ["password","createdBy"])
               // adminUseData["roleName"] = roles[adminUseData["roleId"]]; 
                 classData['staffName']=object.get('staffName');
                 classData['standardName']=object.get('standard_name');
                res.json(classData);
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
        return ClassEntityUseCase.destroyById(rid,createdBy);
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
    let classRids = [];
    if(rids) {
        classRids = JSON.parse(rids);
    }else{
        Utils.responseError(res, new Exception(
            ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND,
            MessageInfo.MI_USER_NOT_EXIST,
            false,
            HttpStatus.BAD_REQUEST
        ));
        
    }
    return Promise.then(() => {
        if(classRids!=null) {
            let ret = [];
            classRids.forEach(rid => {
                let del = ClassEntityUseCase.destroyById(rid,createdBy);
            });
            console.log(ret);
            return ret;
        } else {
            Utils.responseError(res, new Exception(
                ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND,
                MessageInfo.MI_USER_NOT_EXIST,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
        }
    })
    .then((result) => {
        let data ={};
        data["message"] = 'Class deleted successfully';
        res.json(data);
    })
    .catch(err => {
        Utils.responseError(res, err);
    });
}

}

export default AttendenceHandler;
