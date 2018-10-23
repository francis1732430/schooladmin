/**
 *      on 7/21/16.
 */
export const Properties = {
    MOBILE_USER_AGENT: 'mobile',
    SESSION: "session",
    HEADER_DEVICE_ID: "device-id",
    HEADER_TOTAL: "Total",
    HEADER_OFFSET: "Offset",
    HEADER_LIMIT: "Limit",
    FORM_IMAGE: "image",
    FORM_TYPE: "type",
    FORM_FILE: "file",
    FORM_VIDEO_BLOB: "video",
    FORM_VIDEO_TITLE: "title",
    FORM_VIDEO_DESC: "desc",
    FORM_VIDEO_DURATION: "duration",
    FORM_VIDEO_PRICE: "price",
    FORM_VIDEO_CATEGORY: "category",
    FORM_VIDEO_THUMBNAIL: "thumbnail",
    SCHOOL_ID:"schoolid",
    CHECK_USER:"checkuser",
    CATEGORIES: ['Freshman', 'Sophomore', 'Senior', 'Junior'],
    STATUS: {
        APPROVAL: {
            DRAFT: "Draft",
            APPROVED: "Approved",
            NEW: "New",
            INPROGRESS: "In Progress",
            INCORRECT: "Incorrect Info",
            REJECT: "Reject",
        },
        LEVEL: {
            ONE: {
                KEYWORD: "1",
                PRICE: "100",
            },
            TWO: {
                KEYWORD: "2",
                PRICE: "200",
            },
            THREE: {
                KEYWORD: "3",
                PRICE: "500",
            },
            FOUR: {
                KEYWORD: "4",
                PRICE: "1000",
            },
            FIVE: {
                KEYWORD: "5",
                PRICE: "2000",
            },
            SIX: {
                KEYWORD: "6",
                PRICE: "5000",
            },
        },
    },
    ROLE: {
        SYSTEM_ADMIN: "systemAdmin",
        STUDENT: "student",
        SCHOOL_ADMIN: "schoolAdmin",
        SCHOOL_ADMIN_R: "schooladmin", // This matches with role in db
    },
    CHALLENGE_NOTIFICATION: {
        TYPE: {
            CHALLENGING: 0,
            ACCEPT: 1,
            REJECT: 2,
        }
    },
    ONE_TIME_PASSWORD: {
        EMAIL: "email",
        SMS: "sms"
    },
    VARIABLE: {
        CONTACT_PHONE_KEYWORD: "ContactPhone",
    },
    QUIZ_EXAM_TYPE: {
        QUIZ: "quiz",
        EXAM: "exam",
        QUIZ_MAX_QUESTION: 10,
        EXAM_MAX_QUESTION: 25,
        EXAM_PASS_PERCENTAGE: 80,
    },
    CATEGORY_TYPE: {
        FRESHMAN: "Freshman",
        SOPHOMORE: "Sophomore",
        JUNIOR: "Junior",
        SENIOR: "Senior",
    },
    CALCULATOR_TYPE: {
        PERSONAL_BUDGET: 'PersonalBudget',
        MORTGAGE_LOAN: 'MortgageLoan',
        PAY_OFF_CALCULATOR: 'PayOffCalculator'
    },
    DBKEYWORDS: {
        CONFIGKEY: {
            ROLLOUTCOUNTRY: "rollout",
            TRUE_ANSWER: "trueAnswer",
            FALSE_ANSWER: "falseAnswer",
            MATCHING: "matching",
            RANKING: "ranking"
        },
        LEVEL: {
            ONE: {
                KEYWORD: "1",
                PRICE: "100",
            },
            TWO: {
                KEYWORD: "2",
                PRICE: "200",
            },
            THREE: {
                KEYWORD: "3",
                PRICE: "500",
            },
            FOUR: {
                KEYWORD: "4",
                PRICE: "1000",
            },
            FIVE: {
                KEYWORD: "5",
                PRICE: "2000",
            },
            SIX: {
                KEYWORD: "6",
                PRICE: "5000",
            },
        },
    },
};

