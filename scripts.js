const bloggInlägg = document.getElementById("blogg-inlägg")
const skapaNyInlägg = document.getElementById ("skapa-ny-inlägg");
const nyInläggSection = document.getElementById("ny-inlägg-section");
const tidigareInläggen =document.getElementById("tidigare-inläggen")
const nyInläggForm = document.getElementById("ny-inlägg-form")
const publicera = document.getElementById("publicera")
const senastPubliceradSection = document.getElementById("senast-publicerad-section")
const visaAllaKnapp  = document.getElementById("visa-alla-knapp")
const senasteVisning = document.getElementById("senaste-visning")
const senasteVisningSection = document.getElementById("senaste-visning-section")
const ingaInläggMeddelande = document.getElementById("inga-inlägg-meddelande")

skapaNyInlägg.addEventListener("click", (e)=>{
    nyInläggSection.style.display = "block";
    bloggInlägg.style.display = "none";
    senasteVisningSection.style.display = "none";
});

visaAllaKnapp.addEventListener("click", () =>{
    ingaInläggMeddelande.style.display = "none"

    const allaInläggPublicerad = hämtaInlägg()
    const senasteInlägg = allaInläggPublicerad[allaInläggPublicerad.length - 1];

    if (!senasteInlägg) {
        ingaInläggMeddelande.style.display = "block"
    }

    nyInläggSection.style.display = "none";
    bloggInlägg.style.display = "block";
    senasteVisningSection.style.display = "none"
})

senastPubliceradSection.addEventListener("click", () => {
    nyInläggSection.style.display = "none";
    senasteVisningSection.style.display = "block";
    bloggInlägg.style.display = "none";

    const allaInläggPublicerad = hämtaInlägg()
    const senasteInlägg = allaInläggPublicerad[allaInläggPublicerad.length - 1];

    senasteVisning.innerHTML = "";

    if (senasteInlägg) {
        const artikel = skapaInläggElement(senasteInlägg);
        senasteVisning.appendChild(artikel);
    } else {
        senasteVisning.innerHTML = "<p>Inga inlägg hittades.</p>";
    }
});

function hämtaInlägg() {
  return JSON.parse(localStorage.getItem("inlägg")) || [];
}
function hämtaKommentar() {
  return JSON.parse(localStorage.getItem("kommentarer")) || [];
}

function sparaInlägg(nyttInlägg) {
  const alla = hämtaInlägg();
  // lägger till inlägget sist i arrayn
  alla.push(nyttInlägg);
  //Gör det till j-son och spara det i local storage
  localStorage.setItem("inlägg", JSON.stringify(alla));
}

function sparaKommentar(kommentar) {
  const allaKommentar = hämtaKommentar();
  // lägger till inlägget sist i arrayn
  allaKommentar.push(kommentar);
  //Gör det till j-son och spara det i local storage
  localStorage.setItem("kommentarer", JSON.stringify(allaKommentar));
}

function taBortInlägg(inläggAttTaBort) {
    const alla = hämtaInlägg();
    const uppdateradLista = alla.filter(inlägg => {
        return !(inlägg.titel === inläggAttTaBort.titel &&
            inlägg.författare === inläggAttTaBort.författare &&
            inlägg.tid === inläggAttTaBort.tid);
    });

    localStorage.setItem("inlägg", JSON.stringify(uppdateradLista));
    
    if (uppdateradLista.length === 0) {
        tidigareInläggen.innerHTML = ""; // Rensa DOM
        tidigareInläggen.append(ingaInläggMeddelande); // Visa meddelande
    }
}

function kommentar(inlägg){
    const kommentarForm = document.createElement("form")
    kommentarForm.classList.add("ny-inlägg-form")
    kommentarForm.style.display = "none";
    kommentarForm.innerHTML = `
    <textarea placeholder="Skriv en kommentar..." rows="3"></textarea>
    `;

    const skickaKommentarKnapp = document.createElement("button")
    skickaKommentarKnapp.textContent = "Skicka kommentar";
    skickaKommentarKnapp.classList.add("ta-bort-inlägg")
    kommentarForm.appendChild(skickaKommentarKnapp);

    skickaKommentarKnapp.addEventListener("click", (e)=>{
        e.preventDefault();
        skickaKommentar(inlägg, kommentarForm);
    })

    return kommentarForm;
}

