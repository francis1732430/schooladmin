import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import SchoolHandler from "./school.handler";
import * as express from "express";
const router = express.Router();

router.route("/")
    .get(authentication,accessrole, SchoolHandler.list)
    .post(authentication,accessrole, SchoolHandler.create);

router.route("/view/:rid")
    .get(authentication,accessrole,SchoolHandler.view)

    
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
