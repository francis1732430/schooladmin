/**
 *    on 22/05/18.
 */
import {CoreConfigDataDto} from "../data/models";
import {CoreConfigDataTableSchema} from "../data/schemas";
import {BearerObject, Logger} from "../libs";
import {ServerEndpointUseCase} from "../domains"
import {ErrorCode, HttpStatus, Properties, MessageInfo} from "../libs/constants";
import {Utils} from "../libs/utils";
import {Exception, CoreConfigDataModel} from "../models";
import {Promise} from "thenfail";
import {BaseUseCase} from "./base";

export class CoreConfigDataUseCase extends BaseUseCase {

    constructor() {
        super();
        this.mysqlModel = CoreConfigDataDto;
    }
    
}

export default new CoreConfigDataUseCase();
