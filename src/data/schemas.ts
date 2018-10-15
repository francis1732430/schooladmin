/**
 *    on 7/21/16.
 */

 /**
 * Merchant Schema table.
 * @type {{TABLE_NAME: string, FIELDS: {ID: string, CREATED_DATE: string, UPDATED_DATE: string, USER_ID: string, TYPE_ID: string, ITEM_ID: string, SUB_ITEM_ID: string, NAME: string, KEYWORD: string, TRANSACTION_DATE: string}}}
 */
export const MerchantSchemaTableSchema = {
    TABLE_NAME: "merchant_schema",
    FIELDS: {
        ID: "id",
        NAME: "name",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        DURATION: "duration",
        COMMISSION: "commission",
        VALIDITY: "validity",
        PRICE: "price",
        STATUS: "status",
    },
};

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
        LOCK_EXPIRES: "lock_expires"
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

/**
 *  store_scheme_type table. 
 */
export const StoreSchemeTypeTableSchema = {
    TABLE_NAME: "store_scheme_type",
    FIELDS: {
        RID:"rid",
        SCHEME_ID:"scheme_id",
        SCHEME_NAME: "scheme_name",
        DURATION: "duration",
        COMMISSION_B2B: "commission_b2b",
        COMMISSION_B2C:"commission_b2c",
        LOGISTICS_TYPE: "logistics_type",
        VALIDITY: "validity",
        MEMBERSHIP_PRICE: "membership_price",
        IS_ACTIVE : "is_active",
        ADDITIONAL_DATA: "additional_data",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED : "is_deleted"
    },
};

/**
 *  store_document_type table. 
 */
export const StoreDocumentTypeTableSchema = {
    TABLE_NAME: "store_document_type",
    FIELDS: {
        RID:"rid",
        DOCUMENT_TYPE_ID:"document_type_id",
        TYPE_NAME: "type_name",
        IS_ACTIVE : "is_active",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED : "is_deleted"
    },
};

/**
 *  store_business_info table. 
 */
export const StoreBusinessInfoTableSchema = {
    TABLE_NAME: "store_business_info",
    FIELDS: {
        RID:"rid",
        BUSINESS_ID:"business_id",
        STORE_ID:"store_id",
        BUSINESS_LEGAL_NAME: "business_legal_name",
        COMPANY_NUMBER:"company_number",
        STORE_NAME:"store_name",
        NATURE_OF_BUSINESS:"nature_of_business",
        WEBSITE_URL:"website_url",
        MOBILE_NUMBER:"mobile_number",
        PHONE_NUMBER_VERIFICATION: "phone_number_verification",
        PARENT_CATEGORIES:"parent_categories",
        ZIPCODE:"zipcode",
        ADDRESS_LINE1: "address_line1",
        ADDRESS_LINE2:"address_line2",
        CITY:"city",
        STATE: "state",
        COUNTRY_ID:"country_id",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED : "is_deleted"
    },
};

/**
 *  store_document_info table. 
 */
export const StoreDocumentInfoTableSchema = {
    TABLE_NAME: "store_document_info",
    FIELDS: {
        RID:"rid",
        DOCUMENT_ID:"document_id",
        STORE_ID:"store_id",
        DOCUMENT_TYPE_ID: "document_type_id",
        DOCUMENT_VALUE:"document_value",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED : "is_deleted"
    },
};

/**
 *  store_finance_info table. 
 */
export const StoreFinanceInfoTableSchema = {
    TABLE_NAME: "store_finance_info",
    FIELDS: {
        RID:"rid",
        FINANCE_ID:"finance_id",
        STORE_ID:"store_id",
        COMPANY_NAME: "company_name",
        BANK_NAME:"bank_name",
        CONTACT_PERSON:"contact_person",
        CONTACT_DESIGNATION: "contact_designation",
        TELEPHONE:"telephone",
        EXTENSION_NUMBER:"extension_number",
        EMAIL:"email",
        MOBILE_NUMBER1: "mobile_number1",
        MOBILE_NUMBER2:"mobile_number2",
        ACCOUNT_NUMBER:"account_number",
        ROUTING: "routing",
        BANK_ADDRESS:"bank_address",
        SWIFT_CODE:"swift_code",
        PAYPAL:"paypal",
        ADDITIONAL_DATA: "additional_data",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED : "is_deleted"
    },
};

/**
 *  store_logistic_info table. 
 */
