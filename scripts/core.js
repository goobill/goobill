const search = function (
    searchValue
) {
    window.open(`results.html?q=${searchValue}`, "_self");
}

const addSearchButtonListener = function (
    searchBarButtonDOM, searchBarInputDOM
) {
    const pointerDownHandler = function (e) {
        e.preventDefault();
        
        const searchValue = searchBarInputDOM.value

        search(searchValue)
    };

    searchBarButtonDOM.addEventListener('mousedown', pointerDownHandler, { passive: false });
    searchBarButtonDOM.addEventListener('touchstart', pointerDownHandler, { passive: false });
};

const addSearchInputListener = function (
    searchBarInputDOM
) {
    const pointerDownHandler = function (e) {
        if (e.key === 'Enter') { 
            const searchValue = searchBarInputDOM.value
    
            search(searchValue)
        }
    };

    searchBarInputDOM.addEventListener('keydown', pointerDownHandler, { passive: false });
};

const app = function () {
    // Add Search Listeners

    const searchBarButton1DOM = document.getElementById("search-bar-button-1");
    const searchBarButton2DOM = document.getElementById("search-bar-button-2");
    const searchBarInputDOM = document.getElementById("search-bar-input");

    addSearchButtonListener(searchBarButton1DOM, searchBarInputDOM)
    addSearchButtonListener(searchBarButton2DOM, searchBarInputDOM)
    addSearchInputListener(searchBarInputDOM)
};

document.addEventListener('DOMContentLoaded', app);