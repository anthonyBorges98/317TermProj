function setFlashMessageFadeOut() {
    setTimeout(() => {
        let currentOpacity = 1.0;
        let timer = setInterval(() => {
            if (currentOpacity < 0.05) {
                clearInterval(timer);
                flashElement.remove();
            }
            currentOpacity = currentOpacity - 0.5;
            flashElement.style.opacity = currentOpacity;
        }, 50);
    }, 4000);
}

let flashElement = document.getElementById('flash-message');
if (flashElement) {
    setFlashMessageFadeOut();
}

function executeSearch() {
    let searchTerm = document.getElementById('search-text').value;
    console.log(searchTerm);
    if (!searchTerm) {
        location.replace('/');
        return;
    }
    let mainContent = document.getElementById('main-content');
    console.log(mainContent);
    let searchURL = `/posts/search?search=${searchTerm}`;
    fetch(searchURL)
        .then(data => data.json())
        .then((data_json) => {
            let newMainContentHTML = '';
            console.log("data_json");
            console.log(data_json);
            data_json.results.forEach((row) => {
                newMainContentHTML += createCard(row);
            });
            mainContent.innerHTML = newMainContentHTML;
        })
        .catch((err) => console.log(err));
}

let searchButton = document.getElementById('search-button');
if (searchButton) {
    searchButton.onclick = executeSearch;
}

function createCard(postData) {
    return `<div id = "post-${postData.id}" class = "card">
    <img class = "card-image" src = "${postData.thumbnail}" alt ="Missing Image">
    <div class = "card-body">
        <p class = card-title>${postData.title}</p>
        <p class = "card-description">${postData.description}</p>
        <a class = "anchor-button" href = "/post/${postData.id}"> Post Details</a>
    </div>
</div>`;
}
