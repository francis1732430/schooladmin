
import {LeaveRequestDto} from "../data/models";
import {LeaveRequestTableSchema} from "../data/schemas";
import {BearerObject, Logger} from "../libs";
import {ErrorCode, HttpStatus, Properties, MessageInfo} from "../libs/constants";
import {Utils} from "../libs/utils";
import {Exception, LeaveRequestModel} from "../models";
import {Promise} from "thenfail";
import {BaseUseCase} from "./base";

export class LeaveRequestUseCase extends BaseUseCase {

    constructor() {
        super();
        this.mysqlModel = LeaveRequestDto;
    }

    public create(leave:LeaveRequestModel):Promise<any> {
        return Promise.then(() => {
                return LeaveRequestDto.create(LeaveRequestDto, leave.toDto()).save();
            })
            .catch(err => {
                return Promise.reject(Utils.parseDtoError(err));
            })
            .enclose();
    }
    public updateById(id:string, leave:LeaveRequestModel):Promise<any> {
        return Promise.then(() => {
            return this.findById(id);
        })
            .then(object => {
                if(object != null && object != undefined) {
                    let result = LeaveRequestModel.fromDto(object);
                    let data = leave.toDto();
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
                let resultData = LeaveRequestModel.fromDto(object);
                    let adminUser = {};
                    adminUser[LeaveRequestTableSchema.FIELDS.IS_DELETED] = 1;
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

export default new LeaveRequestUseCase();
