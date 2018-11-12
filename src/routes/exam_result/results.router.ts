import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import ExamResultHandler from "./results.handler";
import * as express from "express";
const router = express.Router();

router.route("/")
    .get(authentication,accessrole, ExamResultHandler.list)
    .post(ExamResultHandler.create);

router.route("/view/:rid")
    .get(authentication,accessrole,ExamResultHandler.view)

    
router.route("/:rid")
    .put(authentication,accessrole,ExamResultHandler.update)
    .delete(authentication,accessrole,ExamResultHandler.destroy);

// router.route("/export")
//     .get(authentication,accessrole, UserHandler.export);

router.route("/massDelete")
    .post(authentication,accessrole, ExamResultHandler.massDelete);

// router.route("/exportSelected")
//     .post(authentication, accessrole, UserHandler.exportSelected);

export default router;
