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
    nyInläggSection.style.display = nyInläggSection.style.display === "none" ? "block": "none";
    bloggInlägg.style.display =  bloggInlägg.style.display === "none" ? "block": "none";
    senasteVisningSection.style.display = "none"
});

visaAllaKnapp.addEventListener("click", () =>{
    nyInläggSection.style.display = "none";
    bloggInlägg.style.display = "block";
    senasteVisningSection.style.display = "none"
})

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
function skickaKommentar(inlägg,kommentarForm){
    // Hämta värden från formuläret
    const textarea = kommentarForm.querySelector("textarea");
    const content = textarea.value.trim();

    const varning = document.getElementById("varning");
    if (!content){
        varning.textContent = "Du måste fylla i alla fält innan du kan publicera.";
        // stoppar funktionen
        return; 
    }else {
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

        //Sparar kommentaren i ett objekt "inlägg" 
        const kommentar = {
            tillhör: inlägg.tid,
            innehåll: content,
            tid: datumTid
        };
        sparaKommentar(kommentar)
        textarea.value = "";

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
        skickaKommentar(inlägg, kommentarForm);
    })

    return kommentarForm;
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
    // Skapa en ta bort knapp
    const taBortKnapp = document.createElement("button")
    taBortKnapp.textContent = "Ta bort";
    taBortKnapp.classList.add("ta-bort-inlägg")

    taBortKnapp.addEventListener("click", () => {
        taBortInlägg(inlägg);
        nyArticle.remove(); // Tar bort från DOM
    });  

    nyArticle.appendChild(taBortKnapp);

    // skapa en Kommentarssektion's knapp
    const kommentarKnapp = document.createElement("button")
    kommentarKnapp.textContent = "Kommentera";
    kommentarKnapp.classList.add("kommentar-sektion-knapp")
    const kommentarInlägg = kommentar(inlägg);
    nyArticle.appendChild(kommentarInlägg);

    kommentarKnapp.addEventListener("click", ()=>{
        if (kommentarInlägg.style.display === "none") {
            kommentarInlägg.style.display = "block";
            kommentarKnapp.textContent = "Dölj kommentar";
        }else{
            kommentarInlägg.style.display = "none";
            kommentarKnapp.textContent = "Kommentera";
        }
    })
    nyArticle.appendChild(kommentarKnapp);



  return nyArticle;
}

function visaInlägg(inlägg){
    senasteVisningSection.style.display = "none";
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

        visaInlägg(inlägg) 
        sparaInlägg(inlägg)
        nyInläggForm.reset();
        nyInläggSection.style.display = "none";
    }
};

publicera.addEventListener("click", publiceraInlägg)

senastPubliceradSection.addEventListener("click", () => {
    nyInläggSection.style.display = "none";
    senasteVisningSection.style.display = "block";
    bloggInlägg.style.display = "none";
    const allaInläggPublicerad = hämtaInlägg()
    const senasteInlägg = allaInläggPublicerad[allaInläggPublicerad.length - 1];

    if (senasteInlägg) {
        const artikel = skapaInläggElement(senasteInlägg);
        senasteVisning.innerHTML = "";
        senasteVisning.appendChild(artikel);
    } else {
        senasteVisning.innerHTML = "<p>Inga inlägg hittades.</p>";
    }
});


window.addEventListener("DOMContentLoaded", (e)=>{
    const sparade = hämtaInlägg()
    sparade.forEach(visaInlägg)
});
