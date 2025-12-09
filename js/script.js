
document.addEventListener("DOMContentLoaded", () => {
    const numeroLoja = "558896286336";


    const botoes = document.querySelectorAll(".btn-whatsapp");
    botoes.forEach(botao => {
        botao.addEventListener("click", () => {
            const nome = botao.dataset.nome ?? "Produto";
            const preco = botao.dataset.preco ?? "sob consulta";

            const mensagem = `Olá! Tenho interesse na *${nome}* que está por *R$ ${preco}*. Pode me enviar mais informações?`;
            const url = `https://wa.me/${numeroLoja}?text=${encodeURIComponent(mensagem)}`;
            window.open(url, "_blank");
        });
    });

    const form = document.getElementById("form-orcamento");
    const feedback = document.getElementById("feedback");

    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nome = form.elements["nome"]?.value.trim();
        const telefone = form.elements["telefone"]?.value.trim();
        const veiculo = form.elements["veiculo"]?.value;

        if (!nome || !telefone || !veiculo) {
            alert("Preencha todos os campos!");
            return;
        }

        const dados = { nome, telefone, veiculo };


        const btn = form.querySelector("button[type='submit']");
        const original = btn.innerText;
        btn.disabled = true;
        btn.innerText = "Enviando...";

        try {
            const resposta = await fetch("http://localhost:3000/api/orcamento", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados)
            });

            if (!resposta.ok) {
                alert("Erro ao salvar no servidor.");
                btn.disabled = false;
                btn.innerText = original;
                return;
            }

            const mensagem = `Olá! Gostaria de solicitar um orçamento:\n• Veículo: *${veiculo}*\n• Nome: *${nome}*\n• Telefone: *${telefone}*`;

            const url = `https://wa.me/${numeroLoja}?text=${encodeURIComponent(mensagem)}`;

            window.open(url, "_blank");

            if (feedback) {
                feedback.style.display = "block";
                setTimeout(() => feedback.style.display = "none", 4000);
            }

            form.reset();
        } catch (erro) {
            console.error("Erro no envio:", erro);
            alert("Não foi possível enviar o orçamento.");
        }


        btn.disabled = false;
        btn.innerText = original;
    });
});