export const StoreLogisticInfoTableSchema = {
    TABLE_NAME: "store_logistic_info",
    FIELDS: {
        RID:"rid",
        LOGISTIC_ID:"logistic_id",
        STORE_ID:"store_id",
        SCHEME_ID: "scheme_id",
        DOMESTIC:"domestic",
        INTERNATIONAL:"international",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED : "is_deleted"
    },
};

/**
 *  store_product_revenue_info table. 
 */
export const StoreProductRevenueInfoTableSchema = {
    TABLE_NAME: "store_product_revenue_info",
    FIELDS: {
        RID:"rid",
        PRODUCT_REVENUE_ID:"products_revenue_id",
        /*ADDED 2 FIELDS FOR v2 */        
        COUNTRY_GROUP_ID:"country_group_id",
        COUNTRY_ID:"country_id",
        STORE_ID:"store_id",
        CATEGORIES_SUBCATEGORIES: "categories_subcategories",
        ANNUAL_TURNOVER:"annual_turnover",
        PRODUCT_COUNT_TO_SELL:"product_count_to_sell",
        SELL_IN_OTHER_WEBSITE: "sell_in_other_website",
        OTHER_WEBSITE_URL:"other_website_url",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED : "is_deleted"
    },
};

export const StoreTaxInfoTableSchema = {
    TABLE_NAME: "store_tax_info",
    FIELDS: {
        RID:"rid",
        STORE_TAX_ID:"store_tax_id",
        STORE_ID:"store_id",
        TAX_STATE:"tax_state",
        TAX_NUMEBR: "tax_number",
        ADDITIONAL_DATA: "additional_data",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED : "is_deleted"
    },
};

/**
 *  store_scheme_info table. 
 */
export const StoreSchemeInfoTableSchema = {
    TABLE_NAME: "store_scheme_info",
    FIELDS: {
        RID:"rid",
        SCHEME_INFO_ID:"scheme_info_id",
        STORE_ID:"store_id",
        SCHEME_TYPE_ID: "scheme_type_id",
        START_DATE:"start_date",
        DURATION:"duration",
        END_DATE: "end_date",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED : "is_deleted"
    },
};

/**
 *  store_country_platform_info table. 
 */
export const StoreCountryPlatformInfoTableSchema = {
    TABLE_NAME: "store_country_platform_info",
    FIELDS: {
        RID:"rid",
        STORE_PLATFORM_ID:"store_platform_id",
        STORE_ID:"store_id",
        COUNTRY_ID:"country_id",
        PLATFORM_ID:"platform_id",
        REGISTRATION_FEE_B2B: "registration_fee_b2b",
        REGISTRATION_FEE_B2C:"registration_fee_b2c",
        TRANSACTION_FEE_B2B:"transaction_fee_b2b",
        TRANSACTION_FEE_B2C:"transaction_fee_b2c",
        AGREEMENT_PERIOD:"agreement_period",
        REMARKS:"remarks",
        ADDITIONAL_DATA: "additional_data",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED : "is_deleted"
    },
};

/**
 *  store_delivery_info table. 
 */
export const StoreDeliveryInfoTableSchema = {
    TABLE_NAME: "store_delivery_info",
    FIELDS: {
        RID:"rid",
        STORE_DELIVERY_ID:"store_delivery_id",
        STORE_ID:"store_id",
        NORMAL: "normal",
        FROZEN:"frozen",
        MERCHANT_DELIVERY:"merchant_delivery",
        OTHER:"other",
        OTHER_DETAIL:"other_detail",
        TYPE:"type",
        ESTIMATE_SKU:"estimate_sku",
        SHIPPING_FEE:"shipping_fee",
        PLATFORM:"platform",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED : "is_deleted"
    },
};


/**
 *  store_warehouse_info table. 
 */
export const StoreWarehouseInfoTableSchema = {
    TABLE_NAME: "store_warehouse_info",
    FIELDS: {
        RID:"rid",
        WAREHOUSE_ID:"warehouse_id",
        STORE_ID:"store_id",
        CONTACT_NAME: "contact_name",
        CONTACT_NUMBER:"contact_number",
        ADDRESS_LINE1: "address_line1",
        ADDRESS_LINE2:"address_line2",
        CITY_ID:"city_id",
        STATE_ID: "state_id",
        COUNTRY_ID:"country_id",
        ZIPCODE:"zipcode",
        ADDITIONAL_DATA: "additional_data",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED : "is_deleted"
    },
};

/**
 *  store_signatory_info table. 
 */
