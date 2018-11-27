import { TimingDayUseCase }from '../../domains'
import baseHandler, { BaseHandler } from '../base.handler';
import Promise from 'thenfail';
import { TimingModel } from '../../models';

import { Utils } from "../../libs/utils";
import { ErrorCode, HttpStatus, MessageInfo, Properties, DefaultVal ,DATE_FORMAT} from "../../libs/constants";
import { Exception, SchoolModel, AdminUserModel} from "../../models";
//mport { DirectoryTalukUseCase } from '../../domains';
import * as express from "express"
import { TimingTableSchema } from '../../data/schemas';
import { Expression } from 'aws-sdk/clients/costexplorer';
import { promises } from 'fs';
import { BearerObject } from "../../libs/jwt";



export class TimeHabdler extends BaseHandler{

    constructor(){
        super();
    }


    public static create_time(req:express.Request , res:express.Response){

        let timeDay = TimingModel.fromRequest(req);

        if(!Utils.requiredCheck(timeDay.Time)){
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_TIME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        return Promise.then(()=>{
            return TimingDayUseCase.create(timeDay);
            
        }).then((object)=>{
            let data ={};
            data["message"]="sucessfully created";
            res.json(data);
           
        }).catch(err =>{
            Utils.responseError(res,err);
        })
    }

    public static update_time(req:express.Request,res:express.Response){


        let rid = req.params.rid || "";
        let timeDay = TimingModel.fromRequest(req);
        if(!Utils.requiredCheck(timeDay.Time)){
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_Weak_Name,
                MessageInfo.MI_WEAKNAME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        return Promise.then(()=>{
            return TimingDayUseCase.findById(rid);
        }).then((obj)=>{
            if(obj == null){
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.DUPLICATE_RESOURCE,
                    MessageInfo.MI_TIME_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
              
            return TimingDayUseCase.update(rid,timeDay);
        }).then((object)=>{

            console.log('11',object);
            let weak = TimingModel.fromDto(object);
           weak["message"] = "updated sucess";
            res.json(weak);
        }).catch(err=>{
            Utils.responseError(res,err)
        });
    }

    public static destory(req:express.Request,res:express.Response){

        let rid = req.params.rid || "";

        return Promise.then(()=>{

            return TimingDayUseCase.findOne(q=>{

                q.where(`${TimingTableSchema.TABLE_NAME}.${TimingTableSchema.FIELDS.RID}`,rid);
                q.where(`${TimingTableSchema.TABLE_NAME}.${TimingTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object)=>{

            console.log('321',object)
            if(object == null){
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_TIME_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                    ));
                    return Promise.break;
            }
            return TimingDayUseCase.destroy(rid);

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

            return TimingDayUseCase.countByQuery(q=>{
                let condition;
                q.where(`${TimingTableSchema.TABLE_NAME}.${TimingTableSchema.FIELDS.IS_DELETED}`,0);

                if(searchobj){
                    for(let key in searchobj){
                        if(searchobj[key] != null && searchobj[key] != ''){

                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);
                            if(key=='id'){
                                condition = `(${TimingTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='time'){
                                condition = `(${TimingTableSchema.TABLE_NAME}.${TimingTableSchema.FIELDS.TIME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='noon'){
                                condition = `(${TimingTableSchema.TABLE_NAME}.${TimingTableSchema.FIELDS.NOON} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'isActive') {
                                condition = `(${TimingTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'createdDate') {
                                condition = `(${TimingTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'updatedDate') {
                                condition = `(${TimingTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }
                        }
                    }
                }
            })
        }).then((totalObj)=>{

                total=totalObj;
                return TimingDayUseCase.findByQuery(q=>{

                    q.select(`${TimingTableSchema.TABLE_NAME}.*`);

                    let condition;
                    q.where(`${TimingTableSchema.TABLE_NAME}.${TimingTableSchema.FIELDS.IS_DELETED}`,0);

                    if(searchobj){
                        for(let key in searchobj){
                            if(searchobj[key] != null && searchobj[key] != ''){
    
                                console.log(searchobj[key]);
                                let searchval = searchobj[key];
                                let ColumnKey = Utils.changeSearchKey(key);
                                if(key=='id'){
                                    condition = `(${TimingTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key=='time'){
                                    condition = `(${TimingTableSchema.TABLE_NAME}.${TimingTableSchema.FIELDS.TIME} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key=='noon'){
                                    condition = `(${TimingTableSchema.TABLE_NAME}.${TimingTableSchema.FIELDS.NOON} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key == 'isActive') {
                                    condition = `(${TimingTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key == 'createdDate') {
                                    condition = `(${TimingTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key == 'updatedDate') {
                                    condition = `(${TimingTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
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
                            if (sortKey == 'id') {
                                q.orderBy(ColumnSortKey, sortValue);
                            } else if (sortKey == 'time') {
                                q.orderBy(`${TimingTableSchema.TABLE_NAME}.${TimingTableSchema.FIELDS.TIME}`, sortValue);
                            } else if (sortKey == 'noon') {
                                q.orderBy(`${TimingTableSchema.TABLE_NAME}.${TimingTableSchema.FIELDS.NOON}`, sortValue);
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
                    let districtList = TimingModel.fromDto(obj,["createdBy","password"]);
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
        let TimeId =[];

        if(rids){
            TimeId = JSON.parse(rids);
        }else{

            Utils.responseError(res, new Exception(
                ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND,
                MessageInfo.MI_USER_NOT_EXIST,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        return Promise.then(()=>{

            if(TimeId != null){
                let data =[]; 
                TimeId.forEach(rid=>{
                    let del = TimingDayUseCase.destroy(rid)
                });
                console.log('data of',data);
                return data;
            }else{
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_TIME_ID_NOT_FOUND,
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

    public static view_times(req:express.Required,res:express.Response){

        let rid = req.params.rid;

        return Promise.then(()=>{

            return TimingDayUseCase.findOne(q=>{

                q.where(`${TimingTableSchema.TABLE_NAME}.${TimingTableSchema.FIELDS.RID}`,rid);
                q.where(`${TimingTableSchema.TABLE_NAME}.${TimingTableSchema.FIELDS.IS_DELETED}`,0);


            })
        }).then((obj)=>{

            console.log('123',obj);

            if(obj == null){
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_TIME_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));

                return Promise.break;
            }else{


                let weak2 = TimingModel.fromDto(obj);
                 res.json(weak2);
            }
        }).catch(err=>{
            Utils.responseError(res, err);
        })

    }


}