const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "harrypotter",
  password: "11by",
  port: 5432,
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("A rota está funcionando perfeitamente!");
});

app.get("/bruxos", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM bruxos");
    res.status(200).send({
      message: "Bruxos retornados com sucesso!",
      bruxos: rows,
    });
  } catch (error) {
    console.error("Erro ao buscar bruxos:", error);
    res.status(500).send("Erro ao buscar bruxos");
  }
});

app.get("/bruxos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM bruxos WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      res.status(404).send("Bruxo não encontrado");
    } else {
      res.json(result.rows);
    }
  } catch (error) {
    console.error("Erro ao buscar bruxo pelo ID:", error);
    res.status(500).send("Erro ao buscar bruxo pelo ID");
  }
});

app.get("/bruxos/nome/:nome", async (req, res) => {
  const { nome } = req.params;
  try {
    const result = await pool.query("SELECT * FROM bruxos WHERE nome ILIKE $1", [`%${nome}%`]);
    if (result.rowCount === 0) {
      res.status(404).send("Bruxo não encontrado");
    } else {
      res.json(result.rows);
    }
  } catch (error) {
    console.error("Erro ao buscar bruxos pelo nome:", error);
    res.status(500).send("Erro ao buscar bruxos pelo nome");
  }
});

app.post("/bruxos", async (req, res) => {
  const housevalidada = verificaCasa_Hogwarts(req.body.casa_hogwarts);
  const statusvalidado = verificaStatus(req.body.status_sangue);

  const { nome, idade, habilidade_especial, patrono } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO bruxos (nome, idade, casa_hogwarts, habilidade_especial, status_sangue, patrono) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [nome, idade, housevalidada, habilidade_especial, statusvalidado, patrono]
    );
    res.status(201).send({
      message: "Bruxo cadastrado com sucesso!",
      bruxo: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao cadastrar bruxo:", error);
    res.status(500).send("Erro ao cadastrar bruxo");
  }
});


app.put("/bruxos/:id", async (req, res) => {
  const { id } = req.params;
  const housevalidada = verificaCasa_Hogwarts(req.body.casa_hogwarts);
  const statusvalidado = verificaStatus(req.body.status_sangue);

  const { nome, idade, habilidade_especial, patrono } = req.body;
  try {
    const result = await pool.query(
      "UPDATE bruxos SET nome = $1, idade = $2, casa_hogwarts = $3, habilidade_especial = $4, status_sangue = $5, patrono = $6 WHERE id = $7 RETURNING *",
      [nome, idade, housevalidada, habilidade_especial, statusvalidado, patrono, id]
    );
    res.status(200).send({
      message: "Bruxo atualizado com sucesso!",
      bruxo: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao atualizar bruxo:", error);
    res.status(500).send("Erro ao atualizar bruxo");
  }
});

app.delete("/bruxos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM bruxos WHERE id = $1", [id]);
    res.status(200).send("Bruxo deletado com sucesso!");
  } catch (error) {
    console.error("Erro ao deletar bruxo:", error);
    res.status(500).send("Erro ao deletar bruxo");
  }
});

const verificaCasa_Hogwarts = (house) => {
  const validHouses = ["Grifinória", "Sonserina", "Corvinal", "Lufa-Lufa"];
  if (validHouses.includes(house)) {
      return house;
  } else {
      return "Desconhecida"; 
  }
};

const verificaStatus = (Status) => {
  const validStatus = ["Puro", "Mestiço", "Trouxa"];
  if (validStatus.includes(Status)) {
      return Status;
  } else {
      return "Desconhecido"; 
  }
};

app.listen(PORT, () => {
  console.log(`O servidor está rodando na porta ${PORT}`);
});

app.get("/varinhas", async (req, res) => {
    try {
      const { rows } = await pool.query("SELECT * FROM varinhas");
      res.status(200).send({
        message: "Varinhas retornadas com sucesso!",
        varinhas: rows,
      });
    } catch (error) {
      console.error("Erro ao buscar varinhas:", error);
      res.status(500).send("Erro ao buscar varinhas");
    }
  });

app.get("/varinhas/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM varinhas WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      res.status(404).send("Varinha não encontrada");
    } else {
      res.json(result.rows);
    }
  } catch (error) {
    console.error("Erro ao buscar varinha pelo ID:", error);
    res.status(500).send("Erro ao buscar varinha pelo ID");
  }
});

app.post("/varinhas", async (req, res) => {
  const { material, comprimento, nucleo, data_fabricacao } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO varinhas (material, comprimento, nucleo, data_fabricacao) VALUES ($1, $2, $3, $4) RETURNING *",
      [material, comprimento, nucleo, data_fabricacao]
    );
    res.status(201).send({
      message: "Varinha cadastrada com sucesso!",
      varinha: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao cadastrar varinha:", error);
    res.status(500).send("Erro ao cadastrar varinha");
  }
});

app.put("/varinhas/:id", async (req, res) => {
  const { id } = req.params;
  const { material, comprimento, nucleo, data_fabricacao } = req.body;
  try {
    const result = await pool.query(
      "UPDATE varinhas SET material = $1, comprimento = $2, nucleo = $3, data_fabricacao = $4 WHERE id = $5 RETURNING *",
      [material, comprimento, nucleo, data_fabricacao, id]
    );
    res.status(200).send({
      message: "Varinha atualizada com sucesso!",
      varinha: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao atualizar varinha:", error);
    res.status(500).send("Erro ao atualizar varinha");
  }
});

app.delete("/varinhas/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM varinhas WHERE id = $1", [id]);
    res.status(200).send("Varinha deletada com sucesso!");
  } catch (error) {
    console.error("Erro ao deletar varinha:", error);
    res.status(500).send("Erro ao deletar varinha");
  }
});
