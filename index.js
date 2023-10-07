addEventListener("DOMContentLoaded", (event) => {
  // ------------------------ Creating searchbar elements ------------------------ //

  let searchContainer = document.createElement("ul");
  searchContainer.classList.add("search");
  document.body.append(searchContainer);

  let searchFragment = new DocumentFragment();

  let searchBarLabel = document.createElement("label");
  searchBarLabel.classList.add("search__label");
  searchBarLabel.for = "search-bar";
  searchBarLabel.textContent = "Search repositories";
  searchFragment.append(searchBarLabel);

  let searchBar = document.createElement("input");
  searchBar.type = "search";
  searchBar.id = "search-bar";
  searchBar.classList.add("search__bar");
  searchFragment.append(searchBar);

  for (let i = 0; i < 5; i++) {
    let searchBarElement = document.createElement("li");
    searchBarElement.classList.add("search__element");
    searchBarElement.addEventListener("click", addRepo);
    searchFragment.append(searchBarElement);
  }

  searchContainer.append(searchFragment);

  let addedSearchResults = document.createElement("div");
  addedSearchResults.classList.add("results");
  document.body.append(addedSearchResults);

  // ------------------ Adding debounced event listener to searchbar ------------------ //

  const debounce = (fn, debounceTime) => {
    let timer = null;
    return function () {
      console.log("Debounced fn called");
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      timer = setTimeout(() => {
        fn.apply(this, arguments);
      }, debounceTime);
    };
  };

  function searchEvent(e) {
    if (e === undefined || e.target.value === "") {
      let searchElements = document.querySelectorAll(".search__element");
      searchElements.forEach((elem, ind) => {
        elem.style.display = "none";
      });
    } else
      sendRequest(e.target.value).then((result) => {
        let searchElements = document.querySelectorAll(".search__element");
        if (result.items !== undefined)
          searchElements.forEach((elem, ind) => {
            if (result.items[ind] !== undefined) {
              elem.content = result.items[ind];
              elem.textContent = elem.content.name;
              elem.style.display = "flex";
            } else {
              elem.style.display = "none";
            }
          });
      });
  }

  let debouncedSearchEvent = debounce(searchEvent, 600);

  searchBar.addEventListener("input", debouncedSearchEvent);

  async function sendRequest(searchContent) {
    let url = new URL("https://api.github.com/search/repositories");
    url.searchParams.set("q", searchContent);
    const response = await fetch(url);
    const returnResponse = await response.json();
    console.log(returnResponse);
    return returnResponse;
  }

  // ------------------------- Adding selected repositories ------------------------- //

  function addRepo(event) {
    let addedResult = document.createElement("div");
    addedResult.classList.add("results__element");
    let resultText = document.createElement("div");
    addedResult.append(resultText);
    let deleteButton = document.createElement("button");
    let closeIcon = document.createElement("img");
    closeIcon.src = "./img/close-icon.svg";
    deleteButton.append(closeIcon);

    addedResult.addEventListener("click", (e) => {
      if (e.target === deleteButton || e.target === closeIcon) {
        addedResult.remove();
      }
    });

    addedResult.append(deleteButton);
    resultText.innerHTML = `
    Name: ${event.target.content.name} <br>
    Owner: ${event.target.content.owner.login} <br>
    Stars: ${event.target.content.stargazers_count}
    `;
    addedResult.style.cssText = `
      display: flex;
      align-items: center;
      min-height: 100px;
      width: 400px;
      border: 3px solid black;
      border-radius: 20px;
      margin: 7px;
    `;
    deleteButton.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50px;
      height: 50px;
      border: none;
      background-color: white;
      margin-inline: auto;
      padding: 0;
      cursor: pointer;
    `;
    closeIcon.style.cssText = `
      width: 50px;
      margin: 0;
    `;
    resultText.style.cssText = `
      width: 80%;
      font-family: impact;
      font-size: 20px;
      line-height: 170%;
      padding-left: 10px;
    `;
    addedSearchResults.append(addedResult);
    searchBar.value = "";
    searchEvent();
  }

  // ----------------------------- Styling other elements ----------------------------- //

  searchContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 320px;
    margin-inline: auto;
    padding: 0;
  `;

  searchBarLabel.style.cssText = `
    font-size: 24px;
  `;

  searchBar.style.cssText = `
    width: 320px;
    height: 50px;
    border: 1px solid black;
    border-radius: 5px;
    margin: 2px;
    cursor: pointer;
    font-size: 24px;
  `;

  let allSearchElements = document.querySelectorAll(".search__element");
  allSearchElements.forEach((elem) => {
    elem.style.cssText = `
      display: none;
      width: 300px;
      min-height: 40px;
      height: auto;
      font-size: 20px;
      border: 1px solid black;
      border-radius: 5px;
      margin: 2px;
      padding: 3px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: transform .5s;
    `;
  });

  addedSearchResults.style.cssText = `
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  `;
});
