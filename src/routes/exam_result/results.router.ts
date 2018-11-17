import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import ExamResultHandler from "./results.handler";
import {checkUser} from "../../middlewares/checkuser";
import * as express from "express";
const router = express.Router();

router.route("/")
    .get(authentication,checkUser,accessrole,ExamResultHandler.list)
    .post(authentication,checkUser,accessrole,ExamResultHandler.create);

router.route("/view/:rid")
    .get(authentication,checkUser,accessrole,ExamResultHandler.view)

    
router.route("/:rid")
    .put(authentication,checkUser,accessrole,ExamResultHandler.update)
    .delete(authentication,accessrole,ExamResultHandler.destroy);

// router.route("/export")
//     .get(authentication,accessrole, UserHandler.export);

router.route("/massDelete")
    .post(authentication,checkUser,accessrole, ExamResultHandler.massDelete);

// router.route("/exportSelected")
//     .post(authentication, accessrole, UserHandler.exportSelected);

export default router;
