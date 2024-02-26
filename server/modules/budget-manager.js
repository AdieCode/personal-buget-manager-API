class budgetManager{
    constructor(totalBudget, envelopes){
        this._totalBudget = totalBudget // should be a float type.
        this._envelopes = this.generateEnvelopeIds(envelopes)     // should be an array type.
    }

    get envelopes(){
        return this._envelopes;
    }

    envelope(id){
        return this._envelopes.find(envelope => envelope.id === id) || {};
    }

    generateEnvelopeIds(envelopes){
        envelopes.forEach(envelope => {
            envelope.id = randId();
        });
    
        return envelopes;
    }

    transfer(){
        return null
    }

    //function will return a boolean to verify if the buget depletion was succesful
    depleteBudget(id, Amount){
        let AmountLeft;
        for (const envelope of this._envelopes) {
            AmountLeft = this.currentAmount(envelope.id) - Amount;
            if (id === envelope.id && AmountLeft >= 0) {
                envelope.Amount -= Amount;
                this._totalBudget -= Amount;
                return true; 
            }
        }

        return false;
    }

    currentAmount(id){
        const envelope = this._envelopes.find(envelope => envelope.id === id);
        
        if (envelope) {
            return envelope.Amount;
        } else {
            console.error(`Envelope with ID '${id}' not found.`);
            return null; 
        }
    }
}  


function randId(){
    const radomNumber = Math.floor(Math.random() * 100) + 100;

    return radomNumber.toString();
}

module.exports = {budgetManager};
/*
data recieved in api is going to look like this
{
    "totalBudget" : 40000,
    "envelopes" : [
        {
            "category" : "health",
            "Amount" : 300,
        },
        {
            "category" : "food",
            "Amount" : 200,
        }
    ]
}
*/