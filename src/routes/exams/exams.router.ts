import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import ExamsHandler from "./exams.handler";
import {checkUser} from "../../middlewares/checkuser";
import * as express from "express";
const router = express.Router();

router.route("/")
    .get(authentication,checkUser,accessrole,ExamsHandler.list)
    .post(authentication,checkUser,accessrole,ExamsHandler.create);

router.route("/view/:rid")
    .get(authentication,checkUser,accessrole,ExamsHandler.view)

    
router.route("/:rid")
    .put(authentication,checkUser,accessrole,ExamsHandler.update)
    .delete(authentication,checkUser,accessrole,ExamsHandler.destroy);

// router.route("/export")
//     .get(authentication,accessrole, UserHandler.export);

router.route("/massDelete")
    .post(authentication,checkUser,accessrole,ExamsHandler.massDelete);

// router.route("/exportSelected")
//     .post(authentication, accessrole, UserHandler.exportSelected);

export default router;
