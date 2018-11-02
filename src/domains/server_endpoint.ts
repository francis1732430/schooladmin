/**
 *    on 22/05/18.
 */
import {ServerEndpointDto} from "../data/models";
import {ServerEndpointTableSchema} from "../data/schemas";
import {BearerObject, Logger} from "../libs";
import {ErrorCode, HttpStatus, Properties, MessageInfo} from "../libs/constants";
import {Utils} from "../libs/utils";
import {Exception, ServerEndpointModel} from "../models";
import {Promise} from "thenfail";
import {BaseUseCase} from "./base";

export class ServerEndpointUseCase extends BaseUseCase {

    constructor() {
        super();
        this.mysqlModel = ServerEndpointDto;
    }

    public countryEndpoints():Promise<any> {
        return Promise.then(() => {
            return this.findByQuery(q => {
            }, []);
        })
        .then(objects => {
            if (objects != null && objects.models != null && objects.models.length != null) {
                let ret = [];
                objects.models.forEach(object => {
                    console.log(object);
                    ret.push(ServerEndpointModel.fromDto(object));
                });
               return ret;
                
            }
            let exception;
            exception = new Exception(ErrorCode.SETTINGS.INVALID_COUNTRYID, MessageInfo.MI_INVALID_COUNTRYID, false);
            exception.httpStatus = HttpStatus.BAD_REQUEST;
            return exception;
        })
        .catch(err => {
            Logger.error(err.message, err);
            return false;
        })
        .enclose();
    }
    
}

export default new ServerEndpointUseCase();
