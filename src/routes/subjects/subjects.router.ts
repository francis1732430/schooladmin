import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import SubjectHandler from "./subjects.handler";
import {checkUser} from "../../middlewares/checkuser";
import * as express from "express";
const router = express.Router();

router.route("/")
    .get(authentication,checkUser,accessrole, SubjectHandler.list)
    .post(authentication,checkUser,accessrole,SubjectHandler.create);

router.route("/view/:rid")
    .get(authentication,checkUser,accessrole,SubjectHandler.view)

    
router.route("/:rid")
    .put(authentication,checkUser,accessrole,SubjectHandler.update)
    .delete(authentication,checkUser,accessrole,SubjectHandler.destroy);

// router.route("/export")
//     .get(authentication,accessrole, UserHandler.export);

router.route("/massDelete")
    .post(authentication,checkUser,accessrole,SubjectHandler.massDelete);

// router.route("/exportSelected")
//     .post(authentication, accessrole, UserHandler.exportSelected);

export default router;
