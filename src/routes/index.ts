
import auth from "./auth/auth.router";
import roles from "./roles/roles.router";
import token from "./tokens/tokens.router";
import users from "./user/user.router";
import permission from "./permission/permission.router";
import settings from "./settings/settings.router";
import locations from "./locations/locations.router";
import district from "./district/locations.router";
import district1 from "./districts1/district.router";
import directory_taulk from "./directory_taulk/directory_taluk.router";
import schools from "./schools/school.router";
import me from "./me/me.router";
import WeakDays from "./weakdays/weakdays.routes"
import Timing from "./time/time.routes";
import Prevent from "./prevent/prevent.router";
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
router.use("/district1",district1)
router.use("/taluka",directory_taulk)
router.use("/weak",WeakDays)
router.use("/time",Timing);
router.use("/prevent",Prevent);

router.get("/", (req:express.Request, res:express.Response) => {
    res.end();
});

export default router; 
