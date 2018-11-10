/**
 *    on 22/05/18.
 */
import {SubjectEntityDto} from "../data/models";
import {SubjectTableSchema} from "../data/schemas";
import {BearerObject, Logger} from "../libs";
import {ErrorCode, HttpStatus, Properties, MessageInfo} from "../libs/constants";
import {Utils} from "../libs/utils";
import {Exception, SubjectEntityModel} from "../models";
import {Promise} from "thenfail";
import {BaseUseCase} from "./base";

export class SubjectEntityUseCase extends BaseUseCase {

    constructor() {
        super();
        this.mysqlModel = SubjectEntityDto;
    }

    public create(subject:SubjectEntityModel):Promise<any> {
        return Promise.then(() => {
                return SubjectEntityDto.create(SubjectEntityDto, subject.toDto()).save();
            })
            .catch(err => {
                return Promise.reject(Utils.parseDtoError(err));
            })
            .enclose();
    }
    public updateById(id:string, subject:SubjectEntityModel):Promise<any> {
        return Promise.then(() => {
            return this.findById(id);
        })
            .then(object => {
                if(object != null && object != undefined) {
                    let subjectData = SubjectEntityModel.fromDto(object);
                    let data = subject.toDto();
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
                let subjectData = SubjectEntityModel.fromDto(object);
                    let adminUser = {};
                    adminUser[SubjectTableSchema.FIELDS.IS_DELETED] = 1;
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

export default new SubjectEntityUseCase();
