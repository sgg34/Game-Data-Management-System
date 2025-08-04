const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/rankingtable', async (req, res) => {
    const ranktableContent = await appService.fetchRankingtableFromDb();
    res.json({data: ranktableContent});
});


router.get('/playertable', async (req, res) => {
    const tableContent = await appService.fetchPlayertableFromDb();
    res.json({data: tableContent});
});


// router.post("/initiate-playertable", async (req, res) => {
//     const initiateResult = await appService.initiateDemotable();
//     if (initiateResult) {
//         res.json({ success: true });
//     } else {
//         res.status(500).json({ success: false });
//     }
// });

router.post("/insertPlayertable", async (req, res) => {
    const { id,
        points,
        name,
        rank,
        statID,
        wins,
        losses } = req.body;
    const insertResult = await appService.insertPlayertable( id, points||0, name, rank, statID, wins||0, losses||0 );
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});



router.post("/update-name-playertable", async (req, res) => {
    const { playerID, newName } = req.body;
    const updateResult = await appService.updateNamePlayertable(playerID, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-points-playertable", async (req, res) => {
    const { playerID, newPoints } = req.body;
    console.log("Received request to update points:", req.body);
    const updateResult = await appService.updatePointsPlayertable(playerID, newPoints);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-rankingID-playertable", async (req, res) => {
    const { playerID, newRanking } = req.body;
    console.log("Received request to update ranking:", req.body);
    const updateResult = await appService.updateRankingPlayertable(playerID, newRanking);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-statID-playertable", async (req, res) => {
    const { playerID, newStatID } = req.body;
    console.log("Received request to update statID:", req.body);
    const updateResult = await appService.updatestatIDPlayertable(playerID, newStatID);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-win-loss-playertable", async (req, res) => {
    const { playerID, wins, losses } = req.body;
    console.log("Received request to update wins/losses:", req.body);
    const updateResult = await appService.updateWinLossPlayertable(playerID, wins, losses);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


router.get('/countPlayersByRankingBtn', async (req, res) => {
    const groupedCounts = await appService.countPlayersByRanking();
    if (groupedCounts.length > 0) {
        res.json({ success: true, data: groupedCounts });
    } else {
        res.status(500).json({ success: false });
    }
});


router.delete("/delete-ranking/:id", async (req, res) => {
    const {id} = req.params;
    const deleteResult = await appService.deleteRankingById(id);
    if (deleteResult) {
        res.json({success: true});
    } else {
        res.status(500).json({success: fail});
    }
})
// Route to get list of tables
router.get("/projection/tables", async (req, res) => {
    try {
      const result = await appService.getAllTables();
      res.json({ tables: result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Route to get columns for a given table
  router.get("/projection/columns/:tableName", async (req, res) => {
    try {
      const tableName = req.params.tableName.toUpperCase();
      const result = await appService.getColumnsForTable(tableName);
      res.json({ columns: result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Route to get projected data
  router.post("/projection/data", async (req, res) => {
    try {
      const { table, attributes } = req.body;
      const result = await appService.projectAttributes(table, attributes);
      res.json({ data: result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Route to get the minimum point typed by the user for join query
  router.get('/joinQuery', async (req, res) => {
    const { minPoints } = req.query;

    try {
        const result = await appService.runJoinQuery(minPoints);
        res.json(result);
        } catch (error) {
            console.error("Join query failed:", error);
            res.status(500).json({ message: "Server error", error });
        }
    });

    router.get('/maxWinByRankingBtn', async (req, res) => {
    const maxWin = await appService.maxWinByRanking();
    if (maxWin.length > 0) {
        res.json({ success: true, data: maxWin });
    } else {
        res.status(500).json({ success: false });
    }
    });
  
module.exports = router;