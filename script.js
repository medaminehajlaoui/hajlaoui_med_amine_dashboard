let toutesLesVisites = [];
let visitesFiltrees = [];

function afficherLoading() {
    document.getElementById('loading').style.display = 'flex';
}

function cacherLoading() {
    document.getElementById('loading').style.display = 'none';
}

function exporterDonnees() {
    const dataStr = JSON.stringify(visitesFiltrees, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `donnees-visites-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

function simulerChargement() {
    afficherLoading();
    setTimeout(() => {
        chargerDonnees();
        cacherLoading();
        
        // Animation de fade-in
        document.querySelectorAll('.kpi-card, .chart-container').forEach(el => {
            el.classList.add('fade-in');
        });
    }, 1000);
}

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
            { "user": "David", "page": "Accueil", "temps": 25, "interactions": 0, "rebond": 95 },
            { "user": "Emma", "page": "Produits", "temps": 200, "interactions": 7, "rebond": 25 },
            { "user": "Frank", "page": "Blog", "temps": 150, "interactions": 3, "rebond": 35 }
        ]
    };
    
    toutesLesVisites = donnees.visites;
    visitesFiltrees = [...toutesLesVisites];
    initialiserFiltres();
    initialiserEvenements();
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

function initialiserEvenements() {
    document.getElementById('exporterDonnees').addEventListener('click', exporterDonnees);
    document.getElementById('rafraichir').addEventListener('click', simulerChargement);
    
    // Navigation simulée
    document.querySelectorAll('nav li').forEach(item => {
        item.addEventListener('click', function() {
            alert(`Navigation vers: ${this.textContent}`);
        });
    });
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
    creerGraphiqueUtilisateurs();
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
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Visites: ${context.parsed.y}`;
                        }
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
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
                backgroundColor: "rgba(255, 99, 132, 0.1)",
                borderWidth: 2,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Temps moyen: ${context.parsed.y}s`;
                        }
                    }
                }
            }
        }
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
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed}%`;
                        }
                    }
                }
            }
        }
    });
}

// NOUVELLE FONCTION : Graphique circulaire pour la répartition des utilisateurs
function creerGraphiqueUtilisateurs() {
    const usersData = {};
    visitesFiltrees.forEach(v => {
        usersData[v.user] = (usersData[v.user] || 0) + 1;
    });

    const totalVisites = visitesFiltrees.length;
    const usersPercentage = Object.keys(usersData).map(user => {
        const percentage = ((usersData[user] / totalVisites) * 100).toFixed(1);
        return {
            user: user,
            percentage: percentage,
            visites: usersData[user]
        };
    });

    new Chart(document.getElementById("usersChart"), {
        type: "pie",
        data: {
            labels: usersPercentage.map(u => `${u.user} (${u.percentage}%)`),
            datasets: [{
                label: "Répartition des utilisateurs",
                data: usersPercentage.map(u => u.percentage),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                    '#9966FF', '#FF9F40', '#8AC926', '#1982C4',
                    '#6A4C93', '#F15BB5'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        font: {
                            size: 11
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const userData = usersPercentage[context.dataIndex];
                            return `${userData.user}: ${userData.percentage}% (${userData.visites} visites)`;
                        }
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
}

// Démarrer l'application
document.addEventListener('DOMContentLoaded', function() {
    simulerChargement();
});