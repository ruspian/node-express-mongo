const mongoose = require('mongoose');


// membuat skema
const Contact = mongoose.model('Contact', {
    nama : {
        type : String,
        required : true,
    },
    noHP : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    },

});

module.exports = Contact;