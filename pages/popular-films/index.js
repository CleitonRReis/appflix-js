const APIKEY = '3942be052658547c45144d8ba9fb9009';
const endPointMostPopular = `https://api.themoviedb.org/3/trending/movie/day?api_key=${APIKEY}`;

const yearOfFilm = document.querySelector('[data-js="year"]');
const nameFilm = document.querySelector('[data-js="nameFilm"]');
const filmBigImg = document.querySelector('[data-js="filmBigImg"]');
const voteAverage = document.querySelector('[data-js="vote-average"]');
const filmWindowArea = document.querySelector('[data-js="filmWindowArea"]');
const descriptionOfFilm = document.querySelector('[data-js="descriptionFilm"]');
const filmDetails = document.querySelector('[data-js="container-most-popular"]');

const imgPoster = pathImg => `https://image.tmdb.org/t/p/original${pathImg}`;
const endPointDatailsFilm = id => `https://api.themoviedb.org/3/movie/${id}?api_key=${APIKEY}`;

const getFilmUrl = async () => {
  try {
    const response = await fetch(endPointMostPopular);

    const containerMostPopular = document.querySelector('[data-js="container-most-popular"]');
    const filmsPopular = document.querySelector('[data-js="films-test"]').content;

    if (!response.ok) {
      throw new Error('Sorry! Could not get movie data. Try later!');
    };

    const { results } = await response.json();

    results.map(({ id, poster_path }) => {
      return {
        id,
        src: imgPoster(poster_path)
      }
    }).forEach(({ src, id }) => {
      const clone = filmsPopular.cloneNode(true);
      const [ img ] = [ '[data-js="img-movie"]' ]
      .map(selector => clone.querySelector(selector));

      img.src = src;
      
      img.setAttribute('data-key', id);
      
      containerMostPopular.append(clone);
    });
  } catch (error) {
    console.error(error);
  };
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
