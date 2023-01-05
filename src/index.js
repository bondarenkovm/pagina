import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import NewApiPixabay from './fetchPixabayAPI';

const newApiPixabay = new NewApiPixabay();
const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

var lightbox = new SimpleLightbox('.gallery a', {
  captionsData: `alt`,
  captionDelay: 250,
});

// loadMoreBtn.classList.add('btn');
// loadMoreBtn.setAttribute('hidden', 'true');
loadMoreBtn.hidden = true;
// loadMoreBtn.disabled = true;

form.addEventListener('submit', onSubmitForm);
loadMoreBtn.addEventListener('click', onLoadMore);

function onSubmitForm(evt) {
  evt.preventDefault();

  if (evt.currentTarget.elements.searchQuery.value.trim()) {
    clearGallery();
    newApiPixabay.query = evt.currentTarget.elements.searchQuery.value.trim();
    newApiPixabay.resetPage();
    newApiPixabay.fetchPixabay().then(({ hits, totalHits }) => {
      loadMoreBtn.classList.remove('btn');
      renderMarkup({ hits, totalHits });
    });
  } else {
    clearGallery();
    Notify.failure('Enter data to search!');
  }
}

function onLoadMore() {
  newApiPixabay.fetchPixabay().then(renderMarkup);
}

function renderMarkup({ hits, totalHits }) {
  if (!hits.length) {
    loadMoreBtn.classList.add('btn');
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  if (newApiPixabay.pages === 2) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
  }

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
        return `<div class="photo-card">
        <div class="wraper">
      <a href="${largeImageURL}">
        <img class="card-image" src="${webformatURL}" alt="${tags}" loading="lazy"/>
      </a></div>
      <div class="info">
        <p class="info-item"><b>Likes: </b>${likes}</p>
        <p class="info-item"><b>Views: </b>${views}</p>
        <p class="info-item"><b>Comments: </b>${comments}</p>
        <p class="info-item"><b>Downloads: </b>${downloads}</p>
      </div>
    </div>`;
      }
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);

  lightbox.refresh();
  smoothScroll();

  if (gallery.children.length === totalHits) {
    loadMoreBtn.classList.add('btn');
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    return;
  }
}

function clearGallery() {
  gallery.innerHTML = '';
  loadMoreBtn.classList.add('btn');
}

function smoothScroll() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 0.2,
    behavior: 'smooth',
  });
}
