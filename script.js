(async function renderData(){
  try {
    const res = await axios.get('https://jsonplaceholder.typicode.com/posts');

    // How each item in config.data is rendered depends on the function
    // assigned to config.createItemComponent. paginate() is currently still dependent
    // on a few bootstrap classes, but overall paginate is reusable.
    function makePageChild(item){
      const li           = document.createElement('LI');
      const strong       = document.createElement('STRONG');
      const span         = document.createElement('SPAN');
      li.className       = 'list-group-item text-secondary';
      strong.className   = 'me-5';
      strong.textContent = item.id;
      span.textContent   = item.title;
      li.appendChild(strong);
      li.appendChild(span);
      return li;
    }

    const config = {
      data:                res.data,
      pageContainer:       document.querySelector('#blog-post-list'),
      paginationContainer: document.querySelector('#blog-post-pagination'),
      createItemComponent: makePageChild
      // ,itemsPerPage:       7
    };

    paginate(config);
  } catch (err){
    console.error("There was a problem with the request.", err);
  }
})();
