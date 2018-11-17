import { TimingTableSchema }from '../data/schemas';
import BaseModel from "./base";
import { Request }from "express";



export class TimingModel extends BaseModel{

    public TimeId:string;
    public noon:number;
    public Time:string;
    public createdDate:string;
    public isActive:number;
    public updatedDate:string;

    public static fromRequest(req:Request):TimingModel {

        if (req != null && req.body) {
            let timing = new TimingModel();
            timing.TimeId = TimingModel.getString(req.body.TimeId);
            timing.Time = TimingModel.getString(req.body.Time);
            timing.noon = TimingModel.getNumber(req.body.noon);
           timing.isActive = TimingModel.getNumber(req.body.isActive);
            return timing;
        }
        return null;
    }

    public static objRequest(req:Request):TimingModel {

        let timing = new TimingModel();
             timing.TimeId = TimingModel.getString(req.weakId);
             timing.Time = TimingModel.getString(req.Time); 
            timing.noon = TimingModel.getNumber(req.weakName);
            timing.isActive = TimingModel.getNumber(req.isActive);
            return timing;
    }

    public static fromDto(object:any,filters?:string[]):TimingModel {

        if(object != null){
            let TimeId = object.get(TimingTableSchema.FIELDS.TIME_ID);
            let Time = object.get(TimingTableSchema.FIELDS.TIME);
            let noon = object.get(TimingTableSchema.FIELDS.NOON);
            let isActive = object.get(TimingTableSchema.FIELDS);
            let createdDate = object.get(TimingTableSchema.FIELDS.CREATED_DATE);
            let updatedDate = object.get(TimingTableSchema.FIELDS.UPDATED_DATE);
            let ret = new TimingModel();
            ret.TimeId = TimeId != null && TimeId !== "" ? TimeId : undefined;
            ret.noon = noon != null && noon !== "" ? noon : undefined;
            ret.Time = Time != null && Time !== "" ? Time : undefined;
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
        obj[TimingTableSchema.FIELDS.TIME_ID] = this.TimeId;
        obj[TimingTableSchema.FIELDS.TIME] = this.Time;
        obj[TimingTableSchema.FIELDS.NOON] = this.noon;
        obj[TimingTableSchema.FIELDS.IS_ACTIVE] = this.isActive;
        return obj;
    }
}