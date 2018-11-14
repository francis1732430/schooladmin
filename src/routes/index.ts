
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

router.get("/", (req:express.Request, res:express.Response) => {
    res.end();
});

export default router; 
