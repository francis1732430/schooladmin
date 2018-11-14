import { MessageInfo } from '../../libs/constants';
import {StandardEntityUseCase} from "../../domains";
import { ErrorCode, HttpStatus, MessageInfo, Properties, DefaultVal ,DATE_FORMAT} from "../../libs/constants";
import { Utils } from "../../libs/utils";
import {  Mailer } from "../../libs";
import { Exception, StandardEntityModel} from "../../models";
import * as express from "express";
import { Promise } from "thenfail";
import { StandardEntityTableSchema} from "../../data/schemas";
import { BaseHandler } from "../base.handler";
import { BearerObject } from "../../libs/jwt";
import * as formidable from "formidable";
import { Uploader } from "../../libs";
let fs = require('fs');  
var dateFormat = require('dateformat');
let knex=require('knex');
export class StandardHandler extends BaseHandler {
    constructor() {
        super();
    }

    public static create(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
        req.body.schoolId=schoolId;
        req.body.createdBy=session.userId;
        let standard = StandardEntityModel.fromRequest(req);
        let status = req.body.isActive;
        if (!Utils.requiredCheck(standard.standardName)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_STANDARD_NAME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        
        
        if (!Utils.requiredCheck(standard.subjectIds)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_SUBJECT_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(standard.isActive)) {
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
        return StandardEntityUseCase.subjectIdCheck(standard.subjectIds);
       }).then((object) => {
        if(object.obj1 == 0) {
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.NOT_FOUND,
                MessageInfo.MI_SUBJECT_ID_NOT_FOUND,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
        }
        return StandardEntityUseCase.create(standard);
       }).then((object) => {
        let standardData={};
        standardData["message"] = "Standard created successfully";
        res.json(standardData);
       }).catch(err => {
        Utils.responseError(res, err);
      });


    }

    public static update(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let rid = req.params.rid || "";
        let standard = StandardEntityModel.fromRequest(req);
        let status = req.body.isActive;
        if (!Utils.requiredCheck(standard.standardName)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_STANDARD_NAME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        
        
        if (!Utils.requiredCheck(standard.subjectIds)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_SUBJECT_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(standard.isActive)) {
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
                q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.RID}`,rid);
                q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {

            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_STANDARD_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
            return StandardEntityUseCase.subjectIdCheck(standard.subjectIds);
        }).then((object) => {
 
         if(object.obj1 == 0) {
             Utils.responseError(res, new Exception(
                 ErrorCode.RESOURCE.NOT_FOUND,
                 MessageInfo.MI_SUBJECT_ID_NOT_FOUND,
                 false,
                 HttpStatus.BAD_REQUEST
             ));
             return Promise.break;
         }
         return StandardEntityUseCase.updateById(rid,standard);

        }).then((object) => {

            let standardData=StandardEntityModel.fromDto(object);
            standardData["message"] = "Standard updated successfully";
            res.json(standardData);
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
            return StandardEntityUseCase.countByQuery(q => {
                let condition;
             if(checkuser.roleId != 18 || checkuser.tmp == true) {
             q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.CREATED_BY}`,session.userId);
             }                

