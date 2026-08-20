const express = require("express");

const router = express.Router({
  mergeParams: true
});

router.get("/", async (req, res, next) => {
  try {

    const { businessId } = req.params;

    res.json({
      businessId,
      stats: {
        totalProducts: 124,
        productManagers: 4,
        lowStockProducts: 3,
        systemStatus: "Active"
      }
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;