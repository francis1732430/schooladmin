import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import TimeTableHandler from "./time_tables.handler";

import * as express from "express";
const router = express.Router();

router.route("/")
    .get(authentication,accessrole, TimeTableHandler.list)
    .post(TimeTableHandler.create);

router.route("/view/:rid")
    .get(authentication,accessrole,TimeTableHandler.view)

    
router.route("/:rid")
    .put(authentication,accessrole,TimeTableHandler.update)
    .delete(authentication,accessrole,TimeTableHandler.destroy);

// router.route("/export")
//     .get(authentication,accessrole, UserHandler.export);

router.route("/massDelete")
    .post(authentication,accessrole, TimeTableHandler.massDelete);

// router.route("/exportSelected")
//     .post(authentication, accessrole, UserHandler.exportSelected);

export default router;
