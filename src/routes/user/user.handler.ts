import { MessageInfo } from './../../libs/constants';
/**
 *      on 7/21/16.
 */
import {AdminUserUseCase,AuthorizationRoleUseCase} from "../../domains";
import { ErrorCode, HttpStatus, MessageInfo, Properties, DefaultVal ,DATE_FORMAT} from "../../libs/constants";
import { Utils } from "../../libs/utils";
import {  Mailer } from "../../libs";
import { Exception, AdminUserModel,AuthorizationRoleModel} from "../../models";
import * as express from "express";
import { Promise } from "thenfail";
import { AdminUserTableSchema,AuthorizationRoleTableSchema,AuthorizationRuleTableSchema, SchoolTableSchema,DirectoryDistrictTableSchema} from "../../data/schemas";
import { BaseHandler } from "../base.handler";
import { BearerObject } from "../../libs/jwt";
import * as formidable from "formidable";
import { Uploader } from "../../libs";
let fs = require('fs');  
var dateFormat = require('dateformat');

export class UserHandler extends BaseHandler {
    constructor() {
        super();
    }

    public static create(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        req.body.createdBy = session.userId;
        let checkuser: BearerObject = req[Properties.CHECK_USER];
        //req.body.schoolId=checkuser.schoolId;
        let user = AdminUserModel.fromRequest(req);
        let status = req.body.status;
        console.log(user);
        if (!Utils.requiredCheck(user.email)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_INVALID_EMAIL,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        
        if (!Utils.validateEmail(user.email)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_INVALID_EMAIL,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        let generatedPassword = Utils.randomPassword(8);
         user.password =  Utils.hashPassword(generatedPassword);
        if (!Utils.requiredCheck(user.firstname)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.USER.FIRSTNAME_EMPTY,
                MessageInfo.MI_FIRSTNAME_NOT_EMPTY,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(user.lastname)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.USER.LASTNAME_EMPTY,
                MessageInfo.MI_LASTNAME_NOT_EMPTY,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(user.createdBy)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.USER.CREATEDBY_EMPTY,
                MessageInfo.MI_CREATEDBY_NOT_EMPTY,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        console.log("tttttttttt",checkuser);
        if(checkuser.global && checkuser.global == true){
            if ( !Utils.requiredCheck(user.roleId)) {
                return Utils.responseError(res, new Exception(
                    ErrorCode.USER.ROLEID_EMPTY,
                    MessageInfo.MI_ROLEID_NOT_EMPTY,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
            }
        }
        
        if(checkuser.school && checkuser.school == true){
            if (!Utils.requiredCheck(user.roleName)) {
                return Utils.responseError(res, new Exception(
                    ErrorCode.USER.ROLEID_EMPTY,
                    MessageInfo.MI_ROLE_NAME_NOT_FOUND,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
            }
        }
        if (!Utils.requiredCheck(status)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.STATUS,
                MessageInfo.MI_STATUS_NOT_EMPTY,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        return Promise.then(() => {
            return AdminUserUseCase.create(user);
        })
        .then(object => {
            Mailer.newUser(user.firstname,user.email, generatedPassword);
            let data  ={};
            data["password"] = generatedPassword;
            data["message"] = MessageInfo.MI_USER_ADDED;
            res.json(data);
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
            console.log(AdminUserTableSchema.FIELDS);
            return AdminUserUseCase.countByQuery(q => {
            
                q.leftJoin(`${AuthorizationRoleTableSchema.TABLE_NAME} AS ar`, `ar.${AuthorizationRoleTableSchema.FIELDS.USER_ID}`, `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`);
                q.leftJoin(`${AuthorizationRoleTableSchema.TABLE_NAME} AS arg`, `arg.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID}`, `ar.${AuthorizationRoleTableSchema.FIELDS.PARENT_ID}`);
                q.innerJoin(`${AdminUserTableSchema.TABLE_NAME} AS user`, `user.${AdminUserTableSchema.FIELDS.USER_ID}`, `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.CREATED_BY}`);
                q.leftJoin(`${SchoolTableSchema.TABLE_NAME}`,  `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.SCHOOL_ID}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_ID}`);
                let condition;
           
                if(checkuser.global == true){
                    if(checkuser.tmp == true){
                            condition = `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}=0 and ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.SCHOOL_ID}=${schoolId}`;
                    }
                    else if(session.userId=='1') {
                        condition = `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}=0 and ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.SCHOOL_ID} IS NULL`;

                    } else {
                        condition = `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.CREATED_BY} = "${session.userId}" AND ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}=0 and ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.SCHOOL_ID} IS NULL`;
                    }
                } else if(checkuser.school == true) {
                    if(session.userId=='1') {
                        condition = `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}=0 and ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.SCHOOL_ID}=${schoolId}`;
                    } else {
                        condition = `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.CREATED_BY} = "${session.userId}" AND ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}=0 and ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.SCHOOL_ID}=${schoolId}`;
                    }
                }else {
                    condition = `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}=0 and ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.SCHOOL_ID}=0`;
                }
                
                q.whereRaw(condition);               

                if (searchobj) {
                    for (let key in searchobj) {
                        if(searchobj[key]!=null && searchobj[key]!=''){
                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            let ColumnKey = Utils.changeSearchKey(key);
                            if(key=='roleName'){
                                condition = `(arg.${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key=='createdByName'){
                                condition = `CONCAT(user.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', user.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                                q.andWhereRaw(condition);
                            } else if(key == 'firstname') {
                                condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'lastname'){
                                condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'schoolName'){
                                condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'email') {
                                condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'isActive') {
                                condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'createdDate') {
                                condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            } else if(key == 'updatedDate') {
                                condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                q.andWhereRaw(condition);
                            }
                        }
                    }
                }  
            });
        })
            .then((totalObject) => {
                total = totalObject;
                return AdminUserUseCase.findByQuery(q => {
                    q.select(`${AdminUserTableSchema.TABLE_NAME}.*`,
                        `ar.${AuthorizationRoleTableSchema.FIELDS.PARENT_ID}`,
                        `arg.${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME}`,
                        `user.${AdminUserTableSchema.FIELDS.FIRSTNAME} AS createdByFname`,
                        `user.${AdminUserTableSchema.FIELDS.LASTNAME}  AS createdByLname`,
                         `${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_NAME}`);
                    q.leftJoin(`${AuthorizationRoleTableSchema.TABLE_NAME} AS ar`, `ar.${AuthorizationRoleTableSchema.FIELDS.USER_ID}`, `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`);
                    q.leftJoin(`${AuthorizationRoleTableSchema.TABLE_NAME} AS arg`, `arg.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID}`, `ar.${AuthorizationRoleTableSchema.FIELDS.PARENT_ID}`);
                    q.innerJoin(`${AdminUserTableSchema.TABLE_NAME} AS user`, `user.${AdminUserTableSchema.FIELDS.USER_ID}`, `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.CREATED_BY}`);
                    q.leftJoin(`${SchoolTableSchema.TABLE_NAME}`,  `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.SCHOOL_ID}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_ID}`);
                    let condition;
                   
                if(checkuser.global == true){
                    if(checkuser.tmp == true){
                            condition = `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}=0 and ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.SCHOOL_ID}=${schoolId}`;
                    }
                    else if(session.userId=='1') {
                        condition = `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}=0 and ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.SCHOOL_ID} IS NULL`;

                    } else {
                        condition = `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.CREATED_BY} = "${session.userId}" AND ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}=0 and ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.SCHOOL_ID} IS NULL`;
                    }
                } else if(checkuser.school == true) {
                    if(session.userId=='1') {
                        condition = `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}=0 and ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.SCHOOL_ID}=${schoolId}`;
                    } else {
                        condition = `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.CREATED_BY} = "${session.userId}" AND ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}=0 and ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.SCHOOL_ID}=${schoolId}`;
                    }
                }else {
                    condition = `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}=0 and ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.SCHOOL_ID}=0`;
                }
                    
                    q.whereRaw(condition);               
    
                    if (searchobj) {
                        for (let key in searchobj) {
                            if(searchobj[key]!=null && searchobj[key]!=''){
                                console.log(searchobj[key]);
                                let searchval = searchobj[key];
                                let ColumnKey = Utils.changeSearchKey(key);
                                if(key=='roleName'){
                                    condition = `(arg.${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key=='createdByName'){
                                    condition = `CONCAT(user.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', user.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                                    q.andWhereRaw(condition);
                                } else if(key == 'firstname') {
                                    condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key == 'lastname'){
                                    condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key == 'email') {
                                    condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key == 'schoolName'){
                                    condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key == 'isActive') {
                                    condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key == 'createdDate') {
                                    condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                                    q.andWhereRaw(condition);
                                } else if(key == 'updatedDate') {
                                    condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
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
                            if (sortKey == 'roleName') {
                                q.orderBy(`arg.${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME}`, sortValue);
                            } else if (sortKey == 'createdByName') {
                                q.orderBy(`user.${AdminUserTableSchema.FIELDS.FIRSTNAME}`, sortValue);
                                q.orderBy(`user.${AdminUserTableSchema.FIELDS.LASTNAME}`, sortValue);
                            } else if (sortKey == 'status') {
                                q.orderBy(`user.${AdminUserTableSchema.FIELDS.IS_ACTIVE}`, sortValue);
                            } else if (sortKey == 'firstname') {
                                q.orderBy(ColumnSortKey, sortValue);
                            } else if (sortKey == 'lastname') {
                                q.orderBy(ColumnSortKey, sortValue);
                            } else if (sortKey == 'email') {
                                q.orderBy(ColumnSortKey, sortValue);
                            } else if (sortKey == 'schoolName') {
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
                        let adminUseData = AdminUserModel.fromDto(obj, ["createdBy","password"])
                        
                       //adminUseData["roleName"] = roles[adminUseData["roleId"]]; 
                        ret.push(adminUseData);
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
 
    public static export(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
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
        let adminUser:any;
        return Promise.then(() => {

            
            return AdminUserUseCase.findByQuery(q => {
                q.select(`${AdminUserTableSchema.TABLE_NAME}.*`,
                `ar.${AuthorizationRoleTableSchema.FIELDS.PARENT_ID}`,
                `arg.${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME}`,
                `user.${AdminUserTableSchema.FIELDS.FIRSTNAME} AS createdByFname`,
                `user.${AdminUserTableSchema.FIELDS.LASTNAME}  AS createdByLname`,
                 );
                q.leftJoin(`${AuthorizationRoleTableSchema.TABLE_NAME} AS ar`, `ar.${AuthorizationRoleTableSchema.FIELDS.USER_ID}`, `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`);
                q.leftJoin(`${AuthorizationRoleTableSchema.TABLE_NAME} AS arg`, `arg.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID}`, `ar.${AuthorizationRoleTableSchema.FIELDS.PARENT_ID}`);
                q.innerJoin(`${AdminUserTableSchema.TABLE_NAME} AS user`, `user.${AdminUserTableSchema.FIELDS.USER_ID}`, `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.CREATED_BY}`);
                let condition;
                if(session.userId=='1') {
                    condition = `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}=0`;
                } else {
                    condition = `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.CREATED_BY} = "${session.userId}" AND ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}=0`;
                }
                q.whereRaw(condition);               

                if (searchobj) {
                    for (let key in searchobj) {
                        if(searchobj[key]!=null && searchobj[key]!=''){
                            console.log(searchobj[key]);
                            let searchval = searchobj[key];
                            if(key=='roleName'){
                                condition = `(arg.${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME} LIKE "%${searchval}%")`;  
                            } else if(key=='createdByName'){
                                condition = `CONCAT(user.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', user.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                            } else {
                                let ColumnKey = Utils.changeSearchKey(key);
                                condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                            }
                            q.andWhereRaw(condition);
                        }
                    }
                }  
                if(sortKey!=null && sortValue!='') {
                    if(sortKey=='roleName'){
                        q.orderBy(`arg.${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME}`, sortValue);
                    } else if(sortKey=='createdByName') {
                        q.orderBy(`user.${AdminUserTableSchema.FIELDS.FIRSTNAME}`, sortValue);
                        q.orderBy(`user.${AdminUserTableSchema.FIELDS.LASTNAME}`, sortValue);
                    }else if(sortKey=='status'){
                        q.orderBy(`user.${AdminUserTableSchema.FIELDS.IS_ACTIVE}`, sortValue);
                    } else {
                        let ColumnSortKey = Utils.changeSearchKey(sortKey);
                        q.orderBy(ColumnSortKey, sortValue);
                    }
                }

            }, []);
        })
        .then((object) => {
            adminUser = object;
            let csvdata:string;
            csvdata = "User Id,Name,Email,Role,Status,Created By,Created On,Last Updated On"+'\n';
            if (adminUser != null && adminUser.models != null) {
                adminUser.models.forEach(obj => {
                    let userdata = AdminUserModel.fromDto(obj, ["createdBy","password"]);
                    let status = userdata.status==1?"Active":"Inactive";
                    csvdata += userdata["userId"]+","+userdata["firstname"]+" "+userdata["lastname"]+","+userdata["email"]+","+userdata["roleName"]+","+status+","+userdata.createdByName+","+dateFormat(userdata["createdDate"], DATE_FORMAT.DEFAULT)+","+dateFormat(userdata["updatedDate"], DATE_FORMAT.DEFAULT)+'\n';
                });
            }
            let now = dateFormat(new Date(), "yyyy_mm_dd_h_MM_ss");
            let fileName = `Users_${now}.csv`;
            let filePath = 'export/'+fileName;
            fs.writeFile(filePath, csvdata, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
            return Uploader.uploadCSV(filePath,fileName);
        })
        .then((exportLink) => {
            console.log(exportLink.Location);
            let data = {};
            data["link"] = exportLink.Location;
            res.json(data);
        })
        .catch(err => {
            Utils.responseError(res, err);
        });
    }


    public static getById(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let rid = req.params.rid || "";
        let adminuser:any;

        return Promise.then(() => {
            //return AdminUserUseCase.findById(rid, []); 
            return AdminUserUseCase.findByQuery(q => {
                q.select(`${AdminUserTableSchema.TABLE_NAME}.*`,
                    `${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.PARENT_ID}`,
                    `${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME}`,
                    `user.${AdminUserTableSchema.FIELDS.FIRSTNAME} AS createdByFname`,
                    `user.${AdminUserTableSchema.FIELDS.LASTNAME}  AS createdByLname`,
                    `${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_NAME}`);
                q.innerJoin(AuthorizationRoleTableSchema.TABLE_NAME, `${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.USER_ID}`, `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`);
                q.leftJoin(`${AdminUserTableSchema.TABLE_NAME} AS user`, `user.${AdminUserTableSchema.FIELDS.USER_ID}`, `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.CREATED_BY}`);
                q.leftJoin(`${SchoolTableSchema.TABLE_NAME}`,  `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.SCHOOL_ID}`,`${SchoolTableSchema.TABLE_NAME}.${SchoolTableSchema.FIELDS.SCHOOL_ID}`);
                let condition 
               // if(session.userId=='1') {
                    condition = `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.RID}="${rid}" AND ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}=0`;
                //} else {
                    //condition = `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.RID}="${rid}" AND ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.CREATED_BY} = "${session.userId}" AND ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}=0`;
                //}
                q.whereRaw(condition); 
            }) 
        })
        .then((object) => {
            adminuser = object;
            
            if (adminuser == null && adminuser.models.length == 0) {
                Utils.responseError(res, new Exception(
                    ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND,
                    MessageInfo.MI_USER_NOT_EXIST,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            } else {
                let adminUseData = AdminUserModel.fromDto(adminuser.models[0], ["password","createdBy"])
               // adminUseData["roleName"] = roles[adminUseData["roleId"]]; 
               adminUseData["schoolName"]=object.models[0].get("school_name");
                res.json(adminUseData);
            }
        })
        .catch(err => {
            Utils.responseError(res, err);
        });
    }

    public static update(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let checkuser: BearerObject = req[Properties.CHECK_USER];
        let rid = req.params.rid || "";
        let isActive=req.body.status;
        let user = AdminUserModel.fromRequest(req);
        user.createdBy = parseInt(session.userId);
        if (!Utils.requiredCheck(user.email)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_INVALID_EMAIL,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        
        if (!Utils.validateEmail(user.email)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.INVALID_EMAIL,
                MessageInfo.MI_INVALID_EMAIL,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(user.firstname)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.USER.FIRSTNAME_EMPTY,
                MessageInfo.MI_FIRSTNAME_NOT_EMPTY,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        if (!Utils.requiredCheck(user.lastname)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.USER.LASTNAME_EMPTY,
                MessageInfo.MI_LASTNAME_NOT_EMPTY,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        if (!Utils.requiredCheck(user.status)) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.REQUIRED_ERROR,
                MessageInfo.MI_STATUS_NOT_EMPTY,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        if (!isActive || isActive != 0 && isActive != 1) {
            return Utils.responseError(res, new Exception(
                ErrorCode.RESOURCE.GENERIC,
                MessageInfo.MI_STATUS_ERROR,
                false,
                HttpStatus.BAD_REQUEST
            ));

        }
        return Promise.then(() => {
            return AdminUserUseCase.findOne( q => {
                q.whereNot(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.RID}`,rid);
                q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.EMAIL}`,user.email);
                q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}`,0);
            })
        }).then((object) => {
            if(object != null){
                Utils.responseError(res, new Exception(
                    ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND,
                    MessageInfo.MI_EMAIL_ALREADY_USE,
                    false, 
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
            return AdminUserUseCase.findById(rid);
        })
            .then(object => {
                if (object == null) {
                    Utils.responseError(res, new Exception(
                        ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND,
                        MessageInfo.MI_USER_NOT_EXIST,
                        false, 
                        HttpStatus.BAD_REQUEST
                    ));
                    return Promise.break;
                } else {
                    return AdminUserUseCase.updateById(rid, user);
                }
            })
            .then(object => { 
                let userData = AdminUserModel.fromDto(object, ["createdByName","password","createdDate","updatedDate","createdBy"]);
                AuthorizationRoleUseCase.updateUserRole(req.body.roleId, userData["userId"]);
                userData["roleId"] = req.body.roleId;
                userData["message"] = MessageInfo.MI_USER_UPDATED;
                res.json(userData);
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
            return AdminUserUseCase.destroyById(rid,createdBy);
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
        let userRids = [];
        if(rids) {
            userRids = JSON.parse(rids);
        }else{
            Utils.responseError(res, new Exception(
                ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND,
                MessageInfo.MI_USER_NOT_EXIST,
                false,
                HttpStatus.BAD_REQUEST
            ));
            
        }
        return Promise.then(() => {
            if(userRids!=null) {
                let ret = [];
                userRids.forEach(rid => {
                    let del = AdminUserUseCase.destroyById(rid,createdBy);
                    //console.log("====================fdgdfgdfg",del);
                    //ret.push());
                });
                console.log(ret);
                return ret;
            } else {
                Utils.responseError(res, new Exception(
                    ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND,
                    MessageInfo.MI_USER_NOT_EXIST,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
                return Promise.break;
            }
        })
        .then((result) => {
            let data ={};
            data["message"] = MessageInfo.MI_USER_DELETED;
            res.json(data);
        })
        .catch(err => {
            Utils.responseError(res, err);
        });
    }

    public static exportSelected(req: express.Request, res: express.Response): any {
        let session: BearerObject = req[Properties.SESSION];
        let rids = req.body.rids || "";
        let userRids = [];

        if (rids) {
            userRids = JSON.parse(rids);
        } else {
           return Utils.responseError(res, new Exception(
                ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND,
                MessageInfo.MI_USER_NOT_EXIST,
                false,
                HttpStatus.BAD_REQUEST
            ));

        }
        let adminUser:any;
        return Promise.then(() => {

            return AdminUserUseCase.findByQuery( q => {
                q.select(`${AdminUserTableSchema.TABLE_NAME}.*`,
                    `ar.${AuthorizationRoleTableSchema.FIELDS.PARENT_ID}`,
                    `arg.${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME}`,
                    `user.${AdminUserTableSchema.FIELDS.FIRSTNAME} AS createdByFname`,
                    `user.${AdminUserTableSchema.FIELDS.LASTNAME}  AS createdByLname`
                );
                q.leftJoin(`${AuthorizationRoleTableSchema.TABLE_NAME} AS ar`, `ar.${AuthorizationRoleTableSchema.FIELDS.USER_ID}`, `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`);
                q.leftJoin(`${AuthorizationRoleTableSchema.TABLE_NAME} AS arg`, `arg.${AuthorizationRoleTableSchema.FIELDS.ROLE_ID}`, `ar.${AuthorizationRoleTableSchema.FIELDS.PARENT_ID}`);
                q.innerJoin(`${AdminUserTableSchema.TABLE_NAME} AS user`, `user.${AdminUserTableSchema.FIELDS.USER_ID}`, `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.CREATED_BY}`);
                let condition;
                if(session.userId=='1') {
                    condition = `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}=0`;
                } else {
                    condition = `${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.CREATED_BY} = "${session.userId}" AND ${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}=0`;
                }
                q.whereRaw(condition);
                q.whereIn(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.RID}`, userRids);
            })

        })
            .then((object) => {
                adminUser = object;
                let csvdata:string;
                csvdata = "User Id,Name,Email,Role,Status,Created By,Created On,Last Updated On"+'\n';
                if (adminUser != null && adminUser.models != null) {
                    adminUser.models.forEach(obj => {
                        let userdata = AdminUserModel.fromDto(obj, ["createdBy","password"]);
                        let status = userdata.status==1?"Active":"Inactive";
                        csvdata += userdata["userId"]+","+userdata["firstname"]+" "+userdata["lastname"]+","+userdata["email"]+","+userdata["roleName"]+","+status+","+userdata.createdByName+","+dateFormat(userdata["createdDate"], DATE_FORMAT.DEFAULT)+","+dateFormat(userdata["updatedDate"], DATE_FORMAT.DEFAULT)+'\n';
                    });
                }
                let now = dateFormat(new Date(), "yyyy_mm_dd_h_MM_ss");
                let fileName = `Users_${now}.csv`;
                let filePath = 'export/'+fileName;
                fs.writeFile(filePath, csvdata, (err) => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                });
                return Uploader.uploadCSV(filePath, fileName);
            })
            .then((exportLink) => {
                 console.log(exportLink.Location);
                 let data = {};
                 data["link"] = exportLink.Location;
                 res.json(data);
            })
            .catch(err => {
                Utils.responseError(res, err);
            });
    }

   
public static getUsers(req: express.Request, res: express.Response): any {
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
    let districtId:any;
    let parentId:any;
    let total = 0;
    return Promise.then(() => {
          if(session.userId != '1')
        return AuthorizationRoleUseCase.findOne(q => {
            q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.USER_ID}`,session.userId);
            q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.IS_DELETED}`,0);

        })
    }).then((object) => { 
        return AdminUserUseCase.countByQuery(q => {
            let condition;
            q.innerJoin(`${AuthorizationRoleTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.USER_ID}`);
            q.innerJoin(`${DirectoryDistrictTableSchema.TABLE_NAME}`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.DISTRICT_ID}`);
         if(session.userId != '1') {
            districtId=object.get('assigned_district');
            parentId=object.get('parent_id');
          if(parentId == '32'){
            q.whereIn(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.PARENT_ID}`,['33','221']);
            q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.DISTRICT_ID}`,districtId);
          } else if(parentId == '33'){
            q.whereIn(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.PARENT_ID}`,['221']);
            q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.DISTRICT_ID}`,districtId);
          }

          //q.whereIn(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.PARENT_ID}`,['32','33','221']);
         }  else {
            q.whereIn(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.PARENT_ID}`,['32','33','221']);
         }              
         q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}`,0);
           // q.whereRaw(condition);               
            if (searchobj) {
                for (let key in searchobj) {
                    if(searchobj[key]!=null && searchobj[key]!=''){
                        console.log(searchobj[key]);
                        let searchval = searchobj[key];
                        let ColumnKey = Utils.changeSearchKey(key);
                        if(key=='roleName'){
                            condition = `(arg.${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        } else if(key=='createdByName'){
                            condition = `CONCAT(user.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', user.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                            q.andWhereRaw(condition);
                        } else if(key == 'firstname') {
                            condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        } else if(key == 'lastname'){
                            condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        } else if(key == 'schoolName'){
                            condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        } else if(key == 'email') {
                            condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        } else if(key == 'districtName') {
                            condition = `(${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        } else if(key == 'isActive') {
                            condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        } else if(key == 'createdDate') {
                            condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        } else if(key == 'updatedDate') {
                            condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        }

                    }
                }
            }  
        });
    })
        .then((totalObject) => {
            total = totalObject;
            return AdminUserUseCase.findByQuery(q => {
               q.select(`${AdminUserTableSchema.TABLE_NAME}.*`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME}`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME}`);
               let condition;
            q.innerJoin(`${AuthorizationRoleTableSchema.TABLE_NAME}`,`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.USER_ID}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.USER_ID}`);
            q.innerJoin(`${DirectoryDistrictTableSchema.TABLE_NAME}`,`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_ID}`,`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.DISTRICT_ID}`);
            if(session.userId != '1') {
          if(parentId == '32'){
            q.whereIn(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.PARENT_ID}`,['33','221']);
            q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.DISTRICT_ID}`,districtId);
          } else if(parentId == '33'){
            q.whereIn(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.PARENT_ID}`,['221']);
            q.where(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.DISTRICT_ID}`,districtId);
          }
         } else {
            q.whereIn(`${AuthorizationRoleTableSchema.TABLE_NAME}.${AuthorizationRoleTableSchema.FIELDS.PARENT_ID}`,['32','33','221']);
         }   
         q.where(`${AdminUserTableSchema.TABLE_NAME}.${AdminUserTableSchema.FIELDS.IS_DELETED}`,0);        
          //  q.whereRaw(condition);               
            if (searchobj) {
                for (let key in searchobj) {
                    if(searchobj[key]!=null && searchobj[key]!=''){
                        console.log(searchobj[key]);
                        let searchval = searchobj[key];
                        let ColumnKey = Utils.changeSearchKey(key);
                        if(key=='roleName'){
                            condition = `(arg.${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        } else if(key=='createdByName'){
                            condition = `CONCAT(user.${AdminUserTableSchema.FIELDS.FIRSTNAME},' ', user.${AdminUserTableSchema.FIELDS.LASTNAME}) LIKE "%${searchval}%"`;
                            q.andWhereRaw(condition);
                        } else if(key == 'firstname') {
                            condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        } else if(key == 'lastname'){
                            condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        } else if(key == 'schoolName'){
                            condition = `(${SchoolTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        } else if(key == 'email') {
                            condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        } else if(key == 'districtName') {
                            condition = `(${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        } else if(key == 'isActive') {
                            condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        } else if(key == 'createdDate') {
                            condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
                            q.andWhereRaw(condition);
                        } else if(key == 'updatedDate') {
                            condition = `(${AdminUserTableSchema.TABLE_NAME}.${ColumnKey} LIKE "%${searchval}%")`;
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
                        if (sortKey == 'roleName') {
                            q.orderBy(`arg.${AuthorizationRoleTableSchema.FIELDS.ROLE_NAME}`, sortValue);
                        } else if (sortKey == 'createdByName') {
                            q.orderBy(`user.${AdminUserTableSchema.FIELDS.FIRSTNAME}`, sortValue);
                            q.orderBy(`user.${AdminUserTableSchema.FIELDS.LASTNAME}`, sortValue);
                        } else if (sortKey == 'status') {
                            q.orderBy(`user.${AdminUserTableSchema.FIELDS.IS_ACTIVE}`, sortValue);
                        } else if (sortKey == 'districtName') {
                            q.orderBy(`${DirectoryDistrictTableSchema.TABLE_NAME}.${DirectoryDistrictTableSchema.FIELDS.DISTRICT_NAME}`, sortValue);
                        } else if (sortKey == 'firstname') {
                            q.orderBy(ColumnSortKey, sortValue);
                        } else if (sortKey == 'lastname') {
                            q.orderBy(ColumnSortKey, sortValue);
                        } else if (sortKey == 'email') {
                            q.orderBy(ColumnSortKey, sortValue);
                        } else if (sortKey == 'schoolName') {
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
                    let userData = AdminUserModel.fromDto(obj, ["createdBy","password"]); 
                    userData['distirctName']=obj.get('district_name');
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



}





export default UserHandler;
