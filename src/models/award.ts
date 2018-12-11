import {AwardTableSchema} from "../data/schemas";
import BaseModel from "./base";
import {Request} from "express";

export class AwardModel extends BaseModel {
    public awardId:number;
    public awardName:string;
    public awardDescription:string;
    public userId:number;
    public imageUrl:string;
    public certificateUrls:string;
    public isActive:number;
    public createdBy:number;
    public schoolId:string;

    public static fromRequest(req:Request):AwardModel {
        if (req != null && req.body) {
            let award = new AwardModel();
            award.awardId=AwardModel.getNumber(req.body.awardId);
            award.awardName=AwardModel.getString(req.body.awardName);
            award.awardDescription=AwardModel.getString(req.body.awardDescription);
            award.userId=AwardModel.getNumber(req.body.userId);
            award.imageUrl=AwardModel.getString(req.body.imageUrl);
            award.certificateUrls=AwardModel.getString(req.body.certificateUrls);
            award.schoolId=AwardModel.getString(req.body.schoolId);
            award.isActive=AwardModel.getNumber(req.body.isActive);
            award.createdBy=AwardModel.getNumber(req.body.createdBy);
            return award;
        }
        return null;
    }

    public static fromDto(object:any, filters?:string[]):AwardModel {
        if (object != null) {
            let rid = object.get(AwardTableSchema.FIELDS.RID);
            let awardId = object.get(AwardTableSchema.FIELDS.AWARD_ID);
            let awardName = object.get(AwardTableSchema.FIELDS.AWARD_NAME);
            let awardDescription = object.get(AwardTableSchema.FIELDS.AWARD_DESCRIPTION);
            let userId = object.get(AwardTableSchema.FIELDS.USER_ID);
            let imageUrl = object.get(AwardTableSchema.FIELDS.IMAGE_URL);
            let certificateUrls = object.get(AwardTableSchema.FIELDS.CERTFICATE_URL);
            let schoolId = object.get(AwardTableSchema.FIELDS.SCHOOL_ID);
            let isActive = object.get(AwardTableSchema.FIELDS.IS_ACTIVE);
            let createdDate = object.get(AwardTableSchema.FIELDS.CREATED_DATE);
            let updatedDate = object.get(AwardTableSchema.FIELDS.UPDATED_DATE); 
            let ret = new AwardModel();
            ret.rid = rid != null && rid !== "" ? rid : undefined;
            ret.awardId = awardId != null && awardId !== "" ? awardId : undefined;
            ret.awardName= awardName != null && awardName !== "" ? awardName : undefined;
            ret.awardDescription = awardDescription != null && awardDescription !== "" ? awardDescription : undefined;
            ret.userId = userId != null && userId !== "" ? userId : undefined;
            ret.imageUrl = imageUrl != null && imageUrl !== "" ? imageUrl : undefined;
            ret.certificateUrls = certificateUrls != null && certificateUrls !== "" ? certificateUrls: undefined;
            ret.schoolId = schoolId != null && schoolId !== "" ? schoolId : undefined;
            ret.isActive = isActive != null && isActive !== "" ? isActive : undefined;
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
        obj[AwardTableSchema.FIELDS.AWARD_NAME] = this.awardName;
        obj[AwardTableSchema.FIELDS.AWARD_ID] = this.awardId;
        obj[AwardTableSchema.FIELDS.AWARD_DESCRIPTION] = this.awardDescription;
        obj[AwardTableSchema.FIELDS.USER_ID] = this.userId;
        obj[AwardTableSchema.FIELDS.IMAGE_URL] = this.imageUrl;
        obj[AwardTableSchema.FIELDS.CERTFICATE_URL] = this.certificateUrls;
        obj[AwardTableSchema.FIELDS.SCHOOL_ID] = this.schoolId;
        obj[AwardTableSchema.FIELDS.IS_ACTIVE] = this.isActive;
        obj[AwardTableSchema.FIELDS.CREATED_BY] = this.createdBy;
        return obj;
    }
}

export default AwardModel;
