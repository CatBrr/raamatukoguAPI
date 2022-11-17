const app = require('express')(); //impordib node_modules/ kaustas oleva express/ kausta, kus asub Express raamistik. Tühi sulupaar rea lõpus käivitab mooduli sees oleva koodi, mis tagastab objekti, mille salvestame app nimelisse muutujasse.
const port = 8080 //Muutuja port väärtuseks paneme selle pordi numbri, millel soovime rakendust kuulama panna. Kasutame pordi määramiseks muutujat, et vajadusel saaks porti muuta ainult ühe muutuja väärtuse muutmisega.
const file =require('./data/books.json');
const books= file.books;
app.get('', (req,res)=>{ //kutsud app objektist välja get() meetodi, andes esimeseks argumendiks "/games" ja teiseks argumendiks funktsiooni, mis käivitatakse, kui keegi teeb GET /games päringu meie API vastu. See funktsioon koostab vastuse sellele päringule. Selles funktsioonis on sul ligipääs kahele objektile: req(uest) ja res(ponse). Muutuja reqi seest saad lugeda andmeid, mis klient päringuga saatis. Selle lõpp-punkti jaoks meil sissetulevaid andmeid vaja pole. Muutuja res võimaldab panna vastusesse andmeid, mida me tahame kliendile tagasi saata.
  res.send(books); //asendame seal varem olnud kahe mänguga püsiprogrammeeritud massiivi games muutujaga, mille defineerisime real 6.
});
app.get('/:id', (req,res)=>{ //lisame /games/:id lõpp-punkti. See :id on mingi number, mis näitab, millise mängu infot päriti (nt kui päring on GET /games/8, siis :id väärtus on 8).
    if(typeof books[req.params.id-1]==='undefined'){
        return res.status(404).send({error:"book not foud"}); //kui ei ole leinud näitab viga
    }
    res.send(books[req.params.id-1]); //saadame päringu vastusena tagasi games massiivist selle liikme, mille indeks on :id väärtus.
});
//kutsume app muutujast välja meetodi listen() ja anname selle meetodi esimeseks argumendiks port muutujas oleva numbri, pannes sellega rakenduse kuulama võrgus seda porti sissetulevate päringute osas. 
app.listen(port,()=> {
    console.log(`API up at: http://localhost:${port}`); //Teine, valikuline argument listen meetodil määratleb funktsiooni, mis läheb siis käima, kui rakendus on hakanud võrgus porti kuulama. Selles funktsioonis prindime me konsoolile aadressi, millel rakendus kättesaadav on. Nii on mugav aadressi brauserisse kopeerida ja osades terminalides (nagu nt VS Code) on aadress ka klõpsatav.
});