const db = require('mongoose');
db.connect('mongodb://0.0.0.0:27017/quiz',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err))


module.exports = db;