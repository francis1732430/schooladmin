import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import StandardHandler from "./standard.handler";
import * as express from "express";
const router = express.Router();

router.route("/")
    .get(authentication,accessrole, StandardHandler.list)
    .post(StandardHandler.create);

router.route("/view/:rid")
    .get(authentication,accessrole,StandardHandler.view)

    
router.route("/:rid")
    .put(authentication,accessrole,StandardHandler.update)
    .delete(authentication,accessrole,StandardHandler.destroy);

// router.route("/export")
//     .get(authentication,accessrole, UserHandler.export);

router.route("/massDelete")
    .post(authentication,accessrole, StandardHandler.massDelete);

// router.route("/exportSelected")
//     .post(authentication, accessrole, UserHandler.exportSelected);

export default router;
