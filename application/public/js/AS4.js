var pswdIn = document.getElementById("password");
var userIn = document.getElementById("username");
var pswdLowercase = document.getElementById("pswdLetter");
var pswdUppercase = document.getElementById("pswdCapital");
var pswdNumbers = document.getElementById("pswdNumber");
var pswdLength = document.getElementById("pswdLength");
var pswdSpecial = document.getElementById("pswdSpecial");
var userLength = document.getElementById("userlength");
var userLetters = document.getElementById("userletter");
var userNumbers = document.getElementById("usernumber");
pswdIn.onfocus = function() {
    document.getElementById("pswdMessage").style.display = "block";
}
userIn.onfocus = function() {
    document.getElementById("userMessage").style.display = "block";
}

// When the user clicks outside of the password field, hide the message box
pswdIn.onblur = function() {
    document.getElementById("pswdMessage").style.display = "none";
}
userIn.onblur = function() {
    document.getElementById("userMessage").style.display = "none";
}

// When the user starts to type something inside the password field
pswdIn.onkeyup = function() {
    // Validate lowercase letters
    var lowerCaseLetters = /[a-z]/g;
    if(pswdIn.value.match(lowerCaseLetters)) {
        pswdLowercase.classList.remove("invalid");
        pswdLowercase.classList.add("valid");
    } else {
        pswdLowercase.classList.remove("valid");
        pswdLowercase.classList.add("invalid");
    }

    // Validate capital letters
    var upperCaseLetters = /[A-Z]/g;
    if(pswdIn.value.match(upperCaseLetters)) {
        pswdUppercase.classList.remove("invalid");
        pswdUppercase.classList.add("valid");
    } else {
        pswdUppercase.classList.remove("valid");
        pswdUppercase.classList.add("invalid");
    }

    // Validate numbers
    var numbers = /[0-9]/g;
    if(pswdIn.value.match(numbers)) {
        pswdNumbers.classList.remove("invalid");
        pswdNumbers.classList.add("valid");
    } else {
        pswdNumbers.classList.remove("valid");
        pswdNumbers.classList.add("invalid");
    }
    var specialChar = /[[/*-+!@#$^&*]/g;
    if(pswdIn.value.match(specialChar)) {
        pswdSpecial.classList.remove("invalid");
        pswdSpecial.classList.add("valid");
    } else {
        pswdSpecial.classList.remove("valid");
        pswdSpecial.classList.add("invalid");
    }
    // Validate length
    if(pswdIn.value.length >= 8) {
        pswdLength.classList.remove("invalid");
        pswdLength.classList.add("valid");
    }
}
userIn.onkeyup = function() {
    // Validate lowercase letters
    var letters = /[a-zA-Z]/g;
    if(userIn.value.match(letters)) {
        userLetters.classList.remove("invalid");
        userLetters.classList.add("valid");
    } else {
        userLetters.classList.remove("valid");
        userLetters.classList.add("invalid");
    }

    // Validate numbers
    var num = /[0-9]/g;
    if(userIn.value.match(num)) {
        userNumbers.classList.remove("invalid");
        userNumbers.classList.add("valid");
    }else {
        userNumbers.classList.remove("valid");
        userNumbers.classList.add("invalid");
    }
    // Validate length
    if(userIn.value.length >= 3) {
        userLength.classList.remove("invalid");
        userLength.classList.add("valid");
    }
}
var submitButton = document.getElementById("submission");
submitButton.onsubmit = function(){
    var num = /[0-9]/g;
    if(userIn.value.charAt(0).match(num)) {
        alert("you cannot start your username with a number")
    }

}
function setFlashMessageFadeOut(){
    setTimeout(() => {
        let currentOpacity = 1.0;
        let timer = setInterval(() =>{
            if(currentOpacity < 0.05){
                clearInterval(timer);
                flashElement.remove();
            }
            currentOpacity = currentOpacity - 0.5;
            flashElement.style.opacity = currentOpacity;
        }, 50);
    },4000);
}
let flashElement = document.getElementById('flash-message');
if(flashElement){
    setFlashMessageFadeOut();
}