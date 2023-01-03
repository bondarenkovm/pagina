const API_KEY = '32537245-4f388be37c0f6e70af9a9106a';
const URL = 'https://pixabay.com/api/';

// export function fetchPixabay(value, page) {
//   fetch(
//     `${URL}?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=10&page=${page}`
//   ).then(response => {
//     console.log(response);
//     if (!response.ok) {
//       throw new Error(response.status);
//     }
//     return response.json();
//   });
// }
export default class NewApiPixabay {
  constructor() {
    this.value = '';
    this.page = 1;
  }
  fetchPixabay() {
    return fetch(
      `${URL}?key=${API_KEY}&q=${this.value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=5&page=${this.page}`
    )
      .then(response => {
        //   console.log(response);
        // if (!response.ok) {
        //   throw new Error(response.status);
        // }
        return response.json();
      })
      .then(data => {
        // console.log(data);
        this.page += 1;
        return data.hits;
      });
  }
  resetPage() {
    this.page = 1;
  }
  get query() {
    return this.value;
  }
  set query(newValue) {
    return (this.value = newValue);
  }
}
