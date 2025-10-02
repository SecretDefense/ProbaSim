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

    const worker = new Worker("worker.js");
    worker.postMessage({ N, M, k, facteur });

    worker.onmessage = function(event) {
        const { succes_base, succes_special, proba_base, proba_special, resultats_tests } = event.data;

        // --- Affichage initial inchangé ---
        let html = `<h2>Résultats globaux :</h2>`;
        html += `<p>Test normal (N-1) : ${succes_base} succès sur ${(N - 1) * M} essais (${succes_base / ((N - 1) * M) * 100}%)<br>`;
        html += `Taux théorique normal : ${proba_base * 100}%</p>`;

        html += `<p>Test spécial (k=${k}) : ${succes_special} succès sur ${M} essais (${succes_special / M * 100}%)<br>`;
        html += `Taux théorique spécial : ${proba_special * 100}%</p>`;

        html += `<p><strong>${(succes_special / M) > (succes_base / ((N - 1) * M)) ? "🎉 Tu es chanceux !" : "Pas chanceux cette fois."}</strong></p>`;

        document.getElementById("resultats").innerHTML = html;

        // --- NOUVEAU : boutons pour voir les autres tests ---
        const boutonsDiv = document.getElementById("boutons-tests");
        boutonsDiv.innerHTML = "<h3>Voir les résultats de chaque test :</h3>";
        resultats_tests.forEach(t => {
            let btn = document.createElement("button");
            btn.innerText = `Test ${t.test_num}`;
            btn.onclick = () => afficherTest(t, M);
            boutonsDiv.appendChild(btn);
        });

        document.getElementById("details-test").innerHTML = "";
    };
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

