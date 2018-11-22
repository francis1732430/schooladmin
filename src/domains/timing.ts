import { TimingTDto }from "../data/models";
import { TimingTableSchema }from "../data/schemas";
import {BearerObject, Logger} from "../libs";
import {ErrorCode, HttpStatus, Properties, MessageInfo} from "../libs/constants";
import {Utils} from "../libs/utils";
import {Exception, TimingModel} from "../models";
import {Promise} from "thenfail";
import {BaseUseCase} from "./base";


export class TimingDayUseCase extends BaseUseCase{

    constructor(){ 
        super();
        this.mysqlModel = TimingTDto;
    }

    public create(timeDay:TimingModel):Promise<any> {
        console.log("rr",timeDay);
        return Promise.then(() => {
                return TimingTDto.create(TimingTDto, timeDay.toDto()).save();
            })
            .catch(err => {
                return Promise.reject(Utils.parseDtoError(err));
            })
            .enclose();
    }

    public update(rid:string,timeDay:TimingModel):Promise<any> {

        console.log("update",timeDay);
        return Promise.then(()=>{
            return this.findById(rid)
        })
        .then(obj=>{
            if(obj != null && obj != undefined){
                let dist = TimingModel.fromDto(obj);
                let data = timeDay.toDto();
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
                let time = TimingModel.fromDto(object);
                let admin = {};
                admin[TimingTableSchema.FIELDS.IS_DELETED] = 1;
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

export default new TimingDayUseCase();
