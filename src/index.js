import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import NewApiPixabay from './fetchPixabayAPI';

const newApiPixabay = new NewApiPixabay();
const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

var lightbox = new SimpleLightbox('.gallery a', {
  captionsData: `alt`,
  captionDelay: 250,
});

const options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};
const observer = new IntersectionObserver(onInfinityload, options);

form.addEventListener('submit', onSubmitForm);

function onSubmitForm(evt) {
  evt.preventDefault();

  if (evt.currentTarget.elements.searchQuery.value.trim()) {
    clearGallery();
    newApiPixabay.query = evt.currentTarget.elements.searchQuery.value.trim();
    newApiPixabay.resetPage();
    newApiPixabay.fetchPixabay().then(({ hits, totalHits }) => {
      if (!hits.length) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      renderMarkup({ hits, totalHits });
    });
  } else {
    clearGallery();
    Notify.failure('Enter data to search!');
  }
}

function onInfinityload(entries) {
  //   console.log(entries);
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      newApiPixabay
        .fetchPixabay()
        .then(({ hits, totalHits }) => {
          renderMarkup({ hits, totalHits });

          observer.observe(gallery.lastElementChild);
          //   console.log(gallery.children.length);
          //   console.log(totalHits);

          if (gallery.children.length === totalHits) {
            // console.log(gallery.lastElementChild);
            observer.disconnect();
            Notify.failure(
              "We're sorry, but you've reached the end of search results."
            );
            return;
          }
        })
        .catch(error => {
          observer.disconnect();
          Notify.failure(
            "We're sorry, but you've reached the end of search results."
          );
        });
    }
  });
}

function renderMarkup({ hits, totalHits }) {
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

  observer.observe(gallery.lastElementChild);

  lightbox.refresh();
  smoothScroll();
}

function clearGallery() {
  gallery.innerHTML = '';
}

function smoothScroll() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 0.2,
    behavior: 'smooth',
  });
}
