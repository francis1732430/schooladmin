
import {AttendenceDto} from "../data/models";
import {AttendenceTableSchema, StandardEntityTableSchema,ClassEntityTableSchema,AdminUserTableSchema} from "../data/schemas";
import {BearerObject, Logger} from "../libs";
import {ErrorCode, HttpStatus, Properties, MessageInfo} from "../libs/constants";
import {Utils} from "../libs/utils";
import {Exception, AttendenceModel} from "../models";
import {Promise} from "thenfail";
import {BaseUseCase} from "./base";
import { StandardEntityUseCase,ClassEntityUseCase,AdminUserUseCase} from "../domains";

export class AttendenceUseCase extends BaseUseCase {

    constructor() {
        super();
        this.mysqlModel = AttendenceDto;
    }

    public create(attendence:AttendenceModel):Promise<any> {
        return Promise.then(() => {
                return AttendenceDto.create(AttendenceDto, attendence.toDto()).save();
            })
            .catch(err => {
                return Promise.reject(Utils.parseDtoError(err));
            })
            .enclose();
    }
    public updateById(id:string, attendence:AttendenceModel):Promise<any> {
        return Promise.then(() => {
            return this.findById(id);
        })
            .then(object => {
                if(object != null && object != undefined) {
                    let result = AttendenceModel.fromDto(object);
                    let data = attendence.toDto();
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
                let attendenceData = AttendenceModel.fromDto(object);
                    let adminUser = {};
                    adminUser[AttendenceTableSchema.FIELDS.IS_DELETED] = 1;
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

      
    public findStandardId(standards:any):any {
        let count=0;
        return Promise.then(() => {
            return Promise.each(standards,(objects) => {
                return Promise.each(objects,(obj,i) => {
                    return Promise.then(() => {
        if(i== 0){
    return StandardEntityUseCase.findOne( q => {
        q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.STANDARD_ID}`,obj.standardId);
        q.where(`${StandardEntityTableSchema.TABLE_NAME}.${StandardEntityTableSchema.FIELDS.IS_DELETED}`,0);
           })
            }                 
    }).then((obj1) => {
                  if(i==0 && obj1 == null || count==1){
                   count=1;
                  }
                    })
                })
    
            })
        }).then(() => {
            return count;
        })
        
    }

    public findClassId(classes:any):any {
        let count=0;
        return Promise.then(() => {
            return Promise.each(classes,(objects) => {
                return Promise.each(objects,(obj,i) => {
                    return Promise.then(() => {
        if(i== 1){
    return ClassEntityUseCase.findOne( q => {
        q.where(`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.CLASS_ID}`,obj.classId);
        q.where(`${ClassEntityTableSchema.TABLE_NAME}.${ClassEntityTableSchema.FIELDS.IS_DELETED}`,0);
           })
            }                 
    }).then((obj1) => {
                  if(i==1 && obj1 == null || count==1){
                   count=1;
                  }
                    })
                })
    
            })
        }).then(() => {
            return count;
        })
        
    }


    public findUserId(users:any):any {
        let count=0;
        return Promise.then(() => {
            return Promise.each(users,(objects) => {
                return Promise.each(objects,(obj,i) => {
                    return Promise.then(() => {
        if(i== 2){
    return AdminUserUseCase.findOne( q => {
        q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,obj.userId);
        q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}`,0);
           })
            }                 
    }).then((obj1) => {
                  if(i==2 && obj1 == null || count==1){
                   count=1;
                  }
                    })
                })
    
            })
        }).then(() => {
            return count;
        })
        
    }
}

export default new AttendenceUseCase();