export const HttpStatus = {
    ACCEPTED: 202,
    BAD_GATEWAY: 502,
    BAD_REQUEST: 400,
    CONFLICT: 409,
    CONTINUE: 100,
    CREATED: 201,
    EXPECTATION_FAILED: 417,
    FAILED_DEPENDENCY: 424,
    FORBIDDEN: 403,
    GATEWAY_TIMEOUT: 504,
    GONE: 410,
    HTTP_VERSION_NOT_SUPPORTED: 505,
    INSUFFICIENT_SPACE_ON_RESOURCE: 419,
    INSUFFICIENT_STORAGE: 507,
    INTERNAL_SERVER_ERROR: 500,
    LENGTH_REQUIRED: 411,
    LOCKED: 423,
    METHOD_FAILURE: 420,
    METHOD_NOT_ALLOWED: 405,
    MOVED_PERMANENTLY: 301,
    MOVED_TEMPORARILY: 302,
    MULTI_STATUS: 207,
    MULTIPLE_CHOICES: 300,
    NETWORK_AUTHENTICATION_REQUIRED: 511,
    NO_CONTENT: 204,
    NON_AUTHORITATIVE_INFORMATION: 203,
    NOT_ACCEPTABLE: 406,
    NOT_FOUND: 404,
    NOT_IMPLEMENTED: 501,
    NOT_MODIFIED: 304,
    OK: 200,
    PARTIAL_CONTENT: 206,
    PAYMENT_REQUIRED: 402,
    PRECONDITION_FAILED: 412,
    PRECONDITION_REQUIRED: 428,
    PROCESSING: 102,
    PROXY_AUTHENTICATION_REQUIRED: 407,
    REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
    REQUEST_TIMEOUT: 408,
    REQUEST_TOO_LONG: 413,
    REQUEST_URI_TOO_LONG: 414,
    REQUESTED_RANGE_NOT_SATISFIABLE: 416,
    RESET_CONTENT: 205,
    SEE_OTHER: 303,
    SERVICE_UNAVAILABLE: 503,
    SWITCHING_PROTOCOLS: 101,
    TEMPORARY_REDIRECT: 307,
    TOO_MANY_REQUESTS: 429,
    UNAUTHORIZED: 401,
    UNPROCESSABLE_ENTITY: 422,
    UNSUPPORTED_MEDIA_TYPE: 415,
    USE_PROXY: 305,
};

