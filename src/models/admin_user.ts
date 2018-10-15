import { StoreBusinessInfoTableSchema } from './../data/schemas';
/**
 *      on 7/21/16.
 */
import {AdminUserTableSchema,AuthorizationRoleTableSchema,StoreBusinessInfoTableSchema} from "../data/schemas";
import {AuthorizationRoleModel} from "./authorization_role";
import BaseModel from "./base";
import {Request} from "express";
import {Utils} from "../libs/utils";
import { AdminUserUseCase } from "../domains/admin_user";
export class AdminUserModel extends BaseModel {
    public email:string;
    public userId:number;
    public firstname:string;
    public lastname:string;
    public createdBy:number;
    public createdByName:string;
    public phoneNumber1:string;
    public phoneNumber2:string;
    public role:any;
    public roleId:any;
    public roleName:string;
    public roleIsDeleted:number;
    public password:string;
    public isDeleted:number;
    public extensionNumber:string;
    public telephone:string;
    public designation:string;
    public merchantRepresentativeName:string;
    public approvalStatus:number;
    public status: number;
    public companyNumber:string;
    public storeName:string;
    public businessLegalName:string;
    public approvalRole:string;
    public approvalStatusKey:string;

    public static fromRequest(req:Request):AdminUserModel {
        if (req != null && req.body) {
            let user = new AdminUserModel();
            //user.id = AdminUserModel.getNumber(req.body.id);
            user.rid = AdminUserModel.getString(req.body.rid);
            user.email = AdminUserModel.getString(req.body.email);
            user.firstname = AdminUserModel.getString(req.body.firstname);
            user.lastname = AdminUserModel.getString(req.body.lastname);
            user.createdBy = AdminUserModel.getNumber(req.body.createdBy);
            user.phoneNumber1 = AdminUserModel.getString(req.body.phoneNumber1);
            user.phoneNumber2 = AdminUserModel.getString(req.body.phoneNumber2);
            user.extensionNumber = AdminUserModel.getString(req.body.extensionNumber);
            user.telephone = AdminUserModel.getString(req.body.telephone);
            user.designation = AdminUserModel.getString(req.body.designation);
            user.merchantRepresentativeName = AdminUserModel.getString(req.body.merchantRepresentativeName);
            user.roleId = AdminUserModel.getNumber(req.body.roleId);
            user.password = Utils.hashPassword(AdminUserModel.getString(req.body.password));
            user.status = AdminUserModel.getNumber(req.body.status);
            return user;
        }
        return null;
    }

