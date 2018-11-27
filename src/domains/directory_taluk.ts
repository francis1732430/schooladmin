import {DirectoryTalukDto} from "../data/models";
import {DirectoryTalukTableSchema} from "../data/schemas";
import {BearerObject, Logger} from "../libs";
import {ErrorCode, HttpStatus, Properties, MessageInfo} from "../libs/constants";
import {Utils} from "../libs/utils";
import {Exception, DirectoryCountryModel,DirectoryTalukModel} from "../models";
import {Promise} from "thenfail";
import {BaseUseCase} from "./base";

export class DirectoryTalukUseCase extends BaseUseCase {

    constructor() {
        super();
        this.mysqlModel = DirectoryTalukDto;
    }
    public create(taluka:DirectoryTalukModel):Promise<any> {
        console.log("rr",taluka);
        return Promise.then(() => {
                return DirectoryTalukDto.create(DirectoryTalukDto, taluka.toDto()).save();
            })
            .catch(err => {
                return Promise.reject(Utils.parseDtoError(err));
            })
            .enclose();
    }

    public update(rid:string,taluka:DirectoryTalukModel):Promise<any> {
        console.log("update",taluka);
        return Promise.then(()=>{
            return this.findById(rid)
        })
        .then(obj=>{
            if(obj != null && obj != undefined){
                let dist = DirectoryTalukModel.fromDto(obj);
                let data = taluka.toDto();
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
                let taluka = DirectoryTalukModel.fromDto(object);
                let admin = {};
                admin[DirectoryTalukTableSchema.FIELDS.IS_DELETED] = 1;
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

export default new DirectoryTalukUseCase();
