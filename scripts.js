const bloggInlägg = document.getElementById("blogg-inlägg")
const skapaNyInlägg = document.getElementById ("skapa-ny-inlägg");
const nyInläggSection = document.getElementById("ny-inlägg-section");
const nyInläggForm = document.getElementById("ny-inlägg-form")
const publicera = document.getElementById("publicera")
const senastPubliceradSection = document.getElementById("senast-publicerad-section")
const visaAllaKnapp  = document.getElementById("visa-alla-knapp")
const tillToppen = document.getElementById("till-toppen")
const senasteVisning = document.getElementById("senaste-visning")
const senasteVisningSection = document.getElementById("senaste-visning-section")
const ingaInläggMeddelande = document.getElementById("inga-inlägg-meddelande")

tillToppen.addEventListener("click", function() {
  window.scrollTo({
    top: 0,
    behavior: "smooth" 
  });
});

let tidigareInläggen = document.getElementById("tidigare-inläggen")

function visaSektioner({ nyInlägg = false, blogg = false, senaste = false, ingaInläggM = false }) {
    nyInläggSection.style.display = nyInlägg ? "block" : "none";
    bloggInlägg.style.display = blogg ? "block" : "none";
    senasteVisningSection.style.display = senaste ? "block" : "none";
    ingaInläggMeddelande.style.display = ingaInläggM ? "block" : "none";
}


skapaNyInlägg.addEventListener("click", (e)=>{
    visaSektioner({nyInlägg: true})
});

function OmTomLista() {
    if (hämtaData("inlägg").length === 0) {
        visaSektioner({ blogg: true, ingaInläggM: true });
    }
}

visaAllaKnapp.addEventListener("click", () =>{
    visaSektioner({blogg: true})
    const allaInlägg = hämtaData ("inlägg")
    tidigareInläggen.innerHTML= "";
    OmTomLista()
    for (let i = allaInlägg.length - 1; i >= 0; i--){
        const artikel = skapaInläggElement(allaInlägg[i])
        tidigareInläggen.appendChild(artikel)
    } 
})

senastPubliceradSection.addEventListener("click", () => {
    visaSektioner({senaste: true})

    const allaInlägg = hämtaData("inlägg");
    const senasteInlägg = allaInlägg[allaInlägg.length - 1];

    senasteVisning.innerHTML = "";

    if (senasteInlägg) {
        const artikel = skapaInläggElement(senasteInlägg);
        senasteVisning.appendChild(artikel);
    } else {
        senasteVisning.innerHTML = "<p>Inga inlägg hittades.</p>";
    }
});

