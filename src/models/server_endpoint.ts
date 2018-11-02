/**
 *        on 5/20/18.
 */
import {ServerEndpointTableSchema} from "../data/schemas";
import BaseModel from "./base";
import {Request} from "express";

export class ServerEndpointModel extends BaseModel {
    public countryId:string;
    public frontendURL:string;
    public apiUrl:string;

    public static fromRequest(req:Request):ServerEndpointModel {
        if (req != null && req.body) {
            let country = new ServerEndpointModel();
            country.countryId = ServerEndpointModel.getString(req.body.countryId);
            country.frontendURL = ServerEndpointModel.getString(req.body.Iso2Code);
            country.apiUrl = ServerEndpointModel.getString(req.body.Iso3Code);
            return country;
        }
        return null;
    }

    public static fromDto(object:any, filters?:string[]):ServerEndpointModel {
        if (object != null) {
            let countryId = object.get(ServerEndpointTableSchema.FIELDS.COUNTRY_ID);
            let frontendURL = object.get(ServerEndpointTableSchema.FIELDS.FRONTEND_URL);                
            let apiUrl = object.get(ServerEndpointTableSchema.FIELDS.API_URL);
            let ret = new ServerEndpointModel();
            ret.countryId = countryId != null && countryId !== "" ? countryId : undefined;
            ret.frontendURL = frontendURL != null && frontendURL !== "" ? frontendURL : undefined;
            ret.apiUrl = apiUrl != null && apiUrl !== "" ? apiUrl : undefined;                
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
        obj[ServerEndpointTableSchema.FIELDS.COUNTRY_ID] = this.countryId;
        obj[ServerEndpointTableSchema.FIELDS.FRONTEND_URL] = this.frontendURL;
        obj[ServerEndpointTableSchema.FIELDS.API_URL] = this.apiUrl;
        return obj;
    }
}

export default ServerEndpointModel;