function skickaKommentar(inlägg,kommentarForm){
    // Hämta värden från formuläret
    const textarea = kommentarForm.querySelector("textarea");
    const content = textarea.value;

    // Hämtar in den akutella datum och tid
    const nu = new Date();
    const datumTid = nu.toLocaleString("sv-SE", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    //Sparar kommentaren i ett objekt
    const kommentar = {
        tillhör: inlägg.tid,
        innehåll: content,
        tid: datumTid
    };

    const varning = document.getElementById("varning");
    if (!content || !content.trim()){
        varning.textContent = "Du måste fylla i alla fält innan du kan publicera.";
        // stoppar funktionen
        return; 
    }else {
        varning.textContent ="";
        sparaKommentar(kommentar)
        textarea.value = "";
    }

    if (kommentarForm.kommentarListaEgenskap) {
        const kommentarElement = document.createElement("p");
        kommentarElement.innerHTML = `<strong>${kommentar.tid}</strong>: ${kommentar.innehåll}`;
        kommentarForm.kommentarListaEgenskap.appendChild(kommentarElement);
    }
    kommentarForm.style.display = "block";
    kommentarForm.kommentarListaEgenskap.style.display = "block";

}

function skapaKommentarLista(kommentarInlägg,inlägg){
    const kommentarLista = document.createElement("div")
    kommentarLista.classList.add("inlägg");
    kommentarInlägg.appendChild(kommentarLista)

    kommentarInlägg.kommentarListaEgenskap = kommentarLista;

    const tidigareKommentarer = hämtaKommentar().filter(k => k.tillhör === inlägg.tid);
    tidigareKommentarer.forEach(k => {
        const kommentarElement = document.createElement("p");
        kommentarElement.innerHTML = `<strong>${k.tid}</strong>: ${k.innehåll}`;
        kommentarLista.appendChild(kommentarElement);
});

}

function skapaInläggElement(inlägg) {
    const nyArticle = document.createElement("article");
    nyArticle.classList.add("inlägg");

    // Lägg till värdet i den nya articlen 
    nyArticle.innerHTML = `
        <h3>${inlägg.titel}</h3>
        <p>${inlägg.tid} av <strong>${inlägg.författare}</strong></p>
        <p>${inlägg.innehåll.replace(/\n/g, "<br>")}</p>
    `;

    // Skapa en gilla knapp
    const gillaKnapp = document.createElement("button")
    let gilla = false;
    gillaKnapp.textContent = "🤍";

    gillaKnapp.addEventListener("click", ()=>{
        gilla = !gilla;
        gillaKnapp.textContent = gilla ? "❤️" : "🤍";
    })
    nyArticle.appendChild(gillaKnapp);

    // Skapa en ta bort knapp
    const taBortKnapp = document.createElement("button")
    taBortKnapp.textContent = "Ta bort";
    taBortKnapp.classList.add("ta-bort-inlägg")

    taBortKnapp.addEventListener("click", () => {
        taBortInlägg(inlägg);
        nyArticle.remove(); // Tar bort från DOM
    });  

    nyArticle.appendChild(taBortKnapp);

    // Skapar en kommentarssektion
    const kommentarInlägg = kommentar(inlägg);
    skapaKommentarLista(kommentarInlägg,inlägg);
    const kommentarKnapp = document.createElement("button")
    kommentarKnapp.textContent = "Kommentera";
    kommentarKnapp.classList.add("kommentar-sektion-knapp")

    kommentarKnapp.addEventListener("click", ()=>{
        if (kommentarInlägg.style.display === "none") {
            kommentarInlägg.style.display = "block";
            kommentarKnapp.textContent = "Dölj kommentar";
        }else{
            kommentarInlägg.style.display = "none";
            kommentarKnapp.textContent = "Kommentera";
        }
    })
    nyArticle.appendChild(kommentarInlägg);
    nyArticle.appendChild(kommentarKnapp);

  return nyArticle;
}

function läggTillInlägg(inlägg){
    bloggInlägg.style.display = "block"
    const nyArticle = skapaInläggElement(inlägg)
    // lägger till så den hamnar under blogg inlägg
    tidigareInläggen.prepend(nyArticle); // lägger överst
}


function publiceraInlägg (e){
    bloggInlägg.style.display = "block";
    ingaInläggMeddelande.remove();
    // Hämta värden från formuläret
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const content = document.getElementById("content").value;

    //kontrollerar om något är tomt
    const varning = document.getElementById("varning");

    if (!title || !author || !content) {
        varning.textContent = "Du måste fylla i alla fält innan du kan publicera.";
        // stoppar funktionen
        return; 
    } else {
        // rensar meddelandet om allt är ifyllt
        varning.textContent = ""; 
        // Hämtar in den akutella datum och tid
        const nu = new Date();
        const datumTid = nu.toLocaleString("sv-SE", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });

        //Sparar blogg inläggen i ett objekt "inlägg" 
        const inlägg = {
            titel: title,
            författare: author,
            innehåll: content,
            tid: datumTid
        };

        läggTillInlägg(inlägg) 
        sparaInlägg(inlägg)
        nyInläggForm.reset();
        nyInläggSection.style.display = "none";
    }
};

publicera.addEventListener("click", publiceraInlägg)


window.addEventListener("DOMContentLoaded", (e)=>{
    const sparade = hämtaInlägg()
    if (sparade.length > 0) {
        ingaInläggMeddelande.style.display = "none";
    }
    sparade.forEach(läggTillInlägg)
});
