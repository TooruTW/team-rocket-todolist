
// elements
const apiUrl = "https://todoo.5xcamp.us"
// page login
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
    isConfirmed ? registerUser(email,nickname,password):alert("password not match");
}
function getLoginInfo(){
    const email = document.querySelector("#email").value
    const password = document.querySelector("#password").value
    loginUser(email,password)
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
registerBtn && registerBtn.addEventListener("click",event=>{
    event.preventDefault()  // 防止表單提交導致重新整理
    registerInput.classList.contains("hidden") ? switchInputForm():getResgisterInfo();

})
loginBtn && loginBtn.addEventListener("click",event=>{
    event.preventDefault()  // 防止表單提交導致重新整理
    loginInput.classList.contains("hidden") ? switchInputForm():getLoginInfo();
    
})

// create cookie 
// expire time
function getExpireTime(min){
    const now = new Date()
    const expireTime = new Date(now.getTime() + min*60*1000)
    console.log(expireTime)
    return expireTime
}
// set cookie
function setCookie(name,value,expireMin){
    document.cookie = `${name}=${value};expires=${getExpireTime(expireMin)};path=/`
    console.log("set Cookie")
}
// get cookie
function getCookie(name){
    console.log("getCookie")
    const cookie = document.cookie
    const cookieArr = cookie.split(";")
    console.log(cookieArr)
    for(let cookie of cookieArr){
        if(cookie.includes(name)){
            const resultValue = cookie.split("=")[1]
            return resultValue
        }else{
            return null
        }
    }
}
// API interaction
async function registerUser(email,nickname,password){
    console.log("start register",email,nickname,password)
    try{
        const response = await fetch(`${apiUrl}/users`,{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify({
                "user": {
                    "email": email,
                    "nickname": nickname,
                    "password": password
                  }
            })
        })
        const data = await response.json()
        if(response.ok){
            alert("註冊成功")
            switchInputForm()
        }else{
            alert(data.error)
        }
        console.log(data,data.error,data.message,response.ok)
    }
    catch(err){
        console.error(err)
    }
}
async function loginUser(email,password){
    console.log("start login",email,password)
    try {
        const response = await fetch(`${apiUrl}/users/sign_in`,{
            method:"POST",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "user": {
                    "email": email,
                    "password": password
                  }
            })
        })
        const data = await response.json()
        if(response.ok){
            alert("登入成功")
            const token = response.headers.get("Authorization")
            setCookie("token",token,10)
            console.log(getCookie(token))
            window.location.href = "toDoList.html"
        }
        else{
            alert(data.message)
        }
    } catch (error) {
        console.error(error)
    }
}

// page todoList