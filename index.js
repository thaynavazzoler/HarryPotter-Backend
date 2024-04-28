const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "harrypotter",
  password: "11by",
  port: 5432,
});

app.get("/", (req, res) => {
  res.send("A rota está funcionando perfeitamente!");
});

app.get("/bruxos", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM bruxos");
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar bruxos:", error);
    res.status(500).send("Erro ao buscar bruxos");
  }
});

// Rota para buscar um bruxo pelo ID
app.get("/bruxos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM bruxos WHERE id = $1", [id]);
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar bruxo pelo ID:", error);
    res.status(500).send("Erro ao buscar bruxo pelo ID");
  }
});
// se não for uma casa de Hogwarts ou um status de sangue válido como mestico, puro ou trouxa, retorna um erro
app.post("/bruxos", async (req, res) => {
  try {
    const { nome, idade, casa_hogwarts, habilidade_especial, status_sangue, patrono } = req.body;
    if (!["Grifinória", "Sonserina", "Corvinal", "Lufa-Lufa"].includes(casa_hogwarts)) {
      return res.status(400).send("Casa de Hogwarts inválida");
    }
    if (!["puro", "mestiço", "trouxa"].includes(status_sangue)) {
      return res.status(400).send("Status de sangue inválido");
    }

    const { rows } = await pool.query(
      "INSERT INTO bruxos (nome, idade, casa_hogwarts, habilidade_especial, status_sangue, patrono) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [nome, idade, casa_hogwarts, habilidade_especial, status_sangue, patrono]
    );
    res.json(rows);
  } catch (error) {
    console.error("Erro ao cadastrar bruxo:", error);
    res.status(500).send("Erro ao cadastrar bruxo");
  }
});
// Rota para atualizar um bruxo existente pelo ID
app.put("/bruxos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, idade, casa_hogwarts, habilidade_especial, status_sangue, patrono } = req.body;
    const { rows } = await pool.query(
      "UPDATE bruxos SET nome = $1, idade = $2, casa_hogwarts = $3, habilidade_especial = $4, status_sangue = $5, patrono = $6 WHERE id = $7 RETURNING *",
      [nome, idade, casa_hogwarts, habilidade_especial, status_sangue, patrono, id]
    );
    res.json(rows);
  } catch (error) {
    console.error("Erro ao atualizar bruxo:", error);
    res.status(500).send("Erro ao atualizar bruxo");
  }
});
// Rota para deletar um bruxo pelo ID
app.delete("/bruxos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM bruxos WHERE id = $1", [id]);
    res.send("Bruxo deletado com sucesso!");
  } catch (error) {
    console.error("Erro ao deletar bruxo:", error);
    res.status(500).send("Erro ao deletar bruxo");
  }
});
// Rota para buscar bruxos pelo nome
app.get("/bruxos/nome/:nome", async (req, res) => {
  try {
    const { nome } = req.params;
    const { rows } = await pool.query("SELECT * FROM bruxos WHERE nome ILIKE $1", [`%${nome}%`]);
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar bruxos pelo nome:", error);
    res.status(500).send("Erro ao buscar bruxos pelo nome");
  }
});
app.listen(PORT, () => {
  console.log(`O servidor está rodando na porta ${PORT}`);
});
// Rota para cadastrar uma nova varinha
// Rota para listar todas as varinhas
app.get("/varinhas", async (req, res) => {
    try {
      const { rows } = await pool.query("SELECT * FROM varinhas");
      res.json(rows);
    } catch (error) {
      console.error("Erro ao buscar varinhas:", error);
      res.status(500).send("Erro ao buscar varinhas");
    }
  });
  // Rota para buscar uma varinha pelo ID
  app.get("/varinhas/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { rows } = await pool.query("SELECT * FROM varinhas WHERE id = $1", [id]);
      res.json(rows);
    } catch (error) {
      console.error("Erro ao buscar varinha pelo ID:", error);
      res.status(500).send("Erro ao buscar varinha pelo ID");
    }
  });
  // Rota para cadastrar uma nova varinha
      // Função que verifica se a string corresponde a um status de sangue
  app.post("/varinhas", async (req, res) => {
    try {
      const { material, comprimento, nucleo, data_fabricacao } = req.body;
      const query = {
        text: "INSERT INTO varinhas (material, comprimento, nucleo, data_fabricacao) VALUES ($1, $2, $3, $4) RETURNING *",
        values: [material, comprimento, nucleo, data_fabricacao]
      };
      const { rows } = await pool.query(query);
      res.json(rows);
    } catch (error) {
      console.error("Erro ao cadastrar varinha:", error);
      res.status(500).send("Erro ao cadastrar varinha");
    }
  });
  // Rota para atualizar uma varinha existente pelo ID
  app.put("/varinhas/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { material, comprimento, nucleo, data_fabricacao } = req.body;
      const query = {
        text: "UPDATE varinhas SET material = $1, comprimento = $2, nucleo = $3, data_fabricacao = $4 WHERE id = $5 RETURNING *",
        values: [material, comprimento, nucleo, data_fabricacao, id]
      };
      const { rows } = await pool.query(query);
      res.json(rows);
    } catch (error) {
      console.error("Erro ao atualizar varinha:", error);
      res.status(500).send("Erro ao atualizar varinha");
    }
  });
  // Rota para deletar uma varinha pelo ID
  app.delete("/varinhas/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query("DELETE FROM varinhas WHERE id = $1", [id]);
      res.send("Varinha deletada com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar varinha:", error);
      res.status(500).send("Erro ao deletar varinha");
    }
  });
  //Seu código parece estar definindo duas funções, verificaHouse e verificaBloodStatus, que verificam se uma determinada string corresponde a valores específicos relacionados às casas de Hogwarts e aos status de sangue no mundo de Harry Potter.
    // Rota de teste que se não for uma casa de Hogwarts ou um status de sangue válido, retorna um erro
    app.get("/teste/:valor", (req, res) => {
      const { valor } = req.params;
      if (verificaHouse(valor) || verificaBloodStatus(valor)) {
        res.send("Valor válido");
      } else {
        res.status(400).send("Valor inválido");
      }
    });
    // Função que verifica se a string corresponde a um status de sangue
    function verificaBloodStatus(valor) {
      try {
        const statusSangue = ["puro", "mestiço", "trouxa"];
        return statusSangue.includes(valor);
      }
      catch (error) {
        console.error("Erro ao verificar status de sangue:", error);
        return false;
      }
    }
   // crie  Função que verifica se a string corresponde a um status de sangue
    app.post("/teste", (req, res) => {
      try {
        const { puro, mestiço, trouxa} = req.body;
        if (verificaBloodStatus(puro, mestiço, trouxa)) {
          res.send("Valor válido");
        } else {
          res.status(400).send("Valor inválido");
        }
      } catch (error) {
        console.error("Erro ao verificar status de sangue:", error);
        res.status(500).send("Erro ao verificar status de sangue");
      }
    }
    );
    //implementação de uma rota específica para bruxos, onde seja possível realizar uma pesquisa pelo nome do bruxo.
    // Rota para buscar bruxos pelo nome
    app.get("/bruxos/nome/:nome", async (req, res) => {
      try {
        const { nome } = req.params;
        const { rows } = await pool.query("SELECT * FROM bruxos WHERE nome ILIKE $1", [`%${nome}%`]);
        res.json(rows);
      } catch (error) {
        console.error("Erro ao buscar bruxos pelo nome:", error);
        res.status(500).send("Erro ao buscar bruxos pelo nome");
      }
    });
    
  