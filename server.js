const express = require('express'); //impordib node_modules/ kaustas oleva express/ kausta, kus asub Express raamistik. Tühi sulupaar rea lõpus käivitab mooduli sees oleva koodi, mis tagastab objekti, mille salvestame app nimelisse muutujasse.
const app= express();
var bodyParser = require('body-parser');
const port = 8080 //Muutuja port väärtuseks paneme selle pordi numbri, millel soovime rakendust kuulama panna. Kasutame pordi määramiseks muutujat, et vajadusel saaks porti muuta ainult ühe muutuja väärtuse muutmisega.
const books =require('./data/books.json');
const users =require('./data/users.json');
const fs = require('fs');
let CurrentUser=false;
let CurrentUsername="";
app.use(express.json());
//app.use(express.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/books/', (req,res)=>{ //kutsud app objektist välja get() meetodi, andes esimeseks argumendiks "/games" ja teiseks argumendiks funktsiooni, mis käivitatakse, kui keegi teeb GET /games päringu meie API vastu. See funktsioon koostab vastuse sellele päringule. Selles funktsioonis on sul ligipääs kahele objektile: req(uest) ja res(ponse). Muutuja reqi seest saad lugeda andmeid, mis klient päringuga saatis. Selle lõpp-punkti jaoks meil sissetulevaid andmeid vaja pole. Muutuja res võimaldab panna vastusesse andmeid, mida me tahame kliendile tagasi saata.
  res.send(books); //asendame seal varem olnud kahe mänguga püsiprogrammeeritud massiivi games muutujaga, mille defineerisime real 6.
});
app.get("/login", (req, res) => {
    res.render('login');
    //res.status(200).send("Raamatukogu: raamatud");
  });
app.get("/", (req, res) => {
    res.render('index',{
        ramList:books, 
        IsLogin: false
    });
    //res.status(200).send("Raamatukogu: raamatud");
  });
  app.get("/admin", (req, res) => {
      if(!CurrentUser){
        res.redirect('/');
      }
      else{
        res.render('index', {ramList:books, username: CurrentUsername, IsLogin: true});
      }
    
    //res.status(200).send("Raamatukogu: raamatud");
  });
  app.use(express.static(__dirname + '/public'));

