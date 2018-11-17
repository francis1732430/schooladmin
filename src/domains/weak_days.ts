import { WeakTDto }from "../data/models";
import { WeakTableSchema }from "../data/schemas";
import {BearerObject, Logger} from "../libs";
import {ErrorCode, HttpStatus, Properties, MessageInfo} from "../libs/constants";
import {Utils} from "../libs/utils";
import {Exception, WeakDayModel} from "../models";
import {Promise} from "thenfail";
import {BaseUseCase} from "./base";


export class WeakDayUseCase extends BaseUseCase{

    constructor(){ 
        super();
        this.mysqlModel = WeakTDto;
    }

     public create(weakDay:WeakDayModel):Promise<any> {
        console.log("rr",weakDay);
        return Promise.then(() => {
                return WeakTDto.create(WeakTDto, weakDay.toDto()).save();
            })
            .catch(err => {
                return Promise.reject(Utils.parseDtoError(err));
            })
            .enclose();
    }

    public update(rid:string,weakDay:WeakDayModel):Promise<any> {

        console.log("update",weakDay);
        return Promise.then(()=>{
            return this.findById(rid)
        })
        .then(obj=>{
            if(obj != null && obj != undefined){
                let dist = WeakDayModel.fromDto(obj);
                let data = weakDay.toDto();
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
                let district = WeakDayModel.fromDto(object);
                let admin = {};
                //admin[WeakTableSchema.FIELDS.IS_DELETED] = 1;
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

export default new WeakDayUseCase();