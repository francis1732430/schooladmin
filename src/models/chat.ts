
import {ChatTableSchema} from "../data/schemas";
import BaseModel from "./base";
import {Request} from "express";

export class ChatModel extends BaseModel {
    public chatId:number;
    public groupId:string;
    public userId:number;
    public message:string;
    public joined:number;
    public groupType:string;
    // public isActive:number;
    public createdDate:string;
    public updatedDate:string;
    public static fromRequest(data:any):ChatModel {
        if (data != null) {
            let chat = new ChatModel();
            chat.chatId = ChatModel.getNumber(data.chatId);
            chat.groupId = ChatModel.getString(data.groupId);
            chat.userId = ChatModel.getNumber(data.userId);
            chat.message = ChatModel.getString(data.message);
            chat.joined = ChatModel.getNumber(data.joined);
            chat.groupType = ChatModel.getString(data.groupType);
            return chat;
        }
        return null;
    }
    public static fromDto(object:any, filters?:string[]):ChatModel {
        if (object != null) {
            let rid = object.get(ChatTableSchema.FIELDS.RID);
            let chatId = object.get(ChatTableSchema.FIELDS.CHAT_ID);
            let groupId = object.get(ChatTableSchema.FIELDS.GROUP_ID);
            let userId = object.get(ChatTableSchema.FIELDS.USER_ID);
            let message = object.get(ChatTableSchema.FIELDS.MESSAGE);
            let joined = object.get(ChatTableSchema.FIELDS.JOINED);
            let groupType = object.get(ChatTableSchema.FIELDS.GROUP_TYPE);
            let createdDate = object.get(ChatTableSchema.FIELDS.CREATED_DATE);
            let updatedDate = object.get(ChatTableSchema.FIELDS.UPDATED_DATE);
            let ret = new ChatModel();
            ret.rid = rid != null && rid !== "" ? rid : undefined;
            ret.chatId = chatId != null && chatId !== "" ? chatId : undefined;
            ret.groupId = groupId != null && groupId !== "" ? groupId : undefined;
            ret.userId = userId != null && userId !== "" ? userId : undefined;
            ret.message = message != null && message !== "" ? message : undefined;
            ret.joined = joined != null && joined !== "" ? joined : undefined;
            ret.createdDate = createdDate != null && createdDate !== "" ? createdDate : undefined;
            ret.updatedDate = updatedDate != null && updatedDate !== "" ? updatedDate : undefined;
            //noinspection TypeScriptUnresolvedVariable
            if (object.relations != null) {
                //noinspection TypeScriptUnresolvedVariable
                
            }
            if (filters != null) {
                filters.forEach(filter => {
                    ret[filter] = undefined;
                });
            }
            return ret;
        }
        return null;
    }

    public toDto():any {
        let obj = {};
        obj[ChatTableSchema.FIELDS.CHAT_ID] = this.chatId;
        obj[ChatTableSchema.FIELDS.GROUP_ID] = this.groupId;
        obj[ChatTableSchema.FIELDS.USER_ID] = this.userId;
        obj[ChatTableSchema.FIELDS.MESSAGE] = this.message;
        obj[ChatTableSchema.FIELDS.JOINED] = this.joined;
        obj[ChatTableSchema.FIELDS.GROUP_TYPE] = this.groupType;
        return obj;
    }
}

export default ChatModel;
