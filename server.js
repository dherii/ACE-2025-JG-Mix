const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Configurações padrão
app.use(cors());
app.use(express.json()); // Permite ler JSON vindo do front
app.use(express.static(path.join(__dirname, '.'))); // Serve o seu HTML/CSS/JS

// ARQUIVO QUE SIMULA O BANCO DE DADOS
const BANCO_DE_DADOS = 'pedidos.json';

// Rota POST: Recebe o formulário e salva
app.post('/api/orcamento', (req, res) => {
    const novoPedido = {
        id: Date.now(),
        data: new Date().toLocaleString('pt-BR'),
        ...req.body
    };

    console.log('Recebido:', novoPedido);

    // Lógica de Persistência (Ler arquivo -> Adicionar -> Salvar arquivo)
    fs.readFile(BANCO_DE_DADOS, 'utf8', (err, data) => {
        let listaPedidos = [];
        
        if (!err && data) {
            try {
                listaPedidos = JSON.parse(data);
            } catch (e) { console.log('Criando novo arquivo de banco...'); }
        }

        listaPedidos.push(novoPedido);

        fs.writeFile(BANCO_DE_DADOS, JSON.stringify(listaPedidos, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ erro: 'Erro ao salvar no banco' });
            }
            res.status(201).json({ mensagem: 'Pedido salvo com sucesso!' });
        });
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
    console.log(`📝 Banco de dados: ${path.join(__dirname, BANCO_DE_DADOS)}`);
});