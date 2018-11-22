import { DirectoryTalukUseCase , DirectoryDistrictUseCase }from '../../domains';
import { BaseHandler }from '../base.handler';
import Promise from 'thenfail';
import { DirectoryTalukModel }from '../../models';


import { Utils } from "../../libs/utils";
import { ErrorCode, HttpStatus, MessageInfo, Properties, DefaultVal ,DATE_FORMAT} from "../../libs/constants";
import { Exception, SchoolModel, AdminUserModel} from "../../models";

import * as express from "express"
import { DirectoryTalukTableSchema ,DirectoryDistrictTableSchema } from '../../data/schemas';

import { Expression } from 'aws-sdk/clients/costexplorer';
import { promises } from 'fs';
import { BearerObject } from "../../libs/jwt";




export class District_taluka extends BaseHandler{

    constructor(){
        super();
    }

    public static taluka_create(req:express.Request ,res:express.Response){

        let taluka = DirectoryTalukModel.fromRequest(req);
        let districtId = req.body.districtId;

        if(!Utils.requiredCheck(taluka.cityName)){
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_Districts_Name,
                MessageInfo.MI_CITY_ID_NOT_FOUND,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        return Promise.then(()=>{
            return DirectoryDistrictUseCase.findById(districtId);
            
        }).then((object)=>{

            if(object == null){

                return Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.INVALID_Districts_Name,
                    MessageInfo.MI_DISTRICT_IS_NOTVALID,
                    false,
                    HttpStatus.BAD_REQUEST
                ));  
            }
            return Promise.break;
           
           
        }).then((obj)=>{

            console.log(obj)
             let data ={};
            data["message"]="sucessfully created";
            res.json(data);

        }).catch(err =>{
            Utils.responseError(res,err);
        })
    }


    public static district_taluka_update(req:express.Request,res:express.Response){


        let rid = req.params.rid || "";
        let taluka = DirectoryTalukModel.fromRequest(req);
        if(!Utils.requiredCheck(taluka.cityName)){
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_Weak_Name,
                MessageInfo.MI_WEAKNAME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        return Promise.then(()=>{
            return DirectoryTalukUseCase.findById(rid);
        }).then((obj)=>{
            if(obj == null){
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.DUPLICATE_RESOURCE,
                    MessageInfo.MI_WEAKNAME_IS_NOT,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
            return DirectoryTalukUseCase.findOne(q=>{
                q.where(`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_NAME}`,taluka.cityName);
                q.whereNot(`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.RID}`,rid);
                q.where(`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.IS_DELETED}`,0)
            })
        }).then((obj)=>{
            if (obj != null) {
                Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_Districts_Name,
                MessageInfo.MI_DISTRICT_NOT_FOUND,
                false,
                HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
            
            return DirectoryTalukUseCase.update(rid,taluka);
        }).then((object)=>{

            console.log('11',object);
            let weak = DirectoryTalukModel.fromDto(object);
           weak["message"] = "updated sucess";
            res.json(weak);
        }).catch(err=>{
            Utils.responseError(res,err)
        });
    }


    public static destory(req:express.Request,res:express.Response){

        let rid = req.params.rid || "";

        return Promise.then(()=>{

            return DirectoryTalukUseCase.findOne(q=>{

                q.where(`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.RID}`,rid);
                q.where(`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.IS_DELETED}`,0);
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
            return DirectoryTalukUseCase.destroy(rid);

        }).then((obj)=>{

            console.log('222',obj);
            //res.status(MessageInfo.MI_USER_NOT_EXIST)
            res.json(HttpStatus.NO_CONTENT);

        }).catch(err=>{
            Utils.responseError(res,err);
        })
    }


    public static list(req:express.Request,res:express.Response){

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

            return DirectoryTalukUseCase.countByQuery(q=>{
                let condition;
                q.where(`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.IS_DELETED}`,0);

                if(searchobj){
                    for(let key in searchobj){
                        if(searchobj[key] != null && searchobj[key] != ''){

                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);
                            if(key=='weakId'){
                                condition = `(${DirectoryTalukTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='weakName'){
                                condition = `(${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }else if(key == 'isActive') {
                                condition = `(${DirectoryTalukTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'createdDate') {
                                condition = `(${DirectoryTalukTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'updatedDate') {
                                condition = `(${DirectoryTalukTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }
                        }
                    }
                }
            })
        }).then((totalObj)=>{

                total=totalObj;
                return DirectoryTalukUseCase.findByQuery(q=>{

                    q.select(`${DirectoryTalukTableSchema.TABLE_NAME}.*`);

                    let condition;
                    q.where(`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.IS_DELETED}`,0);

                    if(searchobj){
                        for(let key in searchobj){
                            if(searchobj[key] != null && searchobj[key] != ''){

                                console.log(searchobj[key]);
                                let searchval = searchobj[key];
                                let ColumnKey = Utils.changeSearchKey(key);
                                if(key=='weakId'){
                                    condition = `(${DirectoryTalukTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key=='weakName'){
                                    condition = `(${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_NAME} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                }else if(key == 'isActive') {
                                    condition = `(${DirectoryTalukTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key == 'createdDate') {
                                    condition = `(${DirectoryTalukTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key == 'updatedDate') {
                                    condition = `(${DirectoryTalukTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
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
                                q.orderBy(`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.CITY_NAME}`, sortValue);
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
                    let districtList = DirectoryTalukModel.fromDto(obj,["createdBy","password"]);
                    data.push(districtList);
                })
            }
            res.json(data)
        }).catch(err=>{
            Utils.responseError(res, err);
        })
    }


    public static massdelete(req:express.Request,res:express.Response){

        let rids = req.body.rids || "";
        let DistrictId =[];

        if(rids){
            DistrictId = JSON.parse(rids);
        }else{

            Utils.responseError(res, new Exception(
                ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND,
                MessageInfo.MI_USER_NOT_EXIST,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        return Promise.then(()=>{

            if(DistrictId != null){
                let data =[]; 
                DistrictId.forEach(rid=>{
                    let del = DirectoryTalukUseCase.destroy(rid)
                });
                console.log('data of',data);
                return data;
            }else{
                Utils.responseError(res, new Exception(
                    ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND,
                    MessageInfo.MI_USER_NOT_EXIST,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
        }).then((obg)=>{
            console.log('rest of',obg)
            let data1={};
            data1["message"]="success deleted";
            res.json(data1);
        }).catch(err=>{
            Utils.responseError(res, err);
        })
    }

    public static view_district_taluka(req:express.Required,res:express.Response){

        let rid = req.params.rid;

        return Promise.then(()=>{

            return DirectoryTalukUseCase.findOne(q=>{

                q.where(`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.RID}`,rid);
                q.where(`${DirectoryTalukTableSchema.TABLE_NAME}.${DirectoryTalukTableSchema.FIELDS.IS_DELETED}`,0);


            })
        }).then((obj)=>{

            console.log('123',obj);

            if(obj == null){
                Utils.responseError(res, new Exception(
                    ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND,
                    MessageInfo.MI_USER_NOT_EXIST,
                    false,
                    HttpStatus.BAD_REQUEST
                ));

                return Promise.break;
            }else{


                let weak2 = DirectoryTalukModel.fromDto(obj);
                 res.json(weak2);
            }
        }).catch(err=>{
            Utils.responseError(res, err);
        })

    }
}