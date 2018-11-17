import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import ExamTypesHandler from "./exams.handler";
import {checkUser} from "../../middlewares/checkuser";
import * as express from "express";
const router = express.Router();

router.route("/")
    .get(authentication,checkUser,accessrole,ExamTypesHandler.list)
    .post(authentication,checkUser,accessrole,ExamTypesHandler.create);

router.route("/view/:rid")
    .get(authentication,checkUser,accessrole,ExamTypesHandler.view)

    
router.route("/:rid")
    .put(authentication,checkUser,accessrole,ExamTypesHandler.update)
    .delete(authentication,accessrole,ExamTypesHandler.destroy);

// router.route("/export")
//     .get(authentication,accessrole, UserHandler.export);

router.route("/massDelete")
    .post(authentication,checkUser,accessrole, ExamTypesHandler.massDelete);

// router.route("/exportSelected")
//     .post(authentication, accessrole, UserHandler.exportSelected);

export default router;
