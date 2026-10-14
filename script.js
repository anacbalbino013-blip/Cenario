const cena = document.querySelector(".cena");

const estilo = document.createElement("style");

estilo.textContent = `
.cena {
    position: relative;
    overflow: hidden;
}

.mario {
    position: absolute;
    width: 38px;
    height: 60px;
    left: 50px;
    bottom: 120px;
    z-index: 20;
    image-rendering: pixelated;
}

.mario .chapeu {
    position: absolute;
    top: 0;
    left: 5px;
    width: 29px;
    height: 10px;
    background: #e52521;
    border: 2px solid #8b1715;
    box-sizing: border-box;
}

.mario .rosto {
    position: absolute;
    top: 10px;
    left: 9px;
    width: 23px;
    height: 17px;
    background: #ffbd78;
    border: 2px solid #8b5a36;
    box-sizing: border-box;
}

.mario .olho {
    position: absolute;
    top: 3px;
    right: 3px;
    width: 3px;
    height: 6px;
    background: #222;
}

.mario .bigode {
    position: absolute;
    left: 5px;
    bottom: 1px;
    width: 14px;
    height: 5px;
    background: #59331d;
}

.mario .camisa {
    position: absolute;
    top: 27px;
    left: 4px;
    width: 30px;
    height: 15px;
    background: #e52521;
}

.mario .macacao {
    position: absolute;
    top: 34px;
    left: 8px;
    width: 22px;
    height: 15px;
    background: #1769d2;
    border: 2px solid #10458a;
    box-sizing: border-box;
}

.mario .botao {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 4px;
    height: 4px;
    background: #ffe45c;
    border-radius: 50%;
    box-shadow: 9px 0 #ffe45c;
}

.mario .perna {
    position: absolute;
    top: 47px;
    width: 10px;
    height: 7px;
    background: #1769d2;
}

.mario .perna1 {
    left: 7px;
}

.mario .perna2 {
    left: 22px;
}

.mario .sapato {
    position: absolute;
    bottom: 0;
    width: 17px;
    height: 7px;
    background: #66351e;
    border-bottom: 2px solid #3d2012;
    box-sizing: border-box;
}

.mario .sapato1 {
    left: 1px;
}

.mario .sapato2 {
    right: 0;
}

.controles-mario {
    display: none;
}

@media (max-width: 800px) {
    .controles-mario {
        display: flex;
        justify-content: center;
        gap: 18px;
        padding: 12px;
        position: relative;
        z-index: 30;
    }

    .controles-mario button {
        width: 60px;
        height: 55px;
        font-size: 25px;
        font-weight: bold;
        border: 2px solid #333;
        border-radius: 10px;
        background: #fff;
        touch-action: none;
    }
}
`;

document.head.appendChild(estilo);

const mario = document.createElement("div");
mario.className = "mario";

mario.innerHTML = `
    <div class="chapeu"></div>
    <div class="rosto">
        <div class="olho"></div>
        <div class="bigode"></div>
    </div>
    <div class="camisa"></div>
    <div class="macacao">
        <div class="botao"></div>
    </div>
    <div class="perna perna1"></div>
    <div class="perna perna2"></div>
    <div class="sapato sapato1"></div>
    <div class="sapato sapato2"></div>
`;

cena.appendChild(mario);

const controles = document.createElement("div");
controles.className = "controles-mario";

controles.innerHTML = `
    <button type="button" data-mover="esquerda">◀</button>
    <button type="button" data-mover="pular">▲</button>
    <button type="button" data-mover="direita">▶</button>
`;

cena.insertAdjacentElement("afterend", controles);

let x = 50;
let y = 0;
let velocidadeY = 0;
let esquerda = false;
let direita = false;
let noChao = true;

const velocidade = 4;
const gravidade = 0.65;
const forcaPulo = 13;
const alturaChao = 120;
const alturaMario = 60;

function pular() {
    if (noChao) {
        velocidadeY = forcaPulo;
        noChao = false;
    }
}

document.addEventListener("keydown", function(evento) {
    if (
        ["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(evento.key)
    ) {
        evento.preventDefault();
    }

    if (evento.key === "ArrowLeft" || evento.key.toLowerCase() === "a") {
        esquerda = true;
    }

    if (evento.key === "ArrowRight" || evento.key.toLowerCase() === "d") {
        direita = true;
    }

    if (
        evento.key === "ArrowUp" ||
        evento.key === " " ||
        evento.key.toLowerCase() === "w"
    ) {
        pular();
    }
});

document.addEventListener("keyup", function(evento) {
    if (evento.key === "ArrowLeft" || evento.key.toLowerCase() === "a") {
        esquerda = false;
    }

    if (evento.key === "ArrowRight" || evento.key.toLowerCase() === "d") {
        direita = false;
    }
});

controles.querySelectorAll("button").forEach(function(botao) {
    botao.addEventListener("pointerdown", function(evento) {
        evento.preventDefault();

        const acao = botao.dataset.mover;

        if (acao === "esquerda") esquerda = true;
        if (acao === "direita") direita = true;
        if (acao === "pular") pular();

        if (acao !== "pular" && botao.setPointerCapture) {
            botao.setPointerCapture(evento.pointerId);
        }
    });

    function soltar() {
        if (botao.dataset.mover === "esquerda") esquerda = false;
        if (botao.dataset.mover === "direita") direita = false;
    }

    botao.addEventListener("pointerup", soltar);
    botao.addEventListener("pointercancel", soltar);
    botao.addEventListener("lostpointercapture", soltar);
});

function animar() {
    const limiteDireita = cena.clientWidth - mario.offsetWidth;

    if (esquerda) x -= velocidade;
    if (direita) x += velocidade;

    x = Math.max(0, Math.min(x, limiteDireita));

    velocidadeY -= gravidade;
    y += velocidadeY;

    if (y <= 0) {
        y = 0;
        velocidadeY = 0;
        noChao = true;
    }

    mario.style.left = x + "px";
    mario.style.bottom = (alturaChao + y) + "px";

    requestAnimationFrame(animar);
}

animar();
