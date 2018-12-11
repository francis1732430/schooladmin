import {UserDetailSchema} from "../data/schemas";
import BaseModel from "./base";
import {Request} from "express";

export class UserDetailModel extends BaseModel {
    public userDetailsId:number;
    public designation:string;
    public salary:string;
    public employeeType:string;
    public imageUrl:string;
    public dateOfBirth:string;
    public userId:string;
    public districtId:string;
    public cityId:string;
    public isActive:number;
    public static fromRequest(req:Request):UserDetailModel {
        if (req != null && req.body) {
            let Details = new UserDetailModel();
            Details.userDetailsId=UserDetailModel.getNumber(req.body.userDetailsId);
            Details.designation=UserDetailModel.getString(req.body.designation);
            Details.employeeType=UserDetailModel.getString(req.body.employeeType);
            Details.imageUrl=UserDetailModel.getString(req.body.imageUrl);
            Details.dateOfBirth=UserDetailModel.getString(req.body.dateOfBirth);
            Details.userId=UserDetailModel.getString(req.body.userId);
            Details.districtId=UserDetailModel.getString(req.body.districtId);
            Details.cityId=UserDetailModel.getString(req.body.cityId);
            return Details;
        }
        return null;
    }

    public static fromDto(object:any, filters?:string[]):UserDetailModel {
        if (object != null) {
            let rid = object.get(UserDetailSchema.FIELDS.RID);
            let userDetailsId = object.get(UserDetailSchema.FIELDS.USER_DETAILS_ID);
            let designation = object.get(UserDetailSchema.FIELDS.DESIGNATION);
            let employeeType = object.get(UserDetailSchema.FIELDS.EMPLOYEE_TYPE);
            let imageUrl = object.get(UserDetailSchema.FIELDS.IMAGE_URL);
            let dateOfBirth = object.get(UserDetailSchema.FIELDS.DATE_OF_BIRTH);
            let userId = object.get(UserDetailSchema.FIELDS.USER_ID);
            let districtId = object.get(UserDetailSchema.FIELDS.DISTRICT_ID);
            let cityId = object.get(UserDetailSchema.FIELDS.CITY_ID);
            let createdDate = object.get(UserDetailSchema.FIELDS.CREATED_DATE);
            let updatedDate = object.get(UserDetailSchema.FIELDS.UPDATED_DATE); 
            let ret = new UserDetailModel();
            ret.rid = rid != null && rid !== "" ? rid : undefined;
            ret.userDetailsId = userDetailsId != null && userDetailsId !== "" ? userDetailsId : undefined;
            ret.designation= designation != null && designation !== "" ? designation : undefined;
            ret.employeeType = employeeType!= null && employeeType !== "" ? employeeType : undefined;
            ret.imageUrl = imageUrl != null && imageUrl !== "" ? imageUrl : undefined;
            ret.dateOfBirth = dateOfBirth != null && dateOfBirth !== "" ? dateOfBirth : undefined;
            ret.userId = userId != null && userId !== "" ? userId : undefined;
            ret.districtId = districtId != null && districtId !== "" ? districtId : undefined;
            ret.cityId = cityId != null && cityId !== "" ? cityId : undefined;
            ret.createdDate = createdDate != null && createdDate !== "" ? createdDate : undefined;
            ret.updatedDate = updatedDate != null && updatedDate !== "" ? updatedDate : undefined;
            if (object.relations != null) {
                
            }
            if (filters != null) {
                filters.forEach(filter => {
                    ret[filter] = undefined;
                });
            }
            return ret;
        }
        return null;
    }

    public toDto():any {
        let obj = {};
        obj[UserDetailSchema.FIELDS.USER_DETAILS_ID] = this.userDetailsId;
        obj[UserDetailSchema.FIELDS.EMPLOYEE_TYPE] = this.employeeType;
        obj[UserDetailSchema.FIELDS.DESIGNATION] = this.designation;
        obj[UserDetailSchema.FIELDS.IMAGE_URL] = this.imageUrl;
        obj[UserDetailSchema.FIELDS.DATE_OF_BIRTH] = this.dateOfBirth;
        obj[UserDetailSchema.FIELDS.USER_ID] = this.userId;
        obj[UserDetailSchema.FIELDS.DISTRICT_ID] = this.districtId;
        obj[UserDetailSchema.FIELDS.CITY_ID] = this.cityId;
        return obj;
    }
}

export default UserDetailModel;
