import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    searchForm: document.querySelector(".search-form"),
    galleryContainer: document.querySelector(".gallery"),
    loadMoreBtn: document.querySelector(".load-more"),

};

const API_KEY = '30240578-43afdca340dbb2f4dbb691dc2';
const axios = require('axios');
let searchQuery = '';
let numberPage = 1;
let totalHits = 0;
let lastArr = 0;

refs.loadMoreBtn.classList.add("is-hidden");


const lightbox = new SimpleLightbox('.gallery a', { 
    captionDelay: 250,
      });

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {

  e.preventDefault();
  clearGalleryContainer();


  searchQuery = e.currentTarget.elements.searchQuery.value.trim();

  if (searchQuery === '') {
    Notiflix.Notify.info(`Please enter your request`);
    
  } else {
    numberPage = 1;

    getUser(searchQuery).then(() => {

      if (totalHits > 0) {
        console.log(totalHits)
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images`);
        
      }
     
      refs.searchForm.reset()
      numberPage += 1;
      lightbox.refresh();
      
    }
     
  );

  }

  
 
};



async function getUser(q) {
  try {
    const response = await axios.get(`https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${numberPage}`);
    console.log(response);

    if (response.data.hits.length === 0) {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");

    }

    totalHits = response.data.totalHits
    let images = response.data.hits;
    lastArr = response.data.hits.length;
    

    imageMarkup(images);

    if (totalHits > 40) {
      refs.loadMoreBtn.classList.remove("is-hidden");
    } else if (totalHits <= 40 && totalHits > 0 ) {
      
       refs.loadMoreBtn.classList.add("is-hidden");
      Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
      
    } 
    else if (totalHits === 0) {
      refs.loadMoreBtn.classList.add("is-hidden");
    }

   
      
    

  } catch (error) {
    console.error(error);
  }
}


function onLoadMore() {
  

  incrementPage();
   

  getUser(searchQuery).then(() => {
    lightbox.refresh();

    if (lastArr === 0) {
    refs.loadMoreBtn.classList.add("is-hidden");
    return  Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
 }
    
console.log((lastArr))
    const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
   
  });
    
  
}




 
function imageMarkup(images) {
    const markup = appendImagesMarkup(images);
  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);    
}

function appendImagesMarkup(images) {
   return images
    .map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads  }) => 
      `<div class="photo-card"> 
       <a  href="${largeImageURL}"> 
    <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy"/>
    </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views </b>
      <span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${downloads}</span>
    </p>
  </div>
</div> ` 
    )
        .join("");
    
};


function clearGalleryContainer() {
  refs.galleryContainer.innerHTML = '';
}

function  incrementPage() {
  numberPage += 1;

  
}