const queryResults = function (
    resultsMatrix, searchValue
) {
    const searchRegex = new RegExp(searchValue, "i")
    return resultsMatrix.filter(
        result => searchRegex.test(result.title) ||
            searchRegex.test(result.description) ||
            result.category.some(category => searchRegex.test(category)) ||
            result.tags.some(tag => searchRegex.test(tag))
    )
}

const search = function (
    searchValue
) {
    window.open(`?q=${searchValue}`, "_self");
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

const addPaginationListener = function (pageDOM, urlParams) {
    const pageNumber = pageDOM.getAttribute("page") || 1
    const pointerDownHandler = function (e) {
        e.preventDefault();

        urlParams.set("p", pageNumber);
        window.open(`?${urlParams}`, "_self");
    };

    pageDOM.addEventListener('mousedown', pointerDownHandler, { passive: false });
    pageDOM.addEventListener('touchstart', pointerDownHandler, { passive: false });
}

const renderMetrics = function (resultsDOM, resultsTotal) {
    metricsDOM = document.createElement('div');
    metricsDOM.setAttribute("class", "results-metrics");
    resultsDOM.appendChild(metricsDOM)

    const content = `About ${resultsTotal} results (${Math.random().toFixed(2)} seconds)`
    metricsDOM.textContent = content
}

const renderEmptyResult = function (resultsDOM) {
    marqueDOM = document.createElement('marquee');
    marqueDOM.setAttribute("class", "results-empty");
    marqueDOM.setAttribute("direction", "down");
    marqueDOM.setAttribute("behavior", "alternate");
    innerDOM = document.createElement('marquee');
    innerDOM.setAttribute("behavior", "alternate");
    innerDOM.textContent = "nothing here mate";
    marqueDOM.appendChild(innerDOM);
    resultsDOM.appendChild(marqueDOM);
}

const renderResult = function (resultsDOM, result) {
    const title = result["title"]
    const path = result["path"]
    const url = result["url"]
    const description = result["description"]
    const tags = result["tags"]

    resultDOM = document.createElement('div');
    resultDOM.setAttribute("class", "result");
    resultsDOM.appendChild(resultDOM);

    linkDOM = document.createElement('a');
    linkDOM.setAttribute("class", "result-link");
    linkDOM.setAttribute("href", path);
    linkDOM.textContent = title;
    resultDOM.appendChild(linkDOM);

    urlDOM = document.createElement('div');
    urlDOM.setAttribute("class", "result-url");
    urlDOM.textContent = url;
    resultDOM.appendChild(urlDOM);

    descDOM = document.createElement('div');
    descDOM.setAttribute("class", "result-desc");
    descDOM.textContent = description;
    resultDOM.appendChild(descDOM);

    tagsDOM = document.createElement('div');
    tagsDOM.setAttribute("class", "result-tags");
    resultDOM.appendChild(tagsDOM);

    const lastIdx = tags.length > 0 ? tags.length - 1 : 0
    tags.forEach((tag, idx) => {
        tagDOM = document.createElement('a');
        tagDOM.setAttribute("href", `?q=${tag}`);
        tagDOM.textContent = tag;
        tagsDOM.appendChild(tagDOM);

        if (idx === lastIdx) {
            if (result["datetime"]) {
                dashDOM = document.createElement('a');
                dashDOM.textContent = " - ";
                tagsDOM.appendChild(dashDOM);

                const datetime_value = result["datetime"]["value"]
                const datetime_label = result["datetime"]["label"]

                dateDOM = document.createElement('time');
                dateDOM.setAttribute("class", "result-date");
                dateDOM.setAttribute("datetime", datetime_value);
                dateDOM.textContent = datetime_label;
                tagsDOM.appendChild(dateDOM);
            }
        } else {
            dashDOM = document.createElement('a');
            dashDOM.textContent = " - ";
            tagsDOM.appendChild(dashDOM);
        }
    })
 
    
}

const app = function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const pageNumber = (urlParams.get('p') || 1) - 1
    const query = urlParams.get('q')

    // Add Search Listeners

    const searchBarButtonDOM = document.getElementById("search-bar-button");
    const searchBarInputDOM = document.getElementById("search-bar-input");

    addSearchButtonListener(searchBarButtonDOM, searchBarInputDOM)
    addSearchInputListener(searchBarInputDOM)

    // Add Pagination Listener

    document.querySelectorAll('.pagination-button').forEach(ele => addPaginationListener(ele, urlParams));

    // Set Search Query

    document.getElementById('search-bar-input').value = query

    // Results

    const dataResultsDOM = document.getElementById('data-results')
    let resultsMatrix = dataResultsDOM ? JSON.parse(dataResultsDOM.textContent) : [];
    if (query) {
        resultsMatrix = queryResults(resultsMatrix, query)
    }

    // Render results

    const resultsDOM = document.getElementById("results");

    renderMetrics(resultsDOM, resultsMatrix.length)

    const results = [];
    const chunks = 7
    for (let i = 0; i < resultsMatrix.length; i += chunks) {
        results.push(resultsMatrix.slice(i, i + chunks));
    }
    const pageResults = pageNumber < results.length ? results[pageNumber] : []
    
    if (pageResults.length > 0) {
        pageResults.forEach(result => renderResult(resultsDOM, result));
    } else {
        renderEmptyResult(resultsDOM)
    }
};

document.addEventListener('DOMContentLoaded', app);