app.set('view engine', 'pug');
app.get('/books/:id', (req,res)=>{ //lisame /games/:id lõpp-punkti. See :id on mingi number, mis näitab, millise mängu infot päriti (nt kui päring on GET /games/8, siis :id väärtus on 8).
    if(typeof books[req.params.id-1]==='undefined'){
        return res.status(404).send({error:"book not foud"}); //kui ei ole leinud näitab viga
    }
    res.send(books[req.params.id-1]); //saadame päringu vastusena tagasi games massiivist selle liikme, mille indeks on :id väärtus.
});
app.post('/books/',(req,res)=>{ //lisatakse mängude massiivi uus objekt
    if(!req.body.title || !req.body.price || !req.body.author){
        return res.status(400).send({ error: 'One or all params are missing'});
    }
    let book ={
        id: books.length+1, //id väärtuseks on massiivi liikmete hetkearv + 1, 
        title: req.body.title,
        author: req.body.author,
        price: req.body.price//üritati lugeda .price attribuuti selliselt objektilt, mis pole defineeritud. index.js real 35 on price: req.body.price. Sellest saame tuletada, et see objekt, mis pole defineeritud, on req.body. 
    };
    books.push(book);
    fs.writeFileSync('./data/books.json',JSON.stringify(books));
    if(CurrentUser){
        res.status(201)//.location(`${getBaseUrl(req)}/books/${books.length}`).send(book);
       .redirect('/admin');
    }
    else{
        res.status(201)//.location(`${getBaseUrl(req)}/books/${books.length}`).send(book);
       .redirect('/');
    }
    
});
app.post('/login',function(req, res){
    const username = req.body.username;
    let loginResult = login(username, req.body.password);
    if (loginResult) {
        CurrentUser=true;
        CurrentUsername=username;
        res.render('index', {ramList:books, username: username, IsLogin: true});
    }
    else {
        res.render('index', {ramList:books, error: true});
    }
});
app.post('/registr',function(req, res) {
    let user={
        id: users.length+1,
        username: req.body.username,
        password: req.body.password,
        IsAdmin: false
    };
    users.push(user);
    fs.writeFileSync('./data/users.json',JSON.stringify(users));
    res.status(201)//.location(`${getBaseUrl(req)}/books/${books.length}`).send(book);
       .redirect('/');
    if(error) {
        res.render('index', {ramList:books, error: true});
    }
});
app.get('/logout',(req,res)=>{
    CurrentUsername="";
    CurrentUser=false;
    res.render('index',{
        ramList:books, 
        IsLogin: false
    });
});
app.get('/registr',(req,res)=>{
    res.render('registr');
});
app.get('/books/:id/delete',(req,res)=>{// lisame /games /:id lõpp-punkti. See :id on mingi number, mis näitab, millise mängu infot kustutakse (nt kui päring on GET /games/8, siis kustutatakse mäng, mille id väärtus on 8).
    if(typeof books[req.params.id -1]==='undefined'){//kontrollitakse games massiivi sisu, vastavalt antud indeksile. Kui indeks ei ole massiivis, tagastatakse undefined
       return res.status(404).send({error:" Book not found"});
    }
    books.splice(req.params.id-1,1);//kasutame funktsiooni splice, millega eemaldame elemendi massiivist. Esimeseks funktsiooni parameetriks anname alguse ehk 0 koha massiivist, kust hakatakse elemente eemaldama. Teiseks parameetriks anname arvu, mitu elementi eemaldatakse.
    fs.writeFileSync('./data/books.json',JSON.stringify(books));
    return res
        .status(204)//.send({error:"Book are deleted"})// anname õige tagastatava staatuskoodi: 204 No Content
        .redirect('/admin');
});
app.post('/books/:id/edit',(req,res)=>{// lisame /games /:id lõpp-punkti. See :id on mingi number, mis näitab, millise mängu infot kustutakse (nt kui päring on GET /games/8, siis kustutatakse mäng, mille id väärtus on 8).
    if(typeof books[req.params.id -1]==='undefined'){//kontrollitakse games massiivi sisu, vastavalt antud indeksile. Kui indeks ei ole massiivis, tagastatakse undefined
       return res.status(404).send({error:" Book not found"});
    }
    if(req.body.title){
        books[req.params.id-1].title=req.body.title
    }
    if(req.body.price){
        books[req.params.id-1].price=req.body.price
    }
    if(req.body.author){
        books[req.params.id-1].author=req.body.author
    }
    fs.writeFileSync('./data/books.json',JSON.stringify(books));
    return res
        .status(201)
        .redirect('/admin');
        //.send({error:"Book are updated"})
        

    });

//kutsume app muutujast välja meetodi listen() ja anname selle meetodi esimeseks argumendiks port muutujas oleva numbri, pannes sellega rakenduse kuulama võrgus seda porti sissetulevate päringute osas. 
app.listen(port,()=> {
    console.log(`API up at: http://localhost:${port}`); //Teine, valikuline argument listen meetodil määratleb funktsiooni, mis läheb siis käima, kui rakendus on hakanud võrgus porti kuulama. Selles funktsioonis prindime me konsoolile aadressi, millel rakendus kättesaadav on. Nii on mugav aadressi brauserisse kopeerida ja osades terminalides (nagu nt VS Code) on aadress ka klõpsatav.
});
function getBaseUrl(req){
    return req.connection && req.connection.encryptesd ? 'https' : 'http' + `://${req.headers.host}`;
};
function login(user,password){
    if(user==="admin@admin.com" && password==="admin"){
            return true;
        }
        else{
            return false;
        }
    
}
