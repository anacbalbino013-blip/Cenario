const cena = document.querySelector(".cena");

if (cena && !document.querySelector(".mario")) {
    const estilo = document.createElement("style");

    estilo.textContent = `
        .cena {
            position: relative;
            overflow: hidden;
        }

        .mario {
            position: absolute;
            width: 44px;
            height: 58px;
            left: 40px;
            bottom: 100px;
            z-index: 100;
            image-rendering: pixelated;
            transition: none;
        }

        .mario-pixel {
            position: absolute;
            width: 6px;
            height: 6px;
        }

        .mario-controles {
            display: flex;
            justify-content: center;
            gap: 16px;
            padding: 12px;
            position: relative;
            z-index: 101;
        }

        .mario-controles button {
            width: 58px;
            height: 52px;
            border: 2px solid #333;
            border-radius: 10px;
            background: #fff;
            font-size: 24px;
            font-weight: bold;
            touch-action: none;
        }

        .mario-controles button:active {
            background: #ffe082;
        }
    `;

    document.head.appendChild(estilo);

    const mario = document.createElement("div");
    mario.className = "mario";
    cena.appendChild(mario);

    const pixels = [
        [2,0,0],[3,0,0],[4,0,0],[5,0,0],
        [1,1,0],[2,1,0],[3,1,0],[4,1,0],[5,1,0],[6,1,0],
        [1,2,0],[2,2,0],[3,2,0],[4,2,0],[5,2,0],[6,2,0],
        [2,3,1],[3,3,1],[4,3,1],[5,3,1],
        [2,4,1],[3,4,1],[4,4,1],[5,4,1],
        [1,5,1],[2,5,1],[3,5,1],[4,5,1],[5,5,1],[6,5,1],
        [2,6,2],[3,6,2],[4,6,2],[5,6,2],
        [1,7,2],[2,7,2],[3,7,2],[4,7,2],[5,7,2],[6,7,2],
        [0,8,2],[1,8,2],[2,8,2],[3,8,2],[4,8,2],[5,8,2],[6,8,2],
        [1,9,3],[2,9,3],[3,9,3],[4,9,3],[5,9,3],
        [1,10,3],[2,10,3],[3,10,3],[4,10,3],[5,10,3],
        [0,11,3],[1,11,3],[2,11,3],[3,11,3],[4,11,3],[5,11,3],[6,11,3],
        [0,12,4],[1,12,4],[2,12,4],[5,12,4],[6,12,4],
        [0,13,4],[1,13,4],[5,13,4],[6,13,4],
        [0,14,4],[1,14,4],[5,14,4],[6,14,4],
        [0,15,5],[1,15,5],[2,15,5],[4,15,5],[5,15,5],[6,15,5],
        [0,16,5],[1,16,5],[4,16,5],[5,16,5],[6,16,5]
    ];

    const cores = [
        "#e52521",
        "#ffbd78",
        "#1769d2",
        "#ffbd78",
        "#1769d2",
        "#66351e"
    ];

    pixels.forEach(function(pixel) {
        const quadrado = document.createElement("div");
        quadrado.className = "mario-pixel";
        quadrado.style.left = (pixel[0] * 6) + "px";
        quadrado.style.top = (pixel[1] * 3.4) + "px";
        quadrado.style.background = cores[pixel[2]];
        mario.appendChild(quadrado);
    });

    const controles = document.createElement("div");
    controles.className = "mario-controles";
    controles.innerHTML = `
        <button type="button" data-acao="esquerda">◀</button>
        <button type="button" data-acao="pular">⬆</button>
        <button type="button" data-acao="direita">▶</button>
    `;

    cena.insertAdjacentElement("afterend", controles);

    let x = 40;
    let y = 0;
    let velocidadeY = 0;
    let esquerda = false;
    let direita = false;
    let noChao = true;

    const velocidade = 4;
    const gravidade = 0.6;
    const forcaPulo = 12;
    const alturaChao = 100;

    function pular() {
        if (noChao) {
            velocidadeY = forcaPulo;
            noChao = false;
        }
    }

    document.addEventListener("keydown", function(evento) {
        if (["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(evento.key)) {
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

        x = Math.max(0, Math.min(x, cena.clientWidth - 44));

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
