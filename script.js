
const cena = document.querySelector(".cena");
const mario = document.querySelector(".mario");
const moedas = document.querySelectorAll(".moeda");
const controles = document.querySelectorAll(".mario-controles button");

let x = 50;
let y = 0;
let velocidadeY = 0;
let noChao = true;
let gameOver = false;
let pontos = 0;
let teclas = {};
let moedasPegas = new Set();
let quadro;

const gravidade = 0.7;
const forcaPulo = 13;
const velocidade = 5;

const placar = document.createElement("div");
placar.style.cssText = "position:absolute;top:20px;right:20px;z-index:100;color:white;font:bold 22px Arial;text-shadow:2px 2px #333;";
placar.textContent = "Moedas: 0";
cena.appendChild(placar);

const telaGameOver = document.createElement("div");
telaGameOver.style.cssText = "display:none;position:absolute;inset:0;z-index:150;background:rgba(0,0,0,.8);color:white;align-items:center;justify-content:center;flex-direction:column;gap:20px;font:bold 32px Arial;text-align:center;";
telaGameOver.innerHTML = `
    <div style="color:#ff2929;font-size:50px">GAME OVER</div>
    <div id="pontuacaoFinal" style="font-size:20px">Moedas: 0</div>
    <button id="reiniciar" style="padding:12px 20px;font-size:18px;border:0;border-radius:8px;background:#ffcc00;font-weight:bold;cursor:pointer">Jogar novamente</button>
`;
cena.appendChild(telaGameOver);

function atualizarMario() {
    mario.style.left = x + "px";
    mario.style.bottom = (120 + y) + "px";
}

function colidiu(a, b) {
    return a.left < b.right &&
           a.right > b.left &&
           a.top < b.bottom &&
           a.bottom > b.top;
}

function verificarMoedas() {
    const areaMario = mario.getBoundingClientRect();

    moedas.forEach((moeda, indice) => {
        if (moedasPegas.has(indice)) return;

        if (colidiu(areaMario, moeda.getBoundingClientRect())) {
            moedasPegas.add(indice);
            moeda.style.visibility = "hidden";
            pontos++;
            placar.textContent = "Moedas: " + pontos;
        }
    });
}

function encerrarJogo() {
    if (gameOver) return;

    gameOver = true;
    teclas = {};
    cancelAnimationFrame(quadro);

    document.querySelector("#pontuacaoFinal").textContent =
        "Moedas coletadas: " + pontos;

    telaGameOver.style.display = "flex";
}

function verificarObstaculos() {
    const areaMario = mario.getBoundingClientRect();
    const obstaculos = document.querySelectorAll(".cano, .bloco");

    for (const obstaculo of obstaculos) {
        if (colidiu(areaMario, obstaculo.getBoundingClientRect())) {
            encerrarJogo();
            return;
        }
    }
}

function pular() {
    if (noChao && !gameOver) {
        velocidadeY = forcaPulo;
        noChao = false;
    }
}

function atualizar() {
    if (gameOver) return;

    if (teclas.direita) x += velocidade;
    if (teclas.esquerda) x -= velocidade;

    const limite = cena.clientWidth - mario.offsetWidth;
    x = Math.max(0, Math.min(x, limite));

    if (!noChao) {
        velocidadeY -= gravidade;
        y += velocidadeY;

        if (y <= 0) {
            y = 0;
            velocidadeY = 0;
            noChao = true;
        }
    }

    atualizarMario();
    verificarMoedas();
    verificarObstaculos();

    if (!gameOver) {
        quadro = requestAnimationFrame(atualizar);
    }
}

controles.forEach(botao => {
    const acao = botao.dataset.acao;

    botao.addEventListener("pointerdown", evento => {
        evento.preventDefault();

        if (gameOver) return;

        if (acao === "pular") {
            pular();
        } else {
            teclas[acao] = true;
        }

        if (botao.setPointerCapture) {
            botao.setPointerCapture(evento.pointerId);
        }
    });

    function soltar() {
        teclas[acao] = false;
    }

    botao.addEventListener("pointerup", soltar);
    botao.addEventListener("pointercancel", soltar);
    botao.addEventListener("lostpointercapture", soltar);
});

document.addEventListener("keydown", evento => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(evento.key)) {
        evento.preventDefault();
    }

    if (gameOver) return;

    if (evento.key === "ArrowRight" || evento.key === "d") {
        teclas.direita = true;
    }

    if (evento.key === "ArrowLeft" || evento.key === "a") {
        teclas.esquerda = true;
    }

    if (evento.key === "ArrowUp" || evento.key === " ") {
        if (!evento.repeat) pular();
    }
});

document.addEventListener("keyup", evento => {
    if (evento.key === "ArrowRight" || evento.key === "d") {
        teclas.direita = false;
    }

    if (evento.key === "ArrowLeft" || evento.key === "a") {
        teclas.esquerda = false;
    }
});

document.querySelector("#reiniciar").addEventListener("click", () => {
    x = 50;
    y = 0;
    velocidadeY = 0;
    noChao = true;
    gameOver = false;
    pontos = 0;
    teclas = {};
    moedasPegas.clear();

    moedas.forEach(moeda => {
        moeda.style.visibility = "visible";
    });

    placar.textContent = "Moedas: 0";
    telaGameOver.style.display = "none";

    atualizarMario();
    quadro = requestAnimationFrame(atualizar);
});

atualizarMario();
quadro = requestAnimationFrame(atualizar);
