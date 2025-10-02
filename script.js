function lancerSimulation() {
    const N = parseInt(document.getElementById("N").value);
    const M = parseInt(document.getElementById("M").value);
    const k = parseInt(document.getElementById("k").value);
    const facteur = parseFloat(document.getElementById("facteur").value);

    if (N <= 0 || M <= 0 || k < 1 || k > N) {
        alert("Veuillez entrer des valeurs valides.");
        return;
    }

    document.getElementById("resultats").innerHTML = "<p style='color:#aaa;'>Simulation en cours… Patientez</p>";

    const worker = new Worker("worker.js");
    worker.postMessage({ N, M, k, facteur });

    worker.onmessage = function(event) {
        const { succes_base, succes_special, proba_base, proba_special } = event.data;

        const taux_base = (succes_base / ((N - 1) * M)) * 100;
        const taux_special = (succes_special / M) * 100;

        let html = `
<h2 style="text-align:center; color:#00d8ff;">Résultats de la Simulation</h2>

<div style="background:#1e1e2f; padding:15px; border-radius:10px; color:white; font-family:Arial; margin-bottom:20px;">
    <h3 style="border-bottom:1px solid #444; padding-bottom:5px;">Variables utilisées :</h3>
    <table style="width:100%; border-collapse:collapse; color:white;">
        <tr style="border-bottom:1px solid #444;">
            <td><strong>N</strong> : Nombre de séries de tests</td>
            <td style="text-align:right;">${N}</td>
            <td style="font-style:italic; color:#aaa;">Affecte le nombre total de tests</td>
        </tr>
        <tr style="border-bottom:1px solid #444;">
            <td><strong>M</strong> : Nombre d’essais par série</td>
            <td style="text-align:right;">${M}</td>
            <td style="font-style:italic; color:#aaa;">Affecte directement la précision</td>
        </tr>
        <tr style="border-bottom:1px solid #444;">
            <td><strong>k</strong> : Position spéciale dans la série (1 ≤ k ≤ N)</td>
            <td style="text-align:right;">${k}</td>
            <td style="font-style:italic; color:#aaa;">N'affecte pas le taux normal, mais la simulation spéciale</td>
        </tr>
        <tr>
            <td><strong>Facteur</strong> : Augmentation de probabilité spéciale</td>
            <td style="text-align:right;">${facteur}</td>
            <td style="font-style:italic; color:#aaa;">Augmente la probabilité spéciale</td>
        </tr>
    </table>
</div>

<div style="background:#2a2a3c; padding:15px; border-radius:10px; color:white; font-family:Arial;">
    <h3 style="border-bottom:1px solid #444; padding-bottom:5px;">Résultats :</h3>
    <p><strong>Test normal (N-1)</strong> : ${succes_base} succès sur ${(N - 1) * M} essais (${taux_base.toFixed(5)}%)<br>
    <span style="color:#00d8ff;">Taux théorique = ${(proba_base * 100).toFixed(5)}%</span></p>

    <p><strong>Test spécial (k=${k})</strong> : ${succes_special} succès sur ${M} essais (${taux_special.toFixed(5)}%)<br>
    <span style="color:#00d8ff;">Taux théorique = ${(proba_special * 100).toFixed(5)}%</span></p>

    <p style="text-align:center; font-size:1.3em; font-weight:bold; color:${taux_special > taux_base ? "#00ff00" : "#ff5555"};">
        ${taux_special > taux_base ? "🎉 Tu es chanceux !" : "Pas chanceux cette fois."}
    </p>
</div>
`;

        document.getElementById("resultats").innerHTML = html;
        tracerGraphique(proba_base, proba_special, N, M, succes_base, succes_special, k);
    };
}

function tracerGraphique(proba_base, proba_special, N, M, succes_base, succes_special, k) {
    const ctx = document.getElementById("chart").getContext("2d");

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Normal (N-1)", `Spécial (k=${k})`],
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
            plugins: {
                legend: {
                    labels: { color: "white" }
                }
            },
            scales: {
                x: { ticks: { color: "white" } },
                y: { beginAtZero: true, ticks: { color: "white" } }
            }
        }
    });
}
