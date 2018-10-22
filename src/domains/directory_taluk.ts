import {DirectoryTalukDto} from "../data/models";
import {DirectoryTalukTableSchema} from "../data/schemas";
import {BearerObject, Logger} from "../libs";
import {ErrorCode, HttpStatus, Properties, MessageInfo} from "../libs/constants";
import {Utils} from "../libs/utils";
import {Exception, DirectoryCountryModel} from "../models";
import {Promise} from "thenfail";
import {BaseUseCase} from "./base";

export class DirectoryTalukUseCase extends BaseUseCase {

    constructor() {
        super();
        this.mysqlModel = DirectoryTalukDto;
    }

    
}

export default new DirectoryTalukUseCase();
