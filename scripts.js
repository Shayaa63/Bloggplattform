const skapaNyInlägg = document.getElementById ("skapa-ny-inlägg");
const nyInlägg = document.getElementById("ny-inlägg");
const tidigareInläggen =document.getElementById("tidigare-inläggen")
const nyInläggForm = document.getElementById("ny-inlägg-form")

skapaNyInlägg.addEventListener("click", (e)=>{
    nyInlägg.style.display = nyInlägg.style.display === "none" ? "block": "none";
});

const publicera = document.getElementById("publicera")

publicera.addEventListener("click", (e)=>{
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
        <time datetime="${new Date().toISOString().split("T")[0]}">${new Date().toLocaleDateString("sv-SE")}</time> 
        av <strong>${author}</strong>
      </p>
      <p>${content.replace(/\n/g,"<br>")}</p>`;
    nyInlägg.style.display = "none";

    // Lägg till i DOM
    tidigareInläggen.prepend(nyArticle); // lägger överst
    nyInläggForm.reset(); // tömmer formuläret

})