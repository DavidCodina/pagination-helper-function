function paginate(config){
  /* ======================
       config checks
  ====================== */


  if (!config){ return console.error("You must pass a config object to paginate()."); }

  const data                = config.data;
  const pageContainer       = config.pageContainer;
  const paginationContainer = config.paginationContainer;
  const createItemComponent = config.createItemComponent;
  const itemsPerPage        = config.itemsPerPage || 10;

  if (!data){                return console.error("A data array must be assigned to config.data."); }
  if (!pageContainer){       return console.error("An HTML element must be assigned to config.pageContainer."); }
  if (!paginationContainer){ return console.error("An HTML element must be assigned to config.paginationContainer."); }
  if (!createItemComponent){ return console.error("A function for creating item components must be assigned to config.createItemComponent."); }


  /* ======================

  ====================== */


  let dataSubset       = [];
  let currentPage      = 1;
  let indexOfLastItem  = null; // Dependent on value of currentPage; Set by setFirstAndLastIndex().
  let indexOfFirstItem = null; // Dependent on value of currentPage; Set by setFirstAndLastIndex().
  let limit            = null; // Dependent on items;                Set by setLimit().
  let pageNumbers      = [];   // Dependent on limit;                Set by setPageNumbers().


  /* ======================
      Helper Functions
  ====================== */


  function setLimit(){
    limit = Math.ceil(data.length / itemsPerPage);
  }


  function setPageNumbers(){
    for (let n = 1; n <= limit; n++){ pageNumbers.push(n); }
  }


  function setFirstAndLastIndex(){
    indexOfLastItem  = currentPage     * itemsPerPage;
    indexOfFirstItem = indexOfLastItem - itemsPerPage
  }


  function createDataSubset(){
    dataSubset = data.slice(indexOfFirstItem, indexOfLastItem);
  }


  // This function creates a subset of 3 page numbers.
  // It's not the most flexible approach, but it works...
  function createPageNumbersSubset(){
    const pageNumbersSubset = [];

    if (currentPage === 1){
      if (pageNumbers[currentPage-1]){ pageNumbersSubset.push(pageNumbers[currentPage-1]);   }
      if (pageNumbers[currentPage]){   pageNumbersSubset.push(pageNumbers[currentPage]);   }
      if (pageNumbers[currentPage+1]){ pageNumbersSubset.push(pageNumbers[currentPage+1]); }
    }
    else if (currentPage >= pageNumbers.length-1){
      if (pageNumbers[pageNumbers.length-3]){ pageNumbersSubset.push(pageNumbers[pageNumbers.length-3]); }
      if (pageNumbers[pageNumbers.length-2]){ pageNumbersSubset.push(pageNumbers[pageNumbers.length-2]); }
      if (pageNumbers[pageNumbers.length-1]){ pageNumbersSubset.push(pageNumbers[pageNumbers.length-1]); }
    }
    else if (currentPage > 1){
      if (pageNumbers[currentPage-2]){ pageNumbersSubset.push(pageNumbers[currentPage-2]); }
      if (pageNumbers[currentPage-1]){ pageNumbersSubset.push(pageNumbers[currentPage-1]); }
      if (pageNumbers[currentPage]){   pageNumbersSubset.push(pageNumbers[currentPage]);   }
    }

    return pageNumbersSubset;
  }


  /* ======================
    Rendering Functions
  ====================== */


  function renderPage(){
    pageContainer.innerHTML = '';

    if (dataSubset.length > 0){ pageContainer.classList.remove('d-none'); }
    else {                      pageContainer.classList.add('d-none'); return; }

    dataSubset.forEach(item => {
      const itemComponent = createItemComponent(item);
      pageContainer.appendChild(itemComponent);
    });
  }


  function renderPagination(){
    const pageNumbersSubset       = createPageNumbersSubset();
    paginationContainer.innerHTML = '';
    paginationContainer.classList.remove('d-none');

    /* ======= prev ====== */

    const prev           = document.createElement('LI');
    prev.className       = 'page-item';
    const prevLink       = document.createElement('A');
    prevLink.className   = 'page-link px-1 prev-page-link';
    prevLink.setAttribute('href', '#pages');
    prevLink.innerHTML = `
      <svg  width="25" height="25" fill="currentColor" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/>
      </svg>
    `;

    prevLink.addEventListener('click', function(e){
      e.preventDefault();
      if (currentPage === 1) { return; }
      currentPage = currentPage - 1;
      setFirstAndLastIndex();
      createDataSubset();
      renderPage();
      renderPagination();
    });

    prev.appendChild(prevLink);
    paginationContainer.appendChild(prev);

    /* ===== numbers ===== */

    pageNumbersSubset.forEach(n => {
      const li      = document.createElement('LI');
      const a       = document.createElement('A');
      li.className  = (n === currentPage) ? 'page-item active' : 'page-item';
      a.className   = 'page-link';
      a.textContent = n;
      a.setAttribute('href', '#pages');
      a.addEventListener('click', function(e){
        e.preventDefault();
        currentPage = n;
        setFirstAndLastIndex();
        createDataSubset();
        renderPage();
        renderPagination();
      });

      li.appendChild(a);
      paginationContainer.appendChild(li);
    });

    /* ======= next ====== */

    const next           = document.createElement('LI');
    next.className       = 'page-item';
    const nextLink       = document.createElement('A');
    nextLink.className   = 'page-link px-1 next-page-link';
    nextLink.setAttribute('href', '#pages');
    nextLink.innerHTML = `
      <svg width="25" height="25" fill="currentColor" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
      </svg>
    `;

    nextLink.addEventListener('click', function(e){
      e.preventDefault();
      if (currentPage === pageNumbers.length){ return; }
      currentPage = currentPage + 1;
      setFirstAndLastIndex();
      createDataSubset();
      renderPage();
      renderPagination();
    });

    next.appendChild(nextLink);
    paginationContainer.appendChild(next);
  }


  /* ======================
       Initialization
  ====================== */


  setFirstAndLastIndex();
  createDataSubset();
  setLimit();
  setPageNumbers();
  renderPage();
  renderPagination();
} // End of paginateData(){ ... }
