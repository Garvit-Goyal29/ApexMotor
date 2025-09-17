const openBtn = document.querySelector(".menu");
const closeBtns = document.querySelectorAll(".close");
const phoneMenu = document.getElementById("phoneOpen");
const image = document.getElementById("image")
function openmenu() {
    phoneMenu.style.display = "flex";
    openBtn.style.display = "none";
    image.style.marginRight = "5vw";
    closeBtns.forEach(btn => {
        btn.style.display = "inline-block";
    });
}

function closemenu() {
    phoneMenu.style.display = "none";
    closeBtns.forEach(btn => {
        btn.style.display = "none";
    });
    openBtn.style.display = "inline";
    image.style.marginRight = "0vw";
}
const sign = document.querySelector("#Sign-Up");
const mainP = document.querySelector("#mainpage");
function signopen() {
    sign.style.display = "flex";
    closeBtns.forEach(btn => {
        btn.style.display = "none";
    });
}
function closeFormBtn() {
    sign.style.display = "none";
    closeBtns.forEach(btn => {
        btn.style.display = "inline-block";
    });
}

const leftb = document.querySelector('.left')
const rigthb = document.querySelector('.right')
const car1 = document.querySelector('#car1')
const car2 = document.querySelector('#car2')
const car3 = document.querySelector('#car3')
const car4 = document.querySelector('#car4')
const car5 = document.querySelector('#car5')
function rightslide() {
    if (car1.style.display === "inline-block") {
        car1.style.display = "none";
        car2.style.display = "inline-block";
    } else if (car2.style.display === "inline-block") {
        car2.style.display = "none";
        car3.style.display = "inline-block";
    } else if (car3.style.display === "inline-block") {
        car3.style.display = "none";
        car4.style.display = "inline-block";
    } else if (car4.style.display === "inline-block") {
        car4.style.display = "none";
        car5.style.display = "inline-block";
    }
}

function leftslide() {
    if (car5.style.display === "inline-block") {
        car5.style.display = "none";
        car4.style.display = "inline-block";
    } else if (car4.style.display === "inline-block") {
        car4.style.display = "none";
        car3.style.display = "inline-block";
    } else if (car3.style.display === "inline-block") {
        car3.style.display = "none";
        car2.style.display = "inline-block";
    } else if (car2.style.display === "inline-block") {
        car2.style.display = "none";
        car1.style.display = "inline-block";
    }
}
const cir1 = document.getElementById("cir1")
const cir2 = document.getElementById("cir2")
const cir3 = document.getElementById("cir3")
const cir4 = document.getElementById("cir4")
const cir5 = document.getElementById("cir5")
const car1D = document.getElementById("carD1")
const car2D = document.getElementById("carD2")
const car3D = document.getElementById("carD3")
const car4D = document.getElementById("carD4")
const car5D = document.getElementById("carD5")
function show1() {
    cir1.style.opacity = "1"
    cir2.style.opacity = "0.4"
    cir3.style.opacity = "0.4"
    cir4.style.opacity = "0.4"
    cir5.style.opacity = "0.4"
    car1D.style.display = "flex"
    car2D.style.display = "none"
    car3D.style.display = "none"
    car4D.style.display = "none"
    car5D.style.display = "none"
    revSound.currentTime = 0;
    revSound.play();
}
function show2() {
    cir1.style.opacity = "0.4"
    cir2.style.opacity = "1"
    cir3.style.opacity = "0.4"
    cir4.style.opacity = "0.4"
    cir5.style.opacity = "0.4"
    car1D.style.display = "none";
    car2D.style.display = "flex"
    car3D.style.display = "none"
    car4D.style.display = "none"
    car5D.style.display = "none"
    revSound.currentTime = 0;
    revSound.play();
}
function show3() {
    cir1.style.opacity = "0.4"
    cir2.style.opacity = "0.4"
    cir3.style.opacity = "1"
    cir4.style.opacity = "0.4"
    cir5.style.opacity = "0.4"
    car1D.style.display = "none"
    car2D.style.display = "none"
    car3D.style.display = "flex"
    car4D.style.display = "none"
    car5D.style.display = "none"
    revSound.currentTime = 0;
    revSound.play();
}
function show4() {
    cir1.style.opacity = "0.4"
    cir2.style.opacity = "0.4"
    cir3.style.opacity = "0.4"
    cir4.style.opacity = "1"
    cir5.style.opacity = "0.4"
    car1D.style.display = "none"
    car2D.style.display = "none"
    car3D.style.display = "none"
    car4D.style.display = "flex"
    car5D.style.display = "none"
    revSound.currentTime = 0;
    revSound.play();
}
function show5() {
    cir1.style.opacity = "0.4"
    cir2.style.opacity = "0.4"
    cir3.style.opacity = "0.4"
    cir4.style.opacity = "0.4"
    cir5.style.opacity = "1"
    car1D.style.display = "none"
    car2D.style.display = "none"
    car3D.style.display = "none"
    car4D.style.display = "none"
    car5D.style.display = "flex"
    revSound.currentTime = 0;
    revSound.play();
}
async function submitform(e) {
    e.preventDefault();
    const formData = {
        email: document.getElementById("deal-email").value,
        phone: document.getElementById("deal-num").value
    }
    if (!email || !phone) {
        alert("Enter both contact no. and email!");
    }
    if (phone.length != 10 || !/^\d{10}$/.test(phone))  {
        alert("Enter valid contact number");
    }
    const req = await fetch("https://apexmotor-backend.onrender.com/dealerForm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    });

    const data = await req.json()
    alert("DATA SENDED!");
}