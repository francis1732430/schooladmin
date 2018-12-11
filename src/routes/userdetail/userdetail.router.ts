import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import UserDetailHandler from "./userdetail.handler";
import {checkUser} from "../../middlewares/checkuser";
import * as express from "express";
const router = express.Router();

router.route("/")
    .get(authentication,checkUser,accessrole,UserDetailHandler.list)
    .post(authentication,checkUser,accessrole,UserDetailHandler.create);

router.route("/view/:rid")
    .get(authentication,checkUser,accessrole,UserDetailHandler.view)

    
router.route("/:rid")
    .put(authentication,checkUser,accessrole,UserDetailHandler.update)
    .delete(authentication,checkUser,accessrole,UserDetailHandler.destroy);

// router.route("/export")
//     .get(authentication,accessrole, UserHandler.export);

router.route("/massDelete")
    .post(authentication,checkUser,accessrole,UserDetailHandler.massDelete);

// router.route("/exportSelected")
//     .post(authentication, accessrole, UserHandler.exportSelected);

export default router;
