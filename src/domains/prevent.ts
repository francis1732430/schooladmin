import { PrevenTDto }from "../data/models";
import { PreventionsTableSchemas , AdminUserTableSchema }from "../data/schemas";
import {BearerObject, Logger} from "../libs";
import {ErrorCode, HttpStatus, Properties, MessageInfo} from "../libs/constants";
import {Utils} from "../libs/utils";
import {Exception, PreventModel} from "../models";
import {Promise} from "thenfail";
import {BaseUseCase} from "./base";
import {AdminUserUseCase}from "../domains";


export class PreventUseCase extends BaseUseCase{

    constructor(){
        super();
        this.mysqlModel = PrevenTDto;
    }

    public create(prevent:PreventModel):Promise<any> {
        console.log("rr",prevent);
        return Promise.then(() => {
                return PrevenTDto.create(PrevenTDto, prevent.toDto()).save();
            })
            .catch(err => {
                return Promise.reject(Utils.parseDtoError(err));
            })
            .enclose();
    }


    public update(rid:string,prevent:PreventModel):Promise<any> {

        console.log("update",prevent);
        return Promise.then(()=>{
            return this.findById(rid)
        })
        .then(obj=>{
            if(obj != null && obj != undefined){
                let dist = PreventModel.fromDto(obj);
                let data = prevent.toDto();
                return obj.save(data, {patch:true})
            }
            return Promise.void;
        }).catch(err=>{ 
            return Promise.reject(Utils.parseDtoError(err))
        }).enclose()

    }


    public destroy(rid:string):any{

        return Promise.then(()=>{
            return this.findById(rid);

        }).then((object)=>{
            if(object){
                let prever = PreventModel.fromDto(object);
                let admin = {};
                admin[PreventionsTableSchemas.FIELDS.IS_DELETED] = 1;
                return object.save(admin, {patch:true})
            }else{
                return Promise.reject(new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_OBJECT_ITEM_NOT_EXIST_OR_DELETED,
                    false,
                    HttpStatus.BAD_REQUEST
                ))
            }
        }).catch(err=>{
            return Promise.reject(Utils.parseDtoError(err));
        }).enclose();
    }

    public materialUpload(prevent,schoolId,preventName):Promise<any> {
        let partpath:any;
        return new Promise((resolve,reject) => {
            let img=prevent;
            var check2=img.match(/^data:image\/\w+;base64,/);
            let type;
            // console.log(material);
            console.log('check2',check2);
            if(check2 != null){
               type=prevent.substring("data:image/".length, prevent.indexOf(";base64"));
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
                    partialpath=`leave${schoolId}/${preventName}-${now}.${type}`;
                } else {
                    partialpath=`leave${schoolId}/${preventName}-${now}`;
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

export default new PreventUseCase();