export const StoreSignatoryInfoTableSchema = {
    TABLE_NAME: "store_signatory_info",
    FIELDS: {
        RID:"rid",
        STORE_SIGNATORY_ID:"store_signatory_id",
        STORE_ID:"store_id",
        CREATED_AT: "created_at",
        APPLICANT_NAME:"applicant_name",
        DESIGNATION: "designtaion",
        APPLICANT_SIGNATURE: "applicant_signature",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED : "is_deleted"
    },
};

/**
 *  catalog_category_entity table. 
 */
export const CatalogCategoryEntityTableSchema = {
    TABLE_NAME: "catalog_category_entity",
    FIELDS: {
        RID:"rid",
        ENTITY_ID:"entity_id",
        CATEGORY_NAME:"category_name",
        STORE_ID: "store_id",
        PARENT_ID:"parent_id",
        IS_HALAL: "is_halal",
        LEVEL:"level",
        PATH:"path",
        POSITION: "position",
        SORT_ORDER: "sort_order",
        IS_ACTIVE:"is_active",
        IS_APPROVED:"is_approved",
        APPROVED_BY:"approved_by",
        CHILDREN_COUNT:"children_count",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED : "is_deleted"
    },
};

/**
 *  store_approval_request table. 
 */
export const StoreApprovalRequestTableSchema = {
    TABLE_NAME: "store_approval_request",
    FIELDS: {
        RID:"rid",
        APPROVAL_REQUEST_ID:"approval_request_id",
        STORE_ID: "store_id",
        USER_ID:"user_id",
        ROLE_ID: "role_id",
        APPROVAL_STATUS:"approval_status",
        APPROVAL_LEVEL:"approval_level",
        SENT_EMAIL: "sent_mail",
        ASSIGNED_DATE:"assigned_date",
        APPROVAL_DATE:"approval_date",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED : "is_deleted"
    },
};

/**
 *  store_approval_comment table. 
 */
export const StoreApprovalCommentTableSchema = {
    TABLE_NAME: "store_approval_comment",
    FIELDS: {
        RID:"rid",
        APPROVAL_COMMENT_ID:"approval_comment_id",
        USER_ID:"user_id",
        APPROVAL_REQUEST_ID:"approval_request_id",
        ROLE_ID: "role_id",
        IS_NOTIFIED:"is_notified",
        COMMENTS:"comments",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED : "is_deleted",
        STEP: "step",
    },
};

/**
 *  store_approval_comment table.
 */
export const StoreCertificateTypeTableSchema = {
    TABLE_NAME: "store_certificate_type",
    FIELDS: {
        RID:"rid",
        CERTIFICATE_TYPE_ID:"certificate_type_id",
        CERTIFICATE_NAME:"certificate_name",
        IS_REQUIRED:"is_required",
        IS_ACTIVE: "is_active",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED : "is_deleted"
    },
};


/**
 *  admin_approval_history table.
 */
export const AdminAprovalHistoryTableSchema = {
    TABLE_NAME: "admin_approval_history",
    FIELDS: {
        RID:"rid",
        APPROVAL_HISTORY_ID:"approval_history_id",
        ENTITY_ID:"entity_id",
        APPROVAL_TYPE:"approval_type",
        PREVIOUS_VALUE: "previous_value",
        PROPOSE_VALUE: "propose_value",
        COMMENTS: "comments",
        PROPOSED_BY: "proposed_by",
        ADDITIONAL_DATA: "additional_data",
        STATUS: "status",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED : "is_deleted"
    },
};

/******************* Version 2 DB Schema *************************/
/**
 *  store_business_info table. 
 */
export const StoreBusinessInfov2TableSchema = {
    TABLE_NAME: "store_business_info",
    FIELDS: {
        RID:"rid",
        BUSINESS_ID:"business_id",
        STORE_ID:"store_id",
        BUSINESS_LEGAL_NAME: "business_legal_name",
        COMPANY_NUMBER:"company_number",
        STORE_NAME:"store_name",
        MERCHANT_REPRESENTATIVE_NAME:"merchant_representative_name",
        NATURE_OF_BUSINESS:"nature_of_business",
        ANNUAL_TURNOVER:"annual_turnover",
        SELL_IN_OTHER_WEBSITE: "sell_in_other_website",
        OTHER_WEBSITE_URL:"other_website_url",
        WEBSITE_URL:"website_url",
        MOBILE_NUMBER:"mobile_number",
        ZIPCODE:"zipcode",
        ADDRESS_LINE1: "address_line1",
        ADDRESS_LINE2:"address_line2",
        CITY:"city",
        STATE: "state",
        COUNTRY_ID:"country_id",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED : "is_deleted"
    },
};

