let chart = null;

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

  let taux_base = (succes_base / ((N - 1) * M) * 100).toFixed(2);
  let taux_special = (succes_special / M * 100).toFixed(2);
  let theorique = (proba_base * 100).toFixed(2);

  let result = `Test normal (N-1) : ${succes_base} succès sur ${(N - 1) * M} essais (${taux_base}%)\n`;
  result += `Taux théorique normal : ${theorique}%\n\n`;
  result += `Test spécial (k=${k}) : ${succes_special} succès sur ${M} essais (${taux_special}%)\n`;
  result += `Taux théorique spécial : ${(proba_special * 100).toFixed(2)}%\n\n`;

  if (parseFloat(taux_special) > parseFloat(taux_base)) {
    result += "✨ Tu es chanceux !";
  } else {
    result += "😔 Pas chanceux cette fois.";
  }

  document.getElementById("output").textContent = result;

  // 🎨 Graphique
  const ctx = document.getElementById("chart").getContext("2d");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Normal", "Spécial"],
      datasets: [
        {
          label: "Résultats (%)",
          data: [taux_base, taux_special],
          backgroundColor: ["#4e79a7", "#f28e2b"]
        },
        {
          label: "Théorique (%)",
          data: [theorique, (proba_special * 100).toFixed(2)],
          backgroundColor: ["#a0cbe8", "#ffbe7d"]
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: Math.max(theorique, proba_special * 100, taux_base, taux_special) + 5
        }
      }
    }
  });
}

document.getElementById("start").addEventListener("click", simulate);

// 🌙 Mode nuit
document.getElementById("toggle-dark").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
