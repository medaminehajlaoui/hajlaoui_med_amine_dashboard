// Simulation réaliste : chaque ligne = une visite sur une page
const visites = [
    { user: "Alice", page: "Accueil", temps: 120, interactions: 5, rebond: 20 },
    { user: "Alice", page: "Produits", temps: 75, interactions: 2, rebond: 40 },
    { user: "Alice", page: "Contact", temps: 45, interactions: 1, rebond: 10 },
    { user: "Bob", page: "Accueil", temps: 50, interactions: 1, rebond: 80 },
    { user: "Bob", page: "Produits", temps: 95, interactions: 3, rebond: 30 },
    { user: "Claire", page: "Accueil", temps: 130, interactions: 6, rebond: 5 },
    { user: "Claire", page: "Panier", temps: 90, interactions: 4, rebond: 20 }
];

// Remplir le tableau avec toutes les visites
function remplirTableau() {
    const tbody = document.querySelector("#visitesTable tbody");
    tbody.innerHTML = "";

    visites.forEach(v => {
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

// Créer les graphiques
function creerGraphiques() {

    // ------ Graphique 1 : Nombre de visites par page ------
    const pagesData = {};
    visites.forEach(v => {
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

    // ------ Graphique 2 : Temps moyen passé sur une page ------
    const totalTemps = {};
    const countTemps = {};

    visites.forEach(v => {
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

// Lancer le dashboard
remplirTableau();
creerGraphiques();
