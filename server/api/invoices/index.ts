import express from "express";
const router = express.Router();
import checkAuth from "../../middleware/checkAuth"; // !!! this does nothing now
import invoicesRoutes from "./invoices";

/* router.use("/websites", checkAuth, require("./websites"));
router.use("/languages", checkAuth, require("./languages")); */

router.use("/invoices", checkAuth, invoicesRoutes);

export = router;