    public static fromDto(object:any, filters?:string[]):AdminUserModel {
        if (object != null) {
            let userId = object.get(AdminUserTableSchema.FIELDS.USER_ID);
            if (userId != null && userId !== "") {
                let rid = object.get(AdminUserTableSchema.FIELDS.RID);
                let createdDate = object.get(AdminUserTableSchema.FIELDS.CREATED_DATE);
                let updatedDate = object.get(AdminUserTableSchema.FIELDS.UPDATED_DATE);
                let email = object.get(AdminUserTableSchema.FIELDS.EMAIL);
                let firstname = object.get(AdminUserTableSchema.FIELDS.FIRSTNAME);
                let lastname = object.get(AdminUserTableSchema.FIELDS.LASTNAME);
                let phoneNumber1 = object.get(AdminUserTableSchema.FIELDS.PHONE_NUMBER1);
                let phoneNumber2 = object.get(AdminUserTableSchema.FIELDS.PHONE_NUMBER2);
                let createdBy = object.get(AdminUserTableSchema.FIELDS.CREATED_BY);
                let roleId = object.get(AuthorizationRoleTableSchema.FIELDS.PARENT_ID);
                let roleName = object.get(AuthorizationRoleTableSchema.FIELDS.ROLE_NAME);
                let roleIsDeleted = object.get(AuthorizationRoleTableSchema.FIELDS.IS_DELETED);
                let companyNumber = object.get(StoreBusinessInfoTableSchema.FIELDS.COMPANY_NUMBER);
                let storeName = object.get(StoreBusinessInfoTableSchema.FIELDS.STORE_NAME);
                let password = object.get(AdminUserTableSchema.FIELDS.PASSWORD);
                let extensionNumber = object.get(AdminUserTableSchema.FIELDS.EXTENSION_NUMBER);
                let telephone = object.get(AdminUserTableSchema.FIELDS.TELEPHONE);
                let designation = object.get(AdminUserTableSchema.FIELDS.DESIGNATION);
                let merchantRepresentativeName = object.get(AdminUserTableSchema.FIELDS.MERCHANT_REPRESENTATIVE_NAME);
                let approvalStatus = object.get(AdminUserTableSchema.FIELDS.APPROVAL_STATUS);
                let approvalRole = object.get(AdminUserTableSchema.FIELDS.APPROVAL_ROLE);
                let businessLegalName = object.get(StoreBusinessInfoTableSchema.FIELDS.BUSINESS_LEGAL_NAME);
                let status = object.get(AdminUserTableSchema.FIELDS.IS_ACTIVE);
                let approvalStatusKey = object.get('approvalStatusKey')
                let createdByName = object.get('createdByFname')+" "+object.get('createdByLname');

                let ret = new AdminUserModel();
                ret.createdDate = createdDate != null ? createdDate : "";
                ret.updatedDate = updatedDate != null ? updatedDate : "";
                ret.email = email != null && email !== "" ? email : "";
                ret.firstname = firstname != null && firstname !== "" ? firstname : "";
                ret.lastname = lastname != null && lastname !== "" ? lastname : "";
                ret.userId = userId != null && userId !== "" ? userId : "";
                ret.phoneNumber1 = phoneNumber1 != null && phoneNumber1 !== "" ? phoneNumber1 : "";
                ret.phoneNumber2 = phoneNumber2 != null && phoneNumber2 !== "" ? phoneNumber2 : "";
                ret.rid = rid != null && rid !== "" ? rid : "";
                ret.createdBy = createdBy != null && createdBy !== "" ? createdBy : "";
                ret.roleId = roleId != null && roleId !== "" ? roleId : "";
                ret.roleName = roleName != null && roleName !== "" ? roleName : "";
                ret.password = password != null && password !== "" ? password : "";
                ret.extensionNumber = extensionNumber != null && extensionNumber !== "" ? extensionNumber : "";
                ret.telephone= telephone != null && telephone !== "" ? telephone : "";
                ret.designation = designation != null && designation !== "" ? designation : "";
                ret.merchantRepresentativeName = merchantRepresentativeName != null && merchantRepresentativeName !== "" ? merchantRepresentativeName : "";
                ret.storeName = storeName != null && storeName !== "" ? storeName : "";
                ret.companyNumber = companyNumber != null && companyNumber !== "" ? companyNumber : "";
                ret.approvalStatus = approvalStatus != null && approvalStatus !== "" ? approvalStatus : "";
                ret.approvalRole = approvalRole != null && approvalRole !== "" ? approvalRole : "";
                ret.businessLegalName = businessLegalName != null && businessLegalName !== "" ? businessLegalName : "";
                ret.status = status != null && status !== "" ? status : "";
                ret.createdByName = createdByName != null && createdByName !== "" ? createdByName : "";
                ret.roleIsDeleted = roleIsDeleted != null && roleIsDeleted !== "" ? roleIsDeleted : "";
                ret.approvalStatusKey = approvalStatusKey;
               
                if (object.relations != null) {
                    if (object.relations.role != null) { 
                        ret.roleId = null;
                        let role = AuthorizationRoleModel.fromDto(object.relations.role, filters);
                        if (role != null) {
                            ret.role = role;
                        }
                    }
                }

                if (filters != null) {
                    filters.forEach(filter => {
                        ret[filter] = undefined;
                    });
                }
                return ret;
            }
        }
        return null;
    }

    public toDto():any {
        let obj = {};
        if(this.userId)
            obj[AdminUserTableSchema.FIELDS.USER_ID] = this.userId;
        obj[AdminUserTableSchema.FIELDS.EMAIL] = this.email;
        obj[AdminUserTableSchema.FIELDS.FIRSTNAME] = this.firstname;
        obj[AdminUserTableSchema.FIELDS.LASTNAME] = this.lastname;
        if(this.createdBy)
            obj[AdminUserTableSchema.FIELDS.CREATED_BY] = this.createdBy;
        obj[AdminUserTableSchema.FIELDS.PHONE_NUMBER1] = this.phoneNumber1;
        obj[AdminUserTableSchema.FIELDS.PHONE_NUMBER2] = this.phoneNumber2;
        if(this.password)
            obj[AdminUserTableSchema.FIELDS.PASSWORD] = this.password;

        obj[AdminUserTableSchema.FIELDS.APPROVAL_STATUS] = this.approvalStatus;
        obj[AdminUserTableSchema.FIELDS.IS_ACTIVE] = this.status;
        obj[AdminUserTableSchema.FIELDS.IS_DELETED] = this.isDeleted;
        obj[AdminUserTableSchema.FIELDS.EXTENSION_NUMBER] = this.extensionNumber;
        obj[AdminUserTableSchema.FIELDS.TELEPHONE] = this.telephone;
        obj[AdminUserTableSchema.FIELDS.DESIGNATION] = this.designation;
        obj[AdminUserTableSchema.FIELDS.MERCHANT_REPRESENTATIVE_NAME] = this.merchantRepresentativeName;
        return obj;
    }
}

export default AdminUserModel;
