/**
 *      on 7/20/16.
 */
import merchantschema from "./merchantschema/merchantschema.router";
import auth from "./auth/auth.router";
import roles from "./roles/roles.router";
import token from "./tokens/tokens.router";
import users from "./user/user.router";
import permission from "./permission/permission.router";
import settings from "./settings/settings.router";
import documenttype from "./store_document_type/documenttype.router";
import schemetype from "./store_scheme_type/schemetype.router";
import certificatetype from "./store_certificate_type/certificatetype.router";
import locations from "./locations/locations.router";
import me from "./me/me.router";
import stores from "./stores/stores.router"; 
import * as express from "express";
import catalog from "./catalog/catalog.router";
import approval from "./approval/approval.router";
import adminApproval from "./adminapproval/adminapproval.router";
import version2 from "./v2";

const router = express.Router();
router.use("/merchantschema", merchantschema);
router.use("/auth", auth);
router.use("/roles", roles);
router.use("/tokens", token);
router.use("/users", users);
router.use("/permission", permission);
router.use("/me", me);
router.use("/settings", settings);
router.use("/document-types", documenttype);
router.use("/scheme-types", schemetype);
router.use("/certificate-types", certificatetype);
router.use("/locations", locations);
router.use("/stores", stores);
router.use("/catalog", catalog);
router.use("/approval", approval);
router.use("/admin-approval", adminApproval);
router.use("/v2", version2);

router.get("/", (req:express.Request, res:express.Response) => {
    res.end();
});

export default router; 
