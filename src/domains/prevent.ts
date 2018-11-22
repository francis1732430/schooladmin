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

    public checkId(codes:any){

        let obj =[];
        let arr1 = [];
        let data = [];
        let updatedata = {};

        let arr = codes.split(',').filter(id=>{
            arr1.push(id.replace(/['"]+/g,''))
        });
        console.log('arr value',arr[0]);
        console.log('arr1 value',arr1[0])

        return new Promise(function(resolve,err){

            Promise.each(arr1,(code,i)=>{

                return Promise.then(()=>{

                   return AdminUserUseCase.findOne(q=>{

                    q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,code);
                    q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}`,0);

                   })
                }).then((object)=>{

                    console.log(object);
                    if(object != null){

                        let pret = {userId:object.get(AdminUserTableSchema.FIELDS.USER_ID),firstname:object.get(AdminUserTableSchema.FIELDS.FIRSTNAME)};
                        data.push(pret);
                    }

                    obj[0] = object != null && (obj[0] == 1 || obj[0] == undefined) ?1:0;

                    if(i == arr1.length-1){

                        updatedata.obj1 = obj[0];
                        updatedata.obj2 = data;
                        resolve(updatedata);
                    }
                }).catch(err=>{
                    return Promise.reject(Utils.parseDtoError(err));
                }).enclose();
            });
        });
    }
}

export default new PreventUseCase();