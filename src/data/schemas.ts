/**
 *    on 7/21/16.
 */

 /**
 * Merchant Schema table.
 * @type {{TABLE_NAME: string, FIELDS: {ID: string, CREATED_DATE: string, UPDATED_DATE: string, USER_ID: string, TYPE_ID: string, ITEM_ID: string, SUB_ITEM_ID: string, NAME: string, KEYWORD: string, TRANSACTION_DATE: string}}}
 */
/**
 * Admin User table.
 */
export const AdminUserTableSchema = {
    TABLE_NAME: "admin_user",
    FIELDS: {
        RID:"rid",
        USER_ID: "user_id",
        FIRSTNAME: "firstname",
        LASTNAME: "lastname",
        EMAIL: "email",
        USERNAME: "username",
        PASSWORD: "password",
        CREATED_BY: "created_by",
        PHONE_NUMBER1: "phone_number1",
        PHONE_NUMBER2: "phone_number2",
        EXTENSION_NUMBER: "extension_number",
        TELEPHONE: "telephone",
        DESIGNATION: "designation",
        MERCHANT_REPRESENTATIVE_NAME: "merchant_representative_name",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED: "is_deleted", 
        APPROVAL_STATUS:"approval_status",
        APPROVAL_ROLE:"approval_role",
        LOGDATE: "logdate",
        LOGNUM: "lognum",
        IS_ACTIVE: "is_active",
        EXTRA: "extra",
        RP_TOKEN: "rp_token",
        RP_TOKEN_CREATED_AT: "rp_token_created_at",
        INTERFACE_LOCALE: "interface_locale",
        FALIURES_NUM: "failures_num",
        FIRST_FALIURE: "first_failure",
        LOCK_EXPIRES: "lock_expires",
        SCHOOL_ID:"school_id"
    },
};

/**
 * Admin User Session table.
 */
export const AdminUserSessionTableSchema = {
    TABLE_NAME: "admin_user_session",
    FIELDS: {
        RID:"rid",
        ID: "id",
        SESSION_ID: "session_id",
        USER_ID: "user_id",
        STATUS: "status",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IP: "ip",
        //EXPIRE: "expire",
        DEVICE_ID: "device_id",
        DEVICE_TOKEN: "device_token",
        PLATFORM: "platform",
    },
};

/**
 * Authorization Role table.
 */
export const AuthorizationRoleTableSchema = {
    TABLE_NAME: "authorization_role",
    FIELDS: {
        RID:"rid",
        ROLE_ID: "role_id",
        PARENT_ID: "parent_id",
        TREE_LEVEL: "tree_level",
        SORT_ORDER: "sort_order",
        ROLE_TYPE: "role_type",
        USER_ID: "user_id",
        APPROVAL_ROLE: "approval_role",
        APPROVAL_LEVEL: "approval_level",
        USER_TYPE: "user_type",
        PERMISSION_TYPE:"permission_type",
        ROLE_NAME: "role_name",
        DEFAULT_ROLE:"default_role",
        SCHOOL_ID:"school_id",
        SCHOOL_TMP_ID:"school_tmp_id",
        CREATED_BY: "created_by",
        IS_DELETED: "is_deleted",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
    },
};  


/**
 * Authorization Rule table.
 */
export const AuthorizationRuleTableSchema = {
    TABLE_NAME: "authorization_rule",
    FIELDS: {
        RID:"rid",
        RULE_ID: "rule_id",
        ROLE_ID: "role_id",
        MODULE_ID: "module_id",
        PERMISSION: "permission",
        SCHOOL_ID:"school_id",
        USER_ID:"user_id",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
    },
};

/**
 * Authorization Rule Set table.
 */
export const AuthorizationRuleSetTableSchema = {
    TABLE_NAME: "authorization_rule_set",
    FIELDS: {
        RID:"rid",
        MODULE_ID: "module_id",
        PARENT_ID: "parent_id",
        LEVEL: "level",
        ROLE_ID: "role_id",
        MODULE_NAME: "module_name",
        ACTION: "action",
        ROUTES: "routes",
        ICON: "icon",
        SCHOOL_ID:"null",
        IS_DELETED:"is_deleted",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
    },
};

/**
 * Core Config Data table.
 */
export const CoreConfigDataTableSchema = {
    TABLE_NAME: "core_config_data",
    FIELDS: {
        RID:"rid",
        CONFIG_ID: "config_id",
        COUNTRY_ID: "country_id",
        CONFIG_KEY: "config_key",
        CONFIG_VALUE: "config_value",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
    },
};

/**
 *  Directory Country table.
 */
export const DirectoryCountryTableSchema = {
    TABLE_NAME: "directory_country",
    FIELDS: {
        COUNTRY_ID: "country_id",
        ISO2_CODE: "iso2_code",
        ISO3_CODE: "iso3_code",
        COUNTRY_NAME: "country_name",
        RID:"rid",
        ENTITY_ID:"entity_id",
        IS_ACTIVE: "is_active",
        IS_DELETED : "is_deleted",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
    },
};

/**
 *  Directory State table.
 */
export const DirectoryStateTableSchema = {
    TABLE_NAME: "directory_state",
    FIELDS: {
        RID:"rid",
        STATE_ID:"state_id",
        STATE_NAME: "state_name",
        COUNTRY_ID: "country_id",
        IS_ACTIVE: "is_active",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED : "is_deleted"
    },
};


/**
 *  Directory City table.
 */
export const DirectoryCityTableSchema = {
    TABLE_NAME: "directory_city",
    FIELDS: {
        RID:"rid",
        CITY_ID:"city_id",
        CITY_NAME: "city_name",
        STATE_ID: "state_id",
        IS_ACTIVE: "is_active",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED : "is_deleted"
    },
};

/**
 *  Server Endpoint table. 
 */
export const ServerEndpointTableSchema = {
    TABLE_NAME: "server_endpoint",
    FIELDS: {
        RID:"rid",
        ENDPOINT_ID:"endpoint_id",
        COUNTRY_ID: "country_id",
        FRONTEND_URL: "frontend_url",
        API_URL: "api_url",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
    },
};

