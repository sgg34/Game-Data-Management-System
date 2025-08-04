/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */


// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
    .then((text) => {
        statusElem.textContent = text;
    })
    .catch((error) => {
        statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
    });
}


// Fetches data from the Ranking table and displays it.
async function fetchAndDisplayRanking() {
    const tableElement = document.getElementById('rankingtable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/rankingtable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const rankingtableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    rankingtableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });


        // Add Delete button cell at the end
        const deleteCell = row.insertCell();
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';

        const rankingId = user[0];
        deleteBtn.onclick = async () => {
            if (!confirm(`Are you sure you want to delete RankingID ${rankingId}?`)) {
                return;
            }

            try {
                const deleteResponse = await fetch(`/delete-ranking/${rankingId}`, {
                    method: 'DELETE',
                });

            if (deleteResponse.ok) {
                alert('Entry deleted successfully.');
            }

            else if (!deleteResponse.ok) {
                const errorText = await deleteResponse.text();
                alert('Failed to delete entry.');
                throw new Error(errorText || 'Failed to delete ranking');
                }
            

            fetchTableData();
            } catch (error) {
                alert(`Error deleting ranking: ${error.message}`);
                console.error(error);
            }
        };

        deleteCell.appendChild(deleteBtn);
    });
}


// Fetches data from the palyertable and displays it.
async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('playertable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/playertable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const playertableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    playertableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// This function resets or initializes the demotable.
async function resetDemotable() {
    const response = await fetch("/initiate-demotable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "demotable initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

// Inserts new records into the demotable.
async function insertPlayertable(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertId').value;    
    const pointsValue = document.getElementById('insertPoints').value;
    const nameValue = document.getElementById('insertName').value;
    const rankValue = document.getElementById('insertRank').value;
    const statValue = document.getElementById('insertStatID').value;
    const winValue = document.getElementById('insertWins').value;
    const lossValue = document.getElementById('insertLosses').value;

    const response = await fetch('/insertPlayertable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            points: pointsValue,
            name: nameValue,
            rank: rankValue,
            statID: statValue,
            wins: winValue,
            losses: lossValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data! Make sure to choose your RankingID from the table above. PlayerID and StatID should also be unique.";
    }
}

// Updates names in the demotable.
async function updateNamePlayertable(event) {
    event.preventDefault();
    const updatePlayerIDValue = document.getElementById('UpdatePlayerID').value;
    const newNameValue = document.getElementById('updateNewName').value;

    const response = await fetch('/update-name-playertable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            playerID: updatePlayerIDValue,
            newName: newNameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateNameResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Name updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating Username!";
    }
}

// Updates Points in the demotable.
async function updatePointsPlayertable(event) {
    event.preventDefault();
    const updatePlayerIDValue = document.getElementById('Update-pointsPlayerID').value;
    const newPointsValue = document.getElementById('updateNewPoints').value;

    const response = await fetch('/update-points-playertable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            playerID: updatePlayerIDValue,
            newPoints: newPointsValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updatePointsResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Points updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating Points!";
    }
}

// Updates RankingID in the demotable.
async function updateRankingPlayertable(event) {
    event.preventDefault();
    const updatePlayerIDValue = document.getElementById('UpdateRankPlayerID').value;
    const newRankingValue = document.getElementById('updateNewRanking').value;

    const response = await fetch('/update-rankingID-playertable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            playerID: updatePlayerIDValue,
            newRanking: newRankingValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateRankingResultMsg');

    if (responseData.success) {
        messageElement.textContent = "RankingID updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating Ranking! Please make sure the RankingID comes from the above Ranking table.";
    }
}


// Updates StatID in the demotable.
async function updateStatIDPlayertable(event) {
    event.preventDefault();
    const updatePlayerIDValue = document.getElementById('UpdateStatPlayerID').value;
    const newStatValue = document.getElementById('updateNewStatID').value;

    const response = await fetch('/update-statID-playertable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            playerID: updatePlayerIDValue,
            newStatID: newStatValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateStatResultMsg');

    if (responseData.success) {
        messageElement.textContent = "StatID updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating StatID! Please make sure the StatID is unique.";
    }
}

// Updates Wins and/or Losses in the demotable.
async function updateWinLossPlayertable(event) {
    event.preventDefault();
    const updatePlayerIDValue = document.getElementById('UpdateWinLossPlayerID').value;
    const newWins = document.getElementById('updateNewWins').value;
    const newLosses = document.getElementById('updateNewLosses').value;

    const response = await fetch('/update-win-loss-playertable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            playerID: updatePlayerIDValue,
            wins: newWins,
            losses: newLosses
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateWinLossResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Wins and/or Losses updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating Wins and/or Losses!";
    }
}

async function countPlayersByRanking() {
    const response = await fetch("/countPlayersByRankingBtn", {
        method: "GET"
    });

    const responseData = await response.json();
    const messageElement = document.getElementById("groupedRankingResultMsg");

    if (responseData.success) {
        const results = responseData.data;
        if (results.length === 0) {
            messageElement.textContent = "No data found.";
            return;
        }

        let html = "<table border='1'><tr><th>RankingID</th><th>Number of Players</th></tr>";
        for (const row of results) {
            html += `<tr><td>${row[0]}</td><td>${row[1]}</td></tr>`;
        }
        html += "</table>";
        messageElement.innerHTML = html;
    } else {
        messageElement.textContent = "Error fetching grouped count!";
    }
}


// Projection

document.addEventListener('DOMContentLoaded', () => {
    loadTablesForProjection();
    document.getElementById('tableSelect').addEventListener('change', handleTableChange);
    document.getElementById('projectButton').addEventListener('click', fetchProjectedData);
});

// Load table names
async function loadTablesForProjection() {
    const response = await fetch('/projection/tables');
    const data = await response.json();
    const tableSelect = document.getElementById('tableSelect');

    data.tables.forEach(table => {
        const option = document.createElement('option');
        option.value = table;
        option.textContent = table;
        tableSelect.appendChild(option);
    });
}

// Load columns when a table is selected
async function handleTableChange(event) {
    const tableName = event.target.value;
    const response = await fetch(`/projection/columns/${tableName}`);
    const data = await response.json();
    const container = document.getElementById('columnSelectContainer');

    container.innerHTML = '<strong>Select columns:</strong><br>';
    data.columns.forEach(column => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'columns';
        checkbox.value = column;

        const label = document.createElement('label');
        label.textContent = column;

        checkbox.addEventListener('change', updateProjectButtonState);

        container.appendChild(checkbox);
        container.appendChild(label);
        container.appendChild(document.createElement('br'));
    });
}

// Update the submit button
function updateProjectButtonState() {
    const selected = document.querySelectorAll('input[name="columns"]:checked').length > 0;
    document.getElementById('projectButton').disabled = !selected;
}

// Fetch and display projected data
async function fetchProjectedData(event) {
    event.preventDefault();

    const tableName = document.getElementById('tableSelect').value;
    const selectedColumns = Array.from(document.querySelectorAll('input[name="columns"]:checked')).map(cb => cb.value);

    if (!tableName || selectedColumns.length === 0) {
        alert("Please select a table and at least one column.");
        return;
    }

    const response = await fetch('/projection/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            table: tableName,
            attributes: selectedColumns
        })
    });

    // const query = `/projection/data?table=${encodeURIComponent(tableName)}&columns=${encodeURIComponent(selectedColumns.join(','))}`;
    // const response = await fetch(query);
    const data = await response.json();
    
    document.getElementById('projectionResult').style.display = 'table';
    const headerRow = document.getElementById('projectionTableHeader');
    const body = document.getElementById('projectionTableBody');
    headerRow.innerHTML = '';
    body.innerHTML = '';

    // Create header
    selectedColumns.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col;
        headerRow.appendChild(th);
    });

    // Create rows
    data.data.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        body.appendChild(tr);
    });
}

