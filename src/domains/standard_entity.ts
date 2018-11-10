/**
 *    on 22/05/18.
 */
import {StandardDto} from "../data/models";
import {StandardEntityTableSchema,SubjectTableSchema} from "../data/schemas";
import {BearerObject, Logger} from "../libs";
import {ErrorCode, HttpStatus, Properties, MessageInfo} from "../libs/constants";
import {Utils} from "../libs/utils";
import {Exception, StandardEntityModel} from "../models";
import {Promise} from "thenfail";
import {BaseUseCase} from "./base";
import {SubjectEntityUseCase} from "../domains";

export class StandardEntityUseCase extends BaseUseCase {

    constructor() {
        super();
        this.mysqlModel = StandardDto;
    }

    public create(standard:StandardEntityModel):Promise<any> {
        return Promise.then(() => {
                return StandardDto.create(StandardDto, standard.toDto()).save();
            })
            .catch(err => {
                return Promise.reject(Utils.parseDtoError(err));
            })
            .enclose();
    }
    public updateById(id:string, standard:StandardEntityModel):Promise<any> {
        return Promise.then(() => {
            return this.findById(id);
        })
            .then(object => {
                if(object != null && object != undefined) {
                    let standardData = StandardEntityModel.fromDto(object);
                    let data = standard.toDto();
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
                let schoolData = StandardEntityModel.fromDto(object);
                    let adminUser = {};
                    adminUser[StandardEntityTableSchema.FIELDS.IS_DELETED] = 1;
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

    public subjectIdCheck(codes:any) {
        let obj=[];
        let arr1=[];
        let data=[];
        let updatedata={};
            let arr = codes.split(',').filter(id => {
                arr1.push(id.replace(/['"]+/g, ''));
            });
            console.log(arr1[0]);
        return new Promise(function(resolve,reject) {
            Promise.each(arr1,(code,i) => {
                return Promise.then(() => {
                    return SubjectEntityUseCase.findOne( q => {
                        q.where(`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.SUBJECT_ID}`,code);
                        q.where(`${SubjectTableSchema.TABLE_NAME}.${SubjectTableSchema.FIELDS.IS_DELETED}`,0);
                    });
                }).then( object => {
                 console.log(object);
                 if(object != null){
                     let subjectobj= {subjectId:object.get(SubjectTableSchema.FIELDS.SUBJECT_ID),subjectName:object.get(SubjectTableSchema.FIELDS.SUBJECT_NAME)};
                     data.push(subjectobj);
                 }


                 obj[0]= object != null && (obj[0] == 1 || obj[0] == undefined)  ?1:0;
                     if(i == arr1.length-1){


                        updatedata.obj1=obj[0];
                        updatedata.obj2=data;
                        resolve(updatedata);
                    }
                }).catch(err => {
                    return Promise.reject(Utils.parseDtoError(err));
                }).enclose();
            });
        });

    }
}

export default new StandardEntityUseCase();
