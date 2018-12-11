import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import SchoolHandler from "./school.handler";
import {checkUser} from "../../middlewares/checkuser";
import * as express from "express";
const router = express.Router();

router.route("/list").get(authentication, accessrole,checkUser,SchoolHandler.selectList);
router.route("/")
    .get(authentication,accessrole,checkUser,SchoolHandler.list)
    .post(SchoolHandler.create);

router.route("/view/:rid")
    .get(authentication,accessrole,checkUser,SchoolHandler.view)

    
router.route("/:rid")
    .put(authentication,accessrole,SchoolHandler.update)
    .delete(authentication,accessrole,SchoolHandler.destroy);

// router.route("/export")
//     .get(authentication,accessrole, UserHandler.export);

router.route("/massDelete")
    .post(authentication,accessrole, SchoolHandler.massDelete);

router.route("/createRequest")
    .post(authentication,accessrole, SchoolHandler.createRequest);

// router.route("/exportSelected")
//     .post(authentication, accessrole, UserHandler.exportSelected);

export default router;
