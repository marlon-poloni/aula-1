const http = require("http");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const bcrypt = require("bcrypt");

const CRYPT_SALT = bcrypt.genSaltSync(); // não alterar
const Users = [
  {
    id: 1,
    username: "marlon",
    password: "$2b$10$iWfdOHa6EZxS/j0CXS0sFOzAkhps4WzO3NoUj33KbfxuWlE4rCEYC",
    idade: 23,
    sexo: "M",
  },
  {
    id: 2,
    username: "tais",
    password: "$2b$10$8JDn9CUiy/Z9OdYwP/H5xu2qQ6CLTqEjq698FK94Zmc6EfGbMjipq",
    idade: 23,
    sexo: "M",
  },
  {
    id: 3,
    username: "roberto",
    password: "$2b$10$D0rCnfSp9uExQIrULkLyGu2fTIbptnl45DrdM./Q3z6AtgXfPjOhO",
    idade: 23,
    sexo: "M",
  },
];

const findById = (id) => {
  return Users.map((value) => value.id).indexOf(+id);
};

// LISTAR TODOS USUÁRIOS
app.get("/user", (req, res) => {
  return res.status(200).send(Users);
});

// ACHAR UM USUÁRIO
app.get("/user/:id", (req, res) => {
  const user = Users.filter((value) => value.id === +req.params.id).shift();

  if (user) {
    return res.status(200).send(user);
  }

  return res
    .status(404)
    .send("O usuário com o id informado não foi encontrado 123");
});

// CRIAR UM NOVO USUÁRIO
app.post("/user/", jsonParser, (req, res) => {
  const { username, password, idade, sexo } = req.body;

  if (!username || !password || !idade || !sexo) {
    return res.status(400).send("Os dados não foram preenchidos corretamente");
  }

  const createUser = {
    id: Users.length + 1,
    username: username,
    password: bcrypt.hashSync(password, CRYPT_SALT),
    idade: idade,
    sexo: sexo,
  };
  Users.push(createUser);

  return res.status(201).send(createUser);
});

// ATUALIZAR UM USUÁRIO
app.post("/user/:id", jsonParser, (req, res) => {
  const ArrayId = findById(+req.params.id);

  if (ArrayId < 0) {
    return res
      .status(404)
      .send("O usuário com o id informado não foi encontrado 1");
  }
  let user = Users[ArrayId];

  const { id, password, ...safeData } = req.body;
  if (password) {
    safeData.password = bcrypt.hashSync(password, CRYPT_SALT);
  }
  user = Users[ArrayId] = { ...user, ...safeData };

  return res.status(200).send(user);
});

// APAGAR UM USUÁRIO
app.delete("/user/:id", (req, res) => {
  const ArrayId = findById(+req.params.id);

  if (ArrayId < 0) {
    return res
      .status(404)
      .send("O usuário com o id informado não foi encontrado 2");
  }
  Users.splice(ArrayId, 1);

  return res.status(200).send(Users);
});

// LOGIN PARA TESTAR
app.post("/login", jsonParser, (req, res) => {
  const { username, password } = req.body;
  const user = Users.filter((value) => value.username === username).shift();

  if (user) {
    const cryptPassword = bcrypt.hashSync(password, CRYPT_SALT);

    if (bcrypt.compareSync(cryptPassword, user.password)) {
      const UserId = findById(user.id);
      user.logged_in = true;
      Users[UserId] = user;
      return res.status(200).send(user);
    }
  }

  return res
    .status(400)
    .send("O usuário/senha não coincidem para nenhum usuário.");
});

http.createServer(app).listen(3000, () => {
  console.log("server running at http://localhost:3000");
});

// 2XX // sucesso
// 4XX // erro do usuário
// 5XX // erro do servidor

/** Create (criar)
 *  Read (ler)
 *  Update (atualizar)
 *  Delete (apagar)
 */
