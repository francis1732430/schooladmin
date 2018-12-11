import { MessageInfo } from '../../libs/constants';
import {CategoryUseCase} from "../../domains";
import { ErrorCode, HttpStatus, MessageInfo, Properties, DefaultVal ,DATE_FORMAT} from "../../libs/constants";
import { Utils } from "../../libs/utils";
import {  Mailer } from "../../libs";
import { Exception, CategoryModel} from "../../models";
import * as express from "express";
import { Promise } from "thenfail";
import { CategoryTableSchema} from "../../data/schemas";
import { BaseHandler } from "../base.handler";
import { BearerObject } from "../../libs/jwt";
import * as formidable from "formidable";
import { Uploader } from "../../libs";
import category from '../../domains/category';
let fs = require('fs');  
var dateFormat = require('dateformat');
let knex=require('knex');
export class CategoryHandler extends BaseHandler {
    constructor() {
        super();
    }

    public static create(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
        req.body.schoolId=schoolId;
        req.body.createdBy=session.userId;
        let category = CategoryModel.fromRequest(req);
        let status = req.body.isActive;
        if (!Utils.requiredCheck(category.categoryName)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_CATEGORY_NAME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
      
        if (!Utils.requiredCheck(category.isActive)) {
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
        return CategoryUseCase.findOne(q => {
            q.where(`${CategoryTableSchema.TABLE_NAME}.${CategoryTableSchema.FIELDS.CATEGORY_NAME}`,category.categoryName);
            q.where(`${CategoryTableSchema.TABLE_NAME}.${CategoryTableSchema.FIELDS.IS_DELETED}`,0);
        })
       }).then((object) => {
        if(object!=null) {
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.NOT_FOUND,
                MessageInfo.MI_CATEGORY_NAME_ALREADY_EXISTS,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
        }
        return CategoryUseCase.create(category);
       }).then((object) => {
        let categoryData={};
        categoryData["message"] = "Category created successfully";
        res.json(categoryData);
       }).catch(err => {
        Utils.responseError(res, err);
      });


    }

