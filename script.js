let chart;

function simulate() {
  const N = parseInt(document.getElementById("inputN").value);
  const M = parseInt(document.getElementById("inputM").value);
  const k = parseInt(document.getElementById("inputK").value);
  const facteur = parseFloat(document.getElementById("inputFacteur").value);

  if (N <= 0 || M <= 0 || k < 1 || k > N) {
    document.getElementById("output").textContent = "⚠️ Paramètres invalides.";
    return;
  }

  let proba_base = 1.0 / N;
  let proba_special = Math.min(proba_base * facteur, 1.0);

  let succes_base = 0;
  let succes_special = 0;

  for (let test = 1; test <= N; test++) {
    let proba = (test === k) ? proba_special : proba_base;
    let succes_local = 0;
    for (let i = 0; i < M; i++) {
      if (Math.random() < proba) succes_local++;
    }
    if (test === k) {
      succes_special = succes_local;
    } else {
      succes_base += succes_local;
    }
  }

  let taux_base = (succes_base / ((N - 1) * M) * 100);
  let taux_special = (succes_special / M * 100);

  let theorique_base = proba_base * 100;
  let theorique_special = proba_special * 100;

  let result = `Test normal (N-1) : ${succes_base} succès sur ${(N - 1) * M} essais (${taux_base.toFixed(2)}%)\n`;
  result += `Taux théorique normal : ${theorique_base.toFixed(2)}%\n\n`;
  result += `Test spécial (k=${k}) : ${succes_special} succès sur ${M} essais (${taux_special.toFixed(2)}%)\n`;
  result += `Taux théorique spécial : ${theorique_special.toFixed(2)}%\n\n`;

  if (taux_special > taux_base) {
    result += "Tu es chanceux !";
  } else {
    result += "Pas chanceux cette fois.";
  }

  document.getElementById("output").textContent = result;

  // Graphique Chart.js
  const ctx = document.getElementById("resultChart").getContext("2d");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Normal", "Spécial"],
      datasets: [
        {
          label: "Résultats (%)",
          data: [taux_base, taux_special],
          backgroundColor: ["#03dac6", "#bb86fc"]
        },
        {
          label: "Théorique (%)",
          data: [theorique_base, theorique_special],
          backgroundColor: ["#018786", "#3700b3"]
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: Math.max(100, theorique_special + 5)
        }
      }
    }
  });
}

document.getElementById("start").addEventListener("click", simulate);
