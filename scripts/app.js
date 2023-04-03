import { findElement } from "./util/findElement.js";

const elCards = document.querySelector(".cards");
const elMarks = document.querySelector("#marks");
const elModal = document.querySelector(".modal__flex");
const closeModal = document.querySelector("#closeModal");
const elSearch = document.querySelector(".header__form");
const elOposity = document.querySelector(".opasity");

const token = localStorage.getItem("token");

const logoutBtn = findElement("#logout");
if (!token) {
  window.location.href = "../login.html";
}

if (token) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");

    logoutBtn.textContent = "login";
    window.location.href = "../login.html";
  });
}

let bookProduct = [];

// fetch

fetch("https://www.googleapis.com/books/v1/volumes?q=a")
  .then((response) => response.json())
  .then((data) => {
    bookProduct = data.items;

    console.log(bookProduct);
    renderUI(bookProduct);
    renderMarks(bookProduct);
    renderDeleteMarks(bookProduct);
    renderModal(bookProduct);
  });

//   render UI

function renderUI(array) {
  array.forEach((item) => {
    const square = document.createElement("div");
    square.setAttribute("class", "wrapper");

    square.innerHTML = `
      <div class="wrapper__img">
        <img src="${item.volumeInfo.imageLinks.thumbnail}" alt="${
      item.volumeInfo.title
    }">
      </div>
      <div class="wrapper__title">
        <h3 title="${item.volumeInfo.title}" >${item.volumeInfo.title.slice(
      0,
      18
    )}...</h3>
        <p title="${item.volumeInfo.authors}" >${item.volumeInfo.authors[
      length
    ].slice(0, 16)}</p>
        <p>${item.volumeInfo.publishedDate}</p>
      </div>
      <div class="wrapper__btns">
        <button class="mark" data-id="${item.id}">Bookmark</button>
        <button class="info" data-id="${item.id}" >More Info</button>
      </div>
      <a href="${
        item.volumeInfo.previewLink
      }" target="_blank" class="wrapper_btn" >Read</a>
    `;

    elCards.append(square);
  });
}

// search code

elSearch.addEventListener("keyup", (evt) => {
  evt.preventDefault();
  let value;

  if (elSearch.value != " ") {
    value = evt.target.value;

    let nameVal = bookProduct.filter((item) => {
      return item.volumeInfo.title.includes(value);
    });
    console.log(nameVal);

    elCards.innerHTML = " ";

    renderUI(nameVal);
  } else {
    renderUI(bookProduct);
  }
});

// render marks

function renderMarks(array) {
  elCards.addEventListener("click", function (e) {
    if (e.target.classList.contains("mark")) {
      const markBtn = e.target.closest(".mark");
      const bookId = markBtn.getAttribute("data-id");
      const data = array.filter((item) => item.id == bookId);

      data.forEach((item) => {
        const markDiv = document.createElement("div");
        markDiv.setAttribute("class", "aside__card");

        markDiv.innerHTML = `
            <div class="card__mark">
            <h3> ${item.volumeInfo.title.slice(0, 10)} </h3>
            <p> ${item.volumeInfo.authors[length].slice(0, 14)} </p>
            </div>
            <div class="card__wrapper">
            <a class="read" href="#"><img src="./img/open.svg" alt="Read"></a>
            <button class="delete" href="#" data-id="${item.id}">Del</button>
            </div>
        `;

        elMarks.append(markDiv);
      });
    }
  });
}

// delete function

function renderDeleteMarks(array) {
  const deleteItem = (id) => {
    const index = array.findIndex((item) => item.id === id);
    if (index !== -1) {
      array.slice(index, 1);
      elMarks.children[index].remove();
    }
  };

  elMarks.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete")) {
      const deleteBtn = e.target.closest(".delete");
      const itemId = deleteBtn.getAttribute("data-id");
      console.log(itemId);
      deleteItem(itemId);
    }
  });
}

// modal code

function renderModal(array) {
  elCards.addEventListener("click", function (e) {
    if (e.target.classList.contains("info")) {
      const modalBtn = e.target.closest(".info");
      const bookId = modalBtn.getAttribute("data-id");
      const data = array.filter((item) => item.id == bookId);
      elModal.style.display = "block";

      data.forEach((item) => {
        const modalDiv = document.createElement("div");
        modalDiv.setAttribute("class", "modal__section");

        modalDiv.innerHTML = `
            <div class="modal__title">
                <h2>${item.volumeInfo.title.slice(0, 18)}...</h2>
                <button id="closeModal" >Close</button>
            </div>
            <div class="modal__content">
                <img src="${item.volumeInfo.imageLinks.thumbnail}" alt="">
    
                <p> ${item.volumeInfo.description} </p>
    
                <ul class="modal__wrapper">
                    <li class="wrapper__titles">Author : <span class="wrapper__span">${item.volumeInfo.authors[
                      length
                    ].slice(
                      0,
                      16
                    )}</span> <span class="wrapper__span">Author 2</span></li>
                    <li class="wrapper__titles">Published : <span class="wrapper__span">${
                      item.volumeInfo.publishedDate
                    }</span> </li>
                    <li class="wrapper__titles">Publishers : <span class="wrapper__span">${
                      item.volumeInfo.publisher
                    }</span> </li>
                    <li class="wrapper__titles">Categories : <span class="wrapper__span">${
                      item.volumeInfo.categories
                    }</span> </li>
                    <li class="wrapper__titles">Pages Count : <span class="wrapper__span">${
                      item.volumeInfo.pageCount
                    }</span> </li>
                </ul>
            </div>
        `;

        const closeModal = modalDiv.querySelector("#closeModal");

        closeModal.addEventListener("click", (e) => {
          e.preventDefault();
          elModal.style.display = "none";
        });

        elModal.append(modalDiv);
      });
    }
  });

  elOposity.addEventListener("click", (e) => {
    elModal.style.display = "none";
  });
}

// elCards.addEventListener("click", (e) => {
//   if (e.target.matches(".info")) {
//     elModal.style.display = "block";
//   }
// });

// closeModal.addEventListener("click", (e) => {
//   elModal.style.display = "none";
// });

// -----------------------------------------------------------------------------------------------------------------
