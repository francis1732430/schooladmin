import {DirectoryDistrictDto} from "../data/models";
import {DirectoryDistrictTableSchema} from "../data/schemas";
import {BearerObject, Logger} from "../libs";
import {ErrorCode, HttpStatus, Properties, MessageInfo} from "../libs/constants";
import {Utils} from "../libs/utils";
import {Exception, DirectoryDistrictModel} from "../models";
import {Promise} from "thenfail";
import {BaseUseCase} from "./base";

export class DirectoryDistrictUseCase extends BaseUseCase {

    constructor() {
        super();
        this.mysqlModel = DirectoryDistrictDto;
    }
    public create(district:DirectoryDistrictModel):Promise<any> {
        console.log("rr",district);
        return Promise.then(() => {
                return DirectoryDistrictDto.create(DirectoryDistrictDto, district.toDto()).save();
            })
            .catch(err => {
                return Promise.reject(Utils.parseDtoError(err));
            })
            .enclose();
    }

    public update(rid:string,district:DirectoryDistrictModel):Promise<any> {

        console.log("update",district);
        return Promise.then(()=>{
            return this.findById(rid)
        })
        .then(obj=>{
            if(obj != null && obj != undefined){
                let dist = DirectoryDistrictModel.fromDto(obj);
                let data = district.toDto();
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
                let district = DirectoryDistrictModel.fromDto(object);
                let admin = {};
                admin[DirectoryDistrictTableSchema.FIELDS.IS_DELETED] = 1;
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

export default new DirectoryDistrictUseCase();