/**
 *  store_delivery_info table. 
 */
export const StoreDeliveryInfov2TableSchema = {
    TABLE_NAME: "store_delivery_info",
    FIELDS: {
        RID:"rid",
        STORE_DELIVERY_ID:"store_delivery_id",
        STORE_ID:"store_id",
        COUNTRY_GROUP_ID:"country_group_id",
        COUNTRY_ID:"country_id",
        NORMAL: "normal",
        FROZEN:"frozen",
        MERCHANT_DELIVERY:"merchant_delivery",
        OTHER:"other",
        OTHER_DETAIL:"other_detail", 
        ESTIMATE_SKU:"estimate_sku",
        SHIPPING_FEE:"shipping_fee",
        SCHEME_TYPE_ID: "scheme_type_id",
        START_DATE:"start_date",
        DURATION:"duration",
        END_DATE: "end_date",
        REGISTRATION_FEE_B2B: "registration_fee_b2b",
        REGISTRATION_FEE_B2C:"registration_fee_b2c",
        TRANSACTION_FEE_B2B:"transaction_fee_b2b",
        TRANSACTION_FEE_B2C:"transaction_fee_b2c",
        AGREEMENT_PERIOD:"agreement_period",
        REMARKS:"remarks",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED : "is_deleted"
    },
};

/**
 *  store_finance_info table. 
 */
export const StoreFinanceInfov2TableSchema = {
    TABLE_NAME: "store_finance_info",
    FIELDS: {
        RID:"rid",
        FINANCE_ID:"finance_id",
        STORE_ID:"store_id",
        COMPANY_NAME: "company_name",
        BANK_NAME:"bank_name",
        BRANCH_NAME:"branch_name",
        CONTACT_PERSON:"contact_person",
        CONTACT_DESIGNATION: "contact_designation",
        TELEPHONE:"telephone",
        EXTENSION_NUMBER:"extension_number",
        EMAIL:"email",
        MOBILE_NUMBER1: "mobile_number1",
        MOBILE_NUMBER2:"mobile_number2",
        ACCOUNT_NUMBER:"account_number",
        ROUTING: "routing",
        BANK_ADDRESS:"bank_address",
        SWIFT_CODE:"swift_code",
        PAYPAL:"paypal",
        TAX_STATE:"tax_state",
        TAX_NUMEBR: "tax_number",
        ADDITIONAL_DATA: "additional_data",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED : "is_deleted"
    },
};

/**
 *  store_warehouse_info table. 
 */
export const StorePickupInfoTableSchema = {
    TABLE_NAME: "store_warehouse_info",
    FIELDS: {
        RID:"rid",
        WAREHOUSE_ID:"warehouse_id",
        STORE_ID:"store_id",
        STORE_DELIVERY_ID:"store_delivery_id",
        DEFAULT_PICKUP:"default_pickup",
        CONTACT_NAME: "contact_name",
        CONTACT_NUMBER:"contact_number",
        ADDRESS_LINE1: "address_line1",
        ADDRESS_LINE2:"address_line2",
        CITY_ID:"city_id",
        STATE_ID: "state_id",
        COUNTRY_ID:"country_id",
        ZIPCODE:"zipcode",
        IS_ACTIVE:"is_active",
        ADDITIONAL_DATA: "additional_data",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED : "is_deleted"
    },
};

/**
 * Store Contact Info table.
 */
export const StoreContactInfoTableSchema = {
    TABLE_NAME: "store_contact_info",
    FIELDS: {
        RID:"rid",
        CONTACT_ID: "conatact_id",
        STORE_ID: "store_id",
        CONTACT_PERSON: "contact_person",
        EMAIL: "email",
        PHONE_NUMBER1: "phone_number1",
        PHONE_NUMBER2: "phone_number2",
        EXTENSION_NUMBER: "extension_number",
        TELEPHONE: "telephone",
        DESIGNATION: "designation",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED: "is_deleted",
    },
};

/**
 * Directory Group table.
 */
export const DirectoryGroupTableSchema = {
    TABLE_NAME: "directory_group",
    FIELDS: {
        RID:"rid",
        COUNTRY_GROUP_ID:"country_group_id",
        GROUP_NAME:"group_name",
        COUNTRY_ID:"country_id",
        IS_ACTIVE:"is_active",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED: "is_deleted",
    },
};