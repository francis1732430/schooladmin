import { authentication }from '../../middlewares/authentication';

import {accessrole} from "../../middlewares/accessrole";
import * as express from "express";
import { preventHandler } from './prevent.handler';
//import { LocationsHandler } from '../district/locations.handler';
const router = express.Router();


router.route("/create_prevent").post(preventHandler.prevent_create);





export default router;