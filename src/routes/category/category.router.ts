import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import CategoryHandler from "./category.handler";
import {checkUser} from "../../middlewares/checkuser";
import * as express from "express";
const router = express.Router();

router.route("/")
    .get(authentication,checkUser,accessrole,CategoryHandler.list)
    .post(authentication,checkUser,accessrole,CategoryHandler.create);

router.route("/view/:rid")
    .get(authentication,checkUser,accessrole,CategoryHandler.view)

    
router.route("/:rid")
    .put(authentication,checkUser,accessrole,CategoryHandler.update)
    .delete(authentication,checkUser,accessrole,CategoryHandler.destroy);

// router.route("/export")
//     .get(authentication,accessrole, UserHandler.export);

router.route("/massDelete")
    .post(authentication,checkUser,accessrole,CategoryHandler.massDelete);

// router.route("/exportSelected")
//     .post(authentication, accessrole, UserHandler.exportSelected);

export default router;
