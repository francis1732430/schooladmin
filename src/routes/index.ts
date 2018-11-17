
import auth from "./auth/auth.router";
import roles from "./roles/roles.router";
import token from "./tokens/tokens.router";
import users from "./user/user.router";
import permission from "./permission/permission.router";
import settings from "./settings/settings.router";
import locations from "./locations/locations.router";
import district from "./district/locations.router";
import schools from "./schools/school.router";
import standards from "./standards/standard.router";
import attendence from "./attendence/attendence.router";
import sections from "./class/class.router";
import examtypes from "./exam_types/exams.router";
import exams from "./exams/exams.router";
import results from "./exam_result/results.router";
import subjects from "./subjects/subjects.router";
import leaverequest from "./leave_request/leave.router";
import calender from "./time_tables/time_tables.router";

import me from "./me/me.router";
import * as express from "express";
const router = express.Router();
router.use("/auth", auth);
router.use("/roles", roles);
router.use("/tokens", token);
router.use("/users", users);
router.use("/permission", permission);
router.use("/me", me);
router.use("/settings", settings);
router.use("/locations", locations);
router.use("/district", district);
router.use("/schools", schools);
router.use("/standards", standards);
router.use("/attendence", attendence);
router.use("/sections", sections);
router.use("/examtypes",examtypes);
router.use("/exams",exams);
router.use("/examresults",results);
router.use("/subjects",subjects);
router.use("/leaverequest",leaverequest);
router.use("/calender",calender);


router.get("/", (req:express.Request, res:express.Response) => {
    res.end();
});

export default router; 
