const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function idIsVallid(request, response, next) {
  const { id } = request.params;

  const idVallid = repositories.find((repository) => repository.id === id);

  if (!idVallid) {
    return response.status(400).send();
  }

  return next();
}

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(newRepository);

  return response.json(newRepository);
});

app.put("/repositories/:id", idIsVallid, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoriesIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoriesIndex < 0) {
    return response.status(400).json({ erro: "Repository Not Found" });
  }

  const repository = {
    id: repositories[repositoriesIndex].id,
    title,
    url,
    techs,
    likes: repositories[repositoriesIndex].likes,
  };
  repositories[repositoriesIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", idIsVallid, (request, response) => {
  const { id } = request.params;

  const repositoriesIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoriesIndex < 0) {
    return response.status(400).json({ erro: "Repository Not Found" });
  }

  repositories.splice(repositoriesIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", idIsVallid, (request, response) => {
  const { id } = request.params;

  const repositoriesIndex = repositories.find(
    (repository) => repository.id === id
  );

  repositoriesIndex.likes += 1;

  return response.json(repositoriesIndex);
});

module.exports = app;
