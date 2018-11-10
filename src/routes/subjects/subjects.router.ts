import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import SubjectHandler from "./subjects.handler";
import * as express from "express";
const router = express.Router();

router.route("/")
    .get(authentication,accessrole, SubjectHandler.list)
    .post(SubjectHandler.create);

router.route("/view/:rid")
    .get(authentication,accessrole,SubjectHandler.view)

    
router.route("/:rid")
    .put(authentication,accessrole,SubjectHandler.update)
    .delete(authentication,accessrole,SubjectHandler.destroy);

// router.route("/export")
//     .get(authentication,accessrole, UserHandler.export);

router.route("/massDelete")
    .post(authentication,accessrole, SubjectHandler.massDelete);

// router.route("/exportSelected")
//     .post(authentication, accessrole, UserHandler.exportSelected);

export default router;
