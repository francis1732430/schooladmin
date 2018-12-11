import {CategoryTableDto} from "../data/models";
import {CategoryTableSchema} from "../data/schemas";
import {BearerObject, Logger} from "../libs";
import {ErrorCode, HttpStatus, Properties, MessageInfo} from "../libs/constants";
import {Utils} from "../libs/utils";
import {Exception, CategoryModel} from "../models";
import {Promise} from "thenfail";
import {BaseUseCase} from "./base";

export class CategoryUseCase extends BaseUseCase {

    constructor() {
        super();
        this.mysqlModel = CategoryTableDto;
    }
    public create(category:CategoryModel):Promise<any> {
       
        return Promise.then(() => {
                return CategoryTableDto.create(CategoryTableDto, category.toDto()).save();
            })
            .catch(err => {
                return Promise.reject(Utils.parseDtoError(err));
            })
            .enclose();
    }

    public updateById(id:string, category:CategoryModel):Promise<any> {
        return Promise.then(() => {
            return this.findById(id);
        })
            .then(object => {
                if(object != null && object != undefined) {
                    let awardData = CategoryModel.fromDto(object);
                    let condition={};
                    condition[CategoryTableSchema.FIELDS.RID]=id;
                    let data = category.toDto();
                    return object.save(data, {patch: true});
                }  
                  return Promise.void;
            })
            .catch(err => {
                return Promise.reject(Utils.parseDtoError(err));
            })
            .enclose();
    }

    
    public destroyById(rid:string,createdBy:number):any {
        return Promise.then(() => {
            return this.findById(rid);
        }).then(object => {
            if (object) {
                let categoryData = CategoryModel.fromDto(object);
                    let adminUser = {};
                    adminUser[CategoryTableSchema.FIELDS.IS_DELETED] = 1;
                    return object.save(adminUser, {patch: true});               
            } else {
                return Promise.reject(new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_OBJECT_ITEM_NOT_EXIST_OR_DELETED,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
            }
        }).catch(err => {
            return Promise.reject(Utils.parseDtoError(err));
        }).enclose();
    }

    
}

export default new CategoryUseCase();
