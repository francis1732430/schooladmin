
import {NeetCenterDto} from "../data/models";
import {NeetCenterTableSchema} from "../data/schemas";
import {BearerObject, Logger} from "../libs";
import {ErrorCode, HttpStatus, Properties, MessageInfo} from "../libs/constants";
import {Utils} from "../libs/utils";
import {Exception,NeetCenterModel} from "../models";
import {Promise} from "thenfail";
import {BaseUseCase} from "./base";

export class NeetCenterUseCase extends BaseUseCase {

    constructor() {
        super();
        this.mysqlModel = NeetCenterDto;
    }

    public create(center:NeetCenterModel):Promise<any> {
        return Promise.then(() => {
                return NeetCenterDto.create(NeetCenterDto, center.toDto()).save();
            })
            .catch(err => {
                return Promise.reject(Utils.parseDtoError(err));
            })
            .enclose();
    }
    public updateById(id:string, center:NeetCenterModel):Promise<any> {
        return Promise.then(() => {
            return this.findById(id);
        })
            .then(object => {
                if(object != null && object != undefined) {
                    let centerData = NeetCenterModel.fromDto(object);
                    let data = center.toDto();
                    return object.save(data, {patch: true});
                }  
                  return Promise.void;
            })
            .catch(err => {
                return Promise.reject(Utils.parseDtoError(err));
            })
            .enclose();
    }

    
    public destroyById(rid:string,createdBy:number):any {
        return Promise.then(() => {
            return this.findById(rid);
        }).then(object => {
            if (object) {
                let centerData = NeetCenterModel.fromDto(object);
                    let adminUser = {};
                    adminUser[NeetCenterTableSchema.FIELDS.IS_DELETED] = 1;
                    return object.save(adminUser, {patch: true});               
            } else {
                return Promise.reject(new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_OBJECT_ITEM_NOT_EXIST_OR_DELETED,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
            }
        }).catch(err => {
            return Promise.reject(Utils.parseDtoError(err));
        }).enclose();
    }
    
}

export default new NeetCenterUseCase();