function hämtaDatumochTid() {
    const nu = new Date();
    const datumTid = nu.toLocaleString("sv-SE", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
    return datumTid
}


function hämtaData(nyckel) {
    try{
        const data= JSON.parse(localStorage.getItem(nyckel)) || [];
        return Array.isArray(data) ? data : [];
    } catch (e) {
        console.log("Kunde inte läsa inlägg från localStorage:", e)
        return [];
    }
}

function sparaData(data,nyckel) {
  const alla = hämtaData(nyckel);
  // lägger till inlägget sist i arrayn
  alla.push(data);
  
  localStorage.setItem(nyckel, JSON.stringify(alla));
}

function skapaKnapp (text, klassNamn, klickFunktion){
    const knapp = document.createElement("button");
    knapp.textContent = text;
    knapp.classList.add(klassNamn);

    if (typeof klickFunktion === "function") {
        knapp.addEventListener("click", klickFunktion);
    }
    return knapp;
}

function taBortInlägg(inläggAttTaBort) {
    const alla = hämtaData("inlägg");
    const uppdateradLista = alla.filter(inlägg => {
        return !(inlägg.titel === inläggAttTaBort.titel &&
            inlägg.författare === inläggAttTaBort.författare &&
            inlägg.tid === inläggAttTaBort.tid);
    });

    localStorage.setItem("inlägg", JSON.stringify(uppdateradLista));
    
    if (uppdateradLista.length === 0) {
        tidigareInläggen.innerHTML = ""; // Rensa DOM
    }
}
function skickaKommentar(inlägg,kommentarFormulär, kommentarLista){
    // Hämta värden från formuläret
    const textarea = kommentarFormulär.querySelector("textarea");
    const content = textarea.value;
    const author = kommentarFormulär.querySelector("input")
    const authorValue = author.value

    const datumOchTidNu = hämtaDatumochTid()

    const kommentar = {
        tillhör: inlägg.tid,
        författare: authorValue,
        innehåll: content,
        tid: datumOchTidNu
    };

    const varning = document.getElementById("varning");
    if (!content || !content.trim()){
        varning.textContent = "Du måste fylla i alla fält innan du kan publicera.";
        return; 
    }else {
        varning.textContent ="";
        sparaData(kommentar,"kommentarer")
        textarea.value = "";
        author.value ="";
    }
    
    const kommentarElement = document.createElement("p");
    kommentarElement.innerHTML = `<strong>${kommentar.författare}</strong> skrev den <strong>${kommentar.tid}</strong>: ${kommentar.innehåll}`;
    kommentarLista.appendChild(kommentarElement);
}

function skapaKommentarKnapp (inlägg, artikel){
    const kommetarSektion = document.createElement("div");
    kommetarSektion.style.display = "none";
    //=============================================================
    const kommentarFormulär = document.createElement("form")
    kommentarFormulär.classList.add("ny-kommentar-form")
    kommentarFormulär.innerHTML = ` 
    <input type="text" id="author" name="author" placeholder="Författare" >
    <textarea placeholder="Skriv en kommentar..." rows="3"></textarea>
    <button type="button" id="publiceraKommentar">Publicera</button>
    `;

    //=============================================================

    const kommentarLista = document.createElement("div")
    kommentarLista.classList.add("tidigare-inläggen");
    kommetarSektion.appendChild(kommentarLista)

    const tidigareKommentarer = hämtaData("kommentarer").filter(k => k.tillhör === inlägg.tid);
    tidigareKommentarer.forEach(k => {
        const kommentarElement = document.createElement("p");
        kommentarElement.innerHTML = `<p ="text"> <strong>${k.författare}</strong> skrev den <strong>${k.tid}</strong>: </p> ${k.innehåll}`;
        kommentarLista.appendChild(kommentarElement);
    });

    const publiceraKommentar = kommentarFormulär.querySelector("button");

    publiceraKommentar.addEventListener("click", (e)=>{
        e.preventDefault();
        skickaKommentar(inlägg, kommentarFormulär, kommentarLista);
    })

    //=============================================================
    
    const kommentarKnapp = skapaKnapp ("Kommentera", "kommentar-sektion-knapp", ()=>{
    if (kommetarSektion.style.display === "none") {
        kommetarSektion.style.display = "block";
        kommentarKnapp.textContent = "Dölj kommentar";
    }else{
        kommetarSektion.style.display = "none";
        kommentarKnapp.textContent = "Kommentera";
    }
    })
    
    //=============================================================

    kommetarSektion.appendChild(kommentarFormulär)
    artikel.appendChild(kommetarSektion);
    artikel.appendChild(kommentarKnapp);
    
    return kommentarKnapp
}


function skapaGillaKnapp (inläggTid){
    const tidigareGillat = hämtaData("tidigareGillat");
    let gilla = tidigareGillat.includes(inläggTid);
    const gillaKnapp = skapaKnapp (gilla ? "❤️" : "🤍", "gilla-knapp", ()=>{
        gilla = !gilla;
        gillaKnapp.textContent = gilla ? "❤️" : "🤍";
        uppdateraGillatStatus(inläggTid, gilla)
    })
    return gillaKnapp;
}

function uppdateraGillatStatus(inläggTid, gilla){
    let uppdateraGillat = hämtaData("tidigareGillat").filter(tid => tid !== inläggTid);

    if (gilla){
        uppdateraGillat.push(inläggTid)
    }
    localStorage.setItem("tidigareGillat", JSON.stringify(uppdateraGillat));
}

function skapaTabortKnapp (inlägg,artikel){
    const taBortKnapp = skapaKnapp ("Ta bort", "ta-bort-inlägg", ()=>{
        taBortInlägg(inlägg);
        artikel.remove(); // Tar bort från DOM
        OmTomLista()
    })
    return taBortKnapp;
}

function skapaArtikelElement (inlägg){
    const artikel = document.createElement("article");
    artikel.classList.add("inlägg");

    // Lägg till värdet i den nya articlen 
    artikel.innerHTML = `
        <p class="text">Publicerad den ${inlägg.tid} </p>
        <h3>${inlägg.titel}</h3>
        <p>${inlägg.innehåll.replace(/\n/g, "<br>")}</p>
        <p class="text">av <strong>${inlägg.författare}</strong></p>
    `;
    return artikel;
}

function skapaInläggElement(inlägg) {
    const artikel = skapaArtikelElement(inlägg)

    const gillaKnapp = skapaGillaKnapp(inlägg.tid)
    artikel.appendChild(gillaKnapp);

    const taBortKnapp = skapaTabortKnapp(inlägg,artikel)
    artikel.appendChild(taBortKnapp);

    const kommentarKnapp = skapaKommentarKnapp(inlägg, artikel)
    artikel.appendChild(kommentarKnapp);

  return artikel;
}

function läggTillInlägg(inlägg){
    const nyArticle = skapaInläggElement(inlägg)
    // lägger till så den hamnar under blogg inlägg
    tidigareInläggen.prepend(nyArticle); // lägger överst
}


function publiceraInlägg (e){
    visaSektioner({blogg:true})

    // Hämta värden från formuläret
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const content = document.getElementById("content").value;

    const varning = document.getElementById("varning");

    if (!title.trim() || !author.trim() || !content.trim()) {
        varning.textContent = "Du måste fylla i alla fält innan du kan publicera.";
        return; 
    } else {
        varning.textContent = ""; 
        const datumOchTidNu = hämtaDatumochTid()

        const inlägg = {
            titel: title,
            författare: author,
            innehåll: content,
            tid: datumOchTidNu
        };

        läggTillInlägg(inlägg) 
        sparaData(inlägg,"inlägg")
        nyInläggForm.reset();
        visaSektioner({blogg: true})
    }
};

publicera.addEventListener("click", publiceraInlägg)


window.addEventListener("DOMContentLoaded", (e)=>{
    const sparade = hämtaData("inlägg")
    if (sparade.length > 0) {
        ingaInläggMeddelande.style.display = "none";
    }
    sparade.forEach(läggTillInlägg)
});