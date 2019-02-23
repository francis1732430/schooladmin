import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import ChatHandler from "./chat.handler";
import {checkUser} from "../../middlewares/checkuser";
import * as express from "express";
const router = express.Router();

router.route("/")
    .get(authentication,checkUser,accessrole, ChatHandler.lists)

export default router;
