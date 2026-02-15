const gameBoard = document.querySelector('.game-board');
const nave = document.getElementById('nave');
const pontuacaoDisplay = document.getElementById('pontuacao');
const objetivoDisplay = document.getElementById('objetivo');
let posicao = 50;
let operacaoAtual = '';
let resultadoEsperado = gerarResultadoEsperado();
let pontuacao = 0;
let jogopausado = false;
let ultimoTiro = 0;
let som;
let laser = true;
const audio = new Audio('../sons/laser-shot.mp3');
const audioo = new Audio('../sons/laser-shot2.mp3');
const audio2 = new Audio('../sons/explosion-sfx.mp3');
objetivoDisplay.textContent = resultadoEsperado;
let jogoIniciado = false;
let audiotocando = true;
var musica = document.getElementById('musica');

window.onload = () => {

    const volumeTiros = carregarConfiguracao('volumeTiros', 1);
    document.getElementById('volume-tiros').value = volumeTiros;
    audio.volume = volumeTiros;
    audioo.volume = volumeTiros;
    audio2.volume = volumeTiros;

    const volumeMusica = carregarConfiguracao('volumeMusica', 1);
    document.getElementById('volume-musica').value = volumeMusica;
    musica.volume = volumeMusica;
};


document.addEventListener('keydown', (event) => {
    if (!jogoIniciado) return;
    const tempoAtual = Date.now();
    if (event.key === 'ArrowRight') {
        if (posicao < 90) posicao += 2;
    } else if (event.key === 'ArrowLeft') {
        if (posicao > 10) posicao -= 2;
    } else if (event.key === ' ' || event.ctrlKey) {
        if (tempoAtual - ultimoTiro >= 1000) {
            atirar();
            ultimoTiro = tempoAtual;
        }
    }
    nave.style.left = `${posicao}%`;
});

function atirar() {
    if (!jogoIniciado) return;
    if (laser) {
        audio.play();
        laser = !laser;
    }
    else {
        audioo.play();
        laser = !laser;
    }
    const tiro = document.createElement('div');
    tiro.classList.add('tiro');
    tiro.style.left = `${posicao}%`;
    tiro.style.bottom = '80px';
    gameBoard.appendChild(tiro);

    const intervaloTiro = setInterval(() => {
        let posicaoTiro = parseInt(tiro.style.bottom);
        if (posicaoTiro > 500) {
            tiro.remove();
            clearInterval(intervaloTiro);
        } else {
            tiro.style.bottom = `${posicaoTiro + 10}px`;
            verificarColisao(tiro);
        }
    }, 50);
}

function gerarAsteróide() {
    if (!jogoIniciado) return;

    const asteróide = document.createElement('div');
    asteróide.classList.add('asteroide');

    if (operadoresSelecionados.length === 0) {
        asteróide.textContent = Math.floor(Math.random() * 10);
    } else {
        if (Math.random() > 0.5) {
            asteróide.textContent = Math.floor(Math.random() * 10);
        } else {
            const operadorAleatorio = operadoresSelecionados[Math.floor(Math.random() * operadoresSelecionados.length)];
            asteróide.textContent = operadorAleatorio;
        }
    }

    asteróide.style.left = `${Math.floor(Math.random() * 80)}%`;
    asteróide.style.top = '0px';
    gameBoard.appendChild(asteróide);
    
    const intervaloAsteróide = setInterval(() => {
        let posicaoAsteróide = parseInt(asteróide.style.top);
        if (posicaoAsteróide > 500) {
            asteróide.remove();
            clearInterval(intervaloAsteróide);
        } 
        if(jogopausado) {
            asteróide.style.top = `${posicaoAsteróide + 0}px`;
        }
        else {
            asteróide.style.top = `${posicaoAsteróide + 5}px`;
        }
    }, 100);
}


function verificarColisao(tiro) {
    const asteróides = document.querySelectorAll('.asteroide');
    asteróides.forEach(asteroide => {
        const tiroRect = tiro.getBoundingClientRect();
        const asteroideRect = asteroide.getBoundingClientRect();

        if (tiroRect.left < asteroideRect.right &&
            tiroRect.right > asteroideRect.left &&
            tiroRect.top < asteroideRect.bottom &&
            tiroRect.bottom > asteroideRect.top) {

            const conteudoAsteroide = asteroide.textContent;

            if (isOperador(conteudoAsteroide) && isOperador(operacaoAtual.slice(-1))) {
                return; 
            }

            operacaoAtual += conteudoAsteroide;
            document.getElementById('operacao-atual').textContent = operacaoAtual;

            tiro.remove();
            asteroide.remove();
            verificarOperacao();
            audio2.play();
        }
    });
}



