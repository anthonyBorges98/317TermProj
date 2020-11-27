var count;
function createPhotoCard()
{
    var makeCard = new XMLHttpRequest();
    makeCard.onreadystatechange = function()
    {
        if(this.readyState == 4 && this.status == 200)
        {
            var x = JSON.parse(this.responseText);
            count = x.length;
            document.getElementById("imagesLeft").innerHTML = `${count} Photos`;
            x.forEach((obj) =>
            {
                document.getElementById("imageDisplay").innerHTML += `<div id = ${obj.id} class = "gallery" onclick = "fadeOut(${obj.id})">
                <img src="${obj.url}" width = "600" height="600"/>
                <div class = "desc">${obj.title}</div>
                </div>`;
            });
        }
    };
    makeCard.open("GET", "https://jsonplaceholder.typicode.com/albums/2/photos", true);
    makeCard.send();
}
function fadeOut(element) {
    var picture = document.getElementById(element);
    var op = 1;
    var timer = setInterval(function(){
        if(op <= 0.1){
            clearInterval(timer);
            picture.remove();
            count--;
            document.getElementById("imagesLeft").innerHTML = `<div>${count} Photos</div>`;
        }
        picture.style.opacity = op;
        op -= 0.1;
    }, 50);
}