import { MessageInfo } from '../../libs/constants';
import {BooksUseCase,CategoryUseCase} from "../../domains";
import { ErrorCode, HttpStatus, MessageInfo, Properties, DefaultVal ,DATE_FORMAT} from "../../libs/constants";
import { Utils } from "../../libs/utils";
import {  Mailer } from "../../libs";
import { Exception, BooksModel} from "../../models";
import * as express from "express";
import { Promise } from "thenfail";
import { BooksTableSchema,CategoryTableSchema} from "../../data/schemas";
import { BaseHandler } from "../base.handler";
import { BearerObject } from "../../libs/jwt";
import * as formidable from "formidable";
import { Uploader } from "../../libs";
import category from '../../domains/category';
let fs = require('fs');  
var dateFormat = require('dateformat');
let knex=require('knex');
export class BooksHandler extends BaseHandler {
    constructor() {
        super();
    }

    public static create(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
       // req.body.schoolId=schoolId;
        req.body.createdBy=session.userId;
        req.body.schoolId=schoolId;
        let books = BooksModel.fromRequest(req);
        let status = req.body.isActive;
        if (!Utils.requiredCheck(books.bookName)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_AWARD_NAME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(books.categoryId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_CATEGORY_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(books.isActive)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_STATUS_NOT_EMPTY,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        if (!status || status != 0 && status != 1) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.GENERIC,
                MessageInfo.MI_STATUS_ERROR,
                false,
                HttpStatus.BAD_REQUEST
            ));

        }
       return Promise.then(() => {
           return BooksUseCase.findOne(q => {
               q.where(`${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.BOOK_NAME}`,books.bookName);
               q.where(`${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
               q.where(`${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.IS_DELETED}`,0);
           })
       }).then((object) => {
           if(object != null) {
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.NOT_FOUND,
                MessageInfo.MI_BOOKS_NAME_ALREADY_EXISTS,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
           }
           return CategoryUseCase.findOne(q => {
            q.where(`${CategoryTableSchema.TABLE_NAME}.${CategoryTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
            q.where(`${CategoryTableSchema.TABLE_NAME}.${CategoryTableSchema.FIELDS.CATEGORY_ID}`,books.categoryId);
            q.where(`${CategoryTableSchema.TABLE_NAME}.${CategoryTableSchema.FIELDS.IS_DELETED}`,0);
        })
        
       }).then((object) => {
        if(object == null) {
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.NOT_FOUND,
                MessageInfo.MI_CATEGORY_ID_NOT_FOUND,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
           }


           if(books.bookUrl != undefined && books.bookUrl != null) {
            
            return BooksUseCase.materialUpload(books.bookUrl,schoolId,books.bookName);
        } else {
            // return SubjectEntityUseCase.materialUpload(subject.materialUrl,schoolId,subject.subjectName);
            return null;
        }
        
       }).then((obj) => {
        console.log("kkkk1",obj);
         if(books.bookUrl != undefined && books.bookUrl != null){
            
            books.bookUrl=obj;
        }


           return BooksUseCase.create(books);
       }).then((object) => {

        let awardData={}
        awardData["message"] = "Books created successfully";
        res.json(awardData);
    }).catch(err => {
        Utils.responseError(res, err);
      });
    }

    public static update(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
        let rid = req.params.rid || "";
        let books = BooksModel.fromRequest(req);
        let status = req.body.isActive;
        if (!Utils.requiredCheck(books.bookName)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_AWARD_NAME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(books.categoryId)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_USER_ID_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(books.isActive)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_STATUS_NOT_EMPTY,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        if (!status || status != 0 && status != 1) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.GENERIC,
                MessageInfo.MI_STATUS_ERROR,
                false,
                HttpStatus.BAD_REQUEST
            ));

        }
       
