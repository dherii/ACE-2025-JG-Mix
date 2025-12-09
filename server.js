const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '.')));

const BANCO_DE_DADOS = 'pedidos.json';

//carregar os pedidos
function carregarPedidos() {
    if (!fs.existsSync(BANCO_DE_DADOS)) {
        fs.writeFileSync(BANCO_DE_DADOS, JSON.stringify([], null, 2));
    }

    const data = fs.readFileSync(BANCO_DE_DADOS, 'utf8');
    return JSON.parse(data);
}

//salvar os pedidos
function salvarPedidos(lista) {
    fs.writeFileSync(BANCO_DE_DADOS, JSON.stringify(lista, null, 2));
}

//criar os orçamentos
app.post('/api/orcamento', (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ erro: "Corpo da requisição vazio" });
    }

    const listaPedidos = carregarPedidos();

    const novoPedido = {
        id: Date.now(),
        data: new Date().toLocaleString('pt-BR'),
        ...req.body
    };

    console.log("📩 Recebido do front:", novoPedido);

    listaPedidos.push(novoPedido);
    salvarPedidos(listaPedidos);

    res.status(201).json({ mensagem: "Orçamento salvo com sucesso!", pedido: novoPedido });
});

//ler os or~çamentos
app.get('/api/orcamento', (req, res) => {
    const listaPedidos = carregarPedidos();
    res.json(listaPedidos);
});

//buscar os orçamentos por ID
app.get('/api/orcamento/:id', (req, res) => {
    const listaPedidos = carregarPedidos();
    const pedido = listaPedidos.find(p => p.id == req.params.id);

    if (!pedido) {
        return res.status(404).json({ erro: "Orçamento não encontrado" });
    }

    res.json(pedido);
});

//atualizar o orçamento
app.put('/api/orcamento/:id', (req, res) => {
    const listaPedidos = carregarPedidos();
    const index = listaPedidos.findIndex(p => p.id == req.params.id);

    if (index === -1) {
        return res.status(404).json({ erro: "Orçamento não encontrado" });
    }

    listaPedidos[index] = {
        ...listaPedidos[index],
        ...req.body,
        atualizadoEm: new Date().toLocaleString('pt-BR')
    };

    salvarPedidos(listaPedidos);

    res.json({ mensagem: "Orçamento atualizado!", pedido: listaPedidos[index] });
});


//deletar o orçamento

app.delete('/api/orcamento/:id', (req, res) => {
    const listaPedidos = carregarPedidos();
    const novaLista = listaPedidos.filter(p => p.id != req.params.id);

    if (novaLista.length === listaPedidos.length) {
        return res.status(404).json({ erro: "Orçamento não encontrado" });
    }

    salvarPedidos(novaLista);

    res.json({ mensagem: "Orçamento removido com sucesso!" });
});

// ------------------------------------------------------------
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
