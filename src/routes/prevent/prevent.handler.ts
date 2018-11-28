import { PreventUseCase }from '../../domains'
import baseHandler, { BaseHandler } from '../base.handler';
import Promise from 'thenfail';
import { PreventModel } from '../../models';

import { Utils } from "../../libs/utils";
import { ErrorCode, HttpStatus, MessageInfo, Properties, DefaultVal ,DATE_FORMAT} from "../../libs/constants";
import { Exception, SchoolModel, AdminUserModel} from "../../models";
//mport { DirectoryTalukUseCase } from '../../domains';
import * as express from "express"
import { PreventionsTableSchemas } from '../../data/schemas';
import { Expression } from 'aws-sdk/clients/costexplorer';
import { promises } from 'fs';
import { BearerObject } from "../../libs/jwt";


export class preventHandler extends BaseHandler {

    constructor(){
        super();
    }

    public static prevent_create(req:express.Request ,res:express){
        
        let session: BearerObject = req[Properties.SESSION];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
        req.body.schoolId=schoolId;
        req.body.createdBy=session.userId;
        let prevent = PreventModel.fromRequest(req);

        let status = req.body.is_active;

        if(!Utils.requiredCheck(prevent.preventTitle)){
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_PREVENT_TITLE_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        return Promise.then(()=>{
           
            return PreventUseCase.create(prevent);

        }).then((object)=>{
  
            let data ={};
            data["message"]="sucessfully created";
            res.json(data);
        }).catch(err =>{
            Utils.responseError(res,err);
        })
    }

    public static update(req:express.Request ,res:express){
        
        let rid=req.params.rid || '';
        let session: BearerObject = req[Properties.SESSION];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
        let prevent = PreventModel.fromRequest(req);

        let status = req.body.is_active;
         console.log(schoolId,prevent);
        if(!Utils.requiredCheck(prevent.preventTitle)){
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_PREVENT_TITLE_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        return Promise.then(() => {

            return PreventUseCase.findOne( q => {
                q.where(`${PreventionsTableSchemas.TABLE_NAME}.${PreventionsTableSchemas.FIELDS.RID}`,rid);
                q.where(`${PreventionsTableSchemas.TABLE_NAME}.${PreventionsTableSchemas.FIELDS.IS_DELETED}`,0);
                //q.where(`${PreventionsTableSchemas.TABLE_NAME}.${PreventionsTableSchemas.FIELDS.SCHOOL_ID}`,schoolId);
            })
        }).then((object)=>{
            if(object == null) {
                 Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.REQUIRED_ERROR,
                    MessageInfo.MI_PREVENT_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));

                return Promise.break;
            }
            return PreventUseCase.update(rid,prevent);

        }).then((object)=>{
  
            // let data ={};
            let data = PreventModel.fromDto(object);
            data["message"]="sucessfully updated";
            res.json(data);
        }).catch(err =>{
            Utils.responseError(res,err);
        })
    }


