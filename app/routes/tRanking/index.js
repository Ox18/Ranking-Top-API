"use strict";
const express_1 = require("express");
const router = express_1.Router();
const topController = require("./functions");
router.get('/', (req, res) => {
    const { numberOfAccounts, rank, position, gp } = req.query;
    const topObj = {
        numberOfAccounts: numberOfAccounts || 0,
        rank: rank || 0,
        position: position || 0,
        gp: gp || 0,
    };
    try {
        let rank =topObj.rank >= 26 ? topObj : topController.getRank(topObj);
        res.status(200).json({
            status: "ok",
            message: "Successful get rank",
            data: rank,
        });
    }
    catch (ex) {
        res.status(500).json({
            status: "error",
            message: ex.message,
            data: 0,
        });
    }
});
module.exports = router;
//# sourceMappingURL=index.js.map