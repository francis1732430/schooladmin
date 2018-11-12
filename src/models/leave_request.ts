import {LeaveRequestTableSchema} from "../data/schemas";
import BaseModel from "./base";
import {Request} from "express";

export class LeaveRequestModel extends BaseModel {
    public requestId:number;
    public leaveType:string;
    public sentBy:number;
    public sentTo:number;
    public approvalStatus:number;
    public description:string;
    public dueDate:string;
    public toDate:string;
    public attachments:string;
    public notified:number;
    public approvedBy:number;
    public createdBy:number;
    public schoolId:number;
    public isActive:number;

    public static fromRequest(req:Request):LeaveRequestModel {
        if (req != null && req.body) {
            let leave = new LeaveRequestModel();
            leave.requestId=LeaveRequestModel.getNumber(req.body.requestId);
            leave.leaveType=LeaveRequestModel.getString(req.body.leaveType);
            leave.sentBy=LeaveRequestModel.getNumber(req.body.sentBy);
            leave.sentTo=LeaveRequestModel.getNumber(req.body.sentTo);
            leave.approvalStatus=LeaveRequestModel.getNumber(req.body.approvalStatus);
            leave.description=LeaveRequestModel.getString(req.body.description);
            leave.dueDate=LeaveRequestModel.getString(req.body.dueDate);
            leave.toDate=LeaveRequestModel.getString(req.body.toDate);
            leave.attachments=LeaveRequestModel.getString(req.body.attachments);
            leave.notified=LeaveRequestModel.getNumber(req.body.notified);
            leave.createdBy=LeaveRequestModel.getNumber(req.body.createdBy);
            leave.isActive=LeaveRequestModel.getNumber(req.body.isActive);
            leave.schoolId=LeaveRequestModel.getNumber(req.body.schoolId);
            return leave;
        }
        return null;
    }

    public static fromDto(object:any, filters?:string[]):LeaveRequestModel {
        if (object != null) {
            let rid = object.get(LeaveRequestTableSchema.FIELDS.RID);
            let requestId = object.get(LeaveRequestTableSchema.FIELDS.REQUEST_ID);
            let leaveType = object.get(LeaveRequestTableSchema.FIELDS.LEAVE_TYPE);
            let sentBy = object.get(LeaveRequestTableSchema.FIELDS.SENT_BY);
            let sentTo = object.get(LeaveRequestTableSchema.FIELDS.SENT_TO);
            let approvalStatus = object.get(LeaveRequestTableSchema.FIELDS.APPROVAL_STATUS);
            let description = object.get(LeaveRequestTableSchema.FIELDS.DESCRIPTION);
            let dueDate = object.get(LeaveRequestTableSchema.FIELDS.DUE_DATE);
            let toDate = object.get(LeaveRequestTableSchema.FIELDS.TO_DATE);
            let attachments = object.get(LeaveRequestTableSchema.FIELDS.ATTACHMENTS);
            let notified = object.get(LeaveRequestTableSchema.FIELDS.NOTIFIED);
            let createdBy = object.get(LeaveRequestTableSchema.FIELDS.CREATED_BY);
            let isActive = object.get(LeaveRequestTableSchema.FIELDS.IS_ACTIVE);
            let createdDate = object.get(LeaveRequestTableSchema.FIELDS.CREATED_DATE);
            let updatedDate = object.get(LeaveRequestTableSchema.FIELDS.UPDATED_DATE); 
            let ret = new LeaveRequestModel();
            ret.rid = rid != null && rid !== "" ? rid : undefined;
            ret.requestId = requestId!= null && requestId !== "" ? requestId: undefined;
            ret.leaveType = leaveType != null && leaveType !== "" ? leaveType : undefined;
            ret.sentBy = sentBy != null && sentBy !== "" ? sentBy : undefined;
            ret.sentTo = sentTo != null && sentTo !== "" ? sentTo : undefined;
            ret.approvalStatus = approvalStatus != null && approvalStatus !== "" ? approvalStatus : undefined;
            ret.description = description != null && description !== "" ? description : undefined;
            ret.dueDate = dueDate!= null && dueDate !== "" ? dueDate : undefined;
            ret.createdBy= createdBy != null && createdBy !== "" ? createdBy : undefined;
            ret.toDate = toDate != null && toDate !== "" ? toDate : undefined;
            ret.notified = notified != null && notified !== "" ? notified : undefined;
            ret.attachments = attachments != null && attachments !== "" ? attachments : undefined;
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
        obj[LeaveRequestTableSchema.FIELDS.REQUEST_ID] = this.requestId;
        obj[LeaveRequestTableSchema.FIELDS.LEAVE_TYPE] = this.leaveType;
        obj[LeaveRequestTableSchema.FIELDS.SENT_BY] = this.sentBy;
        obj[LeaveRequestTableSchema.FIELDS.SENT_TO] = this.sentTo;
        obj[LeaveRequestTableSchema.FIELDS.APPROVAL_STATUS] = this.approvalStatus;
        obj[LeaveRequestTableSchema.FIELDS.DESCRIPTION] = this.description;
        obj[LeaveRequestTableSchema.FIELDS.DUE_DATE] = this.dueDate;
        obj[LeaveRequestTableSchema.FIELDS.TO_DATE] = this.toDate;
        obj[LeaveRequestTableSchema.FIELDS.CREATED_BY] = this.createdBy;
        obj[LeaveRequestTableSchema.FIELDS.NOTIFIED] = this.notified;
        obj[LeaveRequestTableSchema.FIELDS.ATTACHMENTS] = this.attachments;
        obj[LeaveRequestTableSchema.FIELDS.IS_ACTIVE] = this.isActive;
        return obj;
    }
}

export default LeaveRequestModel;
