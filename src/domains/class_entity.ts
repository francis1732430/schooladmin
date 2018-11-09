
import {ClassEntityDto} from "../data/models";
import {ClassEntityTableSchema} from "../data/schemas";
import {BearerObject, Logger} from "../libs";
import {ErrorCode, HttpStatus, Properties, MessageInfo} from "../libs/constants";
import {Utils} from "../libs/utils";
import {Exception, ClassEntityModel} from "../models";
import {Promise} from "thenfail";
import {BaseUseCase} from "./base";

export class ClassEntityUseCase extends BaseUseCase {

    constructor() {
        super();
        this.mysqlModel = ClassEntityDto;
    }
    public create(classEntity:ClassEntityModel):Promise<any> {
        return Promise.then(() => {
                return ClassEntityDto.create(ClassEntityDto, classEntity.toDto()).save();
            })
            .catch(err => {
                return Promise.reject(Utils.parseDtoError(err));
            })
            .enclose();
    }
   
    public updateById(id:string, classEntity:ClassEntityModel):Promise<any> {
        return Promise.then(() => {
            return this.findById(id);
        })
            .then(object => {
                if(object != null && object != undefined) {
                    let classData = ClassEntityModel.fromDto(object);
                    let data = classEntity.toDto();
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
                let classData = ClassEntityModel.fromDto(object);
                    let adminUser = {};
                    adminUser[ClassEntityTableSchema.FIELDS.IS_DELETED] = 1;
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

export default new ClassEntityUseCase();