// Join Query
async function runJoinQuery() {
    const minPoints = document.getElementById('minPointsInput').value;
    if (!minPoints || isNaN(minPoints)) {
        alert("Please enter a valid number.");
        return;
    }

    try {
        const response = await fetch(`/joinQuery?minPoints=${minPoints}`);
        const data = await response.json();

        const tbody = document.querySelector('#joinResultsTable tbody');
        tbody.innerHTML = ''; // clear previous results

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3">No results found.</td></tr>';
            return;
        }

        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.AVATARNAME}</td>
                <td>${row.PLAYERID}</td>
                <td>${row.POINTS}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error running join query:', error);
        alert("An error occurred while fetching data.");
    }
}



async function maxWinByRanking() {
    const response = await fetch("/maxWinByRankingBtn", {
        method: "GET"
    });

    const responseData = await response.json();
    const messageElement = document.getElementById("maxWinByRankingMsg");

    if (responseData.success) {
        const results = responseData.data;
        if (results.length === 0) {
            messageElement.textContent = "No data found or satisfy the condition.";
            return;
        }

        let html = "<table border='1'><tr><th>RankingID</th><th>Max Wins of Players</th></tr>";
        for (const row of results) {
            html += `<tr><td>${row[0]}</td><td>${row[1]}</td></tr>`;
        }
        html += "</table>";
        messageElement.innerHTML = html;
    } else {
        messageElement.textContent = "No data found satisfy the condition!";
    }
}

async function runDivisionQuery() {
    try {
        const response = await fetch('/divisionQuery');
        const data = await response.json();

        const tbody = document.querySelector('#divisionResultsTable tbody');
        tbody.innerHTML = '';

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td>No players found.</td></tr>';
            return;
        }

        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${row.PLAYERID}</td>`;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error running division query:', error);
        alert('An error occurred while fetching division query results.');
    }
}




// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    fetchTableData();
    //document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
    document.getElementById("insertPlayertable").addEventListener("submit", insertPlayertable);
    document.getElementById("update-name-playertable").addEventListener("submit", updateNamePlayertable);
    document.getElementById("update-points-playertable").addEventListener("submit", updatePointsPlayertable);
    document.getElementById("update-rankingID-playertable").addEventListener("submit", updateRankingPlayertable);
    document.getElementById("update-statID-playertable").addEventListener("submit", updateStatIDPlayertable);
    document.getElementById("update-win-loss-playertable").addEventListener("submit", updateWinLossPlayertable);
   
    document.getElementById("countPlayersByRankingBtn").addEventListener("click", countPlayersByRanking);
    document.getElementById("maxWinByRankingBtn").addEventListener("click", maxWinByRanking);
   // document.getElementById("countPlayertable").addEventListener("click", countPlayertable);
};



// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayRanking();
    fetchAndDisplayUsers();
}
