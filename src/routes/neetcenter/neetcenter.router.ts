import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import NeetCenterHandler from "./neetcenter.handler";
import {checkUser} from "../../middlewares/checkuser";
import * as express from "express";
const router = express.Router();

router.route("/")
    .get(authentication,checkUser,accessrole, NeetCenterHandler.list)
    .post(authentication,checkUser,accessrole,NeetCenterHandler.create);

router.route("/view/:rid")
    .get(authentication,checkUser,accessrole,NeetCenterHandler.view)

    
router.route("/:rid")
    .put(authentication,checkUser,accessrole,NeetCenterHandler.update)
    .delete(authentication,checkUser,accessrole,NeetCenterHandler.destroy);

// router.route("/export")
//     .get(authentication,accessrole, UserHandler.export);

router.route("/massDelete")
    .post(authentication,checkUser,accessrole,NeetCenterHandler.massDelete);

// router.route("/exportSelected")
//     .post(authentication, accessrole, UserHandler.exportSelected);

export default router;
