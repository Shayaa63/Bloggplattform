const skapaNyInlägg = document.getElementById ("skapa-ny-inlägg");
const nyInlägg = document.getElementById("ny-inlägg");
const tidigareInläggen =document.getElementById("tidigare-inläggen")
const nyInläggForm = document.getElementById("ny-inlägg-form")

skapaNyInlägg.addEventListener("click", (e)=>{
    nyInlägg.style.display = nyInlägg.style.display === "none" ? "block": "none";
});

const publicera = document.getElementById("publicera")
publicera.addEventListener("click", (e)=>{
    // Hämtar in den akutella datum och tid
    let nu = new Date();
    let datumTid = nu.toLocaleString("sv-SE", {
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

    // Skapa nytt <article>
    const nyArticle = document.createElement("article")
    nyArticle.classList.add("inlägg")

    // Lägg till värdet i den nya articlen 
    nyArticle.innerHTML = `
      <h3>${title}</h3>
      <p>
        ${datumTid} 
        av <strong>${author}</strong>
      </p>
      <p>${content.replace(/\n/g,"<br>")}</p>`;
    nyInlägg.style.display = "none";

    // lägger till så den hamnar under blogg inlägg
    tidigareInläggen.prepend(nyArticle); // lägger överst
    nyInläggForm.reset(); // tömmer formuläret

    //Sparar varje blogg inlägg i en array
    const inlägg = {
        titel: title,
        författare: author,
        innehåll: content,
        tid: datumTid
    };

})