        return Promise.then(() => {
            return BooksUseCase.findOne(q => {
                q.where(`${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.RID}`,rid);
                q.where(`${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {

            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_BOOKS_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
            return BooksUseCase.findOne(q => {
                q.where(`${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.BOOK_NAME}`,books.bookName);
                q.where(`${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
                q.whereNot(`${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.RID}`,rid);
                q.where(`${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {
            if(object != null) {
             Utils.responseError(res, new Exception(
                 ErrorCode.RESOURCE.NOT_FOUND,
                 MessageInfo.MI_BOOKS_NAME_ALREADY_EXISTS,
                 false,
                 HttpStatus.BAD_REQUEST
             ));
             return Promise.break;
            }
            return CategoryUseCase.findOne(q => {
             q.where(`${CategoryTableSchema.TABLE_NAME}.${CategoryTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
             q.where(`${CategoryTableSchema.TABLE_NAME}.${CategoryTableSchema.FIELDS.CATEGORY_ID}`,books.categoryId);
             q.where(`${CategoryTableSchema.TABLE_NAME}.${CategoryTableSchema.FIELDS.IS_DELETED}`,0);
         })
         
        }).then((object) => {
         if(object == null) {
             Utils.responseError(res, new Exception(
                 ErrorCode.RESOURCE.NOT_FOUND,
                 MessageInfo.MI_CATEGORY_ID_NOT_FOUND,
                 false,
                 HttpStatus.BAD_REQUEST
             ));
             return Promise.break;
            }
 
 
            if(books.bookUrl != undefined && books.bookUrl != null) {
             
             return BooksUseCase.materialUpload(books.bookUrl,schoolId,books.bookName);
         } else {
             // return SubjectEntityUseCase.materialUpload(subject.materialUrl,schoolId,subject.subjectName);
             return null;
         }
         
        }).then((obj) => {
         console.log("kkkk1",obj);
          if(books.bookUrl != undefined && books.bookUrl != null){
             
             books.bookUrl=obj;
         }
 
 
            
         return BooksUseCase.updateById(rid,books);

        }).then((object) => {
          console.log(object);
            let centerData=BooksModel.fromDto(object);
            centerData["message"] = "Books updated successfully";
            res.json(centerData);
        })
        .catch(err => {
            Utils.responseError(res, err);
        });
    }
 
    
    public static list(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let checkuser:BearerObject = req[Properties.CHECK_USER];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
        let offset = parseInt(req.query.offset) || null;
        let limit = parseInt(req.query.limit) || null;
        let sortKey;
        let sortValue;
        let searchobj = [];
        for (let key in req.query) {
            console.log(req.query[key]);
            if(key=='sortKey'){
                sortKey = req.query[key];
            }
            else if(key=='sortValue'){
                sortValue = req.query[key];
            } else if(req.query[key]!='' && key!='limit' && key!='offset' && key!='sortKey' && key!='sortValue'){
                searchobj[key] = req.query[key];
            }
        }
        console.log(searchobj);
        let adminuser:any;

        let total = 0;
        return Promise.then(() => {
            return BooksUseCase.countByQuery(q => {
                let condition;
             if(session.userId != '18') {
             q.where(`${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.CREATED_BY}`,session.userId);
             } 
             q.innerJoin(`${CategoryTableSchema.TABLE_NAME}`,`${CategoryTableSchema.TABLE_NAME}.${CategoryTableSchema.FIELDS.CATEGORY_ID}`,`${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.CATEGORY_ID}`);                   
             q.where(`${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
             q.where(`${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.IS_DELETED}`,0);
               // q.whereRaw(condition);               
                if (searchobj) {
                    for (let key in searchobj) {
                        if(searchobj[key]!=null && searchobj[key]!=''){
                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);
                            if(key=='bookId'){
                                condition = `(${BooksTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='bookName'){
                                condition = `(${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.BOOK_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='authorName'){
                                condition = `(${BooksTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='categoryId'){
                                condition = `(${CategoryTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='description'){
                                condition = `(${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.DESCRIPTION} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }  else if(key=='refBooks'){
                                condition = `(${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.REF_BOOKS} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if (key == 'bookUrl') {
                                condition = `(${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.BOOK_URL} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }  else if(key == 'isActive') {
                                condition = `(${BooksTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'createdDate') {
                                condition = `(${BooksTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'updatedDate') {
                                condition = `(${BooksTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }
                        }
                    }
                }  
            });
        })
            .then((totalObject) => {
                total = totalObject;
                return BooksUseCase.findByQuery(q => {
                   q.select(`${BooksTableSchema.TABLE_NAME}.*`,`${CategoryTableSchema.TABLE_NAME}.${CategoryTableSchema.FIELDS.CATEGORY_NAME} as categoryName`);
                   let condition;
                   if(session.userId != '18') {
                    q.where(`${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.CREATED_BY}`,session.userId);
                    } 
                    q.innerJoin(`${CategoryTableSchema.TABLE_NAME}`,`${CategoryTableSchema.TABLE_NAME}.${CategoryTableSchema.FIELDS.CATEGORY_ID}`,`${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.CATEGORY_ID}`);                   
                    q.where(`${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
                    q.where(`${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.IS_DELETED}`,0);
                      // q.whereRaw(condition);               
                       if (searchobj) {
                           for (let key in searchobj) {
                               if(searchobj[key]!=null && searchobj[key]!=''){
                                   console.log(searchobj[key]);
                                   let searchval = searchobj[key];
                                   let ColumnKey = Utils.changeSearchKey(key);
                                   if(key=='bookId'){
                                       condition = `(${BooksTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                       q.andWhereRaw(condition);
                                   } else if(key=='bookName'){
                                       condition = `(${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.BOOK_NAME} LIKE "%${searchval}%")`;
                                       q.andWhereRaw(condition);
                                   } else if(key=='authorName'){
                                       condition = `(${BooksTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                       q.andWhereRaw(condition);
                                   } else if(key=='categoryId'){
                                       condition = `(${CategoryTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                       q.andWhereRaw(condition);
                                   } else if(key=='description'){
                                       condition = `(${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.DESCRIPTION} LIKE "%${searchval}%")`;
                                       q.andWhereRaw(condition);
                                   }  else if(key=='refBooks'){
                                       condition = `(${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.REF_BOOKS} LIKE "%${searchval}%")`;
                                       q.andWhereRaw(condition);
                                   } else if (key == 'bookUrl') {
                                       condition = `(${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.BOOK_URL} LIKE "%${searchval}%")`;
                                       q.andWhereRaw(condition);
                                   }  else if(key == 'isActive') {
                                       condition = `(${BooksTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                       q.andWhereRaw(condition);
                                   } else if(key == 'createdDate') {
                                       condition = `(${BooksTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                       q.andWhereRaw(condition);
                                   } else if(key == 'updatedDate') {
                                       condition = `(${BooksTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                       q.andWhereRaw(condition);
                                   }
                               }
                           }
                       }  

                    if (offset != null) {
                        q.offset(offset);
                    }
                    if (limit != null) {
                        q.limit(limit);
                    }
                    if (sortKey != null && sortValue != '') {
                        if (sortKey != null && (sortValue == 'ASC' || sortValue == 'DESC' || sortValue == 'asc' || sortValue == 'desc')) {
                            let ColumnSortKey = Utils.changeSearchKey(sortKey);
                            if (sortKey == 'bookId') {
                                q.orderBy(ColumnSortKey, sortValue);
                            } else if (sortKey == 'bookName') {
                                q.orderBy(`${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.BOOK_NAME}`, sortValue);
                            } else if(sortKey=='categoryName'){
                                q.orderBy(`${CategoryTableSchema.TABLE_NAME}.${CategoryTableSchema.FIELDS.CATEGORY_NAME}`, sortValue);
                            } else if(sortKey == 'authorName') {
                                q.orderBy(`${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.AUTHOR_NAME}`,sortValue);
                            }  else if (sortKey == 'description') {
                                q.orderBy(`${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.DESCRIPTION}`, sortValue);
                            } else if (sortKey == 'bookUrl') {
                                q.orderBy(`${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.BOOK_URL}`, sortValue);
                            } else if (sortKey == 'refBooks') {
                                q.orderBy(`${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.REF_BOOKS}`, sortValue);
                            }   else if (sortKey == 'isActive') {
                                q.orderBy(ColumnSortKey, sortValue);
                            } else if (sortKey == 'createdDate') {
                                q.orderBy(ColumnSortKey, sortValue);
                            } else if (sortKey == 'updatedDate') {
                                q.orderBy(ColumnSortKey, sortValue);
                            }
                        }
                    }

                }, []);
            })
            .then((object) => {
                let ret = [];
               // console.log(object);
                //noinspection TypeScriptUnresolvedVariable
                if (object != null && object.models != null) {
                    //noinspection TypeScriptUnresolvedVariable
                    object.models.forEach(obj => {
                        console.log();
                        let userData = BooksModel.fromDto(obj, ["createdBy","password"]); 
                        userData["categoryName"]=obj.get("categoryName");
                        ret.push(userData);
                    });
                }
                res.header(Properties.HEADER_TOTAL, total.toString(10));

                if (offset != null) {
                    res.header(Properties.HEADER_OFFSET, offset.toString(10));
                }
                if (limit != null) {
                    res.header(Properties.HEADER_LIMIT, limit.toString(10));
                }

                res.json(ret);
            })
            .catch(err => {
                Utils.responseError(res, err);
            });
    }


    public static view(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let rid = req.params.rid || "";
        let userId=session.userId;
        let adminuser:any;
        let role:any;
        let result;
        return Promise.then(() =>{
            return BooksUseCase.findOne( q => {
                q.select(`${BooksTableSchema.TABLE_NAME}.*`,`${CategoryTableSchema.TABLE_NAME}.${CategoryTableSchema.FIELDS.CATEGORY_NAME} as categoryName`);
                let condition;
                 q.innerJoin(`${CategoryTableSchema.TABLE_NAME}`,`${CategoryTableSchema.TABLE_NAME}.${CategoryTableSchema.FIELDS.CATEGORY_ID}`,`${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.CATEGORY_ID}`);                   
                 q.where(`${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.RID}`,rid);
                 q.where(`${BooksTableSchema.TABLE_NAME}.${BooksTableSchema.FIELDS.IS_DELETED}`,0);
            }) 
        })
        .then((object) => {
            adminuser = object;
            
            if (adminuser == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_BOOKS_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            } else {
                let booksData = BooksModel.fromDto(adminuser, ["password","createdBy"]);
                booksData["categoryName"]=object.get("categoryName");
                res.json(booksData);
            }
        })
        .catch(err => {
            Utils.responseError(res, err);
        });
}

public static destroy(req: express.Request, res: express.Response): any {
    let session: BearerObject = req[Properties.SESSION];
    let createdBy = parseInt(session.userId);
    let rid = req.params.rid || "";
    return Promise.then(() => {
        return BooksUseCase.destroyById(rid,createdBy);
    })
    .then(() => {
        res.status(HttpStatus.NO_CONTENT);
        res.json({});
    })
    .catch(err => {
        Utils.responseError(res, err);
    });
}

public static massDelete(req: express.Request, res: express.Response): any {
    let session: BearerObject = req[Properties.SESSION];
    let createdBy = parseInt(session.userId);
    let rids = req.body.rids || "";
    let booksRids = [];
    if(rids) {
        booksRids = JSON.parse(rids);
    }else{
        Utils.responseError(res, new Exception(
            ErrorCode.RESOURCE.NOT_FOUND,
            MessageInfo.MI_AWARD_ID_NOT_FOUND,
            false,
            HttpStatus.BAD_REQUEST
        ));
        
    }
    return Promise.then(() => {
        if(booksRids!=null) {
            let ret = [];
            booksRids.forEach(rid => {
                let del = BooksUseCase.destroyById(rid,createdBy);
            });
            console.log(ret);
            return ret;
        } else {
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.NOT_FOUND,
                MessageInfo.MI_BOOKS_ID_NOT_FOUND,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
        }
    })
    .then((result) => {
        let data ={};
        data["message"] = 'Books deleted successfully';
        res.json(data);
    })
    .catch(err => {
        Utils.responseError(res, err);
    });
}

}

export default BooksHandler;
