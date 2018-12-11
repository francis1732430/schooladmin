import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import BooksHandler from "./books.handler";
import {checkUser} from "../../middlewares/checkuser";
import * as express from "express";
const router = express.Router();

router.route("/")
    .get(authentication,checkUser,accessrole, BooksHandler.list)
    .post(authentication,checkUser,accessrole,BooksHandler.create);

router.route("/view/:rid")
    .get(authentication,checkUser,accessrole,BooksHandler.view)

    
router.route("/:rid")
    .put(authentication,checkUser,accessrole,BooksHandler.update)
    .delete(authentication,checkUser,accessrole,BooksHandler.destroy);

// router.route("/export")
//     .get(authentication,accessrole, UserHandler.export);

router.route("/massDelete")
    .post(authentication,checkUser,accessrole,BooksHandler.massDelete);

// router.route("/exportSelected")
//     .post(authentication, accessrole, UserHandler.exportSelected);

export default router;
