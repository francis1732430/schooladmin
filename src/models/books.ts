import {BooksTableSchema} from "../data/schemas";
import BaseModel from "./base";
import {Request} from "express";

export class BooksModel extends BaseModel {
    public bookId:number;
    public bookName:string;
    public categoryId:number;
    public description:string;
    public authorName:string;
    public bookUrl:string;
    public refBooks:string;
    public isActive:number;
    public createdBy:number;
    public schoolId:number;
    public static fromRequest(req:Request):BooksModel {
        if (req != null && req.body) {
            let Subject = new BooksModel();
            Subject.bookId=BooksModel.getNumber(req.body.bookId);
            Subject.bookName=BooksModel.getString(req.body.bookName);
            Subject.categoryId=BooksModel.getNumber(req.body.categoryId);
            Subject.description=BooksModel.getString(req.body.description);
            Subject.authorName=BooksModel.getString(req.body.authorName);
            Subject.bookUrl=BooksModel.getString(req.body.bookUrl);
            Subject.refBooks=BooksModel.getString(req.body.refBooks);
            Subject.isActive=BooksModel.getNumber(req.body.isActive);
            Subject.createdBy=BooksModel.getNumber(req.body.createdBy);
            Subject.schoolId=BooksModel.getNumber(req.body.schoolId);
            return Subject;
        }
        return null;
    }

    public static fromDto(object:any, filters?:string[]):BooksModel {
        if (object != null) {
            let rid = object.get(BooksTableSchema.FIELDS.RID);
            let bookId = object.get(BooksTableSchema.FIELDS.BOOK_ID);
            let bookName = object.get(BooksTableSchema.FIELDS.BOOK_NAME);
            let categoryId = object.get(BooksTableSchema.FIELDS.CATEGORY_ID);
            let description = object.get(BooksTableSchema.FIELDS.DESCRIPTION);
            let authorName = object.get(BooksTableSchema.FIELDS.AUTHOR_NAME);
            let bookUrl = object.get(BooksTableSchema.FIELDS.BOOK_URL);
            let refBooks = object.get(BooksTableSchema.FIELDS.REF_BOOKS);
            let isActive = object.get(BooksTableSchema.FIELDS.IS_ACTIVE);
            let createdDate = object.get(BooksTableSchema.FIELDS.CREATED_DATE);
            let updatedDate = object.get(BooksTableSchema.FIELDS.UPDATED_DATE); 
            let ret = new BooksModel();
            ret.rid = rid != null && rid !== "" ? rid : undefined;
            ret.bookId = bookId  != null && bookId  !== "" ? bookId  : undefined;
            ret.bookName = bookName != null && bookName !== "" ? bookName : undefined;
            ret.categoryId = categoryId != null && categoryId !== "" ? categoryId : undefined;
            ret.description = description != null && description !== "" ? description : undefined;
            ret.authorName = authorName != null && authorName !== "" ? authorName : undefined;
            ret.bookUrl = bookUrl != null && bookUrl !== "" ? bookUrl : undefined;
            ret.refBooks = refBooks != null && refBooks !== "" ? refBooks : undefined;
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
        obj[BooksTableSchema.FIELDS.BOOK_ID] = this.bookId;
        obj[BooksTableSchema.FIELDS.BOOK_NAME] = this.bookName;
        obj[BooksTableSchema.FIELDS.CATEGORY_ID] = this.categoryId;
        obj[BooksTableSchema.FIELDS.DESCRIPTION] = this.description;
        obj[BooksTableSchema.FIELDS.AUTHOR_NAME] = this.authorName;
        obj[BooksTableSchema.FIELDS.BOOK_URL] = this.bookUrl;
        obj[BooksTableSchema.FIELDS.REF_BOOKS] = this.refBooks;
        obj[BooksTableSchema.FIELDS.IS_ACTIVE] = this.isActive;
        obj[BooksTableSchema.FIELDS.CREATED_BY] = this.createdBy;
        obj[BooksTableSchema.FIELDS.SCHOOL_ID] = this.schoolId;
        return obj;
    }
}

export default BooksModel;
