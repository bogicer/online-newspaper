function addArticle() {
  const text = document.getElementById("articleText").value.trim();
  if (!text) return alert("Введіть текст!");

  fetch("http://localhost:3000/add-article", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ article: { text, date: new Date().toISOString() } })
  })
    .then(res => res.text())
    .then(alert)
    .catch(err => console.error(err));
}
