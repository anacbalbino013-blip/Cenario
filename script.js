const cena = document.querySelector(".cena");
const mario = document.querySelector(".mario");

if (cena && mario) {
    const estilo = document.createElement("style");

    estilo.textContent = `
        .cena {
            position: relative;
            overflow: hidden;
        }

        .mario {
            position: absolute;
            left: 50px;
            bottom: 120px;
            width: 44px;
            height: 60px;
            z-index: 50;
        }

        .mario-controles {
            display: flex;
            justify-content: center;
            gap: 15px;
            padding: 12px;
        }

        .mario-controles button {
            width: 58px;
            height: 52px;
            border: 2px solid #333;
            border-radius: 10px;
            background: white;
            font-size: 24px;
            touch-action: none;
        }
    `;

    document.head.appendChild(estilo);

    const controles = document.createElement("div");
    controles.className = "mario-controles";
    controles.innerHTML = `
        <button type="button" data-acao="esquerda">◀</button>
        <button type="button" data-acao="pular">⬆</button>
        <button type="button" data-acao="direita">▶</button>
    `;

    cena.insertAdjacentElement("afterend", controles);

    let x = 50;
    let y = 0;
    let velocidadeY = 0;
    let esquerda = false;
    let direita = false;
    let noChao = true;

    const velocidade = 4;
    const gravidade = 0.6;
    const forcaPulo = 12;
    const alturaChao = 120;

    function pular() {
        if (noChao) {
            velocidadeY = forcaPulo;
            noChao = false;
        }
    }

    document.addEventListener("keydown", function(evento) {
        const tecla = evento.key.toLowerCase();

        if (["arrowleft", "arrowright", "arrowup", " "].includes(tecla)) {
            evento.preventDefault();
        }

        if (tecla === "arrowleft" || tecla === "a") {
            esquerda = true;
        }

        if (tecla === "arrowright" || tecla === "d") {
            direita = true;
        }

        if (tecla === "arrowup" || tecla === " " || tecla === "w") {
            pular();
        }
    });

    document.addEventListener("keyup", function(evento) {
        const tecla = evento.key.toLowerCase();

        if (tecla === "arrowleft" || tecla === "a") {
            esquerda = false;
        }

        if (tecla === "arrowright" || tecla === "d") {
            direita = false;
        }
    });

    controles.querySelectorAll("button").forEach(function(botao) {
        const acao = botao.dataset.acao;

        botao.addEventListener("pointerdown", function(evento) {
            evento.preventDefault();

            if (acao === "esquerda") esquerda = true;
            if (acao === "direita") direita = true;
            if (acao === "pular") pular();

            if (acao !== "pular") {
                botao.setPointerCapture(evento.pointerId);
            }
        });

        function soltar() {
            if (acao === "esquerda") esquerda = false;
            if (acao === "direita") direita = false;
        }

        botao.addEventListener("pointerup", soltar);
        botao.addEventListener("pointercancel", soltar);
        botao.addEventListener("lostpointercapture", soltar);
    });

    function animar() {
        if (esquerda) x -= velocidade;
        if (direita) x += velocidade;

        const limite = cena.clientWidth - mario.offsetWidth;
        x = Math.max(0, Math.min(x, limite));

        y += velocidadeY;
        velocidadeY -= gravidade;

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
}
