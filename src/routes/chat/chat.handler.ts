import { MessageInfo } from '../../libs/constants';
import {ChatUseCase} from "../../domains";
import { ErrorCode, HttpStatus, MessageInfo, Properties, DefaultVal ,DATE_FORMAT} from "../../libs/constants";
import { Utils } from "../../libs/utils";
import {  Mailer } from "../../libs";
import { Exception, ChatModel} from "../../models";
import * as express from "express";
import { Promise } from "thenfail";
import { ChatTableSchema} from "../../data/schemas";
import { BaseHandler } from "../base.handler";
import { BearerObject } from "../../libs/jwt";
import * as formidable from "formidable";
import { Uploader } from "../../libs";
import { readdir } from 'fs';
let fs = require('fs');  
var dateFormat = require('dateformat');
let knex=require('knex');
export class ChatHandler extends BaseHandler {
    constructor() {
        super();
    }
    public static createGroups(groups: any): Promise<any> {
        groups["groupType"] = "G";
        let groupData = ChatModel.fromRequest(groups);
        return Promise.then(() => {
            return ChatUseCase.findOne(q => {
                q.where(`${ChatTableSchema.TABLE_NAME}.${ChatTableSchema.FIELDS.GROUP_ID}`, groupData.groupId);
                q.where(`${ChatTableSchema.TABLE_NAME}.${ChatTableSchema.FIELDS.IS_DELETED}`, 0);
            })
        }).then((object) => {
         if(!object) {
            //  let chat = ChatModel.groupCreate(groups);
             console.log('obj', groupData);
             return ChatUseCase.create(groupData);
         }
         return null;
        }).then(() => {
            let message = {status:1, message: "groups created successfully"};
            return message;
        }).catch((err) => {
            let message = {status:0, message: "groups created successfully"};
            return message;
            // Utils.responseError(res, err);
        })
    }    
    public static createMessage(data: any): Promise<any> {
        data["joined"] = 1;
        let chat = ChatModel.fromRequest(data);
        if(chat.userId == null || chat.userId == undefined) {
            let message = {status:0, message: "chat id not found"}          
            return message;
        } 
        if(chat.groupId == null || chat.groupId == undefined) {
            let message = {status:0, message: "group id not found"}          
            return message;
        }
        return Promise.then(() => {
            return ChatUseCase.findOne(q => {
                q.where(`${ChatTableSchema.TABLE_NAME}.${ChatTableSchema.FIELDS.GROUP_ID}`, chat.groupId);
                q.where(`${ChatTableSchema.TABLE_NAME}.${ChatTableSchema.FIELDS.IS_DELETED}`, 0);
            })
        })
         .then((object) => {
           if(!object) {
             const message = {status:0, messgae: "group id not found"}; 
             return message;
           }
           return ChatUseCase.create(chat);
        })
         .then(() => {
         let message = {status:1, message: "message created Successfully"};
         return message;
        })
    
    }
    public static list(data: any): Promise<any> {
    
        return Promise.then(() => {
           return ChatUseCase.findByQuery(q => {
               q.where(`${ChatTableSchema.TABLE_NAME}.${ChatTableSchema.FIELDS.GROUP_ID}`, data.groupId);
               q.where(`${ChatTableSchema.TABLE_NAME}.${ChatTableSchema.FIELDS.IS_DELETED}`, 0);
            //    q.whereNot(`${ChatTableSchema.TABLE_NAME}.${ChatTableSchema.FIELDS.GROUP_TYPE}`, 'G');
                let condition= `${ChatTableSchema.TABLE_NAME}.${ChatTableSchema.FIELDS.GROUP_TYPE} IS NULL`
                q.whereRaw(condition);
               q.orderBy(`${ChatTableSchema.TABLE_NAME}.${ChatTableSchema.FIELDS.CREATED_DATE}`, 'asc');
           })
            .then((object) => {
                let ret = [];
               if(object.models.length > 0) {
                object.models.forEach(obj => {
                    let chatData = ChatModel.fromDto(obj);
                    ret.push(chatData);    
                });                
             }
             return ret;
           })
        })
    }
    public static lists(req: express.Request, res: express.Response): Promise<any> {
        let groupId = req.query.groupId;
        return Promise.then(() => {
           return ChatUseCase.findByQuery(q => {
               q.where(`${ChatTableSchema.TABLE_NAME}.${ChatTableSchema.FIELDS.GROUP_ID}`, groupId);
               q.where(`${ChatTableSchema.TABLE_NAME}.${ChatTableSchema.FIELDS.IS_DELETED}`, 0);
            //    q.whereNot(`${ChatTableSchema.TABLE_NAME}.${ChatTableSchema.FIELDS.GROUP_TYPE}`, 'G');
                let condition= `${ChatTableSchema.TABLE_NAME}.${ChatTableSchema.FIELDS.GROUP_TYPE} IS NULL`
                q.whereRaw(condition);
               q.orderBy(`${ChatTableSchema.TABLE_NAME}.${ChatTableSchema.FIELDS.CREATED_DATE}`, 'desc');
           })
            .then((object) => {
                let ret = [];
               if(object.models.length > 0) {
                object.models.forEach(obj => {
                    let chatData = ChatModel.fromDto(obj);
                    ret.push(chatData);    
                });                
             }
             return ret;
           })
        })
    }
}

export default ChatHandler;
