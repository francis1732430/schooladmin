import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import TimeTableHandler from "./time_tables.handler";
import {checkUser} from "../../middlewares/checkuser";
import * as express from "express";
const router = express.Router();

router.route("/")
    .get(authentication,checkUser,accessrole,TimeTableHandler.list)
    .post(authentication,checkUser,accessrole,TimeTableHandler.create);

router.route("/view/:rid")
    .get(authentication,checkUser,accessrole,TimeTableHandler.view)

    
router.route("/:rid")
    .put(authentication,checkUser,accessrole,TimeTableHandler.update)
    .delete(authentication,checkUser,accessrole,TimeTableHandler.destroy);

// router.route("/export")
//     .get(authentication,accessrole, UserHandler.export);

router.route("/massDelete")
    .post(authentication,checkUser,accessrole, TimeTableHandler.massDelete);

// router.route("/exportSelected")
//     .post(authentication, accessrole, UserHandler.exportSelected);

export default router;
