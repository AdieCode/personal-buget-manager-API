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
      res.status(404).send('Invalid data');
    }
})

app.get('/envelopes', (req, res, next) => {
  res.send(userBudgetManager.envelopes)
})

app.get('/envelopes/:category', (req, res, next) => {
  const category = req.params.category;
  res.send(userBudgetManager.envelope(category))
})

app.put('/envelopes/add', (req, res, next) => {
  const envelope = req.body;
  console.log(envelope)
  const added = userBudgetManager.addEnvelope(envelope);

  if (added){
    res.status(200).send('Envelope added.')
  } else {
    res.status(404).send('Envelope was not added.')
  }
})

app.put('/envelopes/editAmount/:category', (req, res, next) => {
  const category = req.params.category;
  const amount = req.body.amount;
  const changed = userBudgetManager.editAmountByCategory(category,amount);

  if (changed){
    res.status(200).send('Envelope edited.')
  } else {
    res.status(404).send('Envelope not edited.')
  }
})

app.put('/envelopes/editCategory/:envelopeId', (req, res, next) => {
  const envelopeId = req.params.envelopeId;
  const category = req.body.category;
  const changed = userBudgetManager.editCategoryById(envelopeId,category);
  console.log(envelopeId + ' | ' + category + ' | ' + changed)
  if (changed){
    res.status(200).send('Envelope category changed.')
  } else {
    res.status(404).send('Envelope category was not changed.')
  }
})

app.put('/envelopes/deplete/:category', (req, res, next) => {
  const category = req.params.category;
  const Amount = req.body.amount;
  const depletionSuccess = userBudgetManager.depleteBudget(category, Amount)

  if (depletionSuccess){
    res.status(200).send('Envelope buget update succeeded.')
  } else {
    res.status(404).send('Envelope buget update vailed.')
  }
})

app.put('/envelopes/transfer/:from/:to', (req, res, next) => {
  const from = req.params.from;
  const to = req.params.to;
  const amount = req.body.amount;
  const transferSuccessful = userBudgetManager.transfer(from, to, amount)

  if (transferSuccessful){
    res.status(200).send('Transfer successful.');
  } else {
    res.status(404).send('Transfer unsuccessful.')
  }
})

app.delete('/envelopes/:category', (req, res, next) => {
  const category = req.params.category;
  const deleteSuccessful = userBudgetManager.deleteEnvelope(category) || false;
  
  if (deleteSuccessful){
    res.status(200).send('Delete successful.');
  } else {
    res.status(404).send('Delete unsuccessful.');
  }
})

const port = process.env.PORT || 3000; // Use environment port or 3000 if not available

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


/* stuff needed
  add more envelopes
  ==================
  - adding function --- done
  - verrify data total amount of the envelopes don't exceed the totalBudget --- busy


  update an envelopes amount
  ==========================
*/