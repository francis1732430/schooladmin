import { MessageInfo } from './../../libs/constants';
import {SchoolUseCase,DirectoryDistrictUseCase,DirectoryTalukUseCase,AuthorizationRoleUseCase} from "../../domains";
import { ErrorCode, HttpStatus, MessageInfo, Properties, DefaultVal ,DATE_FORMAT} from "../../libs/constants";
import { Utils } from "../../libs/utils";
import {  Mailer } from "../../libs";
import { Exception, SchoolModel, AdminUserModel} from "../../models";
import * as express from "express";
import { Promise } from "thenfail";
import { SchoolTableSchema, DirectoryDistrictTableSchema,DirectoryTalukTableSchema, AuthorizationRoleTableSchema, AdminUserTableSchema} from "../../data/schemas";
import { BaseHandler } from "../base.handler";
import { BearerObject } from "../../libs/jwt";
import * as formidable from "formidable";
import { Uploader } from "../../libs";
let fs = require('fs');  
var dateFormat = require('dateformat');

export class SchoolHandler extends BaseHandler {
    constructor() {
        super();
    }

    public static create(req: express.Request, res: express.Response): any {
        //let session: BearerObject = req[Properties.SESSION];
        req.body.createdBy = "18";
        let school = SchoolModel.fromRequest(req);
        let status = req.body.status;
        let districtName;
        if (!Utils.requiredCheck(school.schoolName)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_SCHOOL_NAME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        
        // if (!Utils.requiredCheck(school.schoolName)) {
        //     return Utils.responseError(res, new Exception(
        //         ErrorCode.RESOURCE.INVALID_EMAIL,
        //         MessageInfo.MI_SCHOOL_NAME_IS_REQUIRED,
        //         false,
        //         HttpStatus.BAD_REQUEST
        //     ));
        // }
        
        if (!Utils.requiredCheck(school.districtId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_DISTRICT_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        
        if (!Utils.requiredCheck(school.cityId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_CITY_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        
        if (!Utils.requiredCheck(school.representativeName)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_REPRESENTATIVE_NAME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        
        
        if (!Utils.requiredCheck(school.schoolEmail)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_SCHOOL_EMAIL_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        if (!Utils.requiredCheck(school.representativeEmail)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_REPRESENTATIVE_EMAIL_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }        
        if (!Utils.requiredCheck(school.schoolPhoneNumber)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_REPRESENTATIVE_MOBILE_NUMBER_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(school.representativePhoneNumber)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_REPRESENTATIVE_MOBILE_NUMBER_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        
        if (!Utils.requiredCheck(school.PIN)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_POSTAL_CODE_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        // if (!Utils.requiredCheck(school.address)) {
        //     return Utils.responseError(res, new Exception(
        //         ErrorCode.RESOURCE.INVALID_EMAIL,
        //         MessageInfo.MI_ADDRESS_IS_REQUIRED,
        //         false,
        //         HttpStatus.BAD_REQUEST
        //     ));
        // }
        if (!Utils.validateEmail(school.schoolEmail)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_INVALID_EMAIL,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.validateEmail(school.representativeEmail)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_INVALID_EMAIL,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.validateNumber(school.schoolPhoneNumber)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_INVALID_PHONE_NUMBER,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.validateNumber(school.representativePhoneNumber)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_INVALID_PHONE_NUMBER,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        return Promise.then(() => {

            return SchoolUseCase.findOne( q => {
                q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_EMAIL}`,school.schoolEmail);
                q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {
                if(object != null) {
                    Utils.responseError(res, new Exception(
                       ErrorCode.RESOURCE.NOT_FOUND,
                       MessageInfo.MI_EMAIL_ALREADY_USE,
                       false,
                       HttpStatus.BAD_REQUEST
                   ));
                   return Promise.break;
               }
            return SchoolUseCase.findOne( q => {
                q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.REPRESENTATIVE_EMAIL}`,school.representativeEmail);
                q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {

            if(object != null) {
                    Utils.responseError(res, new Exception(
                       ErrorCode.RESOURCE.NOT_FOUND,
                       MessageInfo.MI_EMAIL_ALREADY_USE,
                       false,
                       HttpStatus.BAD_REQUEST
                   ));
                   return Promise.break;
               }    
            return DirectoryDistrictUseCase.findOne( q => {
                q.where(`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`,school.districtId);
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
            districtName=object.get('ditrict_name');
            return DirectoryTalukUseCase.findOne( q => {
                q.where(`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_ID}`,school.cityId);
                q.where(`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.DISTRICT_ID}`,school.districtId);
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
           school.approvalStatus=0;
           return SchoolUseCase.create(school);
         }).then((object) => {
        //         if(object == null) {
        //             Utils.responseError(res, new Exception(
        //                ErrorCode.RESOURCE.NOT_FOUND,
        //                MessageInfo.MI_SCHOOL_CREATION_FAILED,
        //                false,
        //                HttpStatus.BAD_REQUEST
        //            ));
        //            return Promise.break;
        //        }    
        //     return AuthorizationRoleUseCase.findByQuery(q => {
        //         q.select(`${AuthorizationRoleTableSchema.TABLE_NAME}.*`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.EMAIL}`)
        //         q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.PARENT_ID}`,"32");
        //         q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.DISTRICT_ID}`,school.districtId);
        //         q.innerJoin(`${AdminUserTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.USER_ID}`)
        //     })
        // }).then((objects) => {
        //     let emails=[];
        //     objects.models.forEach((obj) => {
        //         let userData=AdminUserModel.fromDto(obj);
        //          emails.push(userData.email);
        //     })

        //     return SchoolUseCase.sendMail(emails,school.schoolName,districtName);
        // }).then(() => {
            let schoolData={};
            schoolData["message"] = "School created successfully";
            res.json(schoolData);
        })
        .catch(err => {
            Utils.responseError(res, err);
        });
    }

    public static update(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let rid = req.params.rid || "";
        let school = SchoolModel.fromRequest(req);
        if (!Utils.requiredCheck(school.schoolName)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_SCHOOL_NAME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        
        if (!Utils.requiredCheck(school.schoolName)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_SCHOOL_NAME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        
        if (!Utils.requiredCheck(school.districtId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_DISTRICT_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        
        if (!Utils.requiredCheck(school.cityId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_CITY_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        
        if (!Utils.requiredCheck(school.representativeName)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_REPRESENTATIVE_NAME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        
        
        if (!Utils.requiredCheck(school.schoolEmail)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_SCHOOL_EMAIL_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        if (!Utils.requiredCheck(school.representativeEmail)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_REPRESENTATIVE_EMAIL_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }        
        if (!Utils.requiredCheck(school.schoolPhoneNumber)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_REPRESENTATIVE_MOBILE_NUMBER_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(school.representativePhoneNumber)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_REPRESENTATIVE_MOBILE_NUMBER_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        
        if (!Utils.requiredCheck(school.PIN)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_POSTAL_CODE_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(school.address)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_ADDRESS_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.validateEmail(school.schoolEmail)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_INVALID_EMAIL,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.validateEmail(school.representativeEmail)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_INVALID_EMAIL,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.validateNumber(school.schoolPhoneNumber)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_INVALID_PHONE_NUMBER,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (Utils.validateNumber(school.representativePhoneNumber)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_INVALID_PHONE_NUMBER,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
       
       
        return Promise.then(() => {

            return SchoolUseCase.findOne( q => {
                q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_EMAIL}`,school.schoolEmail);
                q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.RID}`,rid);
                q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {
                if(object != null) {
                    Utils.responseError(res, new Exception(
                       ErrorCode.RESOURCE.NOT_FOUND,
                       MessageInfo.MI_EMAIL_ALREADY_USE,
                       false,
                       HttpStatus.BAD_REQUEST
                   ));
                   return Promise.break;
               }
            return SchoolUseCase.findOne( q => {
                q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.REPRESENTATIVE_EMAIL}`,school.representativeEmail);
                q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.RID}`,rid);
                q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {

            if(object != null) {
                    Utils.responseError(res, new Exception(
                       ErrorCode.RESOURCE.NOT_FOUND,
                       MessageInfo.MI_EMAIL_ALREADY_USE,
                       false,
                       HttpStatus.BAD_REQUEST
                   ));
                   return Promise.break;
               }    
            return SchoolUseCase.findById(rid);
        })
            .then(object => {
                if (object == null) {
                    Utils.responseError(res, new Exception(
                        ErrorCode.RESOURCE.NOT_FOUND,
                        MessageInfo.MI_SCHOOL_ID_NOT_FOUND,
                        false, 
                        HttpStatus.BAD_REQUEST
                    ));
                    return Promise.break;
                } 
                return DirectoryDistrictUseCase.findOne( q => {
                    q.where(`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`);
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
                return DirectoryTalukUseCase.findOne( q => {
                    q.where(`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_ID}`);
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
               school.approvalStatus=0;
               return SchoolUseCase.updateById(rid,school);
            })
            .then(object => { 
                let schoolData=SchoolModel.fromDto(object);
                schoolData["message"] = "School updated successfully";
                res.json(schoolData);
            })
            .catch(err => {
                Utils.responseError(res, err);
            });
    }
 
    
    public static list(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let userId=session.userId;
        let offset = parseInt(req.query.offset) || null;
        let limit = parseInt(req.query.limit) || null;
        let sortKey;
        let sortValue;
        let searchobj = [];
        let role:any;
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
        let condition;
        return Promise.then(() =>{
            return AuthorizationRoleUseCase.findOne( q => {
              q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.USER_ID}`,userId);
              q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.PARENT_ID}`,"7");
            })
        }).then((object) => {
            role=object;
            return SchoolUseCase.countByQuery(q => {
               
                q.select(`${SchoolTableSchema.TABLE_NAME}.*`,`${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME}`,`${DirectoryTalukTableSchema.FIELDS.CITY_NAME}`)
                q.innerJoin(`${DirectoryDistrictTableSchema.TABLE_NAME}`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.DISTRICT_ID}`);
                q.innerJoin(`${DirectoryTalukTableSchema.TABLE_NAME}`,`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_ID}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.CITY_ID}`);

                if(userId != "1"){
                    q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.CREATED_BY}`,userId);
                } else if(userId != "7") {
                    q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.DISTRICT_ID}`,role.districtId);
                }
                q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.IS_DELETED}`,0);

                if (searchobj) {
                    for (let key in searchobj) {
                        if(searchobj[key]!=null && searchobj[key]!=''){
                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);
                            if(key=='schoolName'){
                                condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='districtName'){
                                condition = `(${DirectoryDistrictTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'cityName') {
                                condition = `(${DirectoryTalukTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'startedDate'){
                                condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'principleName') {
                                condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }else if(key=='representativeName'){
                                condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='approvalStatus'){
                                condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'representativePhoneNumber') {
                                condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'schoolPhoneNumber'){
                                condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'representativeEmail') {
                                condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'schoolEmail') {
                                condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'PIN') {
                                condition = `(${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.POSTAL_CODE} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'address') {
                                condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'isActive') {
                                condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'createdDate') {
                                condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'updatedDate') {
                                condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
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
                    q.select(`${SchoolTableSchema.TABLE_NAME}.*`,`${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME}`,`${DirectoryTalukTableSchema.FIELDS.CITY_NAME}`)
                    q.innerJoin(`${DirectoryDistrictTableSchema.TABLE_NAME}`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.DISTRICT_ID}`);
                    q.innerJoin(`${DirectoryTalukTableSchema.TABLE_NAME}`,`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_ID}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.CITY_ID}`);
    
                    if(userId != "1"){
                        q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.CREATED_BY}`,userId);
                    } else if(userId != "7") {
                        q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.DISTRICT_ID}`,role.districtId);
                    }
                    q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.IS_DELETED}`,0);
        
                    if (searchobj) {
                        for (let key in searchobj) {
                            if(searchobj[key]!=null && searchobj[key]!=''){
                                console.log(searchobj[key]);
                                let searchval = searchobj[key];
                                let ColumnKey = Utils.changeSearchKey(key);
                                if(key=='schoolName'){
                                    condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key=='districtName'){
                                    condition = `(${DirectoryDistrictTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key == 'cityName') {
                                    condition = `(${DirectoryTalukTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key == 'startedDate'){
                                    condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key == 'principleName') {
                                    condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                }else if(key=='representativeName'){
                                    condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key=='approvalStatus'){
                                    condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key == 'representativePhoneNumber') {
                                    condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key == 'schoolPhoneNumber'){
                                    condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key == 'representativeEmail') {
                                    condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key == 'schoolEmail') {
                                    condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key == 'PIN') {
                                    condition = `(${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.POSTAL_CODE} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key == 'address') {
                                    condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key == 'isActive') {
                                    condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key == 'createdDate') {
                                    condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key == 'updatedDate') {
                                    condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
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
                            if(sortKey=='schoolName'){
                                q.orderBy(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_NAME}`,sortValue);
                            } else if(sortKey=='districtName'){
                                q.orderBy(`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME}`,sortValue);
                            } else if(sortKey == 'cityName') {
                                q.orderBy(`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_NAME}`,sortValue);
                            } else if(sortKey == 'startedDate'){
                                q.orderBy(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.STARTED_DATE}`,sortValue);
                            } else if(sortKey == 'principleName') {
                                q.orderBy(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.PRNICIPLE_NAME}`,sortValue);
                            }else if(sortKey=='representativeName'){
                                q.orderBy(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.REPRESENTATIVE_NAME}`,sortValue);
                            } else if(sortKey=='approvalStatus'){
                                q.orderBy(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.APPROVAL_STATUS}`,sortValue);
                            } else if(sortKey == 'representativePhoneNumber') {
                                q.orderBy(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.REPRESENTATIVE_PHONE_NUMBER}`,sortValue);
                            } else if(sortKey == 'schoolPhoneNumber'){
                                q.orderBy(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_PHONE_NUMBER}`,sortValue);
                            } else if(sortKey == 'representativeEmail') {
                                q.orderBy(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.REPRESENTATIVE_EMAIL}`,sortValue);
                            } else if(sortKey == 'schoolEmail') {
                                q.orderBy(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_EMAIL}`,sortValue);
                            } else if(sortKey == 'PIN') {
                                q.orderBy(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.POSTAL_CODE}`,sortValue);
                            } else if(sortKey == 'address') {
                                q.orderBy(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.ADDRESS}`,sortValue);
                            } else if(sortKey == 'isActive') {
                                q.orderBy(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.IS_ACTIVE}`,sortValue);
                            } else if(sortKey == 'createdDate') {
                                q.orderBy(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.CREATED_DATE}`,sortValue);
                            } else if(sortKey == 'updatedDate') {
                                q.orderBy(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.UPDATED_DATE}`,sortValue);
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
                        let schoolData = SchoolModel.fromDto(obj, ["createdBy","password"])
                        
                       //adminUseData["roleName"] = roles[adminUseData["roleId"]]; 
                        ret.push(schoolData);
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
            return AuthorizationRoleUseCase.findOne( q => {
              q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.USER_ID}`,userId);
              q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.PARENT_ID}`,"7");
            })
        }).then((object) => {
            role=object;
            //return AdminUserUseCase.findById(rid, []); 
            return SchoolUseCase.findOne(q => {
                q.select(`${SchoolTableSchema.TABLE_NAME}.*`,`${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME}`,`${DirectoryTalukTableSchema.FIELDS.CITY_NAME}`)
                q.innerJoin(`${DirectoryDistrictTableSchema.TABLE_NAME}`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.DISTRICT_ID}`);
                q.innerJoin(`${DirectoryTalukTableSchema.TABLE_NAME}`,`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_ID}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.CITY_ID}`);

                if(userId != "1"){
                    q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.CREATED_BY}`,userId);
                } else if(userId != "7") {
                    q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.DISTRICT_ID}`,role.districtId);
                }
                q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.IS_DELETED}`,0);
     
            }) 
        })
        .then((object) => {
            adminuser = object;
            
            if (adminuser == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND,
                    MessageInfo.MI_USER_NOT_EXIST,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            } else {
                let schoolData = SchoolModel.fromDto(adminuser, ["password","createdBy"])
               // adminUseData["roleName"] = roles[adminUseData["roleId"]]; 
                res.json(schoolData);
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
        return SchoolUseCase.destroyById(rid,createdBy);
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
    let schoolRids = [];
    if(rids) {
        schoolRids = JSON.parse(rids);
    }else{
        Utils.responseError(res, new Exception(
            ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND,
            MessageInfo.MI_USER_NOT_EXIST,
            false,
            HttpStatus.BAD_REQUEST
        ));
        
    }
    return Promise.then(() => {
        if(schoolRids!=null) {
            let ret = [];
            schoolRids.forEach(rid => {
                let del = SchoolUseCase.destroyById(rid,createdBy);
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
        data["message"] = MessageInfo.MI_USER_DELETED;
        res.json(data);
    })
    .catch(err => {
        Utils.responseError(res, err);
    });
}


public static createRequest(req: express.Request, res: express.Response): any {
    let session: BearerObject = req[Properties.SESSION];
    let createdBy = parseInt(session.userId);
    let rid = req.params.rid || "";
    return Promise.then(() => {
        return SchoolUseCase.findOne(q => {
        q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.RID}`,rid);
        q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.IS_DELETED}`,0);
        })
    }).then((object) => {
        if(object != null) {
       if(object.attributes.approvalStatus !=1 && object.attributes.approvalStatus != 2){
        if(createdBy == 1){
            let adminUser = {};
            adminUser[SchoolTableSchema.FIELDS.APPROVAL_STATUS] = 1;
            return object.save(adminUser, {patch: true});
            }else {
                Utils.responseError(res, new Exception(
                    ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND,
                    MessageInfo.MI_YOU_ARE_NOT_ALLOWED_EDIT_SCHOOL,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
                }
       }else {
        Utils.responseError(res, new Exception(
            ErrorCode.RESOURCE.NOT_FOUND,
            MessageInfo.MI_SCHOOL_IS_ALREADY_APPROVED,
            false,
            HttpStatus.BAD_REQUEST
        ));
        return Promise.break;
       }     
        } else {
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.NOT_FOUND,
                MessageInfo.MI_SCHOOL_ID_NOT_FOUND,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
        }
    })
    .then((object) => {
     let schoolData=SchoolModel.fromDto(object);
      return SchoolUseCase.createTmpAdmin(object); 
    }).then(() => {
        let data:any={};
          data.message="School is approved and mail is send to school representative";
        res.json(data);
    })
    .catch(err => {
        Utils.responseError(res, err);
    });
}
}

export default SchoolHandler;
