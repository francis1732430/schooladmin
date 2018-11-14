import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import LeaveRequestHandler from "./exams.handler";
import * as express from "express";
const router = express.Router();

router.route("/")
    .get(authentication,accessrole, LeaveRequestHandler.list)
    .post(LeaveRequestHandler.create);

router.route("/view/:rid")
    .get(authentication,accessrole,LeaveRequestHandler.view)

    
router.route("/:rid")
    .put(authentication,accessrole,LeaveRequestHandler.update)
    .delete(authentication,accessrole,LeaveRequestHandler.destroy);

// router.route("/export")
//     .get(authentication,accessrole, UserHandler.export);

router.route("/massDelete")
    .post(authentication,accessrole, LeaveRequestHandler.massDelete);

// router.route("/exportSelected")
//     .post(authentication, accessrole, UserHandler.exportSelected);

export default router;
