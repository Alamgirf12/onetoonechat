var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/onetoone', { useNewUrlParser: true,useUnifiedTopology: true  }, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
});
