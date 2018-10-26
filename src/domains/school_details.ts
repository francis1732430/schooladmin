import {SchoolDto} from "../data/models";
import {SchoolTableSchema, AdminUserTableSchema} from "../data/schemas";
import {BearerObject, Logger} from "../libs";
import {ErrorCode, HttpStatus, Properties, MessageInfo} from "../libs/constants";
import {Utils} from "../libs/utils";
import {Exception, SchoolModel, AdminUserModel} from "../models";
import {Promise} from "thenfail";
import {BaseUseCase} from "./base";
import { AdminUserUseCase } from "../domains";
import {  Mailer } from "../libs";

export class SchoolUseCase extends BaseUseCase {

    constructor() {
        super();
        this.mysqlModel = SchoolDto;
    }
    public create(school:SchoolModel):Promise<any> {
        return Promise.then(() => {
                return SchoolDto.create(SchoolDto, school.toDto()).save();
            })
            .catch(err => {
                return Promise.reject(Utils.parseDtoError(err));
            })
            .enclose();
    }
    public updateById(id:string, school:SchoolModel):Promise<any> {
        return Promise.then(() => {
            return this.findById(id);
        })
            .then(object => {
                if(object != null && object != undefined) {
                    let schoolData = SchoolModel.fromDto(object);
                    let data = school.toDto();
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
                let schoolData = SchoolModel.fromDto(object);
                    let adminUser = {};
                    adminUser[SchoolTableSchema.FIELDS.IS_DELETED] = 1;
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

    public sendMail(emails:any[],schoolName,district):Promise<any> {

        return AdminUserUseCase.findOne( q => {
            
            q.where(`${AdminUserTableSchema.FIELDS.USER_ID}`,"1");
        }).then((object) => {
         let user=AdminUserModel.fromDto(object);
          emails.push(user.email);

          return Promise.each(emails,(email) => {
              return Promise.then(() => {
                Mailer.sendApproval(email,schoolName,district);
              })
          }).then(() => {
              return null;
          }).catch(err => {
            return Promise.reject(Utils.parseDtoError(err));
        }).enclose();


        })
    }
    public createTmpAdmin(object):Promise<any> {

        let email=object.get("representative_email");
        let schoolId=object.get("school_id");
        let tmpPassword:any;
        let genHash:any;
        let obj:any={};
        return Promise.then(() => {
            tmpPassword=Utils.randomPassword(8);
            genHash=Utils.hashPassword(tmpPassword);
            let schoolData=SchoolModel.fromDto(object);
           obj.firstname=schoolData.representativeName;
           obj.lastname=schoolData.schoolName;
           obj.email=schoolData.representativeEmail;
           obj.status="1";
           obj.roleId="18";
           obj.createdby="1";
           obj.tmpPassword=genHash;
           return Mailer.sendNewPassword(schoolData.representativeEmail,schoolData.representativeName,tmpPassword);
          // return AdminUserUseCase.create(obj);
        
    }).then((object) => {
        return AdminUserUseCase.create(obj);
    }).catch(err => {
        return Promise.reject(Utils.parseDtoError(err));
    }).enclose();

}

public checkSchool(permissions:any[]):Promise<any> {

    let count=1;
    return Promise.then(() => {

        return Promise.each(permissions,(schools) => {

            return Promise.then(() => {
                return this.findOne( q => {
                    q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_ID}`,schools.schoolId);
                    q.where(`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.IS_DELETED}`,0);
                })
            }).then((object) => {
                if(object == null || count == 2){
                  count=2;
                }else {
                    count=1;
                }
            })
        }).then(() => {
            return count;
        })
    })



}
}
export default new SchoolUseCase();
