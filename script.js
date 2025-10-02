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

    const worker = new Worker("worker.js");
    worker.postMessage({ N, M, k, facteur });

    worker.onmessage = function(event) {
        const { succes_base, succes_special, proba_base, proba_special } = event.data;

        const taux_base = (succes_base / ((N - 1) * M)) * 100;
        const taux_special = (succes_special / M) * 100;

        let html = `<h2>📊 Résultats :</h2>`;
        html += `
            <div class="result-card">
                <h3>Test normal (N-1)</h3>
                <p><strong>${succes_base}</strong> succès sur <strong>${(N - 1) * M}</strong> essais<br>
                Taux obtenu : <strong>${taux_base.toFixed(5)}%</strong><br>
                Taux théorique : <strong>${(proba_base * 100).toFixed(5)}%</strong></p>
            </div>
        `;
        html += `
            <div class="result-card">
                <h3>Test spécial (k=${k})</h3>
                <p><strong>${succes_special}</strong> succès sur <strong>${M}</strong> essais<br>
                Taux obtenu : <strong>${taux_special.toFixed(5)}%</strong><br>
                Taux théorique : <strong>${(proba_special * 100).toFixed(5)}%</strong></p>
            </div>
        `;

        if (taux_special > taux_base) {
            html += `<div class="chanceux">🎉 <strong>Tu es chanceux !</strong></div>`;
        } else {
            html += `<div class="pas-chanceux">😔 Pas chanceux cette fois.</div>`;
        }

        document.getElementById("resultats").innerHTML = html;

        tracerGraphique(proba_base, proba_special, N, M, succes_base, succes_special);
    };
}

function tracerGraphique(proba_base, proba_special, N, M, succes_base, succes_special) {
    const ctx = document.getElementById("chart").getContext("2d");

    if (window.myChart) {
        window.myChart.destroy();
    }

    // Gradient simple pour les barres
    const gradientNormal = ctx.createLinearGradient(0, 0, 0, 400);
    gradientNormal.addColorStop(0, "#00bfff");
    gradientNormal.addColorStop(1, "#00ff9d");

    const gradientSpecial = ctx.createLinearGradient(0, 0, 0, 400);
    gradientSpecial.addColorStop(0, "#00ff9d");
    gradientSpecial.addColorStop(1, "#00bfff");

    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Normal (N-1)", `Spécial (k)`],
            datasets: [
                {
                    label: "Taux obtenu (%)",
                    data: [(succes_base / ((N - 1) * M)) * 100, (succes_special / M) * 100],
                    backgroundColor: [gradientNormal, gradientSpecial],
                    borderRadius: 8 // ← ARRONDI ajouté
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
