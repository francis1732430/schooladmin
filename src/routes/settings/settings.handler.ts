import { Endpoint } from 'aws-sdk';
/**
 *    on 22/05/18.
 */
import {CoreConfigDataUseCase,ServerEndpointUseCase} from "../../domains";
import {CoreConfigDataTableSchema} from "../../data/schemas";
import {BearerObject, Jwt, Logger, Mailer} from "../../libs";
import {ErrorCode, HttpStatus, Properties, MessageInfo} from "../../libs/constants";
import {Utils} from "../../libs/utils";
import {Exception,CoreConfigDataModel} from "../../models";
import {Request, Response} from "express";
import {Promise} from "thenfail";
import {BaseHandler,languge} from "../base.handler";
let util = require('util'); 


export class SettingsHandler extends BaseHandler {
    
    constructor() {
        super();
    }

   
    /**
     *
     * @param req
     * @param res
     * @returns {Promise<any>}
     */
    public static endpoints(req:Request, res:Response):any {
        return Promise.then(() => {
            return ServerEndpointUseCase.countryEndpoints();
        })
        .then((object) => { 
            res.json(object);
        })
        .catch(err => {
            Utils.responseError(res, err);
        });
    }

    
}

export default new SettingsHandler();
