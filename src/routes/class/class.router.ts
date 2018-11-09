import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import ClassHandler from "./class.handler";
import * as express from "express";
const router = express.Router();

router.route("/")
    .get(authentication,accessrole, ClassHandler.list)
    .post(ClassHandler.create);

router.route("/view/:rid")
    .get(authentication,accessrole,ClassHandler.view)

    
router.route("/:rid")
    .put(authentication,accessrole,ClassHandler.update)
    .delete(authentication,accessrole,ClassHandler.destroy);

// router.route("/export")
//     .get(authentication,accessrole, UserHandler.export);

router.route("/massDelete")
    .post(authentication,accessrole, ClassHandler.massDelete);

// router.route("/exportSelected")
//     .post(authentication, accessrole, UserHandler.exportSelected);

export default router;
