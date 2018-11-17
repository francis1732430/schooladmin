import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import ClassHandler from "./class.handler";
import {checkUser} from "../../middlewares/checkuser";
import * as express from "express";
const router = express.Router();

router.route("/")
    .get(authentication,checkUser,accessrole, ClassHandler.list)
    .post(authentication,checkUser,accessrole,ClassHandler.create);

router.route("/view/:rid")
    .get(authentication,checkUser,accessrole,ClassHandler.view)

    
router.route("/:rid")
    .put(authentication,checkUser,accessrole,ClassHandler.update)
    .delete(authentication,checkUser,accessrole,ClassHandler.destroy);

// router.route("/export")
//     .get(authentication,accessrole, UserHandler.export);

router.route("/massDelete")
    .post(authentication,checkUser,accessrole, ClassHandler.massDelete);

// router.route("/exportSelected")
//     .post(authentication, accessrole, UserHandler.exportSelected);

export default router;
