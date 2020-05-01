const express = require("express");
const cors = require("cors");

const { uuid } = require('uuidv4')

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryid(request, response, next) {
  const repoIndex = repositories.findIndex(repo => repo.id === request.params.id)

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' })
  }

  return next()
}

app.use('/repositories/:id', validateRepositoryid)

app.get("/repositories", (_request, response) => {
  return response.status(200).json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = { title,  url,  techs, likes: 0, id: uuid() }

  repositories.push(repository)

  return response.status(200).json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const repoIndex = repositories.findIndex(repo => repo.id === request.params.id)
  const { title, url, techs } = request.body

  const repository = { ...repositories[repoIndex], title, url, techs }

  repositories[repoIndex] = repository

  return response.status(200).json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const repoIndex = repositories.findIndex(repo => repo.id === request.params.id)

  repositories.splice(repoIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const repoIndex = repositories.findIndex(repo => repo.id === request.params.id)

  const { likes, ...rest } = repositories[repoIndex]
  const repository = { ...rest, likes: likes + 1 }

  repositories[repoIndex] = repository

  return response.status(200).json(repository)
});

module.exports = app;
