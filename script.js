function lancerSimulation() {
    const N = parseInt(document.getElementById("N").value);
    const M = parseInt(document.getElementById("M").value);
    const k = parseInt(document.getElementById("k").value);
    const facteur = parseFloat(document.getElementById("facteur").value);

    if (N <= 0 || M <= 0 || k < 1 || k > N) {
        alert("Veuillez entrer des valeurs valides.");
        return;
    }

    document.getElementById("resultats").innerHTML = "<p>Simulation en cours… Patientez</p>";
    document.getElementById("boutons-tests").innerHTML = "";
    document.getElementById("details-test").innerHTML = "";

    const worker = new Worker("worker.js");
    worker.postMessage({ N, M, k, facteur });

    worker.onmessage = function(event) {
        const { succes_base, proba_base, proba_special, resultats_tests } = event.data;

        // --- Graphique de base inchangé ---
        afficherGraphique(succes_base, proba_base, proba_special, M);

        // --- Boutons pour voir chaque test ---
        const boutonsDiv = document.getElementById("boutons-tests");
        boutonsDiv.innerHTML = "<h3>📊 Voir les résultats de chaque série :</h3>";

        resultats_tests.forEach(t => {
            let btn = document.createElement("button");
            btn.innerText = `Série ${t.test_num}`;
            btn.onclick = () => afficherTest(t, M);
            boutonsDiv.appendChild(btn);
        });
    };
}

function afficherTest(test, M) {
    const detailsDiv = document.getElementById("details-test");
    let taux = (test.succes / M) * 100;
    detailsDiv.innerHTML = `<h3>Détails Série ${test.test_num} :</h3>
                            <p>Succès : ${test.succes} / ${M} (${taux}%)</p>
                            <p>Probabilité utilisée : ${test.proba}</p>`;
}


function afficherTest(test, M) {
    const detailsDiv = document.getElementById("details-test");
    let taux = test.succes / M * 100;
    detailsDiv.innerHTML = `<h3>Détails Test ${test.test_num} :</h3>
                            <p>Succès : ${test.succes} / ${M} (${taux}%)</p>
                            <p>Probabilité utilisée : ${test.proba}</p>`;
}

function tracerGraphique(proba_base, proba_special, N, M, succes_base, succes_special) {
    const ctx = document.getElementById("chart").getContext("2d");

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Normal (N-1)", `Spécial (k)`],
            datasets: [
                {
                    label: "Taux obtenu (%)",
                    data: [(succes_base / ((N - 1) * M)) * 100, (succes_special / M) * 100],
                    backgroundColor: ["#007bff", "#28a745"]
                },
                {
                    label: "Taux théorique (%)",
                    data: [proba_base * 100, proba_special * 100],
                    type: "line",
                    borderColor: "#ff0000",
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


