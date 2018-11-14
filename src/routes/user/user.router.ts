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
    .get(authentication,checkUser,accessrole,UserHandler.getById)

    
router.route("/:rid")
    .put(authentication,checkUser,accessrole,UserHandler.update)
    .delete(authentication,checkUser,accessrole,UserHandler.destroy);

router.route("/export")
    .get(authentication,checkUser,accessrole, UserHandler.export);

router.route("/massDelete")
    .post(authentication,checkUser,accessrole,UserHandler.massDelete);

router.route("/exportSelected")
    .post(authentication,checkUser,accessrole, UserHandler.exportSelected);

export default router;