    public static list(req:express.Request,res:express.Response){
        let session: BearerObject = req[Properties.SESSION];
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
        let total = 0;
        return Promise.then(()=>{

            return PreventUseCase.countByQuery(q=>{
                let condition;
                q.where(`${PreventionsTableSchemas.TABLE_NAME}.${PreventionsTableSchemas.FIELDS.IS_DELETED}`,0);
                q.where(`${PreventionsTableSchemas.TABLE_NAME}.${PreventionsTableSchemas.FIELDS.SCHOOL_ID}`,schoolId);
                if(searchobj){
                    for(let key in searchobj){
                        if(searchobj[key] != null && searchobj[key] != ''){

                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);

                            if(key=='preventionId'){
                                condition = `(${PreventionsTableSchemas.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='preventTitle'){
                                condition = `(${PreventionsTableSchemas.TABLE_NAME}.${PreventionsTableSchemas.FIELDS.PREVENTIONS_TITLE} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='command'){
                                condition = `(${PreventionsTableSchemas.TABLE_NAME}.${PreventionsTableSchemas.FIELDS.PREVENTIONS_COMMAND} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='imageUrl'){
                                condition = `(${PreventionsTableSchemas.TABLE_NAME}.${PreventionsTableSchemas.FIELDS.IMAGES} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'isActive') {
                                condition = `(${PreventionsTableSchemas.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'createdDate') {
                                condition = `(${PreventionsTableSchemas.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'updatedDate') {
                                condition = `(${PreventionsTableSchemas.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }
                        }
                    }
                }
            })
        }).then((totalObj)=>{

                total=totalObj;
                return PreventUseCase.findByQuery(q=>{

                    q.select(`${PreventionsTableSchemas.TABLE_NAME}.*`);

                    let condition;
                    q.where(`${PreventionsTableSchemas.TABLE_NAME}.${PreventionsTableSchemas.FIELDS.IS_DELETED}`,0);
                q.where(`${PreventionsTableSchemas.TABLE_NAME}.${PreventionsTableSchemas.FIELDS.SCHOOL_ID}`,schoolId);
                if(searchobj){
                    for(let key in searchobj){
                        if(searchobj[key] != null && searchobj[key] != ''){

                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);

                            if(key=='preventionId'){
                                condition = `(${PreventionsTableSchemas.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='preventTitle'){
                                condition = `(${PreventionsTableSchemas.TABLE_NAME}.${PreventionsTableSchemas.FIELDS.PREVENTIONS_TITLE} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='command'){
                                condition = `(${PreventionsTableSchemas.TABLE_NAME}.${PreventionsTableSchemas.FIELDS.PREVENTIONS_COMMAND} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='imageUrl'){
                                condition = `(${PreventionsTableSchemas.TABLE_NAME}.${PreventionsTableSchemas.FIELDS.IMAGES} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'isActive') {
                                condition = `(${PreventionsTableSchemas.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'createdDate') {
                                condition = `(${PreventionsTableSchemas.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'updatedDate') {
                                condition = `(${PreventionsTableSchemas.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
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
                            if (sortKey == 'preventionId') {
                                q.orderBy(ColumnSortKey, sortValue);
                            } else if (sortKey == 'preventionTitle') {
                                q.orderBy(`${PreventionsTableSchemas.TABLE_NAME}.${PreventionsTableSchemas.FIELDS.PREVENTIONS_TITLE}`, sortValue);
                            } else if (sortKey == 'command') {
                                q.orderBy(`${PreventionsTableSchemas.TABLE_NAME}.${PreventionsTableSchemas.FIELDS.PREVENTIONS_COMMAND}`, sortValue);
                            } else if (sortKey == 'imageUrl') {
                                q.orderBy(`${PreventionsTableSchemas.TABLE_NAME}.${PreventionsTableSchemas.FIELDS.IMAGES}`, sortValue);
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
                    let preventionList = PreventModel.fromDto(obj,["createdBy","password"]);
                    data.push(preventionList);
                })
            }
            res.json(data);
        }).catch(err=>{
            Utils.responseError(res, err);
        })
    }

    public static view(req:express.Required,res:express.Response){
        let session: BearerObject = req[Properties.SESSION];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
        let rid = req.params.rid;

        return Promise.then(()=>{

            return PreventUseCase.findOne(q=>{

                q.where(`${PreventionsTableSchemas.TABLE_NAME}.${PreventionsTableSchemas.FIELDS.RID}`,rid);
                q.where(`${PreventionsTableSchemas.TABLE_NAME}.${PreventionsTableSchemas.FIELDS.IS_DELETED}`,0);


            })
        }).then((obj)=>{

            console.log('123',obj);

            if(obj == null){
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_PREVENT_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));

                return Promise.break;
            }else{


                let prevent = PreventModel.fromDto(obj);
                 res.json(prevent);
            }
        }).catch(err=>{
            Utils.responseError(res, err);
        })

    }


    public static destory(req:express.Request,res:express.Response){
        let session: BearerObject = req[Properties.SESSION];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
        let rid = req.params.rid || "";

        return Promise.then(()=>{

            return PreventUseCase.findOne(q=>{

                q.where(`${PreventionsTableSchemas.TABLE_NAME}.${PreventionsTableSchemas.FIELDS.RID}`,rid);
                q.where(`${PreventionsTableSchemas.TABLE_NAME}.${PreventionsTableSchemas.FIELDS.IS_DELETED}`,0);
            })
        }).then((object)=>{

            console.log('321',object)
            if(object == null){
                Utils.responseError(res, new Exception(

                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_PREVENT_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                    ));
                    return Promise.break;
            }
            return PreventUseCase.destroy(rid);

        }).then((obj)=>{

            console.log('222',obj);
            //res.status(MessageInfo.MI_USER_NOT_EXIST)
            res.json({});

        }).catch(err=>{
            Utils.responseError(res,err);
        })
    }


    public static massdelete(req:express.Request,res:express.Response){
        let session: BearerObject = req[Properties.SESSION];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
        let rids = req.body.rids || "";
        let preventId =[];

        if(rids){
            preventId = JSON.parse(rids);
        }else{

            Utils.responseError(res, new Exception(
                ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND,
                MessageInfo.MI_USER_NOT_EXIST,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        return Promise.then(()=>{

            if(preventId != null){
                let data =[]; 
                preventId.forEach(rid=>{
                    let del = PreventUseCase.destroy(rid)
                });
                console.log('data of',data);
                return data;
            }else{
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_PREVENT_ID_NOT_FOUND,
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
}


