/**
 *      on 8/1/16.
 */
import {SessionUseCase, UserUseCase} from "../../domains";
import {UserTableSchema} from "../../data/schemas";
import {Jwt, Logger, Mailer} from "../../libs";
import {Utils} from "../../libs/utils";
import * as express from "express";
import {Promise} from "thenfail";
import {BaseHandler} from "../base.handler";
import {Properties, DefaultVal} from "../../libs/constants";
export class TokenHandler extends BaseHandler {
    constructor() {
        super();
    }

    public static handle(req:express.Request, res:express.Response) {
        let token = req.params.token || "";

        let message = {
            body: {
                name: "there",
                intro: "Your token is invalid",
            },
        };
        let password = Utils.randomText(DefaultVal.MAX_LENGTH_PASSWORD_GENERATE);
        let userName;
        return Promise.then(() => {
            if (Jwt.verifyResetToken(token)) {
                let object = Jwt.decodeResetToken(token);
                if (object.exp < Date.now()) {
                    message.body.intro = "Your reset token was expired";
                    let html = Mailer.generateHtml(message);
                    res.send(html);
                    return Promise.break;
                }
                return object;
            }

            let html = Mailer.generateHtml(message);
            res.send(html);
            return Promise.break;
        })
            .then(tokenObj => {
                if (tokenObj.role == Properties.ROLE.STUDENT) {
                    return AccountUseCase.forceChangePassword(tokenObj.accountId, password)
                        .then(object => {
                            let id = object.get(AccountTableSchema.FIELDS.ID);
                            SessionUseCase.destroyAllForId(id)
                                .catch(err => {
                                    Logger.error(err.message, err);
                                });
                            userName = object.get(AccountTableSchema.FIELDS.USER_NAME);
                            let userId = object.get(AccountTableSchema.FIELDS.USER_ID);
                            return UserUseCase.findById(userId);
                        })
                        .then(object => {
                            let email = object.get(UserTableSchema.FIELDS.EMAIL);
                            Mailer.sendNewPassword(email, userName, password);
                        })
                        .catch(err => {
                            Logger.error(err.message, err);
                        });
                } else {
                    return ManagerUseCase.forceChangePassword(tokenObj.userId, password)
                        .then(object => {
                            let id = object.get(ManagerTableSchema.FIELDS.ID);
                            SessionUseCase.destroyAllForId(id)
                                .catch(err => {
                                    Logger.error(err.message, err);
                                });
                            userName = object.get(ManagerTableSchema.FIELDS.FIRST_NAME) + " " + object.get(ManagerTableSchema.FIELDS.LAST_NAME);
                            let userId = object.get(ManagerTableSchema.FIELDS.ID);
                            return ManagerUseCase.findById(userId);
                        })
                        .then(object => {
                            let email = object.get(ManagerTableSchema.FIELDS.EMAIL);
                            Mailer.sendNewPassword(email, userName, password);
                        })
                        .catch(err => {
                            Logger.error(err.message, err);
                        });
                }
            })
            .then(() => {
                message.body.intro = "Check your email for new password";
                let html = Mailer.generateHtml(message);
                res.send(html);
            })
            .catch(err => {
                Logger.error(err.message, err);
                res.end();
            });

    }
}

export default TokenHandler;
