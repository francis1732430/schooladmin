import { PreventionsTableSchemas }from '../data/schemas';
import BaseModel from "./base";
import { Request }from "express";



export class PreventModel extends BaseModel {

    public preventId:string;
    public preventTitle:string;
    public preventCommand:string;
    public createdBy:number;
    public createdDate:string;
    public image:string;
    public isActive:number;
    public updatedDate:string;



    public static fromRequest(req:Request):PreventModel {

        if (req != null && req.body) {
            let prevent = new PreventModel();
            prevent.preventId = PreventModel.getString(req.body.preventId);
            prevent.preventTitle = PreventModel.getString(req.body.preventTitle);
            prevent.preventCommand = PreventModel.getString(req.body.preventCommand);
            prevent.image = PreventModel.getString(req.body.image);
            prevent.isActive = PreventModel.getNumber(req.body.isActive);
            prevent.createdBy = PreventModel.getNumber(req.body.createdBy);
            return prevent;
        }
        return null;
    }

    public static fromDto(object:any,filters?:string[]):PreventModel {

        if(object != null){
            let preventId = object.get(PreventionsTableSchemas.FIELDS.PREVENTIONS_ID);
            let preventTitle = object.get(PreventionsTableSchemas.FIELDS.PREVENTIONS_TITLE);
            let preventCommand = object.get(PreventionsTableSchemas.FIELDS.PREVENTIONS_COMMAND);
            let isActive = object.get(PreventionsTableSchemas.FIELDS.IS_ACTIVE);
            let createdDate = object.get(PreventionsTableSchemas.FIELDS.CREATED_DATE);
            let updatedDate = object.get(PreventionsTableSchemas.FIELDS.UPDATED_DATE);
            let image = object.get(PreventionsTableSchemas.FIELDS.IMAGES);
            let createdBy = object.get(PreventionsTableSchemas.FIELDS.CREATED_BY);
            let ret = new PreventModel();
            ret.preventId = preventId != null && preventId !== "" ? preventId : undefined;
            ret.preventTitle = preventTitle != null && preventTitle !== "" ? preventTitle : undefined;
            ret.preventCommand = preventCommand != null && preventCommand !== "" ? preventCommand : undefined;
            ret.isActive = isActive != null && isActive !== "" ? isActive : undefined;
            ret.image = image != null && image !== "" ? image : undefined;
            ret.createdDate = createdDate != null && createdDate !== "" ? createdDate : undefined;
            ret.updatedDate = updatedDate != null && updatedDate !== "" ? updatedDate : undefined;
            ret.createdBy = createdBy != null && createdBy !== "" ? createdBy : undefined;
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
        obj[PreventionsTableSchemas.FIELDS.PREVENTIONS_ID] = this.preventId;
        obj[PreventionsTableSchemas.FIELDS.PREVENTIONS_TITLE] = this.preventTitle;
        obj[PreventionsTableSchemas.FIELDS.PREVENTIONS_COMMAND] = this.preventCommand;
        obj[PreventionsTableSchemas.FIELDS.IS_ACTIVE] = this.isActive;
        obj[PreventionsTableSchemas.FIELDS.IMAGES] = this.image;
        obj[PreventionsTableSchemas.FIELDS.CREATED_BY] = this.createdBy;
        return obj;
    }
}

export default PreventModel;