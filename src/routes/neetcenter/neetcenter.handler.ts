import { MessageInfo } from '../../libs/constants';
import {NeetCenterUseCase,DirectoryDistrictUseCase,DirectoryTalukUseCase} from "../../domains";
import { ErrorCode, HttpStatus, MessageInfo, Properties, DefaultVal ,DATE_FORMAT} from "../../libs/constants";
import { Utils } from "../../libs/utils";
import {  Mailer } from "../../libs";
import { Exception, NeetCenterModel} from "../../models";
import * as express from "express";
import { Promise } from "thenfail";
import { NeetCenterTableSchema,DirectoryDistrictTableSchema,DirectoryTalukTableSchema} from "../../data/schemas";
import { BaseHandler } from "../base.handler";
import { BearerObject } from "../../libs/jwt";
import * as formidable from "formidable";
import { Uploader } from "../../libs";
let fs = require('fs');  
var dateFormat = require('dateformat');
let knex=require('knex');
export class NeetCenterHandler extends BaseHandler {
    constructor() {
        super();
    }

    public static create(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
        req.body.schoolId=schoolId;
        req.body.createdBy=session.userId;
        let center = NeetCenterModel.fromRequest(req);
        let status = req.body.isActive;
        if (!Utils.requiredCheck(center.centerName)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_CENTER_NAME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(center.districtId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_DISTRICT_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(center.cityId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_CITY_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(center.coordinates)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_COORDINATES_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }


        if (!Utils.requiredCheck(center.representativeName)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_REPRESENTATIVE_NAME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(center.address)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_ADDRESS_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(center.isActive)) {
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
           return DirectoryDistrictUseCase.findOne(q => {
               q.where(`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`,center.districtId);
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
            q.where(`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_ID}`,center.cityId);
            q.where(`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.IS_DELETED}`,0);
        })
        
       }).then((object) => {
        if(object == null) {
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.NOT_FOUND,
                MessageInfo.MI_CITY_NOT_FOUND,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
           }

           return NeetCenterUseCase.create(center);
       }).then((object) => {

        let centerData={}
        centerData["message"] = "Center created successfully";
        res.json(centerData);
    }).catch(err => {
        Utils.responseError(res, err);
      });
    }

    public static update(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
        let rid = req.params.rid || "";
        let center = NeetCenterModel.fromRequest(req);
        let status = req.body.isActive;
        if (!Utils.requiredCheck(center.centerName)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_CENTER_NAME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(center.districtId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_DISTRICT_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(center.cityId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_CITY_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(center.coordinates)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_COORDINATES_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }


        if (!Utils.requiredCheck(center.representativeName)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_REPRESENTATIVE_NAME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(center.address)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_ADDRESS_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(center.isActive)) {
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
            return NeetCenterUseCase.findOne(q => {
                q.where(`${NeetCenterTableSchema.TABLE_NAME}.${NeetCenterTableSchema.FIELDS.RID}`,rid);
                q.where(`${NeetCenterTableSchema.TABLE_NAME}.${NeetCenterTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {

            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_NEET_CENTER_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
            return DirectoryDistrictUseCase.findOne(q => {
                q.where(`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`,center.districtId);
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
             q.where(`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_ID}`,center.cityId);
             q.where(`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.IS_DELETED}`,0);
         })
         
        }).then((object) => {
         if(object == null) {
             Utils.responseError(res, new Exception(
                 ErrorCode.RESOURCE.NOT_FOUND,
                 MessageInfo.MI_CITY_NOT_FOUND,
                 false,
                 HttpStatus.BAD_REQUEST
             ));
             return Promise.break;
            }
         return NeetCenterUseCase.updateById(rid,center);

        }).then((object) => {
           console.log(JSON.parse(object.get('co_ordinates')).lat);
           let lat=JSON.parse(object.get('co_ordinates')).lat;
           let long=JSON.parse(object.get('co_ordinates')).long;
            let centerData=NeetCenterModel.fromDto(object);
            centerData["lat"]=lat;
            centerData["long"]=long;
            delete centerData['coordinates'];
            centerData["message"] = "Center updated successfully";
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
            return NeetCenterUseCase.countByQuery(q => {
                let condition;
             if(session.userId != '1') {
             q.where(`${NeetCenterTableSchema.TABLE_NAME}.${NeetCenterTableSchema.FIELDS.CREATED_BY}`,session.userId);
             } 
             q.innerJoin(`${DirectoryDistrictTableSchema.TABLE_NAME}`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`,`${NeetCenterTableSchema.TABLE_NAME}.${NeetCenterTableSchema.FIELDS.DISTRICT_ID}`);
             q.innerJoin(`${DirectoryTalukTableSchema.TABLE_NAME}`,`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_ID}`,`${NeetCenterTableSchema.TABLE_NAME}.${NeetCenterTableSchema.FIELDS.CITY_ID}`);                    
             q.where(`${NeetCenterTableSchema.TABLE_NAME}.${NeetCenterTableSchema.FIELDS.IS_DELETED}`,0);
               // q.whereRaw(condition);               
                if (searchobj) {
                    for (let key in searchobj) {
                        if(searchobj[key]!=null && searchobj[key]!=''){
                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);
                            if(key=='centerId'){
                                condition = `(${NeetCenterTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='centerName'){
                                condition = `(${NeetCenterTableSchema.TABLE_NAME}.${NeetCenterTableSchema.FIELDS.CENTER_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='districtName'){
                                condition = `(${DirectoryDistrictTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'cityName') {
                                condition = `(${DirectoryTalukTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }else if (key == 'coordinates') {
                                condition = `(${NeetCenterTableSchema.TABLE_NAME}.${NeetCenterTableSchema.FIELDS.CO_ORDINATES} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='mobileNumber'){
                                condition = `(${NeetCenterTableSchema.TABLE_NAME}.${NeetCenterTableSchema.FIELDS.MOBILE_NUMBER} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'representativeName') {
                                condition = `(${NeetCenterTableSchema.TABLE_NAME}.${NeetCenterTableSchema.FIELDS.REPRESENTATIVE_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='address'){
                                condition = `(${NeetCenterTableSchema.TABLE_NAME}.${NeetCenterTableSchema.FIELDS.ADDRESS} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'isActive') {
                                condition = `(${NeetCenterTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'createdDate') {
                                condition = `(${NeetCenterTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'updatedDate') {
                                condition = `(${NeetCenterTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }
                        }
                    }
                }  
            });
        })
            .then((totalObject) => {
                total = totalObject;
                return NeetCenterUseCase.findByQuery(q => {
                   q.select(`${NeetCenterTableSchema.TABLE_NAME}.*`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME} as districtName`,`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_NAME} as cityName`);
                   let condition;
             if(checkuser.roleId != 18) {
             q.where(`${NeetCenterTableSchema.TABLE_NAME}.${NeetCenterTableSchema.FIELDS.CREATED_BY}`,session.userId);
             }                
             q.innerJoin(`${DirectoryDistrictTableSchema.TABLE_NAME}`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`,`${NeetCenterTableSchema.TABLE_NAME}.${NeetCenterTableSchema.FIELDS.DISTRICT_ID}`);
             q.innerJoin(`${DirectoryTalukTableSchema.TABLE_NAME}`,`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_ID}`,`${NeetCenterTableSchema.TABLE_NAME}.${NeetCenterTableSchema.FIELDS.CITY_ID}`);                    
             q.where(`${NeetCenterTableSchema.TABLE_NAME}.${NeetCenterTableSchema.FIELDS.IS_DELETED}`,0);
              //  q.whereRaw(condition);               
              if (searchobj) {
                for (let key in searchobj) {
                    if(searchobj[key]!=null && searchobj[key]!=''){
                        console.log(searchobj[key]);
                        let searchval = searchobj[key];
                        let ColumnKey = Utils.changeSearchKey(key);
                        if(key=='centerId'){
                            condition = `(${NeetCenterTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        } else if(key=='centerName'){
                            condition = `(${NeetCenterTableSchema.TABLE_NAME}.${NeetCenterTableSchema.FIELDS.CENTER_NAME} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        } else if(key=='districtName'){
                            condition = `(${DirectoryDistrictTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        } else if(key == 'cityName') {
                            condition = `(${DirectoryTalukTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        }else if (key == 'coordinates') {
                            condition = `(${NeetCenterTableSchema.TABLE_NAME}.${NeetCenterTableSchema.FIELDS.CO_ORDINATES} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        } else if(key=='mobileNumber'){
                            condition = `(${NeetCenterTableSchema.TABLE_NAME}.${NeetCenterTableSchema.FIELDS.MOBILE_NUMBER} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        } else if (key == 'representativeName') {
                            condition = `(${NeetCenterTableSchema.TABLE_NAME}.${NeetCenterTableSchema.FIELDS.REPRESENTATIVE_NAME} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        } else if(key=='address'){
                            condition = `(${NeetCenterTableSchema.TABLE_NAME}.${NeetCenterTableSchema.FIELDS.ADDRESS} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        } else if(key == 'isActive') {
                            condition = `(${NeetCenterTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        } else if(key == 'createdDate') {
                            condition = `(${NeetCenterTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        } else if(key == 'updatedDate') {
                            condition = `(${NeetCenterTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
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
                            if (sortKey == 'centerId') {
                                q.orderBy(ColumnSortKey, sortValue);
                            } else if (sortKey == 'centerName') {
                                q.orderBy(`${NeetCenterTableSchema.TABLE_NAME}.${NeetCenterTableSchema.FIELDS.CENTER_NAME}`, sortValue);
                            } else if(sortKey=='districtName'){
                                q.orderBy(`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME}`,sortValue);
                            } else if(sortKey == 'cityName') {
                                q.orderBy(`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_NAME}`,sortValue);
                            } else if (sortKey == 'coordinates') {
                                q.orderBy(`${NeetCenterTableSchema.TABLE_NAME}.${NeetCenterTableSchema.FIELDS.CO_ORDINATES}`, sortValue);
                            } else if (sortKey == 'mobileNumber') {
                                q.orderBy(`${NeetCenterTableSchema.TABLE_NAME}.${NeetCenterTableSchema.FIELDS.MOBILE_NUMBER}`, sortValue);
                            } else if (sortKey == 'representativeName') {
                                q.orderBy(`${NeetCenterTableSchema.TABLE_NAME}.${NeetCenterTableSchema.FIELDS.REPRESENTATIVE_NAME}`, sortValue);
                            } else if (sortKey == 'address') {
                                q.orderBy(`${NeetCenterTableSchema.TABLE_NAME}.${NeetCenterTableSchema.FIELDS.ADDRESS}`, sortValue);
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
                        let centerData = NeetCenterModel.fromDto(obj, ["createdBy","password"]); 
                        let lat=JSON.parse(obj.get('co_ordinates')).lat;
                        let long=JSON.parse(obj.get('co_ordinates')).long;
                        centerData["districtName"]=object.get("districtName");
                        centerData["cityName"]=object.get("cityName");
                        centerData["lat"]=lat;
                        centerData["long"]=long;
                        delete centerData['coordinates'];
                        ret.push(centerData);
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
            return NeetCenterUseCase.findOne( q => {
                q.select(`${NeetCenterTableSchema.TABLE_NAME}.*`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME} as districtName`,`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_NAME} as cityName`);
                q.where(`${NeetCenterTableSchema.TABLE_NAME}.${NeetCenterTableSchema.FIELDS.RID}`,rid);
                q.where(`${NeetCenterTableSchema.TABLE_NAME}.${NeetCenterTableSchema.FIELDS.IS_DELETED}`,0);
            }) 
        })
        .then((object) => {
            adminuser = object;
            
            if (adminuser == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_NEET_CENTER_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            } else {
                let neetCenterData = NeetCenterModel.fromDto(adminuser, ["password","createdBy"]);
                let lat=JSON.parse(object.get('co_ordinates')).lat;
                        let long=JSON.parse(object.get('co_ordinates')).long;
                        neetCenterData["lat"]=lat;
                        neetCenterData["long"]=long;
                        neetCenterData["districtName"]=object.get("districtName");
                        neetCenterData["cityName"]=object.get("cityName");
                        delete neetCenterData['coordinates'];
                res.json(neetCenterData);
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
        return NeetCenterUseCase.destroyById(rid,createdBy);
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
    let centerRids = [];
    if(rids) {
        centerRids = JSON.parse(rids);
    }else{
        Utils.responseError(res, new Exception(
            ErrorCode.RESOURCE.NOT_FOUND,
            MessageInfo.MI_NEET_CENTER_ID_NOT_FOUND,
            false,
            HttpStatus.BAD_REQUEST
        ));
        
    }
    return Promise.then(() => {
        if(centerRids!=null) {
            let ret = [];
            centerRids.forEach(rid => {
                let del = NeetCenterUseCase.destroyById(rid,createdBy);
            });
            console.log(ret);
            return ret;
        } else {
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.NOT_FOUND,
                MessageInfo.MI_NEET_CENTER_ID_NOT_FOUND,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
        }
    })
    .then((result) => {
        let data ={};
        data["message"] = 'Neet center deleted successfully';
        res.json(data);
    })
    .catch(err => {
        Utils.responseError(res, err);
    });
}

}

export default NeetCenterHandler;
