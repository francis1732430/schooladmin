import { MessageInfo } from '../../libs/constants';
import {ComplaintRegistrationUseCase,AdminUserUseCase,SchoolUseCase, DirectoryDistrictUseCase, DirectoryTalukUseCase} from "../../domains";
import { ErrorCode, HttpStatus, MessageInfo, Properties, DefaultVal ,DATE_FORMAT} from "../../libs/constants";
import { Utils } from "../../libs/utils";
import {  Mailer } from "../../libs";
import { Exception, ComplaintRegistrationModel} from "../../models";
import * as express from "express";
import { Promise } from "thenfail";
import { ComplaintRegistrationSchema,AdminUserTableSchema,SchoolTableSchema, DirectoryDistrictTableSchema,DirectoryTalukTableSchema} from "../../data/schemas";
import { BaseHandler } from "../base.handler";
import { BearerObject } from "../../libs/jwt";
import * as formidable from "formidable";
import { Uploader } from "../../libs";
let fs = require('fs');  
var dateFormat = require('dateformat');
let knex=require('knex');
export class ComplaintRegistrationHandler extends BaseHandler {
    constructor() {
        super();
    }

    public static create(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
        req.body.schoolId=schoolId;
        req.body.createdBy=session.userId;
        let complaint = ComplaintRegistrationModel.fromRequest(req);
        let status = req.body.isActive;
        if (!Utils.requiredCheck(complaint.studentId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_USER_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(complaint.districtId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_DISTRICT_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        if (!Utils.requiredCheck(complaint.cityId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_CITY_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(complaint.mobileNo)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_MOBILE_NUMBER_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(complaint.email)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_EMAIL_NOT_EMPTY,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.validateEmail(complaint.email)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_INVALID_EMAIL,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(complaint.districtId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_DISTRICT_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        if (!Utils.requiredCheck(complaint.address)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_ADDRESS_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(complaint.pin)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_PIN_NUMBER_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        if (!Utils.requiredCheck(complaint.isActive)) {
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
               q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,complaint.studentId);
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

           return DirectoryDistrictUseCase.findOne(q => {
            q.where(`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`,complaint.districtId);
            q.where(`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.IS_DELETED}`,0);
        })
       }).then((object) => {
           if(object == null) {
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.NOT_FOUND,
                MessageInfo.MI_DISTRICT_NOT_FOUND,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
           }

           return DirectoryTalukUseCase.findOne(q => {
            q.where(`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_ID}`,complaint.cityId);
            q.where(`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.IS_DELETED}`,0);
        })
       }).then((object) => {
           if(object == null) {
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.NOT_FOUND,
                MessageInfo.MI_CITY_ID_NOT_FOUND,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
           }
           return SchoolUseCase.findOne(q => {
            q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
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

           return ComplaintRegistrationUseCase.create(complaint);
       }).then((object) => {

        let complaintData={}
        complaintData["message"] = "Complaint created successfully";
        res.json(complaintData);
    }).catch(err => {
        Utils.responseError(res, err);
      });
    }

    public static update(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
        let rid = req.params.rid || "";
        let complaint = ComplaintRegistrationModel.fromRequest(req);
        let status = req.body.isActive;
        if (!Utils.requiredCheck(complaint.studentId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_USER_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(complaint.districtId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_DISTRICT_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        if (!Utils.requiredCheck(complaint.cityId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_CITY_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(complaint.mobileNo)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_MOBILE_NUMBER_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(complaint.email)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_EMAIL_NOT_EMPTY,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.validateEmail(complaint.email)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_INVALID_EMAIL,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(complaint.districtId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_DISTRICT_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        if (!Utils.requiredCheck(complaint.address)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_ADDRESS_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(complaint.pin)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_PIN_NUMBER_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        if (!Utils.requiredCheck(complaint.isActive)) {
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
            return ComplaintRegistrationUseCase.findOne(q => {
                q.where(`${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.RID}`,rid);
                q.where(`${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {

            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_COMPLAINT_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
            return AdminUserUseCase.findOne(q => {
                q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,complaint.studentId);
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
 
            return DirectoryDistrictUseCase.findOne(q => {
             q.where(`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`,complaint.districtId);
             q.where(`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.IS_DELETED}`,0);
         })
        }).then((object) => {
            if(object == null) {
             Utils.responseError(res, new Exception(
                 ErrorCode.RESOURCE.NOT_FOUND,
                 MessageInfo.MI_DISTRICT_NOT_FOUND,
                 false,
                 HttpStatus.BAD_REQUEST
             ));
             return Promise.break;
            }
 
            return DirectoryTalukUseCase.findOne(q => {
             q.where(`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.DISTRICT_ID}`,complaint.cityId);
             q.where(`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.IS_DELETED}`,0);
         })
        }).then((object) => {
            if(object == null) {
             Utils.responseError(res, new Exception(
                 ErrorCode.RESOURCE.NOT_FOUND,
                 MessageInfo.MI_CITY_ID_NOT_FOUND,
                 false,
                 HttpStatus.BAD_REQUEST
             ));
             return Promise.break;
            }
            return SchoolUseCase.findOne(q => {
             q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_ID}`,complaint.schoolId);
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
         return ComplaintRegistrationUseCase.updateById(rid,complaint);

        }).then((object) => {
          console.log(object);
            let complaintData=ComplaintRegistrationModel.fromDto(object);
            complaintData["message"] = "Award updated successfully";
            res.json(complaintData);
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
            return ComplaintRegistrationUseCase.countByQuery(q => {
                let condition;
             if(session.userId != '1') {
             q.where(`${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.CREATED_BY}`,session.userId);
             } 
             q.innerJoin(`${AdminUserTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.STUDENT_ID}`);
             q.leftJoin(`${SchoolTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_ID}`,`${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.SCHOOL_ID}`);
             q.innerJoin(`${DirectoryDistrictTableSchema.TABLE_NAME}`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`,`${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.DISTRICT_ID}`);
             q.innerJoin(`${DirectoryTalukTableSchema.TABLE_NAME}`,`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_ID}`,`${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.CITY_ID}`);                                       
             q.where(`${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.IS_DELETED}`,0);
               // q.whereRaw(condition);               
                if (searchobj) {
                    for (let key in searchobj) {
                        if(searchobj[key]!=null && searchobj[key]!=''){
                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);
                            if(key=='registrationId'){
                                condition = `(${ComplaintRegistrationSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='email'){
                                condition = `(${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.EMAIL} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='address'){
                                condition = `(${ComplaintRegistrationSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='userName'){
                                condition = `CONCAT(user.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', user.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                                q.andWhereRaw(condition);
                            } else if(key=='schoolName'){
                                condition = `(${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='districtName'){
                                condition = `(${DirectoryDistrictTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'cityName') {
                                condition = `(${DirectoryTalukTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='mobileNo'){
                                condition = `(${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.MOBILE_NUMBER} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'pin') {
                                condition = `(${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.PIN} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }  else if(key=='description'){
                                condition = `(${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.DESCRIPTION} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'isActive') {
                                condition = `(${ComplaintRegistrationSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'createdDate') {
                                condition = `(${ComplaintRegistrationSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'updatedDate') {
                                condition = `(${ComplaintRegistrationSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }
                        }
                    }
                }  
            });
        })
            .then((totalObject) => {
                total = totalObject;
                return ComplaintRegistrationUseCase.findByQuery(q => {
                   q.select(`${ComplaintRegistrationSchema.TABLE_NAME}.*`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_NAME} as schoolName`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME} as districtName`,`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_NAME} as cityName`);
                   q.select(knex.raw(`CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME}," ",${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) as userName`));
                   let condition;
                   if(session.userId != '1') {
                   q.where(`${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.CREATED_BY}`,session.userId);
                   } 
                   q.innerJoin(`${AdminUserTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.STUDENT_ID}`);
                   q.leftJoin(`${SchoolTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_ID}`,`${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.SCHOOL_ID}`);
                   q.innerJoin(`${DirectoryDistrictTableSchema.TABLE_NAME}`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`,`${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.DISTRICT_ID}`);
                   q.innerJoin(`${DirectoryTalukTableSchema.TABLE_NAME}`,`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_ID}`,`${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.CITY_ID}`);                                       
                   q.where(`${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.IS_DELETED}`,0);
                     // q.whereRaw(condition);               
                      if (searchobj) {
                          for (let key in searchobj) {
                              if(searchobj[key]!=null && searchobj[key]!=''){
                                  console.log(searchobj[key]);
                                  let searchval = searchobj[key];
                                  let ColumnKey = Utils.changeSearchKey(key);
                                  if(key=='registrationId'){
                                      condition = `(${ComplaintRegistrationSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                      q.andWhereRaw(condition);
                                  } else if(key=='email'){
                                      condition = `(${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.EMAIL} LIKE "%${searchval}%")`;
                                      q.andWhereRaw(condition);
                                  } else if(key=='address'){
                                      condition = `(${ComplaintRegistrationSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                      q.andWhereRaw(condition);
                                  } else if(key=='userName'){
                                      condition = `CONCAT(user.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', user.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                                      q.andWhereRaw(condition);
                                  } else if(key=='schoolName'){
                                      condition = `(${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_NAME} LIKE "%${searchval}%")`;
                                      q.andWhereRaw(condition);
                                  } else if(key=='districtName'){
                                      condition = `(${DirectoryDistrictTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                      q.andWhereRaw(condition);
                                  } else if(key == 'cityName') {
                                      condition = `(${DirectoryTalukTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                      q.andWhereRaw(condition);
                                  } else if(key=='mobileNo'){
                                      condition = `(${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.MOBILE_NUMBER} LIKE "%${searchval}%")`;
                                      q.andWhereRaw(condition);
                                  } else if (key == 'pin') {
                                      condition = `(${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.PIN} LIKE "%${searchval}%")`;
                                      q.andWhereRaw(condition);
                                  }  else if(key=='description'){
                                      condition = `(${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.DESCRIPTION} LIKE "%${searchval}%")`;
                                      q.andWhereRaw(condition);
                                  } else if(key == 'isActive') {
                                      condition = `(${ComplaintRegistrationSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                      q.andWhereRaw(condition);
                                  } else if(key == 'createdDate') {
                                      condition = `(${ComplaintRegistrationSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                      q.andWhereRaw(condition);
                                  } else if(key == 'updatedDate') {
                                      condition = `(${ComplaintRegistrationSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
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
                            if (sortKey == 'registrationId') {
                                q.orderBy(ColumnSortKey, sortValue);
                            } else if (sortKey == 'email') {
                                q.orderBy(`${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.EMAIL}`, sortValue);
                            } else if(sortKey=='userName'){
                                q.orderBy(`user.${AdminUserTableSchema.FIELDS.FIRSTNAME}`, sortValue);
                                q.orderBy(`user.${AdminUserTableSchema.FIELDS.LASTNAME}`, sortValue);
                            } else if(sortKey == 'schoolName') {
                                q.orderBy(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_NAME}`,sortValue);
                            }  else if (sortKey == 'address') {
                                q.orderBy(`${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.ADDRESS}`, sortValue);
                            } else if (sortKey == 'mobileNo') {
                                q.orderBy(`${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.MOBILE_NUMBER}`, sortValue);
                            }   else if (sortKey == 'pin') {
                                q.orderBy(`${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.PIN}`, sortValue);
                            } else if (sortKey == 'description') {
                                q.orderBy(`${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.DESCRIPTION}`, sortValue);
                            } else if(sortKey=='districtName'){
                                q.orderBy(`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME}`,sortValue);
                            } else if(sortKey == 'cityName') {
                                q.orderBy(`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_NAME}`,sortValue);
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
                        console.log();
                        let userData = ComplaintRegistrationModel.fromDto(obj, ["createdBy","password"]); 
                        userData["schoolName"]=obj.get("schoolName");
                        userData["userName"]=obj.get("userName");
                        userData["districtName"]=obj.get("districtName");
                        userData["cityName"]=obj.get("cityName");
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
            return ComplaintRegistrationUseCase.findOne( q => {
                q.select(`${ComplaintRegistrationSchema.TABLE_NAME}.*`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_NAME} as schoolName`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME} as districtName`,`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_NAME} as cityName`);
                   q.select(knex.raw(`CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME}," ",${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) as userName`));
                   let condition;
                   q.where(`${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.RID}`,rid);
                   q.innerJoin(`${AdminUserTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.STUDENT_ID}`);
                   q.leftJoin(`${SchoolTableSchema.TABLE_NAME}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_ID}`,`${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.SCHOOL_ID}`);
                   q.innerJoin(`${DirectoryDistrictTableSchema.TABLE_NAME}`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`,`${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.DISTRICT_ID}`);
                   q.innerJoin(`${DirectoryTalukTableSchema.TABLE_NAME}`,`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_ID}`,`${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.CITY_ID}`);                                       
                   q.where(`${ComplaintRegistrationSchema.TABLE_NAME}.${ComplaintRegistrationSchema.FIELDS.IS_DELETED}`,0);
            }) 
        })
        .then((object) => {
            adminuser = object;
            
            if (adminuser == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_COMPLAINT_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            } else {
                let userData = ComplaintRegistrationModel.fromDto(object, ["createdBy","password"]); 
                        userData["schoolName"]=object.get("schoolName");
                        userData["userName"]=object.get("userName");
                        userData["districtName"]=object.get("districtName");
                        userData["cityName"]=object.get("cityName");
                res.json(userData);
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
        return ComplaintRegistrationUseCase.destroyById(rid,createdBy);
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
    let registrationRids = [];
    if(rids) {
        registrationRids = JSON.parse(rids);
    }else{
        Utils.responseError(res, new Exception(
            ErrorCode.RESOURCE.NOT_FOUND,
            MessageInfo.MI_COMPLAINT_ID_NOT_FOUND,
            false,
            HttpStatus.BAD_REQUEST
        ));
        
    }
    return Promise.then(() => {
        if(registrationRids!=null) {
            let ret = [];
            registrationRids.forEach(rid => {
                let del = ComplaintRegistrationUseCase.destroyById(rid,createdBy);
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
        data["message"] = 'Complaint deleted successfully';
        res.json(data);
    })
    .catch(err => {
        Utils.responseError(res, err);
    });
}

}

export default ComplaintRegistrationHandler;
