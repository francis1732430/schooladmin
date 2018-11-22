import { WeakTableSchema }from '../data/schemas';
import BaseModel from "./base";
import { Request }from "express";


export class WeakDayModel extends BaseModel {
    public weakId:string;
    public weakName:string;
    public createdDate:string;
    public isActive:number;
    public updatedDate:string;
    

    public static fromRequest(req:Request):WeakDayModel {

        if (req != null && req.body) {
            let weakDay = new WeakDayModel();
            weakDay.weakId = WeakDayModel.getString(req.body.weakId);
            weakDay.weakName = WeakDayModel.getString(req.body.weakName);
           weakDay.isActive = WeakDayModel.getNumber(req.body.isActive);
            return weakDay;
        }
        return null;
    }

    // public static objRequest(req:Request):WeakDayModel {

    //     let weakDay = new WeakDayModel();
    //          weakDay.weakId = WeakDayModel.getString(req.weakId); 
    //         weakDay.weakName = WeakDayModel.getString(req.weakName);
    //         weakDay.isActive = WeakDayModel.getNumber(req.isActive);
    //         return weakDay;
    // }

    public static fromDto(object:any,filters?:string[]):WeakDayModel {

        if(object != null){
            let weakId = object.get(WeakTableSchema.FIELDS.WEAK_ID);
            let weakName = object.get(WeakTableSchema.FIELDS.WEAK_NAME);
            let isActive = object.get(WeakTableSchema.FIELDS.IS_ACTIVE);

            let createdDate = object.get(WeakTableSchema.FIELDS.CREATED_DATE);
            let updatedDate = object.get(WeakTableSchema.FIELDS.UPDATED_DATE);
            let ret = new WeakDayModel();
            ret.weakId = weakId != null && weakId !== "" ? weakId : undefined;
            ret.weakName = weakName != null && weakName !== "" ? weakName : undefined;
            ret.isActive = isActive != null && isActive !== "" ? isActive : undefined;
            ret.createdDate = createdDate != null && createdDate !== "" ? createdDate : undefined;
            ret.updatedDate = updatedDate != null && updatedDate !== "" ? updatedDate : undefined;

            if(filters != null){
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
        obj[WeakTableSchema.FIELDS.WEAK_ID] = this.weakId;
        obj[WeakTableSchema.FIELDS.WEAK_NAME] = this.weakName;
        obj[WeakTableSchema.FIELDS.IS_ACTIVE] = this.isActive;
        return obj;
    }
    
}

export default WeakDayModel;