function verificarOperacao() {
    try {
        if (eval(operacaoAtual) === resultadoEsperado) {
            pontuacao++;
            pontuacaoDisplay.textContent = pontuacao;
            operacaoAtual = '';

            document.getElementById('operacao-atual').textContent = '';

            resultadoEsperado = gerarResultadoEsperado();
            objetivoDisplay.textContent = resultadoEsperado;

            if (pontuacao === 20) {
                alert("Você completou a fase!");
                reiniciarJogo();
            }
        }
    } catch (e) { }
}


function gerarResultadoEsperado() {
    return Math.floor(Math.random() * 20) + 1;
}

setInterval(gerarAsteróide, 800);

const pauseMenu = document.getElementById('pause-menu');
const pauseButton = document.getElementById('pause');

function pausar() {
    if (!jogoIniciado) return;
    jogopausado = !jogopausado;

    if (jogopausado) {
        pauseMenu.style.display = 'flex';
        pauseButton.src = '../img/Play.png';
        jogoIniciado = false;
        pararJogo();
    } else {
        pauseMenu.style.display = 'none';
        pauseButton.src = '../img/Pause.png';
        continuarJogo();
    }
}

function pararJogo() {
    clearInterval(intervaloAsteróide);
}

function continuarJogo() {
    setInterval(gerarAsteróide, 800);
}

function retomarJogo() {
    jogoIniciado = true;
    pausar();
}

function reiniciarJogo() {
    pontuacao = 0;
    operacaoAtual = '';
    resultadoEsperado = gerarResultadoEsperado();
    pontuacaoDisplay.textContent = pontuacao;
    objetivoDisplay.textContent = resultadoEsperado;
    const asteróides = document.querySelectorAll('.asteroide');
    asteróides.forEach(asteroide => asteroide.remove());
    const tiros = document.querySelectorAll('.tiro');
    tiros.forEach(tiro => tiro.remove());
    posicao = 50;
    nave.style.left = `${posicao}%`;
    jogoIniciado = true;
    jogopausado = false;
    continuarJogo();
    pauseMenu.style.display = 'none';
    pauseButton.src = '../img/Pause.png';
    document.getElementById('operacao-atual').textContent = '?';
}

function voltarMenu() {
    window.location.reload();
}

const somButton = document.getElementById('som');

function mutar() {
    if (audiotocando) {
        musica.pause();
        audiotocando = !audiotocando;
        somButton.src = '../img/mute.png';
    }
    else {
        musica.play();
        audiotocando = !audiotocando;
        somButton.src = '../img/som.png';
    }
}

pauseButton.addEventListener('click', pausar);

function salvarConfiguracao(chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));
}

function carregarConfiguracao(chave, valorPadrao) {
    const valor = localStorage.getItem(chave);
    return valor ? JSON.parse(valor) : valorPadrao;
}


function ajustarVolumeTiros() {
    const volumeTiros = document.getElementById('volume-tiros').value;
    audio.volume = volumeTiros;
    audioo.volume = volumeTiros;
    audio2.volume = volumeTiros;
    salvarConfiguracao('volumeTiros', volumeTiros);
}

function ajustarVolumeMusica() {
    const volumeMusica = document.getElementById('volume-musica').value;
    musica.volume = volumeMusica;
    salvarConfiguracao('volumeMusica', volumeMusica);
}

function isOperador(caractere) {
    return ['+', '-', '*'].includes(caractere);
}

let operadoresSelecionados = ['+', '-', '*'];

function atualizarOperadores() {

    operadoresSelecionados = [];
    if (document.getElementById('operador-mais').checked) {
        operadoresSelecionados.push('+');
    }
    if (document.getElementById('operador-menos').checked) {
        operadoresSelecionados.push('-');
    }
    if (document.getElementById('operador-multiplicacao').checked) {
        operadoresSelecionados.push('*');
    }
    if (operadoresSelecionados.length === 0) {
        document.getElementById('operador-mais').checked = true;
        operadoresSelecionados.push('+');
    }
}
