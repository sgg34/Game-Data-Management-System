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

            if (!deleteResponse.ok) {
                const errorText = await deleteResponse.text();
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
        messageElement.textContent = "Error updating name!";
    }
}

// Updates names in the demotable.
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
        messageElement.textContent = "Error updating name!";
    }
}




// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countDemotable() {
    const response = await fetch("/count-demotable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
    } else {
        alert("Error in count demotable!");
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

    document.getElementById("countDemotable").addEventListener("click", countDemotable);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayRanking();
    fetchAndDisplayUsers();
}
