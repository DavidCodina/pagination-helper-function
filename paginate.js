function paginate(config){
  /* ======================
       config checks
  ====================== */


  if (!config){ return console.error("A config object must be passed to paginate()."); }

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
  let indexOfLastItem  = null; // Dependent on value of currentPage;       Set by setFirstAndLastIndex().
  let indexOfFirstItem = null; // Dependent on value of currentPage;       Set by setFirstAndLastIndex().
  let pageNumbers      = [];   // Dependent on data.length & itemsPerPage; Set by setPageNumbers().


  /* ======================
      Helper Functions
  ====================== */


  function setPageNumbers(){
    const lastPage = Math.ceil(data.length / itemsPerPage);
    for (let n = 1; n <= lastPage; n++){ pageNumbers.push(n); }
  }


  function setFirstAndLastIndex(){
    indexOfLastItem  = currentPage     * itemsPerPage;
    indexOfFirstItem = indexOfLastItem - itemsPerPage
  }


  function createDataSubset(){
    dataSubset = data.slice(indexOfFirstItem, indexOfLastItem);
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  // This function creates a subset of 3 page numbers.
  //
  //
  // function createPageNumbersSubset(){
  //   const pageNumbersSubset = [];
  //
  //   if (currentPage === 1){
  //     if (pageNumbers[currentPage-1]){ pageNumbersSubset.push(pageNumbers[currentPage-1]);   }
  //     if (pageNumbers[currentPage]){   pageNumbersSubset.push(pageNumbers[currentPage]);   }
  //     if (pageNumbers[currentPage+1]){ pageNumbersSubset.push(pageNumbers[currentPage+1]); }
  //   }
  //   else if (currentPage >= pageNumbers.length-1){
  //     if (pageNumbers[pageNumbers.length-3]){ pageNumbersSubset.push(pageNumbers[pageNumbers.length-3]); }
  //     if (pageNumbers[pageNumbers.length-2]){ pageNumbersSubset.push(pageNumbers[pageNumbers.length-2]); }
  //     if (pageNumbers[pageNumbers.length-1]){ pageNumbersSubset.push(pageNumbers[pageNumbers.length-1]); }
  //   }
  //   else if (currentPage > 1){
  //     if (pageNumbers[currentPage-2]){ pageNumbersSubset.push(pageNumbers[currentPage-2]); }
  //     if (pageNumbers[currentPage-1]){ pageNumbersSubset.push(pageNumbers[currentPage-1]); }
  //     if (pageNumbers[currentPage]){   pageNumbersSubset.push(pageNumbers[currentPage]);   }
  //   }
  //
  //   return pageNumbersSubset;
  // }
  //
  //////////////////////////////////////////////////////////////////////////////


  // This function creates a subset of 5 page numbers.
  // It's not the most flexible approach, but it works...
  function createPageNumbersSubset(){
    const pageNumbersSubset = [];

    if (currentPage <= 3){
      if (pageNumbers[0]){ pageNumbersSubset.push(pageNumbers[0]); }
      if (pageNumbers[1]){ pageNumbersSubset.push(pageNumbers[1]); }
      if (pageNumbers[2]){ pageNumbersSubset.push(pageNumbers[2]); }
      if (pageNumbers[3]){ pageNumbersSubset.push(pageNumbers[3]); }
      if (pageNumbers[4]){ pageNumbersSubset.push(pageNumbers[4]); }
    }
    else if (currentPage >= pageNumbers.length-2){ //?
      if (pageNumbers[pageNumbers.length-5]){ pageNumbersSubset.push(pageNumbers[pageNumbers.length-5]); }
      if (pageNumbers[pageNumbers.length-4]){ pageNumbersSubset.push(pageNumbers[pageNumbers.length-4]); }
      if (pageNumbers[pageNumbers.length-3]){ pageNumbersSubset.push(pageNumbers[pageNumbers.length-3]); }
      if (pageNumbers[pageNumbers.length-2]){ pageNumbersSubset.push(pageNumbers[pageNumbers.length-2]); }
      if (pageNumbers[pageNumbers.length-1]){ pageNumbersSubset.push(pageNumbers[pageNumbers.length-1]); }
    }
    else if (currentPage > 3){
      if (pageNumbers[currentPage-3]){ pageNumbersSubset.push(pageNumbers[currentPage-3]);   }
      if (pageNumbers[currentPage-2]){ pageNumbersSubset.push(pageNumbers[currentPage-2]);   }
      if (pageNumbers[currentPage-1]){ pageNumbersSubset.push(pageNumbers[currentPage-1]);   }
      if (pageNumbers[currentPage]){   pageNumbersSubset.push(pageNumbers[currentPage]);     }
      if (pageNumbers[currentPage+1]){   pageNumbersSubset.push(pageNumbers[currentPage+1]); }
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

    /* ==== firstLink ==== */

    const first        = document.createElement('LI');
    first.className     = 'page-item';
    // No need to use an 'A' if you're not actually paginating to a new URL.*
    // However, *Link identifiers are still used to be
    // consistent with Bootstrap's .page-link class.
    const firstLink     = document.createElement('SPAN'); // *
    firstLink.className = 'page-link px-1 first-page-link';
    firstLink.innerHTML = `
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 512 512">
        <path fill="currentColor" d="M223.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L319.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L393.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34zm-192 34l136 136c9.4 9.4 24.6 9.4 33.9 0l22.6-22.6c9.4-9.4 9.4-24.6 0-33.9L127.9 256l96.4-96.4c9.4-9.4 9.4-24.6 0-33.9L201.7 103c-9.4-9.4-24.6-9.4-33.9 0l-136 136c-9.5 9.4-9.5 24.6-.1 34z"></path>
      </svg>
    `;

    firstLink.addEventListener('click', function(e){
      e.preventDefault();
      if (currentPage === 1) { return; }
      currentPage = 1;
      setFirstAndLastIndex();
      createDataSubset();
      renderPage();
      renderPagination();
    });

    first.appendChild(firstLink);
    paginationContainer.appendChild(first);

    /* ===== prevLink ==== */

    const prev         = document.createElement('LI');
    prev.className     = 'page-item';
    const prevLink     = document.createElement('SPAN'); // *
    prevLink.className = 'page-link px-1 prev-page-link';
    prevLink.innerHTML = `
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 256 512">
        <path fill="currentColor" d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"></path>
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

    /* ===== pageLink ==== */

    pageNumbersSubset.forEach(n => {
      const li             = document.createElement('LI');
      const pageLink       = document.createElement('SPAN'); // *
      li.className         = (n === currentPage) ? 'page-item active' : 'page-item';
      pageLink.className   = 'page-link user-select-none';
      pageLink.textContent = n;
      pageLink.addEventListener('click', function(e){
        e.preventDefault();
        currentPage = n;
        setFirstAndLastIndex();
        createDataSubset();
        renderPage();
        renderPagination();
      });

      li.appendChild(pageLink);
      paginationContainer.appendChild(li);
    });

    /* ==== nextLink ===== */

    const next         = document.createElement('LI');
    next.className     = 'page-item';
    const nextLink     = document.createElement('SPAN'); // *
    nextLink.className = 'page-link px-1 next-page-link';
    nextLink.innerHTML = `
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 256 512">
        <path fill="currentColor" d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path>
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

    /* ==== lastLink ===== */

    const last         = document.createElement('LI');
    last.className     = 'page-item';
    const lastLink     = document.createElement('SPAN'); // *
    lastLink.className = 'page-link px-1 last-page-link';
    lastLink.innerHTML = `
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 512 512">
        <path fill="currentColor" d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34zm192-34l-136-136c-9.4-9.4-24.6-9.4-33.9 0l-22.6 22.6c-9.4 9.4-9.4 24.6 0 33.9l96.4 96.4-96.4 96.4c-9.4 9.4-9.4 24.6 0 33.9l22.6 22.6c9.4 9.4 24.6 9.4 33.9 0l136-136c9.4-9.2 9.4-24.4 0-33.8z"></path>
      </svg>
    `;

    lastLink.addEventListener('click', function(e){
      e.preventDefault();
      if (currentPage === pageNumbers.length){ return; }
      currentPage = pageNumbers.length;
      setFirstAndLastIndex();
      createDataSubset();
      renderPage();
      renderPagination();
    });

    last.appendChild(lastLink);
    paginationContainer.appendChild(last);
  }


  /* ======================
       Initialization
  ====================== */


  setFirstAndLastIndex();
  createDataSubset();
  setPageNumbers();
  renderPage();
  renderPagination();
} // End of paginateData(){ ... }
