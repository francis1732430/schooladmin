import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import ExamsHandler from "./exams.handler";
import * as express from "express";
const router = express.Router();

router.route("/")
    .get(authentication,accessrole, ExamsHandler.list)
    .post(ExamsHandler.create);

router.route("/view/:rid")
    .get(authentication,accessrole,ExamsHandler.view)

    
router.route("/:rid")
    .put(authentication,accessrole,ExamsHandler.update)
    .delete(authentication,accessrole,ExamsHandler.destroy);

// router.route("/export")
//     .get(authentication,accessrole, UserHandler.export);

router.route("/massDelete")
    .post(authentication,accessrole, ExamsHandler.massDelete);

// router.route("/exportSelected")
//     .post(authentication, accessrole, UserHandler.exportSelected);

export default router;
