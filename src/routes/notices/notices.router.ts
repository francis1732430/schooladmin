import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import NoticesHandler from "./notices.handler";
import {checkUser} from "../../middlewares/checkuser";
import * as express from "express";
const router = express.Router();

router.route("/")
    .get(authentication,checkUser,accessrole, NoticesHandler.list)
    .post(authentication,checkUser,accessrole,NoticesHandler.create);

router.route("/view/:rid")
    .get(authentication,checkUser,accessrole,NoticesHandler.view)

    
router.route("/:rid")
    .put(authentication,checkUser,accessrole,NoticesHandler.update)
    .delete(authentication,checkUser,accessrole,NoticesHandler.destroy);

// router.route("/export")
//     .get(authentication,accessrole, UserHandler.export);

router.route("/massDelete")
    .post(authentication,checkUser,accessrole,NoticesHandler.massDelete);

// router.route("/exportSelected")
//     .post(authentication, accessrole, UserHandler.exportSelected);

export default router;
