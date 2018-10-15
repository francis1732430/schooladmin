/**
 *      on 8/1/16.
 */
import {TokenHandler} from "./tokens.handler";
import * as express from "express";
const router = express.Router();

router.route("/:token")
    .get(TokenHandler.handle);

export default router;
