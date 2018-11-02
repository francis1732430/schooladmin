/**
 *         on 8/16/16.
 */
import conf from "./config";
import {Promise} from "thenfail";
import Logger from "./logger";
import {DefaultVal} from './constants';
import e = require("cookie-parser");
let util = require('util');
let Nexmo = require("nexmo");
let request = require('request-promise');

class NexmoSMS {
    private instance;
    private opts;

    constructor(opts) {
        this.opts = opts || {};
        this.init();
    }

    /**
     *
     */
    private init() {
        try {
            this.instance = new Nexmo({
                apiKey: this.opts.apiKey,
                apiSecret: this.opts.secretKey
            }, {debug: true});
        } catch (err) {
            Logger.error(err.message, err);
        }
    }

    /**
     *
     * @param sender
     * @param recipient
     * @param message
     * @returns {Promise<TResult>}
     */

    public sendSMS(sender:string, recipient:string, message:string) {
        this.instance.message.sendSms(sender, recipient, message, function (error, response) {
            if (error) {
                Logger.error('SMS send fail: ', error);
            } else {
                if (response && response.messages && response.messages.length && response.messages[0]['error-text']) {
                    Logger.error('SMS send fail: ' + response.messages[0]['error-text']);
                } else {
                    Logger.debug('SMS send successfully');
                }
            }
        });
    }

    /**
     * Send pin code via phone.
     * @param phone {number} User's phone number.
     * @param pin {number} User's pin code.
     */
    sendAccessCode(toPhone:string, pin:number) {
        if (toPhone) {
            if (toPhone.length == DefaultVal.MAX_LENGTH_PHONE_US && toPhone.indexOf(DefaultVal.ITU_US) < 0) {
                toPhone = DefaultVal.ITU_US + toPhone;
            }

            let url = 'https://rest.nexmo.com/sc/us/2fa/json?api_key=' + this.opts.apiKey + '&api_secret=' + this.opts.secretKey + '&to=' + toPhone + '&pin=' + pin;
            request.get(url)
                .then(response => {
                    let ret = JSON.parse(response);
                    if (ret && ret.messages && ret.messages.length && ret.messages[0]['error-text']) {
                        Logger.error('SMS send fail: ' + ret.messages[0]['error-text']);
                    } else {
                        Logger.debug('SMS send successfully: ');
                    }
                })
                .catch(error => {
                    Logger.error('SMS send fail:' + error.message);
                });
        }
        else {
            Logger.debug('Invalid phone number');
        }
    }

}

export default new NexmoSMS(conf.nexmo);
