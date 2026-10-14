
const cena = document.querySelector(".cena");
const mario = document.querySelector(".mario");
const moedas = document.querySelectorAll(".moeda");
const controles = document.querySelectorAll(".mario-controles button");

let x = 150;
let y = 0;
let velocidadeY = 0;
let noChao = true;
let gameOver = false;
let pontos = 0;
let teclas = {};
let moedasPegas = new Set();
let quadro = null;
let ultimoTempo = 0;

const gravidade = 1800;
const forcaPulo = 700;
const velocidade = 260;

const placar = document.createElement("div");
placar.style.cssText = "position:absolute;top:20px;right:20px;z-index:100;color:white;font:bold 20px Arial;text-shadow:2px 2px #333;";
placar.textContent = "Moedas: 0";
cena.appendChild(placar);

const telaFinal = document.createElement("div");
telaFinal.style.cssText = "display:none;position:absolute;inset:0;z-index:300;background:rgba(0,0,0,.8);align-items:center;justify-content:center;flex-direction:column;gap:20px;color:white;font-family:Arial;text-align:center;";

const tituloFinal = document.createElement("h1");
tituloFinal.textContent = "GAME OVER";
tituloFinal.style.cssText = "font-size:clamp(38px,10vw,60px);color:#ff2929;margin:0;";

const resultado = document.createElement("p");
resultado.style.cssText = "font-size:22px;font-weight:bold;";

const botaoReiniciar = document.createElement("button");
botaoReiniciar.textContent = "Jogar novamente";
botaoReiniciar.style.cssText = "padding:15px 22px;border:0;border-radius:12px;background:#ffcc00;color:#087bea;font-size:20px;font-weight:bold;cursor:pointer;";

telaFinal.append(tituloFinal, resultado, botaoReiniciar);
cena.appendChild(telaFinal);

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

function pegarMoedas() {
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

function verificarColisoes() {
    const areaMario = mario.getBoundingClientRect();
    const obstaculos = cena.querySelectorAll(".cano, .bloco");

    for (const obstaculo of obstaculos) {
        if (colidiu(areaMario, obstaculo.getBoundingClientRect())) {
            finalizarJogo();
            return;
        }
    }
}

function finalizarJogo() {
    if (gameOver) return;

    gameOver = true;
    teclas = {};
    resultado.textContent = "Moedas coletadas: " + pontos;
    telaFinal.style.display = "flex";
}

function pular() {
    if (noChao && !gameOver) {
        velocidadeY = forcaPulo;
        noChao = false;
    }
}

function iniciarJogo() {
    cancelAnimationFrame(quadro);

    gameOver = false;
    pontos = 0;
    y = 0;
    velocidadeY = 0;
    noChao = true;
    teclas = {};
    moedasPegas.clear();
    ultimoTempo = 0;

    const canoInicial = cena.querySelector(".cano1");

    if (canoInicial) {
        x = canoInicial.offsetLeft +
            canoInicial.offsetWidth + 15;
    } else {
        x = 150;
    }

    x = Math.min(x, cena.clientWidth - mario.offsetWidth);

    moedas.forEach(moeda => {
        moeda.style.visibility = "visible";
    });

    placar.textContent = "Moedas: 0";
    telaFinal.style.display = "none";

    atualizarMario();
    quadro = requestAnimationFrame(atualizar);
}

function atualizar(tempo) {
    if (gameOver) return;

    const delta = ultimoTempo
        ? Math.min((tempo - ultimoTempo) / 1000, 0.03)
        : 0;

    ultimoTempo = tempo;

    if (teclas.direita) x += velocidade * delta;
    if (teclas.esquerda) x -= velocidade * delta;

    const limite = cena.clientWidth - mario.offsetWidth;
    x = Math.max(0, Math.min(x, limite));

    if (!noChao) {
        velocidadeY -= gravidade * delta;
        y += velocidadeY * delta;

        if (y <= 0) {
            y = 0;
            velocidadeY = 0;
            noChao = true;
        }
    }

    atualizarMario();
    pegarMoedas();
    verificarColisoes();

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

    const soltar = () => {
        teclas[acao] = false;
    };

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

botaoReiniciar.addEventListener("click", iniciarJogo);

iniciarJogo();
