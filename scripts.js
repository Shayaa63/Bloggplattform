const skapaNyInlägg = document.getElementById ("skapa-ny-inlägg");
const nyInlägg = document.getElementById("ny-inlägg");
const tidigareInläggen =document.getElementById("tidigare-inläggen")
const nyInläggForm = document.getElementById("ny-inlägg-form")
const publicera = document.getElementById("publicera")

skapaNyInlägg.addEventListener("click", (e)=>{
    nyInlägg.style.display = nyInlägg.style.display === "none" ? "block": "none";
});


function visaInlägg(inlägg){
    // Skapa nytt <article>
    const nyArticle = document.createElement("article")
    nyArticle.classList.add("inlägg")

    // Lägg till värdet i den nya articlen 
    nyArticle.innerHTML = `
      <h3>${inlägg.titel}</h3>
      <p>
        ${inlägg.tid} 
        av <strong>${inlägg.författare}</strong>
      </p>
      <p>${inlägg.innehåll.replace(/\n/g,"<br>")}</p>`;

    // lägger till så den hamnar under blogg inlägg
    tidigareInläggen.prepend(nyArticle); // lägger överst
}


function publiceraInlägg (e){
    // Hämtar in den akutella datum och tid
    const nu = new Date();
    const datumTid = nu.toLocaleString("sv-SE", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    // Hämta värden från formuläret
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const content = document.getElementById("content").value;

    //Sparar blogg inläggen i ett objekt "inlägg" 
    const inlägg = {
        titel: title,
        författare: author,
        innehåll: content,
        tid: datumTid
    };

    visaInlägg(inlägg) //kör funktionen 
    //spara alla inlägg i en lista (array)
    let allaInlägg = JSON.parse(localStorage.getItem("inlägg")) || []; //Hämta tidigare sparade inlägg
    allaInlägg.push(inlägg); // lägger till inlägget sist i arrayn
    localStorage.setItem("inlägg", JSON.stringify(allaInlägg)); //Gör det till j-son och spara det i local storage
    nyInlägg.style.display = "none";
    nyInläggForm.reset();

};

publicera.addEventListener("click", publiceraInlägg)

window.addEventListener("DOMContentLoaded", (e)=>{
    const sparade = JSON.parse(localStorage.getItem("inlägg")) || [];
    sparade.forEach(visaInlägg)
});