export const ErrorCode = {
    UNKNOWN: {
        TYPE: "Unknown",
        GENERIC: 0,
    },
    RESOURCE: {
        TYPE: "Resource",
        GENERIC: 1000,
        INVALID_URL: 1001,
        NOT_FOUND: 1002,
        DUPLICATE_RESOURCE: 1003,
        INVALID_REQUEST: 1004,
        INVALID_EMAIL: 1005,
        INVALID_NAME: 1006,
        INVALID_PASSWORD: 1007,
        USER_NOT_FOUND: 1008,
        INVALID_SCHOOL: 1009,
        MISMATCH_SCHOOL: 1010,
        NO_QUESTION: 1011,
        NO_MONEY: 1012,
        SCHOOL_NOT_FOUND: 1013,
        INVALID_FILTER_DATE: 1014,
        INVALID_INTERVAL: 1015,
        INVALID_TYPE: 1016,
        SCHOOL_NOT_ACTIVE: 1017,
        PAYMENT_FAILED: 1018,
        INVALID_USERNAME: 1019,
        INVALID_DEVICEID: 1020,
        INVALID_DEVICETOKEN: 1020, 
        INVALID_PLATFORM: 1021, 
        NO_DATA: 1022, 
        REQUIRED_ERROR: 1023,
        DOCUMENT_TYPE_NAME: 1266,
        STATUS: 1267,
        IS_VALID_ERROR: 1303
    },
    AUTHENTICATION: {
        TYPE: "Unknown",
        GENERIC: 1100,
        VIOLATE_RFC6750: 1101,
        TOKEN_NOT_FOUND: 1102,
        INVALID_AUTHORIZATION_HEADER: 1103,
        ACCOUNT_NOT_FOUND: 1104,
        WRONG_USER_NAME_OR_PASSWORD: 1105,
        INVALID_TOKEN: 1106,
        TOKEN_EXPIRE: 1107,
        NEED_ACCESS_CODE: 1108,
        INVALID_CODE: 1109,
        ALREADY_ACTIVE: 1110,
        NOT_ACTIVE: 1500,
    },
    VERSION: {
        TYPE: "Unknown",
        INVALID_VERSION: 1111
    },
    ROLEAUTHENTICATION: {
        TYPE: "Unknown",
        GENERIC: 1112,
        INVALID_ACTION_HEADER: 1113,
        ACCOUNT_NOT_FOUND: 1114,
        NO_ROLE_ASSIGNED: 1115,
        ACTION_NOT_FOUND: 1116,
    },
    BALANCE: {
        TYPE: "Balance",
        GENERIC: 1200,
        NOT_ENOUGH: 1201,
    },
    SETTINGS: {
        TYPE: "Settings",
        INVALID_COUNTRYID: 1250,
    },
    ROLE: {
        TYPE: "ROLE",
        NO_ROLE_FOUND: 1251,
    },
    USER: {
        TYPE: "USER",
        FIRSTNAME_EMPTY: 1252,
        LASTNAME_EMPTY: 1253,
        CREATEDBY_EMPTY: 1254,
        ROLEID_EMPTY: 1255,
        CREATE_USER_FAILED: 1256,
        NOT_ALLOWED_TO_DELETE: 1257,
        NOT_ALLOWED_TO_UPDATE: 1258
    },

    STORETYPE: {

        SCHEME_NAME: 1259,
        DURATION: 1260,
        COMMISSION_B2B: 1261,
        COMMISSION_B2C: 1262,
        LOGISTICS_TYPE: 1263,
        VALIDITY: 1264,
        MEMBERSHIP_PRICE: 1265,
    },
    CATALOG: {
        TYPE: "CATALOG",
        CATEGORY_NOT_EXIST: 1300,
        INVALID_CATEGORYNAME:1301,
        INVALID_PARENTID:1302
    },
    CERTIFICATE: {
       CERTIFICATE_NAME: 1266,
    }
}; 

export const DATE_FORMAT = {
    DEFAULT: "mm-dd-yyyy",
};

export const WebUrl = {
    WEBSITE_URL: "http://52.9.168.172/#/",
    RESETPASSWORD_URL:"resetpassword/"
};


