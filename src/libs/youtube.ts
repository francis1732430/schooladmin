// /**
//  *         on 8/17/16.
//  */
// import conf from "./config";
// import * as fs from "fs"
// import {Promise} from "thenfail";
// const GoogleAPI = require("googleapis");
//
// export class Youtube {
//     private opts: any;
//     private client: any;
//     private oauth2Client: any;
//
//     constructor(opts) {
//         this.opts = opts || {};
//         //noinspection TypeScriptUnresolvedVariable
//         let OAuth2 = GoogleAPI.auth.OAuth2;
//         this.oauth2Client = new OAuth2(
//             opts.clientId,
//             opts.clientSecret,
//             "/"
//         );
//         //noinspection TypeScriptUnresolvedFunction
//         this.oauth2Client.setCredentials({
//             access_token: "",
//             refresh_token: opts.refreshToken,
//         });
//         //noinspection TypeScriptValidateJSTypes
//         this.client = GoogleAPI.youtube({version: 'v3', auth: this.oauth2Client});
//     }
//
//     private refreshToken() {
//         //noinspection TypeScriptUnresolvedFunction
//         return new Promise((resolve, reject)=> {
//             //noinspection TypeScriptUnresolvedFunction
//             this.oauth2Client.refreshAccessToken(function (err, tokens) {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(tokens);
//                 }
//             });
//         })
//     }
//
//     private processUpdate(id: string, snippet) {
//         return new Promise((resolve, reject) => {
//             //noinspection TypeScriptUnresolvedVariable,TypeScriptValidateJSTypes
//             this.client.videos.update({
//                 resource: {
//                     id: id,
//                     snippet: snippet
//                 },
//                 part: "snippet",
//             }, (err, data) => {
//                 if (err != null) {
//                     reject(err);
//                 } else {
//                     resolve(data);
//                 }
//             });
//         });
//     }
//
//     private processGetById(id) {
//         return new Promise((resolve, reject) => {
//             //noinspection TypeScriptUnresolvedVariable,TypeScriptValidateJSTypes
//             this.client.videos.list({
//                 id: id,
//                 part: "snippet"
//             }, (err, data) => {
//                 if (err != null) {
//                     reject(err);
//                 } else {
//                     resolve(data);
//                 }
//             });
//         });
//     }
//
//     private processRemove(id: string) {
//         return new Promise((resolve, reject) => {
//             //noinspection TypeScriptUnresolvedVariable,TypeScriptValidateJSTypes
//             this.client.videos.delete({
//                 id: id
//             }, (err, data) => {
//                 if (err != null) {
//                     reject(err);
//                 } else {
//                     resolve(data);
//                 }
//             });
//         });
//     }
//
//     private processUpload(path: string, title: string, description: string, visible: string): Promise<any> {
//         return new Promise((resolve, reject) => {
//             //noinspection TypeScriptUnresolvedVariable,TypeScriptValidateJSTypes
//             this.client.videos.insert({
//                 resource: {
//                     snippet: {
//                         title: title,
//                         description: description
//                     },
//                     status: {
//                         privacyStatus: visible
//                     },
//                 },
//                 part: "snippet,status",
//                 media: {
//                     body: fs.createReadStream(path)
//                 },
//             }, (err, data) => {
//                 if (err != null) {
//                     reject(err);
//                 } else {
//                     resolve(data);
//                 }
//             });
//         });
//     }
//
//     public getById(id: string) {
//         return this.refreshToken()
//             .then(()=> {
//                 return this.processGetById(id);
//             })
//             .then((object:any) => {
//                 if (object != null && object.items != null && object.items.length > 0) {
//                     return object.items[0];
//                 } else {
//                     return null;
//                 }
//             })
//             .enclose();
//     }
//
//     public update(id: string, snippet) {
//         return this.refreshToken()
//             .then(() => {
//                 return this.processUpdate(id, snippet);
//             })
//             .enclose();
//     }
//
//     public upload(path: string, title: string, description: string, visible: string): Promise<any> {
//         return this.refreshToken()
//             .then(() => {
//                 return this.processUpload(path, title, description, visible);
//             })
//             .enclose();
//     }
//
//     public remove(id: string) {
//         return this.refreshToken()
//             .then(() => {
//                 return this.processRemove(id);
//             })
//             .enclose();
//     }
// }
//
// export default new Youtube(conf.youtube);
