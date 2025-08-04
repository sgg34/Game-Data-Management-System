const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchPlayertableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Player_Has_R1');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchRankingtableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Ranking');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// async function initiateDemotable() {
//     return await withOracleDB(async (connection) => {
//         try {
//             await connection.execute(`DROP TABLE Player_Has_R1`);
//         } catch(err) {
//             console.log('Table might not exist, proceeding to create...');
//         }

//         const result = await connection.execute(`
//             CREATE TABLE Player_Has_R1 (
//                 PlayerID CHAR(10) PRIMARY KEY, 
//                 Points INTEGER, 
//                 Username VARCHAR(20), 
//                 RankingID CHAR(10) NOT NULL, 
//                 StatID CHAR(10) NOT NULL, 
//                 Wins INTEGER, 
//                 Losses INTEGER, 
//                 UNIQUE (StatID), 
//                 FOREIGN KEY ( RankingID ) REFERENCES Ranking)
//         `);
//         return true;
//     }).catch(() => {
//         return false;
//     });
// }

async function insertPlayertable(id, points, name, rank, statID, wins, losses ) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Player_Has_R1 VALUES (:id, :points, :name, :rank, :statID, :wins, :losses )`,
            [id, points, name, rank, statID, wins, losses],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}



async function updateNamePlayertable(playerID, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE Player_Has_R1 SET Username = :newName WHERE PlayerID = :playerID`,
            [newName, playerID],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updatePointsPlayertable(playerID, newPoints) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE Player_Has_R1 SET Points = :newPoints WHERE PlayerID = :playerID`,
            [newPoints, playerID],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateRankingPlayertable(playerID, newRanking) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE Player_Has_R1 SET RankingID = :newRanking WHERE PlayerID = :playerID`,
            [newRanking, playerID],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updatestatIDPlayertable(playerID, newStat) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE Player_Has_R1 SET StatID = :newStat WHERE PlayerID = :playerID`,
            [newStat, playerID],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateWinLossPlayertable(playerID, wins, losses) {
    return await withOracleDB(async (connection) => {
        let setClauses = [];
        let binds = { playerID };

        if (wins !== undefined && wins !== null && wins !== "") {
            setClauses.push("Wins = :wins");
            binds.wins = Number(wins);
        }

        if (losses !== undefined && losses !== null && losses !== "") {
            setClauses.push("Losses = :losses");
            binds.losses = Number(losses);
        }

        if (setClauses.length === 0) {
            // Nothing to update
            return false;
        }

        const query = `UPDATE Player_Has_R1 SET ${setClauses.join(", ")} WHERE PlayerID = :playerID`;

        const result = await connection.execute(query, binds, { autoCommit: true });
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        console.error("Update failed:", err);
        return false;
    });
}


async function countPlayertable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM Player_Has_R1');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

async function deleteRankingById(rankingId) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'DELETE FROM Ranking WHERE RankingID = :id',
            [rankingId],
            {autoCommit: true}
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => false);
}

async function getAllTables() {
    return await withOracleDB(async (connection) => {
        const query = `SELECT table_name FROM user_tables`;
        const result = await connection.execute(query);
        return result.rows.map(row => row[0]);
    })
}

async function getColumnsForTable(tableName) {
    return await withOracleDB(async (connection) => {
        const query = `
            SELECT column_name 
            FROM user_tab_columns 
            WHERE table_name = :tableName
  `     ;
        const result = await connection.execute(query, [tableName]);
        return result.rows.map(row => row[0]);
    });
}

async function projectAttributes(tableName, attributes) {
    return await withOracleDB(async (connection) => {
        const attrList = attributes.map(attr => `"${attr}"`).join(", ");
        const query = `SELECT ${attrList} FROM "${tableName}"`;
        const result = await connection.execute(query);
        return result.rows;
    });
}

module.exports = {
    testOracleConnection,
    fetchPlayertableFromDb,
    fetchRankingtableFromDb,
    //initiateDemotable, 
    insertPlayertable, 
    updateNamePlayertable, 
    updatePointsPlayertable, 
    updateRankingPlayertable,
    updatestatIDPlayertable,
    updateWinLossPlayertable,

    deleteRankingById,
    countPlayertable,

    getAllTables,
    getColumnsForTable,
    projectAttributes
};