
import { DirectoryDistrictUseCase }from '../../domains'
import { BaseHandler } from '../base.handler';
import Promise from 'thenfail';
import { DirectoryDistrictModel } from '../../models';

import { Utils } from "../../libs/utils";
import { ErrorCode, HttpStatus, MessageInfo, Properties, DefaultVal ,DATE_FORMAT} from "../../libs/constants";
import { Exception, SchoolModel, AdminUserModel} from "../../models";
//mport { DirectoryTalukUseCase } from '../../domains';
import * as express from "express"
import { DirectoryDistrictTableSchema } from '../../data/schemas';
import { Expression } from 'aws-sdk/clients/costexplorer';
import { promises } from 'fs';
import { BearerObject } from "../../libs/jwt";

export class DistrictsHandler extends BaseHandler {

    constructor(){
        super();
    }

    public static districtcreate (req:express.Request , res:express.Response):any {
        let session: BearerObject = req[Properties.SESSION];
        req.body.createdBy=session.userId;
        let district = DirectoryDistrictModel.fromRequest(req); 

        if(!Utils.requiredCheck(district.districtName)){
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_Districts_Name,
                MessageInfo.MI_DISTRICT_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        
        return Promise.then(() => {
            return DirectoryDistrictUseCase.findOne( q => {
                q.where(`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME}`,district.districtName);
                //q.whereNot(`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.RID}`,rid);              
                q.where(`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object)=>{
            if(object != null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.DUPLICATE_RESOURCE,
                    MessageInfo.MI_DISTRICT_ALREADY_EXISTS,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
            return DirectoryDistrictUseCase.create(district)
        }).then((obt)=>{
            let data1={};
            data1["message"] = "districts sucessfully";
            res.json(data1);
        }).catch(err =>{
            Utils.responseError(res,err);
        })
    }

    public static district_update(req:express.Request , res:express.Response):any{

        let rid = req.params.rid || "";
        let session: BearerObject = req[Properties.SESSION];
        let district = DirectoryDistrictModel.fromRequest(req); 
        if(!Utils.requiredCheck(district.districtName)){
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_Districts_Name,
                MessageInfo.MI_DISTRICT_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        return Promise.then(()=>{

            return DirectoryDistrictUseCase.findById(rid)
           
        })
        .then((Object)=>{
            if(Object == null){
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.INVALID_Districts_id,
                    MessageInfo.MI_DISTRICT_NOT_FOUND,
                    false, 
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
             return DirectoryDistrictUseCase.findOne(q=>{
                q.where(`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME}`,district.districtName);
              q.whereNot(`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.RID}`,rid);
              q.where(`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.IS_DELETED}`,0)
            })
            
        }).then((Object)=>{
            if (Object != null) {
                Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_Districts_Name,
                MessageInfo.MI_DISTRICT_ALREADY_EXISTS,
                false,
                HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            } 
            return DirectoryDistrictUseCase.update(rid,district)
        })
        .then((object)=>{ 
            console.log('11',object);
            let district = DirectoryDistrictModel.fromDto(object);
           district["message"] = "district updated"
            res.json(district);
        }).catch(err=>{
            Utils.responseError(res,err)
        });

    }

    public static destory(req :express.Request , res:express.Response): any{

        let rid = req.params.rid || "";
        let session: BearerObject = req[Properties.SESSION];
        return Promise.then(()=>{
            return DirectoryDistrictUseCase.findOne(q=>{
                q.where(`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.RID}`,rid);
                q.where(`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object)=>{
            console.log('321',object)
            if(object == null){
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.INVALID_Districts_Name,
                    MessageInfo.MI_DISTRICT_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                    ));
                    return Promise.break;
            }
            return DirectoryDistrictUseCase.destroy(rid);
        }).then((obj)=>{
            console.log('222',obj);
            //res.status(MessageInfo.MI_USER_NOT_EXIST)
            res.json({});
        }).catch(err=>{
            Utils.responseError(res,err);
        })
    }

    public static list(req:express.Request, res:express.Response){

        let session: BearerObject = req[Properties.SESSION];
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
        let total = 0;
        return Promise.then(()=>{
            return DirectoryDistrictUseCase.countByQuery(q=>{
                let condition;
               // q.where(`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`);
                q.where(`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.IS_DELETED}`,0);
                //q.whereRaw(condition);
                if (searchobj) {
                    for (let key in searchobj) {
                        if(searchobj[key]!=null && searchobj[key]!=''){
                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);
                            if(key=='districtId'){
                                condition = `(${DirectoryDistrictTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='districtName'){
                                condition = `(${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }else if(key == 'isActive') {
                                condition = `(${DirectoryDistrictTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'createdDate') {
                                condition = `(${DirectoryDistrictTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'updatedDate') {
                                condition = `(${DirectoryDistrictTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }
                        }
                    }
                } 
            })
        }).then((totalObj)=>{
            total = totalObj;
            return DirectoryDistrictUseCase.findByQuery(q=>{
                q.select(`${DirectoryDistrictTableSchema.TABLE_NAME}.*`);
                let condition;
                //q.select(`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`);
                q.where(`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.IS_DELETED}`,0);
                //q.whereRaw(condition);
                if (searchobj) {
                    for (let key in searchobj) {
                        if(searchobj[key]!=null && searchobj[key]!=''){
                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);
                            if(key=='districtId'){
                                condition = `(${DirectoryDistrictTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='districtName'){
                                condition = `(${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }else if(key == 'isActive') {
                                condition = `(${DirectoryDistrictTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'createdDate') {
                                condition = `(${DirectoryDistrictTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'updatedDate') {
                                condition = `(${DirectoryDistrictTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }
                        }
                    }
                }

                if(offset != null){
                    q.offset(offset)
                }
                if(limit != null){
                    q.limit(limit);
                }

                if (sortKey != null && sortValue != '') {
                    if (sortKey != null && (sortValue == 'ASC' || sortValue == 'DESC' || sortValue == 'asc' || sortValue == 'desc')) {
                        let ColumnSortKey = Utils.changeSearchKey(sortKey);
                        if (sortKey == 'districtId') {
                            q.orderBy(ColumnSortKey, sortValue);
                        } else if (sortKey == 'districtName') {
                            q.orderBy(`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME}`, sortValue);
                        } else if (sortKey == 'isActive') {
                            q.orderBy(ColumnSortKey, sortValue);
                        } else if (sortKey == 'createdDate') {
                            q.orderBy(ColumnSortKey, sortValue);
                        } else if (sortKey == 'updatedDate') {
                            q.orderBy(ColumnSortKey, sortValue);
                        }
                    }
                }
            },[]);
        }).then((object)=>{
            let data = [];
            if(object != null && object.models != null){
                object.models.forEach(obj=>{
                    let districtList = DirectoryDistrictModel.fromDto(obj,["createdBy","password"]);
                    data.push(districtList);
                })
            }
            res.json(data)
        }).catch(err=>{
            Utils.responseError(res, err);
        })
        
    }
    public static massdelete(req:express.Request, res:express.Response){
        let session: BearerObject = req[Properties.SESSION];
        let rids = req.body.rids || "";
        let districtId = [];
        if(rids){
            districtId = JSON.parse(rids);
        }else{
            Utils.responseError(res, new Exception(
                ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND,
                MessageInfo.MI_USER_NOT_EXIST,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        return Promise.then(()=>{
            if(districtId != null){
                let data =[];
                districtId.forEach(rid=>{
                    let del = DirectoryDistrictUseCase.destroy(rid)
                });
                console.log('data of',data);
                return data;
            }else{
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.REQUIRED_ERROR,
                    MessageInfo.MI_DISTRICT_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
        }).then((rest)=>{
            console.log('rest of',rest)
            let data1={};
            data1["message"]="success deleted";
            res.json(data1);
        }).catch(err=>{
            Utils.responseError(res, err);
        })
    }

    public static view(req:express.Request,res:express.Response){

        let rid = req.params.rid;
        let session: BearerObject = req[Properties.SESSION];
        return Promise.then(()=>{
            return DirectoryDistrictUseCase.findOne(q=>{

                q.where(`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.RID}`,rid);
                q.where(`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.IS_DELETED}`,0);

            })
            
        }).then((object)=>{
                console.log('obj',object);
            if(object == null){
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.REQUIRED_ERROR,
                    MessageInfo.MI_DISTRICT_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));

                return Promise.break;
            }else{

                let district2 = DirectoryDistrictModel.fromDto(object);
                 res.json(district2);
            }

            
        }).catch(err=>{
            Utils.responseError(res, err);
        })
    }
}