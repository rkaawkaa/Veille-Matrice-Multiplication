const jsButton = document.getElementById("js-button");
const wasmButton = document.getElementById("wasm-button");
const jsResult = document.getElementById("js-result");
const wasmResult = document.getElementById("wasm-result");
const generateMatriceButton = document.getElementById("generate");
const compareButton = document.getElementById("compare-button");

console.log('reload')

let matrice1 = null;
let matrice2 = null;
let elapsedTimeJavaScript = null;
let elapsedTimeWasm = null;
//wasm v2 step 1
let multiplyMatricesWasmFunction;



//Javascript
jsButton.addEventListener("click", () => {
      displayCalculating("javascript", true)
      .then(()=> {
        multiplyMatricesJS(matrice1, matrice2);
      })
});



function multiplyMatricesJS(matrix1, matrix2) {
    const startTime = performance.now();
    let result = [];
    for (let i = 0; i < matrix1.length; i++) {
        result[i] = [];
        for (let j = 0; j < matrix2[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < matrix1[0].length; k++) {
            sum += matrix1[i][k] * matrix2[k][j];

        }
        result[i][j] = sum;
        }
    }
    elapsedTimeJavaScript = performance.now() - startTime;

    document.querySelector('.result-js').innerHTML = "Temps total pour multiplier les matrices :"
    document.querySelector('.result-number-js').innerHTML = elapsedTimeJavaScript.toFixed(2) +` millisecondes, soit ${(elapsedTimeJavaScript/1000).toFixed(2)} secondes.`;

    displayCalculating("javascript", false)
}
  






wasmButton.addEventListener("click", () => {
    if(matrice1 === null) {
        console.error("Pas encore de matrice générée.");
        throw new Error("Pas encore de matrice générée.");
    }
    document.querySelector(".calculating-text-wasm").innerHTML="Récupération du module WASM..."
    getWasmFunction()
    .then(()=> {
        console.log('module wasm chargé')
        displayCalculating("wasm", true)
        .then(()=> {
            console.log('démarrage du calcul des matrices avec wasm')
            const startTime = performance.now();
            multiplyMatricesWasm(matrice1, matrice2)
            elapsedTimeWasm = performance.now()-startTime
            console.log('fin du calcul')
            console.log(elapsedTimeWasm);
            document.querySelector(".result-wasm").innerHTML = "Temps total pour multiplier les matrices:";
            document.querySelector('.result-number-wasm').innerHTML = elapsedTimeWasm.toFixed(2) +` millisecondes.`;
            displayCalculating("wasm", false);
        })
    })





  });

  function getWasmFunction() {
    return fetch('multiply_matrices.wasm')
    .then(res => res.arrayBuffer())
    .then(bytes => new WebAssembly.Instance(new WebAssembly.Module(bytes),{}))
    .then(mod => {
    multiplyMatricesWasm = mod.exports._Z16multiply_matricePA1000_fS0_iiii;
    });
}






generateMatriceButton.addEventListener("click", () => {
    const textMatrice = document.querySelector(".generate-matrice-text");
    textMatrice.innerHTML= "Génération des matrices en cours..."
     matrice1 = generateRandomMatrix(1000, 1000);
     matrice2 = generateRandomMatrix(1000, 1000);
     setTimeout(() => {
    textMatrice.innerHTML = "Deux matrices de dimensions <b>1000*1000</b> ont été générées. Les valeurs des matrices sont des nombres compris entre <b>-1 milliard et 1 milliard.</b><br>Le nombre de multiplications élementaires nécessaires pour multiplier ces deux matrices est de 1000*1000*1000 =<b> 1 milliard.</b>"
}, 1500);
})


function generateRandomMatrix(row, col) {
    const matrix = [];
    for (let i = 0; i < row; i++) {
        matrix[i] = [];
        for (let j = 0; j < col; j++) {
            matrix[i][j] = Math.random() * 2000000000 - 1000000000;
        }
    }
    return matrix;
}

function displayCalculating(language, calculating) {
    const calculateText = "Calcul en cours...";
    const finishedText = "Calcul de multiplication de matrices fini.";
    const calculateTextJS = document.querySelector(".calculating-text-js");
    const calculateTextWASM = document.querySelector(".calculating-text-wasm");
    
    return new Promise((resolve, reject) => {
    try {
    if (language === "javascript") {
    if (calculating === true) {
    calculateTextJS.innerHTML = calculateText;
    } else {
    calculateTextJS.innerHTML = finishedText;
    }
    } else {
    if (calculating === true) {
    calculateTextWASM.innerHTML = calculateText;
    } else {
    calculateTextWASM.innerHTML = finishedText;
    }
    }
    setTimeout(()=> {
        resolve();
    },200)
    } catch (error) {
    reject(error);
    }
    });
    }


compareButton.addEventListener("click", () => {
    if(elapsedTimeJavaScript === null || elapsedTimeWasm === null) {
        console.error("Pas encore les 2 temps.");
        throw new Error("Pas encore les 2 temps.");
    }
    let plusRapideText;
    let diffTemps;
    let gainTemps;
    if(elapsedTimeJavaScript < elapsedTimeWasm) {
        plusRapideText = "La tâche de multiplication de matrices s'est exécutée plus rapidement avec Javascript."
        diffTemps = `La différence de temps a été de : ${elapsedTimeJavaScript.toFixed(2)} - ${elapsedTimeWasm.toFixed(2)} = ${elapsedTimeJavaScript-elapsedTimeWasm}`
        gainTemps = `On a donc une meilleure performance (et un gain de temps) de ${((elapsedTimeJavaScript - elapsedTimeWasm) / elapsedTimeJavaScript) * 100}%`
    } else {
        plusRapideText = "La tâche de multiplication de matrices s'est exécutée plus rapidement avec du <b>bytecode WASM</b> (produit en compilant du code C++)."
        diffTemps = `La différence de temps a été de : <b>${elapsedTimeJavaScript.toFixed(2)} - ${elapsedTimeWasm.toFixed(2)} = ${(elapsedTimeJavaScript-elapsedTimeWasm).toFixed(2)} millisecondes.</b>`
        gainTemps = `On a donc une meilleure performance (et un gain de temps) de <b>${((1-(elapsedTimeWasm / elapsedTimeJavaScript))*100).toFixed(2)}`
    }
    document.querySelector('.compare-text').innerHTML = `${plusRapideText}<br>${diffTemps}<br>${gainTemps}%.</b><br>Il est donc environ <b>${Math.round(elapsedTimeJavaScript/elapsedTimeWasm)}fois plus rapide</b> que Javascript.`
})