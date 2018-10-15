/**
 *         on 8/17/16.
 */
import Promise from 'thenfail';
import Conf from "./config";
import {PushServer} from "./config";
import {Logger} from "../libs";
import {DeviceUseCase} from '../domains';
import {DeviceTableSchema} from '../data/schemas';
let Bluebird = require('bluebird');
let request = Bluebird.promisifyAll(require('request'));

export class Notification {
    private opts: any;

    constructor(opts: PushServer) {
        this.opts = opts || {};

        if (!this.opts.host) {
            //console.log('Missing host push server!');
        }
    }

    /**
     * Push message to mobile device by account id.
     * @param accountId
     * @param message
     * @returns {Promise<T>|Promise<T|U>}
     */
    pushNotify(accountId: string, message: any) {
        return Promise.then(() => {
            return DeviceUseCase.getDeviceByAccountId(accountId);
        }).then(item => {
            if (item) {
                this.pushToDevice(item.get(DeviceTableSchema.FIELDS.DEVICE_OS), item.get(DeviceTableSchema.FIELDS.REGISTRAR_ID), message);
            }
        }).catch(err => {
            Logger.error(err.message, err);
        });
    }

    /**
     * Action notify message to device.
     * @param os
     * @param registrarId
     * @param message
     * @returns {Promise<T>|Promise<T|U>}
     */
    pushToDevice(os: string, registrarId: string, message: any) {
        try {
            var body = {
                'message': {
                    content: message,
                    os: os,
                    registrarId: registrarId,
                    badge: 1,
                },
                'expire': this.opts.expire
            };

            Promise.then(() => {
                return this.post(this.opts.host + '/notification', body);
            }).then(res => {
                if (res) {
                    Logger.info('Send notify successful');
                } else {
                    Logger.info('Send notify unsuccessful');
                }
            }).catch(err => {
                Logger.error(err.message, err);
            });
        } catch (err) {
            Logger.error(err.message, err);
        }
    }

    /**
     * Method post data.
     * @param url
     * @param body
     * @returns {any}
     */
    post(url: string, body: any) {
        var options = {
            url: url,
            method: 'POST',
            body: body,
            json: true,
        };

        return request(options);
    }
}

export default new Notification(Conf.pushServer);
