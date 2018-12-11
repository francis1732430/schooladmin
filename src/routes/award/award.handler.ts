import { MessageInfo } from '../../libs/constants';
import {AwardUseCase,AdminUserUseCase,SchoolUseCase} from "../../domains";
import { ErrorCode, HttpStatus, MessageInfo, Properties, DefaultVal ,DATE_FORMAT} from "../../libs/constants";
import { Utils } from "../../libs/utils";
import {  Mailer } from "../../libs";
import { Exception, AwardModel} from "../../models";
import * as express from "express";
import { Promise } from "thenfail";
import { AwardTableSchema,AdminUserTableSchema,SchoolTableSchema} from "../../data/schemas";
import { BaseHandler } from "../base.handler";
import { BearerObject } from "../../libs/jwt";
import * as formidable from "formidable";
import { Uploader } from "../../libs";
let fs = require('fs');  
var dateFormat = require('dateformat');
let knex=require('knex');
export class AwardHandler extends BaseHandler {
    constructor() {
        super();
    }

    public static create(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
       // req.body.schoolId=schoolId;
        req.body.createdBy=session.userId;
        let award = AwardModel.fromRequest(req);
        let status = req.body.isActive;
        if (!Utils.requiredCheck(award.awardName)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_AWARD_NAME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(award.userId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_USER_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(award.isActive)) {
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
           return AdminUserUseCase.findOne(q => {
               q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,award.userId);
               q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}`,0);
           })
       }).then((object) => {
           if(object == null) {
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.NOT_FOUND,
                MessageInfo.MI_USER_NOT_EXIST,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
           }
           return SchoolUseCase.findOne(q => {
            q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_ID}`,award.schoolId);
            q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.IS_DELETED}`,0);
        })
        
       }).then((object) => {
        if(object == null) {
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.NOT_FOUND,
                MessageInfo.MI_SCHOOL_ID_NOT_FOUND,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
           }


           if(award.imageUrl != undefined && award.imageUrl != null) {
            
            return AwardUseCase.materialUpload(award.imageUrl,schoolId,award.awardName);
        } else {
            // return SubjectEntityUseCase.materialUpload(subject.materialUrl,schoolId,subject.subjectName);
            return null;
        }
        
       }).then((obj) => {
           console.log("kkkk",obj);
        if(award.imageUrl != undefined && award.imageUrl != null) {
            award.imageUrl=obj;
        } if(award.certificateUrls != undefined && award.certificateUrls != null){
   
            return AwardUseCase.materialUpload(award.certificateUrls,schoolId,award.awardName);
        }
        return null;
      }).then((obj) => {
        console.log("kkkk1",obj);
         if(award.certificateUrls != undefined && award.certificateUrls != null){
            
            award.certificateUrls=obj;
        }


           return AwardUseCase.create(award);
       }).then((object) => {

        let awardData={}
        awardData["message"] = "Award created successfully";
        res.json(awardData);
    }).catch(err => {
        Utils.responseError(res, err);
      });
    }

    public static update(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
        let rid = req.params.rid || "";
        let award = AwardModel.fromRequest(req);
        let status = req.body.isActive;
        if (!Utils.requiredCheck(award.awardName)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_AWARD_NAME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(award.userId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_USER_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(award.isActive)) {
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
            return AwardUseCase.findOne(q => {
                q.where(`${AwardTableSchema.TABLE_NAME}.${AwardTableSchema.FIELDS.RID}`,rid);
                q.where(`${AwardTableSchema.TABLE_NAME}.${AwardTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {

            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_AWARD_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
            return AdminUserUseCase.findOne(q => {
                q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,award.userId);
                q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {
            if(object == null) {
             Utils.responseError(res, new Exception(
                 ErrorCode.RESOURCE.NOT_FOUND,
                 MessageInfo.MI_USER_NOT_EXIST,
                 false,
                 HttpStatus.BAD_REQUEST
             ));
             return Promise.break;
            }
            return SchoolUseCase.findOne(q => {
             q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_ID}`,award.schoolId);
             q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.IS_DELETED}`,0);
         })
         
        }).then((object) => {
         if(object == null) {
             Utils.responseError(res, new Exception(
                 ErrorCode.RESOURCE.NOT_FOUND,
                 MessageInfo.MI_SCHOOL_ID_NOT_FOUND,
                 false,
                 HttpStatus.BAD_REQUEST
             ));
             return Promise.break;
            }
 
            if(award.imageUrl != undefined && award.imageUrl != null) {
            
                return AwardUseCase.materialUpload(award.imageUrl,schoolId,award.awardName);
            } else {
                // return SubjectEntityUseCase.materialUpload(subject.materialUrl,schoolId,subject.subjectName);
                return null;
            }
            
           }).then((obj) => {
               console.log("kkkk",obj);
            if(award.imageUrl != undefined && award.imageUrl != null) {
                award.imageUrl=obj;
            } if(award.certificateUrls != undefined && award.certificateUrls != null){
       
                return AwardUseCase.materialUpload(award.certificateUrls,schoolId,award.awardName);
            }
            return null;
          }).then((obj) => {
            console.log("kkkk1",obj);
             if(award.certificateUrls != undefined && award.certificateUrls != null){
                
                award.certificateUrls=obj;
            }
            
         return AwardUseCase.updateById(rid,award);

        }).then((object) => {
          console.log(object);
            let centerData=AwardModel.fromDto(object);
            centerData["message"] = "Award updated successfully";
            res.json(centerData);
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
            return AwardUseCase.countByQuery(q => {
                let condition;
             if(session.userId != '1') {
             q.where(`${AwardTableSchema.TABLE_NAME}.${AwardTableSchema.FIELDS.CREATED_BY}`,session.userId);
             } 
             q.innerJoin(`${AdminUserTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${AwardTableSchema.TABLE_NAME}.${AwardTableSchema.FIELDS.USER_ID}`);
             q.leftJoin(`${SchoolTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_ID}`,`${AwardTableSchema.TABLE_NAME}.${AwardTableSchema.FIELDS.SCHOOL_ID}`);                    
             q.where(`${AwardTableSchema.TABLE_NAME}.${AwardTableSchema.FIELDS.IS_DELETED}`,0);
               // q.whereRaw(condition);               
                if (searchobj) {
                    for (let key in searchobj) {
                        if(searchobj[key]!=null && searchobj[key]!=''){
                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);
                            if(key=='awardId'){
                                condition = `(${AwardTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='awardName'){
                                condition = `(${AwardTableSchema.TABLE_NAME}.${AwardTableSchema.FIELDS.AWARD_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='awardDescription'){
                                condition = `(${AwardTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='userName'){
                                condition = `CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                                q.andWhereRaw(condition);
                            } else if(key=='schoolName'){
                                condition = `(${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }  else if(key=='imageUrl'){
                                condition = `(${AwardTableSchema.TABLE_NAME}.${AwardTableSchema.FIELDS.IMAGE_URL} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'certificateUrls') {
                                condition = `(${AwardTableSchema.TABLE_NAME}.${AwardTableSchema.FIELDS.CERTFICATE_URL} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }  else if(key == 'isActive') {
                                condition = `(${AwardTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'createdDate') {
                                condition = `(${AwardTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'updatedDate') {
                                condition = `(${AwardTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }
                        }
                    }
                }  
            });
        })
            .then((totalObject) => {
                total = totalObject;
                return AwardUseCase.findByQuery(q => {
                   q.select(`${AwardTableSchema.TABLE_NAME}.*`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_NAME} as schoolName`);
                   q.select(knex.raw(`CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME}," ",${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) as userName`));
                   let condition;
                   if(session.userId != '1') {
                    q.where(`${AwardTableSchema.TABLE_NAME}.${AwardTableSchema.FIELDS.CREATED_BY}`,session.userId);
                    } 
                    q.innerJoin(`${AdminUserTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${AwardTableSchema.TABLE_NAME}.${AwardTableSchema.FIELDS.USER_ID}`);
                    q.leftJoin(`${SchoolTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_ID}`,`${AwardTableSchema.TABLE_NAME}.${AwardTableSchema.FIELDS.SCHOOL_ID}`);                    
                    q.where(`${AwardTableSchema.TABLE_NAME}.${AwardTableSchema.FIELDS.IS_DELETED}`,0);
                      // q.whereRaw(condition);               
                       if (searchobj) {
                           for (let key in searchobj) {
                               if(searchobj[key]!=null && searchobj[key]!=''){
                                   console.log(searchobj[key]);
                                   let searchval = searchobj[key];
                                   let ColumnKey = Utils.changeSearchKey(key);
                                   if(key=='awardId'){
                                       condition = `(${AwardTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                       q.andWhereRaw(condition);
                                   } else if(key=='awardName'){
                                       condition = `(${AwardTableSchema.TABLE_NAME}.${AwardTableSchema.FIELDS.AWARD_NAME} LIKE "%${searchval}%")`;
                                       q.andWhereRaw(condition);
                                   } else if(key=='awardDescription'){
                                       condition = `(${AwardTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                       q.andWhereRaw(condition);
                                   } else if(key=='userName'){
                                       condition = `CONCAT(user.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', user.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                                       q.andWhereRaw(condition);
                                   } else if(key=='schoolName'){
                                       condition = `(${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_NAME} LIKE "%${searchval}%")`;
                                       q.andWhereRaw(condition);
                                   }  else if(key=='imageUrl'){
                                       condition = `(${AwardTableSchema.TABLE_NAME}.${AwardTableSchema.FIELDS.IMAGE_URL} LIKE "%${searchval}%")`;
                                       q.andWhereRaw(condition);
                                   } else if (key == 'certificateUrls') {
                                       condition = `(${AwardTableSchema.TABLE_NAME}.${AwardTableSchema.FIELDS.CERTFICATE_URL} LIKE "%${searchval}%")`;
                                       q.andWhereRaw(condition);
                                   }  else if(key == 'isActive') {
                                       condition = `(${AwardTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                       q.andWhereRaw(condition);
                                   } else if(key == 'createdDate') {
                                       condition = `(${AwardTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                       q.andWhereRaw(condition);
                                   } else if(key == 'updatedDate') {
                                       condition = `(${AwardTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
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
                            if (sortKey == 'awardId') {
                                q.orderBy(ColumnSortKey, sortValue);
                            } else if (sortKey == 'awardName') {
                                q.orderBy(`${AwardTableSchema.TABLE_NAME}.${AwardTableSchema.FIELDS.AWARD_NAME}`, sortValue);
                            } else if(sortKey=='userName'){
                                q.orderBy(`user.${AdminUserTableSchema.FIELDS.FIRSTNAME}`, sortValue);
                                q.orderBy(`user.${AdminUserTableSchema.FIELDS.LASTNAME}`, sortValue);
                            } else if(sortKey == 'schoolName') {
                                q.orderBy(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_NAME}`,sortValue);
                            }  else if (sortKey == 'imageUrl') {
                                q.orderBy(`${AwardTableSchema.TABLE_NAME}.${AwardTableSchema.FIELDS.IMAGE_URL}`, sortValue);
                            } else if (sortKey == 'certificateUrl') {
                                q.orderBy(`${AwardTableSchema.TABLE_NAME}.${AwardTableSchema.FIELDS.CERTFICATE_URL}`, sortValue);
                            }   else if (sortKey == 'isActive') {
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
                        console.log();
                        let userData = AwardModel.fromDto(obj, ["createdBy","password"]); 
                        userData["schoolName"]=obj.get("schoolName");
                        userData["userName"]=obj.get("userName");
                        ret.push(userData);
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
            return AwardUseCase.findOne( q => {
                q.select(`${AwardTableSchema.TABLE_NAME}.*`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_NAME} as schoolName`);
                   q.select(knex.raw(`CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME}," ",${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) as userName`));
                   let condition;
                    q.where(`${AwardTableSchema.TABLE_NAME}.${AwardTableSchema.FIELDS.RID}`,rid);

                    q.innerJoin(`${AdminUserTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${AwardTableSchema.TABLE_NAME}.${AwardTableSchema.FIELDS.USER_ID}`);
                    q.innerJoin(`${SchoolTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_ID}`,`${AwardTableSchema.TABLE_NAME}.${AwardTableSchema.FIELDS.SCHOOL_ID}`);                    
                    q.where(`${AwardTableSchema.TABLE_NAME}.${AwardTableSchema.FIELDS.IS_DELETED}`,0);
            }) 
        })
        .then((object) => {
            adminuser = object;
            
            if (adminuser == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_AWARD_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            } else {
                let awardData = AwardModel.fromDto(adminuser, ["password","createdBy"]);
                awardData["schoolName"]=object.get("schoolName");
                awardData["userName"]=object.get("userName");
                res.json(awardData);
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
        return AwardUseCase.destroyById(rid,createdBy);
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
    let awardRids = [];
    if(rids) {
        awardRids = JSON.parse(rids);
    }else{
        Utils.responseError(res, new Exception(
            ErrorCode.RESOURCE.NOT_FOUND,
            MessageInfo.MI_AWARD_ID_NOT_FOUND,
            false,
            HttpStatus.BAD_REQUEST
        ));
        
    }
    return Promise.then(() => {
        if(awardRids!=null) {
            let ret = [];
            awardRids.forEach(rid => {
                let del = AwardUseCase.destroyById(rid,createdBy);
            });
            console.log(ret);
            return ret;
        } else {
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.NOT_FOUND,
                MessageInfo.MI_AWARD_ID_NOT_FOUND,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
        }
    })
    .then((result) => {
        let data ={};
        data["message"] = 'Award deleted successfully';
        res.json(data);
    })
    .catch(err => {
        Utils.responseError(res, err);
    });
}

}

export default AwardHandler;
