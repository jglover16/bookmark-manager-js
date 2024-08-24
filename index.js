//instead of installing on our own system like in the firebaselesson, we are using CDN
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDjGOL7jOl8QpKM6AYu5_-K-uvVKR_RfSs",
    authDomain: "bookmark-9ec5c.firebaseapp.com",
    projectId: "bookmark-9ec5c",
    storageBucket: "bookmark-9ec5c.appspot.com",
    messagingSenderId: "200442344318",
    appId: "1:200442344318:web:c11a1c88786647ea37b92f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const colRef = collection(db, "bookmarks");

function deleteEvent(){
    const deleteButtons = document.querySelectorAll("i.delete");
    deleteButtons.forEach(button => {
        button.addEventListener("click", event => {
            const deleteRef = doc(db, "bookmarks", button.dataset.id);
            deleteDoc(deleteRef)
            .then(() => {
                button.parentElement.parentElement.parentElement.remove();  
            })
        })
    })
};


//card template
function generateTemplate(response, id){
    return `<div class="card">
                 <p class="title">${response.title}</p>
                    <div class="sub-information">
                         <p>
                            <span class="category ${response.category}">${response.category[0].toUpperCase()}${response.category.slice(1)}</span>
                        </p>
                        <a href="${response.link}" target="_blank"><i class="bi bi-box-arrow-up-right website"></i></a>
                        <a href="https://www.google.com/search?q=${response.title}" target="_blank"><i class="bi bi-google search"></i></a>
                        <span><i class="bi bi-trash delete" data-id="${id}"></i></span>
                     </div>
            </div>`;
            
}

//show card shows all the items
const cards = document.querySelector(".cards");
const orderedRef = query(colRef, orderBy("createdAt", "desc")); // order cards as new to old
function showCard(){
    cards.innerHTML = ""; // empty cards then add the new 
    getDocs(orderedRef)
    .then(data => {
        data.docs.forEach(document => {
            cards.innerHTML += generateTemplate(document.data(), document.id);
        })
        deleteEvent(); //after card is loaded then attach the delete listener
    })
    .catch(error => {
        console.log(error);
    });
}
showCard();

//add data to database
function addToDB(){
    const addForm = document.querySelector(".add");
    addForm.addEventListener("submit", event => {
        event.preventDefault();
    
        addDoc(colRef, {
            link: addForm.link.value,
            title: addForm.title.value,
            category: addForm.category.value,
            createdAt: serverTimestamp()
        })
        .then(() => {
            addForm.reset();
            showCard();
        })
    });
}
addToDB();

//filter cards based on query reference where the category passed == "category"
function filteredCards(category){
    if(category === "All"){
        showCard();
    } else {
        const qRef = query(colRef, where("category", "==", category.toLowerCase()));
        cards.innerHTML = "";
        getDocs(qRef)
        .then(data => {
            data.docs.forEach(document => {
                cards.innerHTML += generateTemplate(document.data(), document.id);
            })
        })
        .catch(error => {
            console.log(error);
        });
    }
}

//filtered list based on click
const categoryList = document.querySelector(".category-list");
const categorySpan = document.querySelectorAll(".category-list span");
categoryList.addEventListener("click", event => {
    if(event.target.tagName === "SPAN"){
        filteredCards(event.target.innerText);
        categorySpan.forEach(span => span.classList.remove("active"));
        event.target.classList.add("active");
    }
})