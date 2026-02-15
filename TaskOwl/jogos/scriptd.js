const words = [
    { scrambled: "panio", correct: "piano", hint: "Instrumento musical de cordas" },
        { scrambled: "acsco", correct: "casco", hint: "O cavalo tem." },
        { scrambled: "hionc", correct: "nicho", hint: "Espaço ou especialidade." },
        { scrambled: "amtre", correct: "marte", hint: "É um planeta." },
        { scrambled: "vlrio", correct: "livro", hint: "Você lê." },
        { scrambled: "acixa", correct: "caixa", hint: "Objeto usado para guardar coisas." },
        { scrambled: "giter", correct: "tigre", hint: "Animal felino." },
        { scrambled: "vache", correct: "chave", hint: "Usada para abrir ou fechar fechaduras." },  
        { scrambled: "nasom", correct: "manso", hint: "Calmo e tranquilo." },
        { scrambled: "ovroc", correct: "corvo", hint: "Ele voa." },
        { scrambled: "ohvni", correct: "vinho", hint: "É uma bebida." },
        { scrambled: "osonh", correct: "sonho", hint: "Você tem enquanto dorme." },
        { scrambled: "xfaai", correct: "faixa", hint: "É um acessório." },
        { scrambled: "tapos", correct: "pasto", hint: "É verde." },
        { scrambled: "helvo", correct: "velho", hint: "Tem muitos anos." },
        { scrambled: "cihbo", correct: "bicho", hint: "Animal, especialmente pequeno." },
        { scrambled: "iilro", correct: "lírio", hint: "É uma flor." },
        { scrambled: "nidlo", correct: "lindo", hint: "Belo e atraente." },
        { scrambled: "tumoi", correct: "muito", hint: "Grande quantidade." },
        { scrambled: "lohet", correct: "hotel", hint: "Você se hospeda nele." },
        { scrambled: "lahip", correct: "pilha", hint: "Energia." },
        { scrambled: "nodum", correct: "mundo", hint: "Planeta Terra ou universo." },
        { scrambled: "tovas", correct: "vasto", hint: "Amplo e grande." },
        { scrambled: "alhof", correct: "folha", hint: "Parte da árvore ou caderno." },
        { scrambled: "toven", correct: "vento", hint: "Ar." },
        { scrambled: "uprog", correct: "grupo", hint: "Conjunto de pessoas ou coisas." },
        { scrambled: "adome", correct: "moeda", hint: "Utilizado para pagamento." },
        { scrambled: "ogral", correct: "largo", hint: "Amplo ou aberto." },
        { scrambled: "tapsa", correct: "pasta", hint: "Usa para escovar os dentes." },
        { scrambled: "valse", correct: "selva", hint: "Floresta densa e tropical." },
        { scrambled: "pasil", correct: "lapis", hint: "Utilizado para escrever ou desenhar." },

];


let currentWordIndex = 0;

document.getElementById('input-word').addEventListener('keypress', function (e) {
    const keyCode = e.keyCode || e.which;

    if (e.key === ' ' || (keyCode >= 48 && keyCode <= 57)) {
        e.preventDefault();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        checkAnswer();
    }
});

let usedWords = [];

function getRandomIndex() {
    let index;
    do {
        index = Math.floor(Math.random() * words.length);
    } while (usedWords.includes(index));

    usedWords.push(index);
    return index;
}

function displayWord() {
    if (usedWords.length >= words.length) {
        document.getElementById("feedback").textContent = "Parabéns! Você completou o jogo!";
        document.getElementById("scrambled-word").textContent = "";
        document.getElementById("input-word").value = "";
        document.getElementById("input-word").placeholder = "Fim de jogo!";
        document.getElementById('input-word').disabled = true;
        document.getElementById('input-word').addEventListener('keydown', function (e) {
            e.preventDefault();
        });
        return;
    }

    currentWordIndex = getRandomIndex();
    const word = words[currentWordIndex];
    document.getElementById("scrambled-word").textContent = word.scrambled;
    document.getElementById("input-word").value = "";
    document.getElementById("feedback").textContent = "";
    document.getElementById("hint").style.display = "none";
}

function checkAnswer() {
    const input = document.getElementById("input-word").value.toLowerCase();
    const word = words[currentWordIndex];

    if (input === word.correct) {
        document.getElementById("feedback").textContent = "Correto! Passando para a próxima palavra...";
        currentWordIndex++;

        if (currentWordIndex < words.length) {
            setTimeout(displayWord, 750);
        } else {
            document.getElementById("feedback").textContent = "Parabéns! Você completou o jogo!";
            document.getElementById("scrambled-word").textContent = "";
            document.getElementById("input-word").value = "";
            document.getElementById("input-word").placeholder = "Fim de jogo!";
            document.getElementById('input-word').disabled = true;
            document.getElementById('input-word').addEventListener('keydown', function (e) {
                e.preventDefault();
            });
        }
    } else {
        document.getElementById("feedback").textContent = "Tente novamente!";
        document.getElementById("hint").style.display = "block";
        document.getElementById("hint-text").textContent = word.hint;
    }
}

document.getElementById("check-button").addEventListener("click", checkAnswer);

displayWord();


