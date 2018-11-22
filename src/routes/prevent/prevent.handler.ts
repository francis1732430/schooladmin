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
        
        let session:BearerObject = req[Properties.SESSION];
        let preventions_id :BearerObject = req[Properties.PREVENT_ID];
        req.body.preventions_id = preventions_id;
        //req.body.createdBy = session.userId;
        let prevent = PreventModel.fromRequest(req);

        let status = req.body.is_active;

        if(!Utils.requiredCheck(prevent.preventTitle)){
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_Weak_Name,
                MessageInfo.MI_WEAKNAME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        return Promise.then(()=>{
            return PreventUseCase.checkId(prevent.preventId);
        }).then((object)=>{

            if(object.obj1 == 0) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_WEAKNAME_IS_REQUIRED,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
           
            return PreventUseCase.create(prevent);

        }).then((object)=>{
  
            let data ={};
            data["message"]="sucessfully created";
            res.json(data);
        }).catch(err =>{
            Utils.responseError(res,err);
        })
    }
}


