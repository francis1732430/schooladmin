import {CategoryTableSchema} from "../data/schemas";
import BaseModel from "./base";
import {Request} from "express";

export class CategoryModel extends BaseModel {
    public categoryId:number;
    public categoryName:string;
    public schoolId:number;
    public isActive:number;
    public createdBy:number;
    public static fromRequest(req:Request):CategoryModel {
        if (req != null && req.body) {
            let category = new CategoryModel();
            category.categoryId=CategoryModel.getNumber(req.body.categoryId);
            category.categoryName=CategoryModel.getString(req.body.categoryName);
            category.schoolId=CategoryModel.getNumber(req.body.schoolId);
            category.createdBy=CategoryModel.getNumber(req.body.createdBy);
            category.isActive=CategoryModel.getNumber(req.body.isActive);
            return category;
        }
        return null;
    }

    public static fromDto(object:any, filters?:string[]):CategoryModel {
        if (object != null) {
            let rid = object.get(CategoryTableSchema.FIELDS.RID);
            let categoryId = object.get(CategoryTableSchema.FIELDS.CATEGORY_ID);
            let categoryName = object.get(CategoryTableSchema.FIELDS.CATEGORY_NAME);
            let isActive = object.get(CategoryTableSchema.FIELDS.IS_ACTIVE);
            let createdDate = object.get(CategoryTableSchema.FIELDS.CREATED_DATE);
            let updatedDate = object.get(CategoryTableSchema.FIELDS.UPDATED_DATE);
            let ret = new CategoryModel();
            ret.rid = rid != null && rid !== "" ? rid : undefined;
            ret.categoryId = categoryId != null && categoryId !== "" ? categoryId : undefined;
            ret.categoryName = categoryName != null && categoryName !== "" ? categoryName : undefined;
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
        obj[CategoryTableSchema.FIELDS.CATEGORY_ID] = this.categoryId;
        obj[CategoryTableSchema.FIELDS.CATEGORY_NAME] = this.categoryName;
        obj[CategoryTableSchema.FIELDS.SCHOOL_ID] = this.schoolId;
        obj[CategoryTableSchema.FIELDS.IS_ACTIVE] = this.isActive;
        obj[CategoryTableSchema.FIELDS.CREATED_BY] = this.createdBy;
        return obj;
    }
}

export default CategoryModel;
