// Load mock data from data.json
let mockData = {};
fetch('data.json')
    .then(response => response.json())
    .then(data => mockData = data);

// Redirect function
function redirectTo(type) {
    if (type === 'patient') {
        window.location.href = 'patient.html';
    } else {
        window.location.href = 'researcher.html';
    }
}

// Setup profile
function setupProfile(type) {
    if (type === 'patient') {
        const condition = document.getElementById('conditionInput').value.toLowerCase();
        localStorage.setItem('userType', 'patient');
        localStorage.setItem('condition', condition);
        document.getElementById('onboarding').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        loadDashboard('patient');
    } else {
        const specialty = document.getElementById('specialtyInput').value;
        const interests = document.getElementById('interestsInput').value;
        localStorage.setItem('userType', 'researcher');
        localStorage.setItem('specialty', specialty);
        localStorage.setItem('interests', interests);
        document.getElementById('onboarding').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        loadDashboard('researcher');
    }
}

// Load dashboard
function loadDashboard(type) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    const condition = localStorage.getItem('condition') || '';
    const specialty = localStorage.getItem('specialty') || '';

    // Match from mock data
    let items = [];
    if (type === 'patient') {
        items = mockData.trials.filter(t => t.condition.toLowerCase().includes(condition)) || mockData.trials;
    } else {
        items = mockData.collaborators.filter(c => c.specialty.toLowerCase().includes(specialty)) || mockData.collaborators;
    }

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
            <h4>${item.title}</h4>
            <p>Summary: ${generateSummary(item.description)}</p>
            <button class="fav-btn" onclick="addToFavorites('${item.title}')">Add to Favorites</button>
        `;
        resultsDiv.appendChild(div);
    });
    loadFavorites();
}

// Search function
function searchItems() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    const type = localStorage.getItem('userType');
    let items = type === 'patient' ? mockData.trials : mockData.collaborators;
    items = items.filter(item => item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query));

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
            <h4>${item.title}</h4>
            <p>Summary: ${generateSummary(item.description)}</p>
            <button class="fav-btn" onclick="addToFavorites('${item.title}')">Add to Favorites</button>
        `;
        resultsDiv.appendChild(div);
    });
}

// Generate AI-style summary (mock)
function generateSummary(text) {
    return text.substring(0, 100) + '... (AI Summary: This is an important study.)';
}

// Add to favorites
function addToFavorites(title) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(title)) {
        favorites.push(title);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    loadFavorites();
}

// Load favorites
function loadFavorites() {
    const favoritesDiv = document.getElementById('favorites');
    favoritesDiv.innerHTML = '';
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.forEach(fav => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `<p>${fav}</p>`;
        favoritesDiv.appendChild(div);
    });
}