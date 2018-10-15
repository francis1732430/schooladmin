/**
 *    on 22/05/18.
 */
import {AuthorizationRuleSetDto} from "../data/models";
import {Utils} from "../libs/utils";
import {Promise} from "thenfail";
import {BaseUseCase} from "./base";
import {AuthorizationRuleModel} from "../models";
import {ErrorCode, MessageInfo, HttpStatus} from "../libs/constants";
import {Exception} from "../models/exception";
import {AuthorizationRuleSetTableSchema} from "../data/schemas";

export class AuthorizationRuleSetUseCase extends BaseUseCase {
    constructor() {
        super();
        this.mysqlModel = AuthorizationRuleSetDto;
    }


    public permissionFormat(AuthorizationRule:any) {
         
        let ret = [];
        let retKey = 0;
        let retKeySel = 0;
        let retActionKey = 0;
        let retActionKeySel = 0;
        //noinspection TypeScriptUnresolvedVariable
        AuthorizationRule.models.forEach(obj => {
            let rule = AuthorizationRuleModel.fromDto(obj);
            console.log(rule)
            let datum = {};
            datum['moduleId'] = rule.moduleId;
            if(rule.moduleName!='' && rule.moduleName!=null)
            datum['moduleName'] = rule.moduleName;
            else
            datum['moduleName'] = rule.action;
            datum['isChecked'] = rule.permission!=null && rule.permission== 'allow' ? true:false;
            console.log(datum);
            if(rule.level==1){
                ret.push(datum);
                retKeySel = retKey;
                console.log("COUNTER ============ ",retKeySel);
                if(ret[retKeySel]) {
                    ret[retKeySel].submenu = [];
                }
                retActionKey = 0;
                retKey++;
            } else if(rule.level==2){
            
                if(ret[retKeySel]) {
                    ret[retKeySel].submenu.push(datum);
                    ret[retKeySel].submenu[retActionKey].submenu = [];
                }
                retActionKeySel = retActionKey;
                retActionKey++;
                
            } else if(rule.level==3){
                if(ret[retKeySel]) {
                    if(rule.action==null){
                        //console.log(ret[retKeySel].submenu[retActionKeySel])
                        ret[retKeySel].submenu[retActionKeySel].submenu.push(datum);
                    } else {
                        ret[retKeySel].submenu[retActionKeySel].submenu.push(datum);
                    }
                }
            }
        });
        return ret;
    }
}

export default new AuthorizationRuleSetUseCase();
