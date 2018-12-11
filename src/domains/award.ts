
import {AwardDto} from "../data/models";
import {AwardTableSchema} from "../data/schemas";
import {BearerObject, Logger} from "../libs";
import {ErrorCode, HttpStatus, Properties, MessageInfo} from "../libs/constants";
import {Utils} from "../libs/utils";
import {Exception,AwardModel} from "../models";
import {Promise} from "thenfail";
import {BaseUseCase} from "./base";

export class AwardUseCase extends BaseUseCase {

    constructor() {
        super();
        this.mysqlModel = AwardDto;
    }

    public create(award:AwardModel):Promise<any> {
        return Promise.then(() => {
                return AwardDto.create(AwardDto, award.toDto()).save();
            })
            .catch(err => {
                return Promise.reject(Utils.parseDtoError(err));
            })
            .enclose();
    }
    public updateById(id:string, award:AwardModel):Promise<any> {
        return Promise.then(() => {
            return this.findById(id);
        })
            .then(object => {
                if(object != null && object != undefined) {
                    let awardData = AwardModel.fromDto(object);
                    let condition={};
                    condition[AwardTableSchema.FIELDS.RID]=id;
                    let data = award.toDto();
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
                let awardData = AwardModel.fromDto(object);
                    let adminUser = {};
                    adminUser[AwardTableSchema.FIELDS.IS_DELETED] = 1;
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
   
    

    public materialUpload(award,schoolId,awardName):Promise<any> {
        let partpath:any;
        return new Promise((resolve,reject) => {
            let img=award;
            var check2=img.match(/^data:image\/\w+;base64,/);
            let type;
            // console.log(material);
            console.log('check2',check2);
            if(check2 != null){
               type=award.substring("data:image/".length, award.indexOf(";base64"));
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
                    if( fi && file1 == `award${schoolId}`){
                        return 1;
                    }else {
                        return 0;
                    }
                })
               console.log(check);
                if(check.length == 0){
                    fs.mkdirSync(`${pathUrl}/award${schoolId}`);
                }
                let partialpath;
                if(check2 != null){
                    partialpath=`award${schoolId}/${awardName}-${now}.${type}`;
                } else {
                    partialpath=`award${schoolId}/${awardName}-${now}`;
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

export default new AwardUseCase();
