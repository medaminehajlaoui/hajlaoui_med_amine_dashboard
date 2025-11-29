let toutesLesVisites = [];
let visitesFiltrees = [];

// Charger les données depuis un JSON simulé
async function chargerDonnees() {
    // Simulation de données JSON externes
    const donnees = {
        "visites": [
            { "user": "Alice", "page": "Accueil", "temps": 120, "interactions": 5, "rebond": 20 },
            { "user": "Alice", "page": "Produits", "temps": 75, "interactions": 2, "rebond": 40 },
            { "user": "Alice", "page": "Contact", "temps": 45, "interactions": 1, "rebond": 10 },
            { "user": "Bob", "page": "Accueil", "temps": 50, "interactions": 1, "rebond": 80 },
            { "user": "Bob", "page": "Blog", "temps": 180, "interactions": 8, "rebond": 15 },
            { "user": "Claire", "page": "Accueil", "temps": 130, "interactions": 6, "rebond": 5 },
            { "user": "Claire", "page": "Panier", "temps": 90, "interactions": 4, "rebond": 20 },
            { "user": "David", "page": "Accueil", "temps": 25, "interactions": 0, "rebond": 95 }
        ]
    };
    
    toutesLesVisites = donnees.visites;
    visitesFiltrees = [...toutesLesVisites];
    initialiserFiltres();
    mettreAJourDashboard();
}

function initialiserFiltres() {
    const filtreSelect = document.getElementById('filtreUtilisateur');
    const utilisateurs = [...new Set(toutesLesVisites.map(v => v.user))];
    
    utilisateurs.forEach(user => {
        const option = document.createElement('option');
        option.value = user;
        option.textContent = user;
        filtreSelect.appendChild(option);
    });

    document.getElementById('appliquerFiltres').addEventListener('click', appliquerFiltres);
}

function appliquerFiltres() {
    const utilisateurSelectionne = document.getElementById('filtreUtilisateur').value;
    
    visitesFiltrees = utilisateurSelectionne === 'tous' 
        ? [...toutesLesVisites] 
        : toutesLesVisites.filter(v => v.user === utilisateurSelectionne);
    
    mettreAJourDashboard();
}

function mettreAJourDashboard() {
    remplirTableau();
    calculerKPIs();
    creerGraphiques();
    creerGraphiqueRebond();
}

function remplirTableau() {
    const tbody = document.querySelector("#visitesTable tbody");
    tbody.innerHTML = "";

    visitesFiltrees.forEach(v => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${v.user}</td>
            <td>${v.page}</td>
            <td>${v.temps}</td>
            <td>${v.interactions}</td>
            <td>${v.rebond}</td>
        `;
        tbody.appendChild(tr);
    });
}

function calculerKPIs() {
    const totalVisites = visitesFiltrees.length;
    const tempsMoyen = totalVisites > 0 
        ? (visitesFiltrees.reduce((sum, v) => sum + v.temps, 0) / totalVisites).toFixed(1)
        : 0;
    const rebondMoyen = totalVisites > 0
        ? (visitesFiltrees.reduce((sum, v) => sum + v.rebond, 0) / totalVisites).toFixed(1)
        : 0;
    const utilisateursUniques = new Set(visitesFiltrees.map(v => v.user)).size;

    document.getElementById('totalVisites').textContent = totalVisites;
    document.getElementById('tempsMoyen').textContent = `${tempsMoyen}s`;
    document.getElementById('rebondMoyen').textContent = `${rebondMoyen}%`;
    document.getElementById('utilisateursUniques').textContent = utilisateursUniques;
}

function creerGraphiques() {
    // Graphique 1 : Nombre de visites par page
    const pagesData = {};
    visitesFiltrees.forEach(v => {
        pagesData[v.page] = (pagesData[v.page] || 0) + 1;
    });

    new Chart(document.getElementById("pagesChart"), {
        type: "bar",
        data: {
            labels: Object.keys(pagesData),
            datasets: [{
                label: "Nombre de visites",
                data: Object.values(pagesData),
                backgroundColor: "rgba(54, 162, 235, 0.6)"
            }]
        },
        options: { responsive: true }
    });

    // Graphique 2 : Temps moyen passé sur une page
    const totalTemps = {};
    const countTemps = {};

    visitesFiltrees.forEach(v => {
        totalTemps[v.page] = (totalTemps[v.page] || 0) + v.temps;
        countTemps[v.page] = (countTemps[v.page] || 0) + 1;
    });

    const tempsMoyen = Object.keys(totalTemps).map(page =>
        (totalTemps[page] / countTemps[page]).toFixed(1)
    );

    new Chart(document.getElementById("tempsChart"), {
        type: "line",
        data: {
            labels: Object.keys(totalTemps),
            datasets: [{
                label: "Temps moyen (secondes)",
                data: tempsMoyen,
                borderColor: "rgba(255, 99, 132, 0.8)",
                fill: false,
                tension: 0.3
            }]
        },
        options: { responsive: true }
    });
}

function creerGraphiqueRebond() {
    const rebondData = {};
    visitesFiltrees.forEach(v => {
        rebondData[v.page] = (rebondData[v.page] || 0) + v.rebond;
    });

    const countData = {};
    visitesFiltrees.forEach(v => {
        countData[v.page] = (countData[v.page] || 0) + 1;
    });

    const rebondMoyenParPage = Object.keys(rebondData).map(page => 
        (rebondData[page] / countData[page]).toFixed(1)
    );

    new Chart(document.getElementById("rebondChart"), {
        type: "doughnut",
        data: {
            labels: Object.keys(rebondData),
            datasets: [{
                label: "Taux de rebond moyen (%)",
                data: rebondMoyenParPage,
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                    '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Démarrer l'application
chargerDonnees();