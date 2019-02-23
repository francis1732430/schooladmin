import {ChatTableDto} from "../data/models";
import {ChatTableSchema} from "../data/schemas";
import {BearerObject, Logger} from "../libs";
import {ErrorCode, HttpStatus, Properties, MessageInfo} from "../libs/constants";
import {Utils} from "../libs/utils";
import {Exception, ChatModel} from "../models";
import {Promise} from "thenfail";
import {BaseUseCase} from "./base";

export class ChatUseCase extends BaseUseCase {

    constructor() {
        super();
        this.mysqlModel = ChatTableDto;
    }
    public create(chat:ChatModel):Promise<any> {
        return Promise.then(() => {
                return ChatTableDto.create(ChatTableDto, chat.toDto()).save();
            })
            .catch(err => {
                return Promise.reject(Utils.parseDtoError(err));
            })
            .enclose();
    }

    public update(rid:string,chat:ChatModel):Promise<any> {
        return Promise.then(()=>{
            return this.findById(rid)
        })
        .then(obj=>{
            if(obj != null && obj != undefined){
                let dist = ChatModel.fromDto(obj);
                let data = chat.toDto();
                return obj.save(data, {patch:true})
            }
            return Promise.void;
        }).catch(err=>{ 
            return Promise.reject(Utils.parseDtoError(err))
        }).enclose()
    }

    public destroy(rid:string):any{

        return Promise.then(()=>{
            return this.findById(rid);

        }).then((object)=>{
            if(object){
                let chat = ChatModel.fromDto(object);
                let admin = {};
                admin[ChatTableSchema.FIELDS.IS_DELETED] = 1;
                return object.save(admin, {patch:true})
            }else{
                return Promise.reject(new Exception(
                    ErrorCode.RESOURCE.NOT_FOUND,
                    MessageInfo.MI_OBJECT_ITEM_NOT_EXIST_OR_DELETED,
                    false,
                    HttpStatus.BAD_REQUEST
                ))
            }
        }).catch(err=>{
            return Promise.reject(Utils.parseDtoError(err));
        }).enclose();
    }

    
}

export default new ChatUseCase();
