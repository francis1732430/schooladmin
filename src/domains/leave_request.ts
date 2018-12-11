
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

    public materialUpload(leave,schoolId,attachmentName):Promise<any> {
        let partpath:any;
        return new Promise((resolve,reject) => {
            let img=leave;
            var check2=img.match(/^data:image\/\w+;base64,/);
            let type;
            // console.log(material);
            console.log('check2',check2);
            if(check2 != null){
               type=leave.substring("data:image/".length, leave.indexOf(";base64"));
            }
            var data = img.replace(/^data:image\/\w+;base64,/, "");
                        var buf = new Buffer(data, 'base64');
            let path=require('path');
            let pathUrl=path.join(__dirname,'../../files');
            let now=Utils.todayDateAndTime();
             var fs=require('fs');
             let res=resolve;
            return fs.readdir(pathUrl,async function(err,files) {
              
                let check=await files.filter((file1,i) => {
                    let dirUrl=`${pathUrl}/${file1}`;
                    let fi=fs.lstatSync(dirUrl).isDirectory();
                    if( fi && file1 == `leave${schoolId}`){
                        return 1;
                    }else {
                        return 0;
                    }
                })
               console.log(check);
                if(check.length == 0){
                    fs.mkdirSync(`${pathUrl}/leave${schoolId}`);
                }
                let partialpath;
                if(check2 != null){
                    partialpath=`leave${schoolId}/${attachmentName}-${now}.${type}`;
                } else {
                    partialpath=`leave${schoolId}/${attachmentName}-${now}`;
                }
                
                let originalPath=`${pathUrl}/${partialpath}` 
            return fs.writeFile(originalPath,buf,function(err){
                console.log(err);

                partpath=partialpath;
                console.log("1111111",partialpath);
               return res(partialpath);
            })
        })
        }).catch(err => {
            return Promise.reject(Utils.parseDtoError(err));
        }).enclose();
     }
}

export default new LeaveRequestUseCase();
