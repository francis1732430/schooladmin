import {NoticesTableSchema} from "../data/schemas";
import BaseModel from "./base";
import {Request} from "express";

export class NoticesModel extends BaseModel {
    public noticeId:number;
    public description:string;
    public levels:number;
    public sentBy:string;
    public sentTo:string;
    public sectionId:string;
    public imageUrl:string;
    public sentToSchool:string;
    public title:string;
    public isActive:number;
    public createdBy:number;
    public schoolId:string;
    public static fromRequest(req:Request):NoticesModel {
        if (req != null && req.body) {
            let notices = new NoticesModel();
            notices.noticeId=NoticesModel.getNumber(req.body.noticeId);
            notices.description=NoticesModel.getString(req.body.description);
            notices.levels=NoticesModel.getNumber(req.body.levels);
            notices.sentBy=NoticesModel.getString(req.body.sentBy);
            notices.sentTo=NoticesModel.getString(req.body.sentTo);
            notices.sectionId=NoticesModel.getString(req.body.standardId);
            notices.imageUrl=NoticesModel.getString(req.body.imageUrl);
            notices.sentToSchool=NoticesModel.getString(req.body.sentToSchool);
            notices.title=NoticesModel.getString(req.body.title);
            notices.schoolId=NoticesModel.getString(req.body.schoolId);
            notices.isActive=NoticesModel.getNumber(req.body.isActive);
            notices.createdBy=NoticesModel.getNumber(req.body.createdBy);
            return notices;
        }
        return null;
    }

    public static fromDto(object:any, filters?:string[]):NoticesModel {
        if (object != null) {
            let rid = object.get(NoticesTableSchema.FIELDS.RID);
            let noticeId = object.get(NoticesTableSchema.FIELDS.NOTICE_ID);
            let description = object.get(NoticesTableSchema.FIELDS.DESCRIPTION);
            let levels = object.get(NoticesTableSchema.FIELDS.LEVELS);
            let sentBy = object.get(NoticesTableSchema.FIELDS.SENT_BY);
            let sentTo = object.get(NoticesTableSchema.FIELDS.SENT_TO);
            let sectionId = object.get(NoticesTableSchema.FIELDS.SECTION_ID);
            let imageUrl = object.get(NoticesTableSchema.FIELDS.IMAGE_URL);
            let sentToSchool = object.get(NoticesTableSchema.FIELDS.SENT_TO_SCHOOL);
            let title = object.get(NoticesTableSchema.FIELDS.TITLE);
            let isActive = object.get(NoticesTableSchema.FIELDS.IS_ACTIVE);
            let createdDate = object.get(NoticesTableSchema.FIELDS.CREATED_DATE);
            let updatedDate = object.get(NoticesTableSchema.FIELDS.UPDATED_DATE); 
            let ret = new NoticesModel();
            ret.rid = rid != null && rid !== "" ? rid : undefined;
            ret.noticeId = noticeId != null && noticeId !== "" ? noticeId : undefined;
            ret.description = description != null && description !== "" ? description : undefined;
            ret.levels = levels != null && levels !== "" ? levels : undefined;
            ret.sentBy = sentBy != null && sentBy !== "" ? sentBy : undefined;
            ret.sentTo = sentTo != null && sentTo !== "" ? sentTo : undefined;
            ret.sectionId = sectionId != null && sectionId !== "" ? sectionId : undefined;
            ret.imageUrl = imageUrl != null && imageUrl !== "" ?imageUrl : undefined;
            ret.sentToSchool = sentToSchool != null && sentToSchool !== "" ?sentToSchool : undefined;
            ret.title = title != null && title !== "" ?title : undefined;
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
        obj[NoticesTableSchema.FIELDS.NOTICE_ID] = this.noticeId;
        obj[NoticesTableSchema.FIELDS.DESCRIPTION] = this.description ;
        obj[NoticesTableSchema.FIELDS.LEVELS] = this.levels;
        obj[NoticesTableSchema.FIELDS.SENT_BY] = this.sentBy;
        obj[NoticesTableSchema.FIELDS.SENT_TO] = this.sentTo;
        obj[NoticesTableSchema.FIELDS.SECTION_ID] = this.sectionId;
        obj[NoticesTableSchema.FIELDS.IMAGE_URL] = this.imageUrl;
        obj[NoticesTableSchema.FIELDS.SENT_TO_SCHOOL] = this.sentToSchool;
        obj[NoticesTableSchema.FIELDS.IS_ACTIVE] = this.isActive;
        obj[NoticesTableSchema.FIELDS.TITLE] = this.title;
        obj[NoticesTableSchema.FIELDS.SCHOOL_ID] = this.schoolId;
        return obj;
    }
}

export default NoticesModel;
