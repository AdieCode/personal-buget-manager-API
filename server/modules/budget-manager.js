class budgetManager{
    constructor(totalBudget, envelopes){
        this._totalBudget = totalBudget // should be a float type.
        this._envelopes = this.generateEnvelopeIds(envelopes) || []    // should be an array type.
    }

    get envelopes(){
        return this._envelopes;
    }

    envelope(category){
        return this._envelopes.find(envelope => envelope.category === category) || {};
    }

    generateEnvelopeIds(envelopes){
        envelopes.forEach(envelope => {
            envelope.id = randId();
        });
    
        return envelopes;
    }

    transfer(from, to, amount){
        const fromAmount = this.currentAmountByCategory(from)
        const toAmount = this.currentAmountByCategory(to)
        const fromAmountLeft = fromAmount - amount;

        if (fromAmount && toAmount){
            if (fromAmountLeft > 0){
                this.removeAmountByCategory(from, amount);
                this.addAmountByCategory(to, amount)
                console.log('Amount transfer succesful.');
                return true
            } else {
                console.log("Amount to transfer exceeds available balance.");
                return false
            }

        } else {
            console.log("One of the category's were not found.");
            return false
        }
    }

    deleteEnvelope(category){
        let deleteSuccess = false;

        this._envelopes = this._envelopes.filter(envelope => {
            if(envelope.category === category){
                deleteSuccess = true;
            }

            return envelope.category !== category;
        })

        if(deleteSuccess){
            console.log('Delete successful.')
            return true
        } else {
            console.log('Delete unsuccessful.')
            return false
        }
    }

    //function will return a boolean to verify if the buget depletion was succesful
    depleteBudget(category, Amount){
        let AmountLeft;
        for (const envelope of this._envelopes) {
            AmountLeft = this.currentAmountByCategory(envelope[category]) - Amount;
            if (envelope[category] && AmountLeft >= 0) {
                envelope.Amount -= Amount;
                this._totalBudget -= Amount;
                return true; 
            }
        }

        return false;
    }

    currentAmountById(id){
        const envelope = this._envelopes.find(envelope => envelope.id === id);
        
        if (envelope) {
            return envelope.Amount;
        } else {
            console.error(`Envelope with ID '${id}' not found.`);
            return null; 
        }
    }

    currentAmountByCategory(category){
        const envelope = this._envelopes.find(envelope => envelope.category === category);
        
        if (envelope) {
            return envelope.amount;
        } else {
            console.error(`Envelope with ID '${id}' not found.`);
            return null; 
        }
    }

    addAmountByCategory(category, amount){

        for (const envelope of this._envelopes) {
            if (envelope[category]) {
                envelope.amount += amount;
            }
        }

    }

    removeAmountByCategory(category, amount){

        let AmountLeft;
        for (const envelope of this._envelopes) {
            AmountLeft = this.currentAmountByCategory(category) - amount;
            if (envelope[category] && AmountLeft >= 0) {
                envelope.amount -= amount;
            }
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
    "totalBudget" : 10000,
    "envelopes" : [
        {
            "category" : "health",
            "amount" : 300
        },
        {
            "category" : "food",
            "amount" : 200
        }
    ]
}
*/