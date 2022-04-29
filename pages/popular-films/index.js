const APIKEY = '3942be052658547c45144d8ba9fb9009';
const endPointDatailsFilm = id => `https://api.themoviedb.org/3/movie/${id}?api_key=${APIKEY}`;
const endPointMostPopular = `https://api.themoviedb.org/3/trending/movie/day?api_key=${APIKEY}`;

const filmDetails = document.querySelector('[data-js="container-most-popular"]');
const filmWindowArea = document.querySelector('[data-js="filmWindowArea"]');
const nameFilm = document.querySelector('[data-js="nameFilm"]');
const filmBigImg = document.querySelector('[data-js="filmBigImg"]');
const voteAverage = document.querySelector('[data-js="vote-average"]');
const yearOfFilm = document.querySelector('[data-js="year"]');
const descriptionOfFilm = document.querySelector('[data-js="descriptionFilm"]');

const imgPoster = pathImg => `https://image.tmdb.org/t/p/original${pathImg}`;


const getFilmUrl = async () => {
  const setKey = document.querySelector('.films-popular-img');
  const containerMostPopular = document.querySelector('[data-js="container-most-popular"]');
  const filmsPopular = document.querySelector('[data-js="films-popular"]');

  try {
    const response = await fetch(endPointMostPopular);

    if (!response.ok) {
      throw new Error('Sorry! Could not get movie data. Try later!');
    };

    const responseData = await response.json();
    const arrayFilms = responseData.results;

    arrayFilms.map(movie => {
      const clone = filmsPopular.cloneNode(true);
      const { poster_path, id } = movie;

      filmsPopular.querySelector('img').src = imgPoster(poster_path);

      containerMostPopular.append(clone);
      setKey.setAttribute('data-key', id);
    });
  } catch (error) {
    console.error(error);
  };

  containerMostPopular.removeChild(containerMostPopular.childNodes[3]);
};

getFilmUrl();

filmDetails.addEventListener('click', async e => {
  const key = e.target.getAttribute('data-key');

  if (e.target.className === 'films-popular-img') {
    filmWindowArea.classList.toggle('active');

    try {
      const response = await fetch(endPointDatailsFilm(key))

      if (!response.ok) {
        throw new Error('Sorry! Could not get movie data. Try later!');
      }

      const responseData = await response.json();
      const releaseDate = new Date(responseData.release_date);

      filmBigImg.src = imgPoster(responseData.backdrop_path);
      nameFilm.innerHTML = responseData.title;
      voteAverage.innerHTML = `${responseData.vote_average} vote average`;
      yearOfFilm.innerHTML = releaseDate.getFullYear();
      descriptionOfFilm.innerHTML = responseData.overview;
    } catch (error) {
      console.error(error);
    }
  };
});

filmWindowArea.addEventListener('click', e => {
  const verifyClassInModal = e.target.className === 'close' || e.target.className === 'filmWindowArea active';

  if (verifyClassInModal) {
    filmWindowArea.classList.toggle('active');
  };
});