export const MessageInfo = {
    VERSION_INVALID: "Version is not correct.",
    MI_URL_NOT_FOUND: "The URL doesn't exist.",
    MI_NOT_AUTHORIZED: "You are not authorized. Access denied.",
    MI_MISSING_REQUIRED_FIELDS: "Missing required fields.",
    MI_DUPLICATE_ACCESS_TOKEN: "Token must not be provided in more than one place in a single request.",
    MI_MISSING_ACCESS_TOKEN: "Missing Access-Token value.",
    MI_TOKEN_NOT_FOUND: "Token not found.",
    MI_TOKEN_EXPIRED: "Token expired.",
    MI_INVALID_TOKEN: "Invalid token.",
    MI_USER_NOT_EXIST: "User doesn't exists.",
    MI_EMAIL_NOT_EXIST: "Email address doesn't exists.",
    MI_INVALID_EMAIL: "Email address is not valid. Ex: john.doe@example.com",
    MI_OBJECT_ITEM_NOT_EXIST_OR_DELETED: "Selected item doesn’t exists.",
    MI_OBJECT_ITEM_EXISTED: "Selected item exists.",
    MI_EMAIL_WAS_BE_USED: "Email address already exists.",
    MI_EMAIL_NOT_EMPTY: "Email address is required.",
    MI_FILE_UPLOAD_NOT_EMPTY: "Please upload relevant documents.",    
    MI_FILE_UPLOAD_SIZE_EXEEDED: "Upload document size should not be greater than 5MB.",   
    MI_VALUES_MUST_BE_NUMBER: "This field must contain only numbers",
    MI_VALUES_MUST_GREATER_THAN_0: " This field must contain numbers greater than 0.",
    MI_VALUES_TIME_PER_DAY: " This field must contain hour[0-23] and minute[0-59].",
    MI_VALUES_MONTH_PER_YEAR: "Please select month.",
    MI_ONLY_ACCEPT_FILE_EXTENSION: "Supported File Formats for Upload Document: jpg, jpeg, png, doc, docx, pdf, odt, txt.",
    MI_NOT_PERMISSION_ACCESS: "You are not authorized. Access denied.",
    MI_EMAIL_NOT_DB: "Email address doesn't exists.",
    MI_WEAK_PASSWORD_NOT_ALLOW: "Please use strong password.",
    MI_ERROR_FORMAT_US_PHONE_NUMBER: "Phone number must contain only alphabets or numbers.",
    MI_EMAIL_ALREADY_USE: "Email address already exists.",
    WEBSITE_INVALID: "Website URL is not valid. Ex: http://www.example.com",
    MI_WRONG_USERNAME_OR_PASSWORD: "Wrong email or password.",
    MI_OLD_PASSWORD_NOT_EMPTY: "Current password is required.",
    MI_INCORRECT_OLD_PASSWORD: "Incorrect current password.",
    MI_NEW_PASSWORD_NOT_EMPTY: "New password is required.",
    MI_ROLE_NAME_NOT_EMPTY: "Role name is required.",
    MI_ROLE_NAME_EXIST: "Role name already exists.",
    MI_FIST_NAME_NOT_EMPTY: "First name is required.",
    MI_INVALID_PARAMETER: "Invalid parameters.",
    MI_MISSING_ACCESS_CODE: "Access code is required.",
    MI_INVALID_ACCESS_CODE: "Invalid access code.",
    MI_RESOURCE_NOT_EXIST: "Item doesn't exist.",
    MI_ROLE_NOT_EXIST: "Role doesn't exist.",
    MI_SEND_SMS_ACCESS_CODE: "Welcome To Aladdin Street! We're very excited to have you on board as part of the Aladdin Street family. To get started with Aladdin Street, please input this activation code in your app: %s.",
    MI_INVALID_COUNTRYID: "Please select country.",
    MI_NO_ROLE_FOUND: "Role doesn’t exists.",
    MI_CREATE_USER_FAILED: "User can\'t be created.",
    INVALID_USERNAME: "Invalid username.",
    INVALID_DEVICEID: "Invalid Devide ID.",
    INVALID_DEVICETOKEN: "Invalid device token.",
    INVALID_ACTION_HEADER:"Invalid Action.",
    NO_ROLE_ASSIGNED:"No role assigned to current user.",
    ACTION_NOT_FOUND:"Invalid action.",
    MI_INVALID_PLATFORM:"Invalid platform.",
    MI_FIRSTNAME_NOT_EMPTY: "First name is required.",
    MI_LASTNAME_NOT_EMPTY: "Last name is required.",
    MI_CREATEDBY_NOT_EMPTY: "Created by is required.",
    MI_ROLEID_NOT_EMPTY: "Role ID is required.",
    MI_NOT_ALLOWED_TO_DELETE: "You are not allowed to delete it.",
    MI_NOT_ALLOWED_TO_UPDATE: "You are not allowed to update it.",
    MI_PASSWORD_UPDATED: "Password updated successfully.",
    MI_OTP_EMPTY: "OTP is required.",
    MI_INCORRECT_OTP: "Incorrect OTP.",
    MI_OTP_NOT_VERIFIED: "OTP not verified.",
    MI_DATA_NOT_FOUND: "No data found.",
    MI_REQUIRED_ERROR: "Required fields are empty.",
    MI_REQUIRED_ERROR_NUMBER: "Field is required and must contain only numbers.",
    MI_DATA_SAVED_SUCCESSFULLY: "Data saved successfully.",
    MI_INVALID_INPUT: "Invalid input.",
    MI_STATUS_NOT_EMPTY: "Please select status.",
    MI_STATUS_ERROR: "Status can be Active or Inactive.",
    MI_REQUIRED_VALIDATION: "Status should be active or inactive.",
    MI_PERMISSION_NAME_NOT_EMPTY : "Permission is required.",
    MI_PERMISSION_TYPE_NOT_EMPTY:"Permission can be active or inactive.",
    MI_USER_NOT_ACTIVE:"User is not active.",
    MI_ASSIGNED_ROLE_NOT_FOUND:"Assigned role is not found, Please contact Aladdin Team.",
    MI_ACTION_PERFORMED:"Action performed successfully",
    MI_LOGOUT:"You are successfully logged out.",
    MI_LOGIN:"Logged in successfully.",
    MI_SEND_RESETPWD_EMAIL:'An email is sent for further login instructions.',
    MI_SEND_RESETPWD_TOKEN:'An email is sent with OTP.',
    MI_PROFILE_UPDATED:'Profile updated successfully.',
    MI_ROLE_ADDED:"Role added successfully.",
    MI_ROLE_UPDATED:"Role edited successfully.",
    MI_STORE_SAVED: "Data saved successfully.",
    MI_USER_ADDED : "User added successfully.",
    MI_USER_UPDATED : "User updated successfully.",
    MI_ROLES_DELETED: "Roles deleted successfully",
    MI_USER_DELETED: "Users deleted successfully.",
    MI_BOOLEAN_REQUIRED: "Value should be 0 or 1.",
    MI_COUNTRY_SAVED_SUCCESSFULLY: "Country saved successfully",
    MI_COUNTRY_CODE_IS_REQUIRED: "Country code is required",
    MI_COUNTRY_CODE_ALREADY_EXISTS: "Country code already exists",
    MI_COUNTRY_NAME_IS_REQUIRED: "Country name is required",
    MI_COUNTRY_CODE_MUST_CONTAIN_TWO_CHARACTER: "Country code must contain two character",
    MI_COUNTRY_ID_NOT_FOUND: "Country id not found",
    MI_COUNTRY_DELETED_SUCCESSFULLY: "Country deleted successfully",
    MI_COUNTRY_NOT_FOUND: "Country code does not exist",
    MI_STATE_NOT_FOUND: "State does not exist.",
    MI_CITY_NOT_FOUND: "City does not exist.",
    MI_GROUP_NAME_IS_REQUIRED: "Group name is required.",
    MI_SELECT_COUNTRIES: "Please select countries.",
    MI_GROUP_ID_NOT_FOUND: "Group id not found.",
    MI_GROUP_DELETED_SUCCESSFULLY: "Group deleted successfully.",
    MI_COUNTRY_NAME_ALREADY_ASSIGNED: "Country name is already assigned another group. same country cannot be used different group.",
    MI_GROUP_NAME_ALREADY_EXISTS: "Group name already exists.",
    MI_ROLE_NAME_CREATED_SUCCESSFULLY:"Role name created Successfully.",
    MI_ROLE_CREATEION_FAILED:"Role creation failed.",
    MI_MODULE_NOT_FOUND:"Module not found.",
    MI_PARENT_ROLE_NOT_FOUND:"Parent role not found.",
    MI_ROLE_NAME_NOT_FOUND:"Role name not found.",
    MI_ROLE_NOT_FOUND:"Role id not found.",
    MI_YOU_ARE_NOT_ALLOWED:"You are not allowed edit role.",
    MI_YOU_ARE_NOT_ALLOWED_CREATE_ROLE:"You are not allowed create role.",
    MI_SCHOOL_ID_NOT_FOUND:"School id not found.",
    MI_SCHOOL_NAME_IS_REQUIRED:"School name is required.",
    MI_DISTRICT_IS_REQUIRED:"District is required.",
    MI_CITY_ID_IS_REQUIRED:"City is required.",
    MI_PRINCIPLE_NAME_IS_REQUIRED:"Principle name is required.",
    MI_REPRESENTATIVE_NAME_IS_REQUIRED:"Representative name is required.",
    MI_REPRESENTATIVE_MOBILE_NUMBER_IS_REQUIRED:"Representative mobile number is required.",
    MI_REPRESENTATIVE_EMAIL_IS_REQUIRED:"Representative email is required.",
    MI_SCHOOL_EMAIL_IS_REQUIRED:"School email is required.",
    MI_POSTAL_CODE_IS_REQUIRED:"Postal code is required.",
    MI_ADDRESS_IS_REQUIRED:"Address is required.",
    MI_INVALID_PHONE_NUMBER:"Invalid phone number.",
    MI_DISTRICT_ID_NOT_FOUND:"District not found.",
    MI_CITY_ID_NOT_FOUND:"City not found.",
    MI_SCHOOL_CREATION_FAILED:"School creation failed.",
    MI_YOU_ARE_NOT_ALLOWED_EDIT_SCHOOL:"You are not allowed edit School.",
    MI_SCHOOL_IS_ALREADY_APPROVED:"School is already approved.",
    MI_USER_PASSWORD_NOT_EMPTY:"User password not empty.",
};

