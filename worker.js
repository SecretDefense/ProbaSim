onmessage = function(event) {
    const { N, M, k, facteur } = event.data;

    const proba_base = 1 / N;
    let proba_special = proba_base * facteur;
    if (proba_special > 1) proba_special = 1;

    let succes_base = 0;
    let resultats_tests = [];

    for (let test = 1; test <= N; test++) {
        let proba = (test === k) ? proba_special : proba_base;
        let succes_local = 0;

        for (let i = 0; i < M; i++) {
            if (Math.random() < proba) {
                succes_local++;
            }
        }

        if (test === k) {
            succes_base = succes_local; // on garde le test principal
        }

        resultats_tests.push({
            test_num: test,
            succes: succes_local,
            proba: proba
        });
    }

    postMessage({ succes_base, proba_base, proba_special, resultats_tests });
};
