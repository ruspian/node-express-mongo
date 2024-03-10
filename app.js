// module 
const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const { body, validationResult, check } = require('express-validator');
const methodOverride = require('method-override');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

// require folder sebelah
require('./utils/db');
const Contact = require('./model/Contact');


// config express
const app = express();
const port = 3000;

// setup method override
app.use(methodOverride('_method'));

// setup engine (EJS)
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public')); // express.static => mengizinkan folder ditampilkan
app.use(express.urlencoded({extended : true}));  

// konfigurasi flash/menampilkan pesan singkat
app.use(cookieParser('secret'));
app.use(session({
    cookie : { maxAge : 6000 },
    secret : 'secret',
    resave : true,
    saveUninitialized : true,
}));
app.use(flash());

// halaman home
app.get('/', (req, res) => {

    // memanggil index menggunakan ejs
    const mahasiswa = [
        {
            nama : 'Ruspian Majid',
            email : 'ruspian@gmail.com'
        },
        {
            nama : 'Suhirman',
            email : 'suhir@gmail.com'
        },
        {
            nama : 'Muhammad Farhat',
            email : 'farhat@gmail.com'
        },
    ]
    res.render('index', { 
        nama : 'Ruspian Majid', 
        title : 'Halaman Utama',
        layout : 'layouts/main-layout',
        mahasiswa,
    });
});

// halaman about
app.get('/about', (req, res) => {
    // res.sendFile('./about.html', { root : __dirname });
    res.render('about', { 
        title : 'Halaman Tentang',
        layout : 'layouts/main-layout'
    });
});

// halaman contact
app.get('/contact', async (req, res) => {
    const contacts = await Contact.find();

    res.render('contact', { 
        title : 'Halaman Kontak',
        layout : 'layouts/main-layout',
        contacts,
        msg : req.flash('msg')
    });
});


// halaman tambah kontak
app.get('/contact/add', (req, res) => {
    res.render('addKontak', { 
        title : 'Halaman Tambah Kontak',
        layout : 'layouts/main-layout',
    });
});


// proses input/tambah data via form 
app.post('/contact',[
    // validasi cek duplikat
    body('nama').custom( async (value) => {
        const duplikat = await Contact.findOne({ nama : value });
        if(duplikat) {
            throw new error('Nama sudah digunakan!');
        }
    return true;
    }),
    // validasi cek email
    check('email', 'Email Tidak Valid!').isEmail(), 
    // validasi cek nomor hp
    check('noHP', 'Nomor HP Tidak Valid!').isMobilePhone('id-ID')   
], (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        res.render('addKontak', {
            title : 'Halaman Tambah Kontak',
            layout : 'layouts/main-layout',
            errors : error.array(),
        });
    } else {
        Contact.insertMany(req.body);
        req.flash('msg', 'Kontak berhasil ditambahkan!');
        res.redirect('/contact');

    }
});

// proses delete kontak
app.delete('/contact',( req, res ) => {
    // res.send(req.body.nama);
    Contact.deleteOne({ nama : req.body.nama }).then(() => {
        req.flash('msg', 'Kontak berhasil dihapus!');
        res.redirect('/contact');
    });
});

// halaman form ubah data kontak
app.get('/contact/edit/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama : req.params.nama });

    res.render('editKontak', { 
        title : 'Halaman Edit Kontak',
        layout : 'layouts/main-layout',
        contact,
    });
});


// proses ubah data 
app.put('/contact',[
    body('nama').custom( async (value, { req }) => {
        const duplikat = await Contact.findOne({ nama : value });
        if(value !== req.body.namaLama && duplikat) {
            throw new error('Nama sudah digunakan!');
        }
    return true;
    }),
    check('email', 'Email Tidak Valid!').isEmail(), // validasi cek email
    check('noHP', 'Nomor HP Tidak Valid!').isMobilePhone('id-ID')   // validasi cek nomor hp
], (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        res.render('editKontak', {
            title : 'Halaman Edit Kontak',
            layout : 'layouts/main-layout',
            errors : error.array(),
            contact : req.body,
        });
    } else {
        Contact.updateOne(
            { _id : req.body._id},
            {
                $set : {
                    nama : req.body.nama,
                    email : req.body.email,
                    noHP : req.body.noHP,
                },
            }
        ).then(() => {
            req.flash('msg', 'Kontak berhasil diubah!');
            res.redirect('/contact');
        });
    }
});


// masuk halaman detail kontak
app.get('/contact/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama });

    res.render('detail', { 
        title : 'Halaman Detail Kontak',
        layout : 'layouts/main-layout',
        contact,
    });
});

// menjalankan express
app.listen( port, () => {
    console.log(`Mongo Contact App | Listening at http://localhost:${port}`);
});
