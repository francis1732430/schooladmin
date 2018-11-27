import { WeakDayUseCase }from '../../domains'
import baseHandler, { BaseHandler } from '../base.handler';
import Promise from 'thenfail';
import { WeakDayModel } from '../../models';

import { Utils } from "../../libs/utils";
import { ErrorCode, HttpStatus, MessageInfo, Properties, DefaultVal ,DATE_FORMAT} from "../../libs/constants";
import { Exception, SchoolModel, AdminUserModel} from "../../models";
//mport { DirectoryTalukUseCase } from '../../domains';
import * as express from "express"
import { WeakTableSchema } from '../../data/schemas';
import { Expression } from 'aws-sdk/clients/costexplorer';
import { promises } from 'fs';
import { BearerObject } from "../../libs/jwt";




export class weakHandler extends BaseHandler{
   
    constructor(){
        super();
    }

    public static create_weak(req:express.Request , res:express.Response){

        let weakDay = WeakDayModel.fromRequest(req);

        if(!Utils.requiredCheck(weakDay.weakName)){
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_Weak_Name,
                MessageInfo.MI_WEAKNAME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        return Promise.then(()=>{
            
            return WeakDayUseCase.findOne(q => {
                q.where(`${WeakTableSchema.TABLE_NAME}.${WeakTableSchema.FIELDS.WEAK_NAME}`,weakDay.weakName);
                q.where(`${WeakTableSchema.TABLE_NAME}.${WeakTableSchema.FIELDS.IS_DELETED}`,0);
            })
            
        }).then((object)=>{

            if(object != null){
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.DUPLICATE_RESOURCE,
                    MessageInfo.MI_WEAKNAME_IS_ALREADY_EXISTS,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }

            return WeakDayUseCase.create(weakDay);
           
        }).then(() => {
            let data ={};
            data["message"]="sucessfully created";
            res.json(data);
        }).catch(err =>{
            Utils.responseError(res,err);
        })
    }

    public static update_weak(req:express.Request,res:express.Response){


        let rid = req.params.rid || "";
        let weakDay = WeakDayModel.fromRequest(req);
        if(!Utils.requiredCheck(weakDay.weakName)){
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_Weak_Name,
                MessageInfo.MI_WEAKNAME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        return Promise.then(()=>{
            return WeakDayUseCase.findById(rid);
        }).then((obj)=>{
            if(obj == null){
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.DUPLICATE_RESOURCE,
                    MessageInfo.MI_WEAK_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
            return WeakDayUseCase.findOne(q=>{
                q.where(`${WeakTableSchema.TABLE_NAME}.${WeakTableSchema.FIELDS.WEAK_NAME}`,weakDay.weakName);
                q.whereNot(`${WeakTableSchema.TABLE_NAME}.${WeakTableSchema.FIELDS.RID}`,rid);
                q.where(`${WeakTableSchema.TABLE_NAME}.${WeakTableSchema.FIELDS.IS_DELETED}`,0)
            })
        }).then((obj)=>{
            if (obj != null) {
                Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.DUPLICATE_RESOURCE,
                MessageInfo.MI_WEAKNAME_IS_ALREADY_EXISTS,
                false,
                HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
            
            return WeakDayUseCase.update(rid,weakDay);
        }).then((object)=>{

            console.log('11',object);
            let weak = WeakDayModel.fromDto(object);
           weak["message"] = "updated sucess";
            res.json(weak);
        }).catch(err=>{
            Utils.responseError(res,err)
        });
    }

    public static destory(req:express.Request,res:express.Response){

        let rid = req.params.rid || "";

        return Promise.then(()=>{

            return WeakDayUseCase.findOne(q=>{

                q.where(`${WeakTableSchema.TABLE_NAME}.${WeakTableSchema.FIELDS.RID}`,rid);
                q.where(`${WeakTableSchema.TABLE_NAME}.${WeakTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object)=>{

            console.log('321',object)
            if(object == null){
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_WEAK_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                    ));
                    return Promise.break;
            }
            return WeakDayUseCase.destroy(rid);

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

            return WeakDayUseCase.countByQuery(q=>{
                let condition;
                q.where(`${WeakTableSchema.TABLE_NAME}.${WeakTableSchema.FIELDS.IS_DELETED}`,0);

                if(searchobj){
                    for(let key in searchobj){
                        if(searchobj[key] != null && searchobj[key] != ''){

                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);
                            if(key=='weakId'){
                                condition = `(${WeakTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='weakName'){
                                condition = `(${WeakTableSchema.TABLE_NAME}.${WeakTableSchema.FIELDS.WEAK_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }else if(key == 'isActive') {
                                condition = `(${WeakTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'createdDate') {
                                condition = `(${WeakTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'updatedDate') {
                                condition = `(${WeakTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }
                        }
                    }
                }
            })
        }).then((totalObj)=>{

                total=totalObj;
                return WeakDayUseCase.findByQuery(q=>{

                    q.select(`${WeakTableSchema.TABLE_NAME}.*`);

                    let condition;
                    q.where(`${WeakTableSchema.TABLE_NAME}.${WeakTableSchema.FIELDS.IS_DELETED}`,0);

                    if(searchobj){
                        for(let key in searchobj){
                            if(searchobj[key] != null && searchobj[key] != ''){

                                console.log(searchobj[key]);
                                let searchval = searchobj[key];
                                let ColumnKey = Utils.changeSearchKey(key);
                                if(key=='weakId'){
                                    condition = `(${WeakTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key=='weakName'){
                                    condition = `(${WeakTableSchema.TABLE_NAME}.${WeakTableSchema.FIELDS.WEAK_NAME} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                }else if(key == 'isActive') {
                                    condition = `(${WeakTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key == 'createdDate') {
                                    condition = `(${WeakTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key == 'updatedDate') {
                                    condition = `(${WeakTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
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
                            if (sortKey == 'weakId') {
                                q.orderBy(ColumnSortKey, sortValue);
                            } else if (sortKey == 'weakName') {
                                q.orderBy(`${WeakTableSchema.TABLE_NAME}.${WeakTableSchema.FIELDS.WEAK_NAME}`, sortValue);
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
                    let districtList = WeakDayModel.fromDto(obj,["createdBy","password"]);
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
        let weakId =[];

        if(rids){
            weakId = JSON.parse(rids);
        }else{

            Utils.responseError(res, new Exception(
                ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND,
                MessageInfo.MI_USER_NOT_EXIST,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        return Promise.then(()=>{

            if(weakId != null){
                let data =[];
                weakId.forEach(rid=>{
                    let del = WeakDayUseCase.destroy(rid)
                });
                console.log('data of',data);
                return data;
            }else{
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_WEAK_ID_NOT_FOUND,
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
    public static view_weaks(req:express.Required,res:express.Response){

        let rid = req.params.rid;

        return Promise.then(()=>{

            return WeakDayUseCase.findOne(q=>{

                q.where(`${WeakTableSchema.TABLE_NAME}.${WeakTableSchema.FIELDS.RID}`,rid);
                q.where(`${WeakTableSchema.TABLE_NAME}.${WeakTableSchema.FIELDS.IS_DELETED}`,0);


            })
        }).then((obj)=>{

            console.log('123',obj);

            if(obj == null){
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_WEAK_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));

                return Promise.break;
            }else{


                let weak2 = WeakDayModel.fromDto(obj);
                 res.json(weak2);
            }
        }).catch(err=>{
            Utils.responseError(res, err);
        })

    }

}