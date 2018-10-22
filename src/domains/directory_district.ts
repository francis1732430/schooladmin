import {DirectoryDistrictDto} from "../data/models";
import {DirectoryDistrictTableSchema} from "../data/schemas";
import {BearerObject, Logger} from "../libs";
import {ErrorCode, HttpStatus, Properties, MessageInfo} from "../libs/constants";
import {Utils} from "../libs/utils";
import {Exception, DirectoryDistrictModel} from "../models";
import {Promise} from "thenfail";
import {BaseUseCase} from "./base";

export class DirectoryDistrictUseCase extends BaseUseCase {

    constructor() {
        super();
        this.mysqlModel = DirectoryDistrictDto;
    }

    
}

export default new DirectoryDistrictUseCase();