    public static update(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let schoolId:BearerObject = req[Properties.SCHOOL_ID];
        //req.body.schoolId=schoolId;
        let rid = req.params.rid || "";
        let category = CategoryModel.fromRequest(req);
        let status = req.body.isActive;
        if (!Utils.requiredCheck(category.categoryName)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_CATEGORY_NAME_IS_REQUIRED,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
      
        if (!Utils.requiredCheck(category.isActive)) {
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
            return CategoryUseCase.findOne(q => {
                q.where(`${CategoryTableSchema.TABLE_NAME}.${CategoryTableSchema.FIELDS.RID}`,rid);
                q.where(`${CategoryTableSchema.TABLE_NAME}.${CategoryTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {

            if(object == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_STANDARD_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
            return CategoryUseCase.findOne(q => {
                q.where(`${CategoryTableSchema.TABLE_NAME}.${CategoryTableSchema.FIELDS.CATEGORY_NAME}`,category.categoryName);
                q.whereNot(`${CategoryTableSchema.TABLE_NAME}.${CategoryTableSchema.FIELDS.RID}`,rid);
                q.where(`${CategoryTableSchema.TABLE_NAME}.${CategoryTableSchema.FIELDS.IS_DELETED}`,0);
            })
           }).then((object) => {
            if(object!=null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_CATEGORY_NAME_ALREADY_EXISTS,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
         return CategoryUseCase.updateById(rid,category);

        }).then((object) => {

            let categoryData=CategoryModel.fromDto(object);
            categoryData["message"] = "Category updated successfully";
            res.json(categoryData);
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
            return CategoryUseCase.countByQuery(q => {
                let condition;
             if(checkuser.roleId != 18) {
             q.where(`${CategoryTableSchema.TABLE_NAME}.${CategoryTableSchema.FIELDS.CREATED_BY}`,session.userId);
             }                

             q.where(`${CategoryTableSchema.TABLE_NAME}.${CategoryTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
             q.where(`${CategoryTableSchema.TABLE_NAME}.${CategoryTableSchema.FIELDS.IS_DELETED}`,0);
              //  q.whereRaw(condition);               
                if (searchobj) {
                    for (let key in searchobj) {
                        if(searchobj[key]!=null && searchobj[key]!=''){
                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);
                            if(key=='categoryId'){
                                condition = `(${CategoryTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='categoryName'){
                                condition = `(${CategoryTableSchema.TABLE_NAME}.${CategoryTableSchema.FIELDS.CATEGORY_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }  else if(key == 'isActive') {
                                condition = `(${CategoryTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'createdDate') {
                                condition = `(${CategoryTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'updatedDate') {
                                condition = `(${CategoryTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }
                        }
                    }
                }  
            });
        })
            .then((totalObject) => {
                total = totalObject;
                return CategoryUseCase.findByQuery(q => {
                   q.select(`${CategoryTableSchema.TABLE_NAME}.*`);
                   //q.select(knex.raw(`CONCAT(${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.FIRSTNAME}," ",${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.LASTNAME}) as staffName`));
                   let condition;
                   if(checkuser.roleId != 18) {
                    q.where(`${CategoryTableSchema.TABLE_NAME}.${CategoryTableSchema.FIELDS.CREATED_BY}`,session.userId);
                    }                
       
                    q.where(`${CategoryTableSchema.TABLE_NAME}.${CategoryTableSchema.FIELDS.SCHOOL_ID}`,schoolId);
                    q.where(`${CategoryTableSchema.TABLE_NAME}.${CategoryTableSchema.FIELDS.IS_DELETED}`,0);
                     //  q.whereRaw(condition);               
                       if (searchobj) {
                           for (let key in searchobj) {
                               if(searchobj[key]!=null && searchobj[key]!=''){
                                   console.log(searchobj[key]);
                                   let searchval = searchobj[key];
                                   let ColumnKey = Utils.changeSearchKey(key);
                                   if(key=='categoryId'){
                                       condition = `(${CategoryTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                       q.andWhereRaw(condition);
                                   } else if(key=='categoryName'){
                                       condition = `(${CategoryTableSchema.TABLE_NAME}.${CategoryTableSchema.FIELDS.CATEGORY_NAME} LIKE "%${searchval}%")`;
                                       q.andWhereRaw(condition);
                                   }  else if(key == 'isActive') {
                                       condition = `(${CategoryTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                       q.andWhereRaw(condition);
                                   } else if(key == 'createdDate') {
                                       condition = `(${CategoryTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                       q.andWhereRaw(condition);
                                   } else if(key == 'updatedDate') {
                                       condition = `(${CategoryTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
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
                            if (sortKey == 'categoryId') {
                                q.orderBy(ColumnSortKey, sortValue);
                            } else if (sortKey == 'categoryName') {
                                q.orderBy(`${CategoryTableSchema.TABLE_NAME}.${CategoryTableSchema.FIELDS.CATEGORY_NAME}`, sortValue);
                            }  else if (sortKey == 'isActive') {
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
                        let categoryData = CategoryModel.fromDto(obj, ["createdBy","password"]); 
                        ret.push(categoryData);
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
            return CategoryUseCase.findOne( q => {
                q.select(`${CategoryTableSchema.TABLE_NAME}.*`);
                q.where(`${CategoryTableSchema.TABLE_NAME}.${CategoryTableSchema.FIELDS.RID}`,rid);
                q.where(`${CategoryTableSchema.TABLE_NAME}.${CategoryTableSchema.FIELDS.IS_DELETED}`,0);
            }) 
        })
        .then((object) => {
            adminuser = object;
            
            if (adminuser == null) {
                Utils.responseError(res, new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_CATEGORY_ID_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            } else {
                let categoryData = CategoryModel.fromDto(adminuser, ["password","createdBy"]);
                res.json(categoryData);
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
        return CategoryUseCase.destroyById(rid,createdBy);
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
    let categoryRids = [];
    if(rids) {
        categoryRids = JSON.parse(rids);
    }else{
        Utils.responseError(res, new Exception(
            ErrorCode.RESOURCE.NOT_FOUND,
            MessageInfo.MI_CATEGORY_ID_NOT_FOUND,
            false,
            HttpStatus.BAD_REQUEST
        ));
        
    }
    return Promise.then(() => {
        if(categoryRids!=null) {
            let ret = [];
            categoryRids.forEach(rid => {
                let del = CategoryUseCase.destroyById(rid,createdBy);
            });
            console.log(ret);
            return ret;
        } else {
            Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.NOT_FOUND,
                MessageInfo.MI_CATEGORY_ID_NOT_FOUND,
                false,
                HttpStatus.BAD_REQUEST
            ));
            return Promise.break;
        }
    })
    .then((result) => {
        let data ={};
        data["message"] = 'Category deleted successfully';
        res.json(data);
    })
    .catch(err => {
        Utils.responseError(res, err);
    });
}

}

export default CategoryHandler;
