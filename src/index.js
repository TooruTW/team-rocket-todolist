// elements
const registerBtn = document.querySelector("#btn-sign-up")
const loginBtn = document.querySelector("#btn-log-in")
const getStartBtn = document.querySelector(".mainpage-btns")
const loginInput = document.querySelector("#input-log-in")
const registerInput = document.querySelector("#input-sign-up")
const loginFormArr = document.querySelectorAll(".login-form")
const registerFormArr = document.querySelectorAll(".register-form")

// functions render register state
function getResgisterInfo(){
    const email = document.querySelector("#email-register").value
    const nickname = document.querySelector("#nickname-register").value
    const password = document.querySelector("#password-register").value
    const isConfirmed = document.querySelector("#password-confirm").value === password ? true : false;

    console.log(email,nickname,password,isConfirmed)
}

function switchInputForm(){
    loginInput.classList.toggle("hidden")
    registerInput.classList.toggle("hidden")
    getStartBtn.classList.toggle("reverse")
    registerFormArr.forEach(itme =>{
        itme.toggleAttribute("required")
    })
    loginFormArr.forEach(itme =>{
        itme.toggleAttribute("required")
    })
}

registerBtn.addEventListener("click",()=>{
    getResgisterInfo()
    registerInput.classList.contains("hidden") && switchInputForm()
})
loginBtn.addEventListener("click",()=>{
    loginInput.classList.contains("hidden") && switchInputForm()
})

// API interaction
const apiUrl = "https://todoo.5xcamp.us/"
async function registerUser(emain,nickname,password){
    try{
        const response = await fetch(`${apiUrl}/users`,{
            method:"POST",
            body: JSON.stringify({
                "user": {
                    "email": emain,
                    "nickname": nickname,
                    "password": password
                  }
            })
        })
        console.log(response)
        const data = await response.json()
        const token = data.token
    }
    catch(err){
        console.error(err)
    }
}