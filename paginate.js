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


  function updatePagination(){
    const pageButtons = paginationContainer.querySelectorAll('LI');

    for (let i = 0; i < pageButtons.length; i++){
      const pageButton = pageButtons[i];
      if (pageButton.classList.contains('active')){
        pageButton.classList.remove('active');
      } else if (i === currentPage - 1){
        pageButton.classList.add('active');
      }
    }
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
    paginationContainer.innerHTML = '';
    paginationContainer.classList.remove('d-none');

    pageNumbers.forEach(n => {
      const li      = document.createElement('LI');
      const a       = document.createElement('A');
      li.className  = (n === 1) ? 'page-item active' : 'page-item';
      a.className   = 'page-link';
      a.textContent = n;
      a.setAttribute('href', '#pages');
      a.addEventListener('click', function(){
        currentPage = n;
        setFirstAndLastIndex();
        createDataSubset();
        renderPage();
        updatePagination();
      });

      li.appendChild(a);
      paginationContainer.appendChild(li);
    });
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
