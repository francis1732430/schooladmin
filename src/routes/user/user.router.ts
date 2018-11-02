/**
 *      on 7/21/16.
 */
import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import {checkUser} from "../../middlewares/checkuser";
import UserHandler from "./user.handler";
import * as express from "express";
const router = express.Router();

router.route("/")
    .get(authentication,checkUser,accessrole, UserHandler.list)
    .post(authentication,checkUser,accessrole, UserHandler.create);

router.route("/view/:rid")
    .get(authentication,accessrole,UserHandler.getById)

    
router.route("/:rid")
    .put(authentication,accessrole,UserHandler.update)
    .delete(authentication,accessrole,UserHandler.destroy);

router.route("/export")
    .get(authentication,accessrole, UserHandler.export);

router.route("/massDelete")
    .post(authentication,accessrole, UserHandler.massDelete);

router.route("/exportSelected")
    .post(authentication, accessrole, UserHandler.exportSelected);

export default router;
