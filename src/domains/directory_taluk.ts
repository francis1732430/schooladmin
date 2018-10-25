import {DirectoryTalukDto} from "../data/models";
import {DirectoryTalukTableSchema} from "../data/schemas";
import {BearerObject, Logger} from "../libs";
import {ErrorCode, HttpStatus, Properties, MessageInfo} from "../libs/constants";
import {Utils} from "../libs/utils";
import {Exception, DirectoryCountryModel,DirectoryTalukModel} from "../models";
import {Promise} from "thenfail";
import {BaseUseCase} from "./base";

export class DirectoryTalukUseCase extends BaseUseCase {

    constructor() {
        super();
        this.mysqlModel = DirectoryTalukDto;
    }
    public create(district:DirectoryTalukModel):Promise<any> {
        console.log("rr",district);
        return Promise.then(() => {
                return DirectoryTalukDto.create(DirectoryTalukDto, district.toDto()).save();
            })
            .catch(err => {
                return Promise.reject(Utils.parseDtoError(err));
            })
            .enclose();
    }
    
}

export default new DirectoryTalukUseCase();
