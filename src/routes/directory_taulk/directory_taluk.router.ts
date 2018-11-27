import { authentication }from '../../middlewares/authentication';
import { District_taluka }from './directory_taulk.handler';
import * as express from "express";
import { format } from 'url';

const router = express.Router();


router.route("/create_taluka").post(District_taluka.taluka_create);
router.route("/update_taluka/:rid").put(District_taluka.district_taluka_update);
router.route("/:rid").delete(District_taluka.destory);
router.route("/list").get(District_taluka.list);
router.route("/massdelete").post(District_taluka.massdelete);
router.route("/view/:rid").get(District_taluka.view_district_taluka);

export default router;