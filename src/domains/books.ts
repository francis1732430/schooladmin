
import {BooksTableDto} from "../data/models";
import {BooksTableSchema} from "../data/schemas";
import {BearerObject, Logger} from "../libs";
import {ErrorCode, HttpStatus, Properties, MessageInfo} from "../libs/constants";
import {Utils} from "../libs/utils";
import {Exception,BooksModel} from "../models";
import {Promise} from "thenfail";
import {BaseUseCase} from "./base";

export class BooksUseCase extends BaseUseCase {

    constructor() {
        super();
        this.mysqlModel = BooksTableDto;
    }

    public create(books:BooksModel):Promise<any> {
        return Promise.then(() => {
                return  BooksTableDto.create(BooksTableDto, books.toDto()).save();
            })
            .catch(err => {
                return Promise.reject(Utils.parseDtoError(err));
            })
            .enclose();
    }
    public updateById(id:string, books:BooksModel):Promise<any> {
        return Promise.then(() => {
            return this.findById(id);
        })
            .then(object => {
                if(object != null && object != undefined) {
                    let booksData = BooksModel.fromDto(object);
                    let condition={};
                    condition[BooksTableSchema.FIELDS.RID]=id;
                    let data = books.toDto();
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
                let awardData = BooksModel.fromDto(object);
                    let adminUser = {};
                    adminUser[BooksTableSchema.FIELDS.IS_DELETED] = 1;
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
   
    

    public materialUpload(books,schoolId,bookName):Promise<any> {
        let partpath:any;
        return new Promise((resolve,reject) => {
            let img=books;
            var check2=img.match(/^data:image\/\w+;base64,/);
            let type;
            // console.log(material);
            console.log('check2',check2);
            if(check2 != null){
               type=books.substring("data:image/".length, books.indexOf(";base64"));
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
                    if( fi && file1 == `books${schoolId}`){
                        return 1;
                    }else {
                        return 0;
                    }
                })
               console.log(check);
                if(check.length == 0){
                    fs.mkdirSync(`${pathUrl}/books${schoolId}`);
                }
                let partialpath;
                if(check2 != null){
                    partialpath=`books${schoolId}/${bookName}-${now}.${type}`;
                } else {
                    partialpath=`books${schoolId}/${bookName}-${now}`;
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

export default new BooksUseCase();
