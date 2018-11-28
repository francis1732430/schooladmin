import { PrevenTDto }from "../data/models";
import { PreventionsTableSchemas , AdminUserTableSchema }from "../data/schemas";
import {BearerObject, Logger} from "../libs";
import {ErrorCode, HttpStatus, Properties, MessageInfo} from "../libs/constants";
import {Utils} from "../libs/utils";
import {Exception, PreventModel} from "../models";
import {Promise} from "thenfail";
import {BaseUseCase} from "./base";
import {AdminUserUseCase}from "../domains";


export class PreventUseCase extends BaseUseCase{

    constructor(){
        super();
        this.mysqlModel = PrevenTDto;
    }

    public create(prevent:PreventModel):Promise<any> {
        console.log("rr",prevent);
        return Promise.then(() => {
                return PrevenTDto.create(PrevenTDto, prevent.toDto()).save();
            })
            .catch(err => {
                return Promise.reject(Utils.parseDtoError(err));
            })
            .enclose();
    }


    public update(rid:string,prevent:PreventModel):Promise<any> {

        console.log("update",prevent);
        return Promise.then(()=>{
            return this.findById(rid)
        })
        .then(obj=>{
            if(obj != null && obj != undefined){
                let dist = PreventModel.fromDto(obj);
                let data = prevent.toDto();
                return obj.save(data, {patch:true})
            }
            return Promise.void;
        }).catch(err=>{ 
            return Promise.reject(Utils.parseDtoError(err))
        }).enclose()

    }


    public destroy(rid:string):any{

        return Promise.then(()=>{
            return this.findById(rid);

        }).then((object)=>{
            if(object){
                let prever = PreventModel.fromDto(object);
                let admin = {};
                admin[PreventionsTableSchemas.FIELDS.IS_DELETED] = 1;
                return object.save(admin, {patch:true})
            }else{
                return Promise.reject(new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_OBJECT_ITEM_NOT_EXIST_OR_DELETED,
                    false,
                    HttpStatus.BAD_REQUEST
                ))
            }
        }).catch(err=>{
            return Promise.reject(Utils.parseDtoError(err));
        }).enclose();
    }

   
}

export default new PreventUseCase();