import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import ExamTypesHandler from "./exams.handler";
import * as express from "express";
const router = express.Router();

router.route("/")
    .get(authentication,accessrole, ExamTypesHandler.list)
    .post(ExamTypesHandler.create);

router.route("/view/:rid")
    .get(authentication,accessrole,ExamTypesHandler.view)

    
router.route("/:rid")
    .put(authentication,accessrole,ExamTypesHandler.update)
    .delete(authentication,accessrole,ExamTypesHandler.destroy);

// router.route("/export")
//     .get(authentication,accessrole, UserHandler.export);

router.route("/massDelete")
    .post(authentication,accessrole, ExamTypesHandler.massDelete);

// router.route("/exportSelected")
//     .post(authentication, accessrole, UserHandler.exportSelected);

export default router;
