
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
// page mission
const signOutBtn = document.querySelector("#sign-out")
let toDoList
const listContainer = document.querySelector("#list")
const missionTemplate = document.querySelector("#mission-template")
const addMissionBtn = document.querySelector(".btn-add-todo")

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

function updateList(arr){
    console.log("clearn list")
    listContainer.innerHTML = ""
    console.log("updating list")
    arr.forEach((item,index) => {
        // create mission card
        const clone = missionTemplate.content.cloneNode(true);
        clone.querySelector(".mission-card").id = item.id;

        clone.querySelector(".content").value = item.content;
        if(item.completed_at){
            clone.querySelector(".mission-card").classList.add("done")
            clone.querySelector(".content").classList.add("line-through")
            clone.querySelector(".content").readOnly = true
        }else{
            clone.querySelector(".state-box").classList.remove("done")
            clone.querySelector(".content").classList.remove("line-through")
            clone.querySelector(".content").readOnly = false
        }
        const deleteIcon = clone.querySelector(".icon-delete");     
        // show delete btn   
        clone.querySelector(".mission-card").addEventListener("mouseover", ()=>{
            deleteIcon.classList.remove("hidden")
        })
        clone.querySelector(".mission-card").addEventListener("mouseout", ()=>{
            deleteIcon.classList.add("hidden")
        })
        // delete mission
        deleteIcon.addEventListener('click',()=>{
            deleteMission(item.id)
        })
        // toggle mission status
        clone.querySelector(".state-box").addEventListener("click", ()=>{
            toggleMission(item.id)
        })
        // edit mission
        const contentContainer = clone.querySelector(".content")
        clone.querySelector(".content").addEventListener("keydown", event =>{
            
            if(event.key === "Enter"){
                console.log(item.id,"Enter got clicked, updating content")
                console.log(contentContainer.value)
                
                editMissioin(item.id,contentContainer.value)
            }
        })
        listContainer.appendChild(clone)
    })
}

// API interaction
// user identify
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
                "Content-Type": "application/json"
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
            window.location.href = "toDoList.html"
        }
        else{
            alert(data.message)
        }
    } catch (error) {
        console.error(error)
    }
}
async function signOutUser(){
    const token = getCookie("token")
    console.log("sign out", token)
    try {
        const response = await fetch( `${apiUrl}/users/sign_out`,{
            method:"DELETE",
            headers:{"Authorization": token}
        })
        const data = await response.json()
        if(response.ok){
            alert("登出成功")
        }else{
            alert(data.message)
        }
        window.location.href = "index.html"
    } catch (error) {
        console.error
    }
}
// todolist edit
async function getList() {
    console.log("get list")
    const token = getCookie("token")
    try {
        const response = await fetch(`${apiUrl}/todos`,{
            method:"GET",
            headers:{"Authorization": token}
        })
        const data = await response.json()
        updateList(data.todos)
        toDoList = data.todos
        console.log(toDoList)
    } catch (error) {
        console.error
    }
}
async function addMissioin(newContent) {
    console.log("add mission")
    const token = getCookie("token")
    try {
        const response = await fetch(`${apiUrl}/todos`,{
            method:"POST",
            headers:{
                "accept": "application/json", 
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                "todo": {
                    "content": newContent
                }
            })
        })
        const data = await response.json()
        console.log(data, response.ok)
        getList()
    } catch (error) {
        console.error
    }
}
async function editMissioin(id,newContent) {
    console.log("edit mission")
    const token = getCookie("token")
    try {
        const response = await fetch(`${apiUrl}/todos/${id}`,{
            method:"PUT",
            headers:{
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                "todo": {
                    "content": newContent
                }
            })
        })
        const data = await response.json()
        console.log(data, response.ok)
        getList()
    } catch (error) {
        console.error
    }
}
async function deleteMission(id) {
    console.log("delete mission")
    const token = getCookie("token")
    try{
        const response = await fetch(`${apiUrl}/todos/${id}`,{
            method:"DELETE",
            headers:{"Authorization": token}
        })
        if(response.ok){
            console.log(id,"has been deleted")
            getList()
        }
    }catch(error){
        console.error
    }
}
async function toggleMission(id) {
    console.log("toggle mission")
    const token = getCookie("token")
    try{
        const response = await fetch(`${apiUrl}/todos/${id}/toggle`,{
            method:"PATCH",
            headers:{"Authorization": token}
        })
        if(response.ok){
            console.log(id,"mission state change")
            getList()
        }
    }catch(error){
        console.error
    }
}
// page todoList
listContainer && getList()
// eventlistener
signOutBtn && signOutBtn.addEventListener("click",()=>{
    signOutUser()
})
addMissionBtn && addMissionBtn.addEventListener("click",()=>{
    console.log(document.querySelector("#new-toDo-input"))
    const content = document.querySelector("#new-toDo-input").value
    console.log("content" ,content,typeof(content))
    addMissioin(content)
})