export const DefaultVal = {
    MAX_LENGTH_PASSWORD_GENERATE: 8,
    COUNTRY_CODE_US: 'US',  // Support get list state in US.
    ITU_US: '+1',  // The International Telecommunication Union (ITU) default is US: +1
    MAX_LENGTH_PHONE_US: 10,  // Max length phone number of US: 10 digits.
    ITEM_PER_PAGE: 20,
    BALANCE: 125000,
    TOKEN_EXPIRED: 5 * 30 * 24 * 60 * 60 * 1000, // 5 months,
    RESET_PASSWORD_EXPIRED: 10 * 60 * 1000, // 10 mins
    PERCENTAGE_OF_DEDUCTION: 0.10,
    TOTAL_POST_RELATED_RANDOM: 5    // Support for website
};

// Default value support for WEBSITE
export const WebPostType = {
    PAGE_TYPE: 'Page',
    BLOCK_TYPE: 'Block',
    BLOG_TYPE: 'Blog',
    BANNER_TYPE: 'Banner'
};

export const WebCategory = {
    // Page:
    ABOUT_US_PAGE: 'AboutUs',
    SERVICES_PAGE: 'Services',
    PRIVACY_POLICY_PAGE: 'PrivacyPolicy',
    TERM_OF_USE_PAGE: 'TermsOfUse',
    // Block:
    BANNER_BLOCK: 'Banner',
    CONTACT_US_BLOCK: 'ContactUs',
    HEAD_OFFICE_BLOCK: 'HeadOffice',
    SERVICES_BLOCK: 'ServicesBlock',    // Group: {E_LEARNING_BLOCK, MOBILE_APP_BLOCK, WORKSHOP_BLOCK}
    E_LEARNING_BLOCK: 'ELearning',
    MOBILE_APP_BLOCK: 'MobileApp',
    WORKSHOP_BLOCK: 'Workshop',
    COURSES_BLOCK: 'Courses',
    PARTNERS_BLOCK: 'Partners',
};

export const ImageType = {
    AVATAR: "avatar",
    BANNER: "banner",
    THUMBNAIL: "thumbnail",
};

export default {
    Properties,
    HttpStatus,
    ErrorCode,
    DefaultVal,
    MessageInfo,
    WebPostType,
    WebCategory,
    ImageType
};

export const VIDEO_RELATED_ITEM_LIMIT = 20;

export const Variables = {
    CONTACT_EMAIL_KEYWORD: "ContactEmail"
};
