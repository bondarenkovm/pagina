import axios from 'axios';
const API_KEY = '32537245-4f388be37c0f6e70af9a9106a';
const BASE_URL = 'https://pixabay.com/api/';

export default class NewApiPixabay {
  constructor() {
    this.value = '';
    this.page = 1;
  }
  async fetchPixabay() {
    const URL = `${BASE_URL}?key=${API_KEY}&q=${this.value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=21&page=${this.page}`;

    const response = await axios.get(URL);
    this.page += 1;
    // console.log(response);
    return response.data;
  }
  resetPage() {
    this.page = 1;
  }
  get pages() {
    return this.page;
  }
  get query() {
    return this.value;
  }
  set query(newValue) {
    return (this.value = newValue);
  }
}
