import { authentication }from '../../middlewares/authentication';

import {accessrole} from "../../middlewares/accessrole";
import * as express from "express";
import { preventHandler } from './prevent.handler';
import {checkUser} from "../../middlewares/checkuser";
const router = express.Router();


router.route("/").post(authentication,checkUser,accessrole,preventHandler.prevent_create);
router.route("/:rid").put(authentication,checkUser,accessrole,authentication,checkUser,accessrole,preventHandler.update);
router.route("/:rid").delete(authentication,checkUser,accessrole,authentication,checkUser,accessrole,preventHandler.destory);
router.route("/").get(authentication,checkUser,accessrole,authentication,checkUser,accessrole,preventHandler.list);
router.route("/massdelete").post(authentication,checkUser,accessrole,authentication,checkUser,accessrole,preventHandler.massdelete);
router.route("/view/:rid").get(authentication,checkUser,accessrole,authentication,checkUser,accessrole,preventHandler.view);





export default router;