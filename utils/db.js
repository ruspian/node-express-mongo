// module
const mongoose = require('mongoose');

// konek mongoose
mongoose.connect('mongodb://127.0.0.1:27017/myDB').then(() => console.log('Connected!'));

// membuat skema
// const Contact = mongoose.model('Contact', {
//     nama : {
//         type : String,
//         required : true,
//     },
//     noHP : {
//         type : String,
//         required : true,
//     },
//     email : {
//         type : String,
//         required : true,
//     },

// });

// // menambah 1 data
// const contact1 = new Contact({
//     nama : 'Fizi',
//     noHP : '082293303312',
//     email : 'fizi0987@gmail.com'
// });

// // simpan ke koleksion
// contact1.save().then((contact) => console.log(contact));