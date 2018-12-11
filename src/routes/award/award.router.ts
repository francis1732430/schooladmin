import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import AwardHandler from "./award.handler";
import {checkUser} from "../../middlewares/checkuser";
import * as express from "express";
const router = express.Router();

router.route("/")
    .get(authentication,checkUser,accessrole, AwardHandler.list)
    .post(authentication,checkUser,accessrole,AwardHandler.create);

router.route("/view/:rid")
    .get(authentication,checkUser,accessrole,AwardHandler.view)

    
router.route("/:rid")
    .put(authentication,checkUser,accessrole,AwardHandler.update)
    .delete(authentication,checkUser,accessrole,AwardHandler.destroy);

// router.route("/export")
//     .get(authentication,accessrole, UserHandler.export);

router.route("/massDelete")
    .post(authentication,checkUser,accessrole,AwardHandler.massDelete);

// router.route("/exportSelected")
//     .post(authentication, accessrole, UserHandler.exportSelected);

export default router;
