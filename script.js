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
    </div>`;

html += `
    <div class="result-card">
        <h3>Test spécial (k=${k})</h3>
        <p><strong>${succes_special}</strong> succès sur <strong>${M}</strong> essais<br>
        Taux obtenu : <strong>${taux_special.toFixed(5)}%</strong><br>
        Taux théorique : <strong>${(proba_special * 100).toFixed(5)}%</strong></p>
    </div>`;

if (taux_special > taux_base) {
    html += `<div class="chanceux">🎉 <strong>Tu es chanceux !</strong></div>`;
} else {
    html += `<div class="pas-chanceux">😔 Pas chanceux cette fois.</div>`;
}

document.getElementById("resultats").innerHTML = html;


        tracerGraphique(proba_base, proba_special, N, M, succes_base, succes_special, k);
    };
}

function tracerGraphique(proba_base, proba_special, N, M, succes_base, succes_special, k) {
    const ctx = document.getElementById("chart").getContext("2d");

    if (window.myChart) {
        window.myChart.destroy();
    }

    // Création d'un gradient pour les barres
    const gradientNormal = ctx.createLinearGradient(0, 0, 0, 400);
    gradientNormal.addColorStop(0, "#4facfe");
    gradientNormal.addColorStop(1, "#00f2fe");

    const gradientSpecial = ctx.createLinearGradient(0, 0, 0, 400);
    gradientSpecial.addColorStop(0, "#43e97b");
    gradientSpecial.addColorStop(1, "#38f9d7");

    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Normal (N-1)", `Spécial (k=${k})`],
            datasets: [
                {
                    label: "Taux obtenu (%)",
                    data: [(succes_base / ((N - 1) * M)) * 100, (succes_special / M) * 100],
                    backgroundColor: [gradientNormal, gradientSpecial],
                    borderRadius: 6,
                    barPercentage: 0.6
                },
                {
                    label: "Taux théorique (%)",
                    data: [proba_base * 100, proba_special * 100],
                    type: "line",
                    borderColor: "#ff6363",
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: "#ff6363",
                    pointRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: "#ffffff",
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: "#2a2a2a",
                    titleColor: "#ffffff",
                    bodyColor: "#ffffff"
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: "#ffffff",
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return value.toFixed(2) + "%";
                        }
                    },
                    grid: {
                        color: "rgba(255,255,255,0.1)"
                    }
                },
                x: {
                    ticks: {
                        color: "#ffffff",
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: "rgba(255,255,255,0.1)"
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: "easeOutQuart"
            }
        }
    });
}




