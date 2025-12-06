const botoesCompra = document.querySelectorAll('.btn-whatsapp');

botoesCompra.forEach(botao => {
    botao.addEventListener('click', function() {
        // Pega os dados que colocamos no HTML
        const nomeProduto = this.getAttribute('data-nome');
        const precoProduto = this.getAttribute('data-preco');
        
        // Número do WhatsApp da Loja (Adicione o código do país 55 e DDD)
        const numeroLoja = "558896286336"; 
        
        // Cria a mensagem automática
        // O encodeURIComponent garante que espaços e acentos funcionem na URL
        const mensagem = `Olá! Vi no site e tenho interesse na *${nomeProduto}* por *R$ ${precoProduto}*. Podem entregar?`;
        
        // Cria o link final
        const linkZap = `https://wa.me/${numeroLoja}?text=${encodeURIComponent(mensagem)}`;
        
        // Abre o WhatsApp em nova aba
        window.open(linkZap, '_blank');
    });
});


const formulario = document.getElementById('form-orcamento');

if (formulario) {
    formulario.addEventListener('submit', async function(event) {
        event.preventDefault(); // 1. Impede a página de recarregar
        
        const formData = new FormData(event.target);
        const dados = Object.fromEntries(formData.entries()); // 2. Transforma em JSON
    
        const btn = event.target.querySelector('button');
        const textoOriginal = btn.innerText;
        btn.innerText = "Enviando...";
        btn.disabled = true;
    
        try {
            // 3. Envia para o servidor que criamos
            const response = await fetch('/api/orcamento', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
    
            if (response.ok) {
                // 4. Mostra mensagem de sucesso
                document.getElementById('feedback').style.display = 'block';
                event.target.reset();
                setTimeout(() => {
                    document.getElementById('feedback').style.display = 'none';
                }, 5000);
            } else {
                alert('Erro ao enviar. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro de conexão com o servidor.');
        } finally {
            btn.innerText = textoOriginal;
            btn.disabled = false;
        }
    });
}