             q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
             q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.IS_DELETED}`,0);
              //  q.whereRaw(condition);               
                if (searchobj) {
                    for (let key in searchobj) {
                        if(searchobj[key]!=null && searchobj[key]!=''){
                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);
                            if(key=='standardId'){
                                condition = `(${StandardEntityTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='standardName'){
                                condition = `(${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'subjectIds') {
                                let condition = "";
                                let subjectIds = searchobj[key].split(',');
                                subjectIds.forEach((subjectId, i) => {
                                    if (i == 0) {
                                        condition = `${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.SUBJECT_ID} LIKE "%${subjectId}%"`;
                                    } else {
                                        condition = `(${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.SUBJECT_ID} LIKE "%${subjectId}%" or ${condition})`;
                                    }
                                });
                                q.andWhereRaw(condition);
                            } else if(key == 'isActive') {
                                condition = `(${StandardEntityTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'createdDate') {
                                condition = `(${StandardEntityTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'updatedDate') {
                                condition = `(${StandardEntityTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }
                        }
                    }
                }  
            });
        })
            .then((totalObject) => {
                total = totalObject;
                return StandardEntityUseCase.findByQuery(q => {
                   q.select(`${StandardEntityTableSchema.TABLE_NAME}.*`);
                   //q.select(knex.raw(`CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME}," ",${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) as staffName`));
                   let condition;
                   if(checkuser.roleId != 18 || checkuser.tmp == true) {
                   q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.CREATED_BY}`,session.userId);
                   }                
      
                   q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
                   q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.IS_DELETED}`,0);
                     // q.whereRaw(condition);               
                      if (searchobj) {
                          for (let key in searchobj) {
                              if(searchobj[key]!=null && searchobj[key]!=''){
                                  console.log(searchobj[key]);
                                  let searchval = searchobj[key];
                                  let ColumnKey = Utils.changeSearchKey(key);
                                  if(key=='standardId'){
                                      condition = `(${StandardEntityTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                      q.andWhereRaw(condition);
                                  } else if(key=='standardName'){
                                      condition = `(${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_NAME} LIKE "%${searchval}%")`;
                                      q.andWhereRaw(condition);
                                  } else if (key == 'subjectIds') {
                                    let condition = "";
                                    let subjectIds = searchobj[key].split(',');
                                    subjectIds.forEach((subjectId, i) => {
                                        if (i == 0) {
                                            condition = `${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.SUBJECT_ID} LIKE "%${subjectId}%"`;
                                        } else {
                                            condition = `(${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.SUBJECT_ID} LIKE "%${subjectId}%" or ${condition})`;
                                        }
                                    });
                                    q.andWhereRaw(condition);
                                } else if(key == 'isActive') {
                                      condition = `(${StandardEntityTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                      q.andWhereRaw(condition);
                                  } else if(key == 'createdDate') {
                                      condition = `(${StandardEntityTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                      q.andWhereRaw(condition);
                                  } else if(key == 'updatedDate') {
                                      condition = `(${StandardEntityTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
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
                            if (sortKey == 'standardId') {
                                q.orderBy(ColumnSortKey, sortValue);
                            } else if (sortKey == 'standardName') {
                                q.orderBy(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_NAME}`, sortValue);
                            } else if (sortKey == 'subjectIds') {
                                q.orderBy(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.SUBJECT_ID}`, sortValue);
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
                //noinspection TypeScriptUnresolvedVariable
                if (object != null && object.models != null) {
                    //noinspection TypeScriptUnresolvedVariable
                    let subjectData;
                    return Promise.each(object.models, (obj, i) => {

                        return Promise.then(() => {
                            subjectData = StandardEntityModel.fromDto(obj, ["createdBy"]);
                            return StandardEntityUseCase.subjectIdCheck(subjectData.subjectIds);
                        }).then((obj) => {
                            subjectData["subjects"] = obj.obj2;
                            delete subjectData["subjectIds"];
                            ret.push(subjectData);

                        })

                    }).then(obj => {
                        res.header(Properties.HEADER_TOTAL, total.toString(10));
                        if (offset != null) {
                            res.header(Properties.HEADER_OFFSET, offset.toString(10));
                        }
                        if (limit != null) {
                            res.header(Properties.HEADER_LIMIT, limit.toString(10));
                        }
                        res.json(ret);
                    })
                }
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
            return StandardEntityUseCase.findOne( q => {
                q.select(`${StandardEntityTableSchema.TABLE_NAME}.*`);
                q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.RID}`,rid);
                q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.IS_DELETED}`,0);
            }) 
        })
        .then(object => {
            if (object !== null) {
                 result = StandardEntityModel.fromDto(object);
                return StandardEntityUseCase.subjectIdCheck(result.subjectIds);
            } else {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_STANDARD_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
        }).then(obj => {
            result["subjects"] = obj.obj2;
            delete result["subjectIds"];
            res.json(result);
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
        return StandardEntityUseCase.destroyById(rid,createdBy);
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
    let standardRids = [];
    if(rids) {
        standardRids = JSON.parse(rids);
    }else{
        Utils.responseError(res, new Exception(
            ErrorCode.RESOURCE.NOT_FOUND,
            MessageInfo.MI_STAFF_ID_NOT_FOUND,
            false,
            HttpStatus.BAD_REQUEST
        ));
        
    }
    return Promise.then(() => {
        if(standardRids!=null) {
            let ret = [];
            standardRids.forEach(rid => {
                let del = StandardEntityUseCase.destroyById(rid,createdBy);
            });
            console.log(ret);
            return ret;
        } else {
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.NOT_FOUND,
                MessageInfo.MI_STANDARD_ID_NOT_FOUND,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
        }
    })
    .then((result) => {
        let data ={};
        data["message"] = 'Standard deleted successfully';
        res.json(data);
    })
    .catch(err => {
        Utils.responseError(res, err);
    });
}

}

export default StandardHandler;
