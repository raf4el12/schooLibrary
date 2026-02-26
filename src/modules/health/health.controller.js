const { checkHealth } = require("./health.usecase");

function getHealth(req, res) {
  const result = checkHealth();
  res.json(result);
}

module.exports = { getHealth };
