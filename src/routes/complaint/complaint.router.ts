import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import ComplaintRegistrationHandler from "./complaint.handler";
import {checkUser} from "../../middlewares/checkuser";
import * as express from "express";
const router = express.Router();

router.route("/")
    .get(authentication,checkUser,accessrole, ComplaintRegistrationHandler.list)
    .post(authentication,checkUser,accessrole,ComplaintRegistrationHandler.create);

router.route("/view/:rid")
    .get(authentication,checkUser,accessrole,ComplaintRegistrationHandler.view)

    
router.route("/:rid")
    .put(authentication,checkUser,accessrole,ComplaintRegistrationHandler.update)
    .delete(authentication,checkUser,accessrole,ComplaintRegistrationHandler.destroy);

// router.route("/export")
//     .get(authentication,accessrole, UserHandler.export);

router.route("/massDelete")
    .post(authentication,checkUser,accessrole,ComplaintRegistrationHandler.massDelete);

// router.route("/exportSelected")
//     .post(authentication, accessrole, UserHandler.exportSelected);

export default router;
