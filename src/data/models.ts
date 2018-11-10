/**
 *    on 7/21/16.
 */
import Mysql from "./connection";
import {
    AdminUserSessionTableSchema,
    AdminUserTableSchema,
    AuthorizationRoleTableSchema,
    AuthorizationRuleTableSchema,
    AuthorizationRuleSetTableSchema,
    CoreConfigDataTableSchema,
    DirectoryCountryTableSchema,
    ServerEndpointTableSchema,
    DirectoryStateTableSchema,
    DirectoryCityTableSchema,
    DirectoryDistrictTableSchema,
    DirectoryTalukTableSchema,
    SchoolTableSchema,
    StandardEntityTableSchema,
    ClassEntityTableSchema,
    SubjectTableSchema,
    ExamTypesTableSchema,
    ExamTableSchema
} from "./schemas";
import * as Bookshelf from "bookshelf";
import * as UUID from "node-uuid";

export class BaseDto extends Mysql.Model<BaseDto>, Bookshelf.Model<BaseDto> {
    public static knex() {
        return Mysql.knex;
    }

    public static create(clazz:typeof BaseDto, value?:Object):Bookshelf.Model<any> {
        if (value != null) {
            //noinspection TypeScriptValidateTypes,TypeScriptUnresolvedFunction
            return new clazz().set(value);
        }
        //noinspection TypeScriptValidateTypes
        return new clazz();
    }

    private static generateUuid(model:any):void {
        if (model.isNew()) {
            model.set(model.idAttribute, UUID.v4());
        }
    }

    get idAttribute():string {
        return "rid";
    }

    get hasTimestamps():string[] {
        return ["created_date", "updated_date"];
    }

    public initialize():void {
        //noinspection TypeScriptUnresolvedFunction
        this.on("saving", BaseDto.generateUuid);
    }
}

export class AdminUserSessionDto extends BaseDto {
    get tableName() {
        return AdminUserSessionTableSchema.TABLE_NAME;
    }

    public adminUser():any {
        //noinspection TypeScriptUnresolvedFunction
        return this.belongsTo(AdminUserDto, AdminUserSessionTableSchema.FIELDS.USER_ID);
    }
}

export class AdminUserDto extends BaseDto {
    get tableName():string {
        return AdminUserTableSchema.TABLE_NAME;
    }

    /*public role():any {
        //noinspection TypeScriptUnresolvedFunction
        return this.belongsTo(RoleDto, AdminUserTableSchema.FIELDS.ROLE);
    }*/
}

export class AuthorizationRoleDto extends BaseDto {
    get tableName():string {
        return AuthorizationRoleTableSchema.TABLE_NAME;
    }

    public authorizationrole():string {
        return this.hasOne(AuthorizationRoleDto, AuthorizationRoleTableSchema.FIELDS.PARENT_ID);
    }

    public authorizationrule():string {
        return this.hasMany(AuthorizationRuleDto, AuthorizationRuleTableSchema.FIELDS.ROLE_ID);
    }
}

export class AuthorizationRuleDto extends BaseDto {
    get tableName():string {
        return AuthorizationRuleTableSchema.TABLE_NAME;
    }

    public authorizationRuleSet():any {
        //noinspection TypeScriptUnresolvedFunction
        return this.belongsTo(AuthorizationRuleSetDto, AuthorizationRuleSetTableSchema.FIELDS.MODULE_ID);
    }
}

export class AuthorizationRuleSetDto extends BaseDto {
    get tableName():string {
        return AuthorizationRuleSetTableSchema.TABLE_NAME;
    }
}
export class CoreConfigDataDto extends BaseDto {
    get tableName():string {
        return CoreConfigDataTableSchema.TABLE_NAME;
    }
}
export class DirectoryCountryDto extends BaseDto {
    get tableName():string {
        return DirectoryCountryTableSchema.TABLE_NAME;
    }
}

export class DirectoryStateDto extends BaseDto {
    get tableName():string {
        return DirectoryStateTableSchema.TABLE_NAME;
    }
}

export class DirectoryCityDto extends BaseDto {
    get tableName():string {
        return DirectoryCityTableSchema.TABLE_NAME;
    }
}

export class ServerEndpointDto extends BaseDto {
    get tableName():string {
        return ServerEndpointTableSchema.TABLE_NAME;
    }
}

export class DirectoryDistrictDto extends BaseDto {
    get tableName():string {
        return DirectoryDistrictTableSchema.TABLE_NAME;
    }
}

export class DirectoryTalukDto extends BaseDto {
    get tableName():string {
        return DirectoryTalukTableSchema.TABLE_NAME;
    }
}
export class SchoolDto extends BaseDto {
    get tableName():string {
        return SchoolTableSchema.TABLE_NAME;
    }
}

export class StandardDto extends BaseDto {
    get tableName():string {
        return StandardEntityTableSchema.TABLE_NAME;
    }
}

export class ClassEntityDto extends BaseDto {
    get tableName():string {
        return ClassEntityTableSchema.TABLE_NAME;
    }
}

export class SubjectEntityDto extends BaseDto {
    get tableName():string {
        return SubjectTableSchema.TABLE_NAME;
    }
}

export class ExamTypesDto extends BaseDto {
    get tableName():string {
        return ExamTypesTableSchema.TABLE_NAME;
    }
}

export class ExamsDto extends BaseDto {
    get tableName():string {
        return ExamTableSchema.TABLE_NAME;
    }
}