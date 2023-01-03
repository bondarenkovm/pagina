import './css/index.css';
import NewApiPixabay from './fetchPixabayAPI';
// const API_KEY = '32537245-4f388be37c0f6e70af9a9106a';
// const URL = 'https://pixabay.com/api/';
//${value}
//${page}
const newApiPixabay = new NewApiPixabay();
const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

// let page = 1;

form.addEventListener('submit', onSubmitForm);
loadMoreBtn.addEventListener('click', onLoadMore);

function onSubmitForm(evt) {
  evt.preventDefault();
  newApiPixabay.query = evt.currentTarget.elements.searchQuery.value.trim();
  newApiPixabay.resetPage();
  newApiPixabay.fetchPixabay().then(renderMarkup);
}

function onLoadMore() {
  newApiPixabay.fetchPixabay().then(renderMarkup);
}

function renderMarkup(hits) {
  const markup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        // const values = Object.values(languages);
        return `<div class="photo-card">
      <a href="${largeImageURL}">
        <img class="card-image" src="${webformatURL}" alt="${tags}" loading="lazy"/>
      </a>
      <div class="info">
        <p class="info-item"><b>Likes</b>${likes}</p>
        <p class="info-item"><b>Views</b>${views}</p>
        <p class="info-item"><b>Comments</b>${comments}</p>
        <p class="info-item"><b>Downloads</b>${downloads}</p>
      </div>
    </div>`;
      }
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}
