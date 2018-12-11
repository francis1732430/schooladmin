
import {ComplaintRegistrationDto} from "../data/models";
import {ComplaintRegistrationSchema} from "../data/schemas";
import {BearerObject, Logger} from "../libs";
import {ErrorCode, HttpStatus, Properties, MessageInfo} from "../libs/constants";
import {Utils} from "../libs/utils";
import {Exception,ComplaintRegistrationModel} from "../models";
import {Promise} from "thenfail";
import {BaseUseCase} from "./base";

export class ComplaintRegistrationUseCase extends BaseUseCase {

    constructor() {
        super();
        this.mysqlModel = ComplaintRegistrationDto;
    }

    public create(complaint:ComplaintRegistrationModel):Promise<any> {
        return Promise.then(() => {
                return ComplaintRegistrationDto.create(ComplaintRegistrationDto, complaint.toDto()).save();
            })
            .catch(err => {
                return Promise.reject(Utils.parseDtoError(err));
            })
            .enclose();
    }
    public updateById(id:string, complaint:ComplaintRegistrationModel):Promise<any> {
        return Promise.then(() => {
            return this.findById(id);
        })
            .then(object => {
                if(object != null && object != undefined) {
                    let awardData = ComplaintRegistrationModel.fromDto(object);
                    let condition={};
                    condition[ComplaintRegistrationSchema.FIELDS.RID]=id;
                    let data = complaint.toDto();
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
                let awardData = ComplaintRegistrationModel.fromDto(object);
                    let adminUser = {};
                    adminUser[ComplaintRegistrationSchema.FIELDS.IS_DELETED] = 1;
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

export default new ComplaintRegistrationUseCase();
