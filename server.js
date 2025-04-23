import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const contasPath = path.join(process.cwd(), "contas.json");

async function lerContas() {
  const data = await fs.readFile(contasPath, "utf-8");
  return JSON.parse(data);
}

async function salvarContas(contas) {
  await fs.writeFile(contasPath, JSON.stringify(contas, null, 2));
}

app.get("/api/contas", async (req, res) => {
  try {
    const contas = await lerContas();
    res.json(contas);
  } catch (err) {
    res.status(500).json({ error: "Erro ao carregar contas." });
  }
});

app.post("/api/comprar", async (req, res) => {
  const { id } = req.body;
  try {
    const contas = await lerContas();
    const index = contas.findIndex((c) => c.id === id);

    if (index === -1) return res.status(404).json({ error: "Conta não encontrada" });

    const contaVendida = contas.splice(index, 1)[0];
    await salvarContas(contas);

    console.log(`Conta vendida: ${contaVendida.login}`);
    res.status(200).json({ sucesso: true, conta: contaVendida });
  } catch (err) {
    res.status(500).json({ error: "Erro ao processar a compra." });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
