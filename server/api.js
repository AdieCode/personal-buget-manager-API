const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { budgetManager } = require('./modules/budget-manager.js')
const app = express()

let userBudgetManager;

app.use(cors('tiny'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/envelopes', (req, res, next) => {
    const totalBudget = req.body.totalBudget;
    const envelopes = req.body.envelopes;

    if (totalBudget && envelopes){
      userBudgetManager = new budgetManager(totalBudget, envelopes)
      res.status(200).send('Data recieved and stored')
    } else {
      res.status(400).send('Invalid data');
    }
    
})

app.get('/envelopes', (req, res, next) => {
  res.send(userBudgetManager.envelopes)
})

app.get('/envelopes/:envelopeId', (req, res, next) => {
  const envelopeId = req.params.envelopeId;
  res.send(userBudgetManager.envelope(envelopeId))
})

app.put('/envelopes/:envelopeId', (req, res, next) => {
  const envelopeId = req.params.envelopeId;
  const Amount = req.body.amount;
  console.log(typeof Amount)
  const depletionSucces = userBudgetManager.depleteBudget(envelopeId, Amount)

  if (depletionSucces){
    res.status(200).send('Envelope buget update succeeded.')
  } else {
    res.status(400).send('Envelope buget update vailed.')
  }
})

const port = process.env.PORT || 3000; // Use environment port or 3000 if not available

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});