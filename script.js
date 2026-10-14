
const cena = document.querySelector(".cena");
const mario = document.querySelector(".mario");
const controles = document.querySelector(".mario-controles");

if (cena && mario && controles) {
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

        if (
            tecla === "arrowleft" ||
            tecla === "arrowright" ||
            tecla === "arrowup" ||
            tecla === " "
        ) {
            evento.preventDefault();
        }

        if (tecla === "arrowleft" || tecla === "a") {
            esquerda = true;
        }

        if (tecla === "arrowright" || tecla === "d") {
            direita = true;
        }

        if (
            tecla === "arrowup" ||
            tecla === " " ||
            tecla === "w"
        ) {
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

    window.addEventListener("blur", function() {
        esquerda = false;
        direita = false;
    });

    controles.querySelectorAll("button").forEach(function(botao) {
        const acao = botao.dataset.acao;

        function pressionar(evento) {
            evento.preventDefault();

            if (acao === "esquerda") {
                esquerda = true;
            }

            if (acao === "direita") {
                direita = true;
            }

            if (acao === "pular") {
                pular();
            }
        }

        function soltar(evento) {
            if (evento) {
                evento.preventDefault();
            }

            if (acao === "esquerda") {
                esquerda = false;
            }

            if (acao === "direita") {
                direita = false;
            }
        }

        botao.addEventListener("pointerdown", pressionar);
        botao.addEventListener("pointerup", soltar);
        botao.addEventListener("pointercancel", soltar);
        botao.addEventListener("lostpointercapture", soltar);

        botao.addEventListener("contextmenu", function(evento) {
            evento.preventDefault();
        });
    });

    function animar() {
        if (esquerda) {
            x -= velocidade;
        }

        if (direita) {
            x += velocidade;
        }

        const limite = Math.max(
            0,
            cena.clientWidth - mario.offsetWidth
        );

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
