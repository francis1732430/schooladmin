
/**
 *    on 22/05/18.
 */
import {DirectoryCountryUseCase,DirectoryStateUseCase,DirectoryCityUseCase,DirectoryDistrictUseCase,DirectoryTalukUseCase} from "../../domains";
import {Logger, Mailer} from "../../libs";
import {ErrorCode, HttpStatus, Properties, MessageInfo} from "../../libs/constants";
import {Utils} from "../../libs/utils";
import {Exception, DirectoryDistrictModel, DirectoryTalukModel} from "../../models";
import {Request, Response} from "express";
import {Promise} from "thenfail";
import {BaseHandler} from "../base.handler";
let util = require('util'); 


export class LocationsHandler extends BaseHandler {
    
    constructor() {
        super();
    }

   
    /**
     *
     * @param req
     * @param res
     * @returns {Promise<any>}
     */
    public static countries(req:Request, res:Response):any {
        return Promise.then(() => {
            return DirectoryCountryUseCase.list();
        })
        .then((object) => { 
            res.json(object);
        })
        .catch(err => {
            Utils.responseError(res, err);
        });
    }

    /**
     *
     * @param req
     * @param res
     * @returns {Promise<any>}
     */
    public static states(req:Request, res:Response):any {
        let countryId = req.params.countryId;
        return Promise.then(() => {
            return DirectoryStateUseCase.list(countryId);
        })
        .then((object) => { 
            res.json(object);
        })
        .catch(err => {
            Utils.responseError(res, err);
        });
    }

    /**
     *
     * @param req
     * @param res
     * @returns {Promise<any>}
     */
    public static cities(req:Request, res:Response):any {
        let stateId = req.params.stateId;
        return Promise.then(() => {
            return DirectoryCityUseCase.list(stateId);
        })
        .then((object) => { 
            res.json(object);
        })
        .catch(err => {
            Utils.responseError(res, err);
        });
    }
    
    public static create(req:Request, res:Response):any {

        // console.log(req.body);
        // req.body.forEach(el => {
        //     console.log(el);
        // });
       let arr:any=[];
        let districts=req.body;
        districts.forEach(obj => {
            let district1=DirectoryDistrictModel.objRequest(obj);
            arr.push(district1);
        })
        console.log(arr);
        return Promise.then(() => {
            return Promise.each(arr,(obj:any) => {
                return Promise.then(() => {
                    return DirectoryDistrictUseCase.create(obj);
                }).then((obj) => {
                    return 0;
                })

            }) 
        })
        
    }
    
    public static cityCreate(req:Request, res:Response):any {

        // console.log(req.body);
        // req.body.forEach(el => {
        //     console.log(el);
        // });
       let arr:any=[];
        let districts=req.body;
        districts.forEach(obj => {
            let district1=DirectoryTalukModel.objRequest(obj);
            arr.push(district1);
        })
        console.log(arr);
        return Promise.then(() => {
            return Promise.each(arr,(obj:any) => {
                return Promise.then(() => {
                    return DirectoryTalukUseCase.create(obj);
                }).then((obj) => {
                    return 0;
                })

            }) 
        })
        
    }
}

export default new LocationsHandler();
