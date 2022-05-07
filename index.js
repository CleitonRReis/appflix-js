
const filterInput = document.querySelector('[data-js="search"]');
const formSearch = document.querySelector('[data-js="film-form"]');
const yearOfFilm = document.querySelector('[data-js="date-film"]');
const titleFilm = document.querySelector('[data-js="title-film"]');
const searchFilmInput = document.querySelector('[data-js="search"]');
const resultsOfResults = document.querySelector('[data-js="results"]');
const resultTitle = document.querySelector('[data-js="result-title"]');
const imgFilmWeek = document.querySelector('[data-js="img-film-week"]');
const descriptionFilm = document.querySelector('[data-js="description"]');
const searchedMovie = document.querySelector('[data-js="search-movie-area"]');
const searchMovieContainer = document.querySelector('[data-js="search-movie-container"]');

// console.log(searchMovieContainer);

const APIKEY = '3942be052658547c45144d8ba9fb9009';
const endPointMostPopularDay = `https://api.themoviedb.org/3/trending/movie/day?api_key=${APIKEY}`;
const endPointMostPopularWeek = `https://api.themoviedb.org/3/trending/movie/week?api_key=${APIKEY}`;

const endPointDatailsFilm = id => `https://api.themoviedb.org/3/movie/${id}?api_key=${APIKEY}`;
const searchFilm = nameFilm => `https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&query=${nameFilm}`;
const imgPoster = (size, pathImg) => `https://image.tmdb.org/t/p/${size}${pathImg}`;
const truncate = (str, limit) => str.length > limit ? `${str.substring(0, limit)}...` : str;

const handleApi = async () => {
  for (let i = 0; i < 1; i++) {
    const filmArea = document.querySelector('[data-js="film-area"]');
    const filmModels = document.querySelector('[data-js="models"]').cloneNode(true);

    try {
      const response = await fetch(endPointMostPopularDay);

      if (!response.ok) {
        throw new Error('Sorry! Could not get movie data. Try later!');
      }

      const responseData = await response.json();
      const { poster_path } = responseData.results[i];

      const imgPoster = `https://image.tmdb.org/t/p/w300${poster_path}`;

      if (poster_path === null) {
        filmModels.querySelector('img').src = 'img/take.png';
      } else {
        filmModels.querySelector('img').src = imgPoster;
      }

      filmArea.append(filmModels);
    } catch (error) {
      console.log(error);
    };
  };
};

handleApi();

const getFilmsWeek = async () => {
  const response = await fetch(endPointMostPopularWeek);
  const { results } = await response.json();

  const filmArea = document.querySelector('[data-js="films-week-dad"]');
  const filmsWeekTemplate = document.querySelector('[data-js="films-week"]').content;

  results
    .map(({ backdrop_path, release_date, title, overview }) => {
      return {
        src: imgPoster('original', backdrop_path),
        year: new Date(release_date).getFullYear(),
        title: truncate(title, 25),
        description: truncate(overview, 50)
      };
    })
    .forEach(result => {
      const clone = filmsWeekTemplate.cloneNode(true);
      const [thumb, date, title, description] = [
        '[data-js="img-film-week"]',
        '[data-js="date-film"]',
        '[data-js="title-film"]',
        '[data-js="description"]'
      ].map(selector => clone.querySelector(selector));

      thumb.src = result.src;
      date.innerHTML = result.year;
      title.innerHTML = result.title;
      description.innerHTML = result.description;

      filmArea.appendChild(clone);
    });
};

getFilmsWeek();

const showMovieList = async e => {
  e.preventDefault();

  const inputValue = e.target.value.trim().toLowerCase();

  if (inputValue) {
    searchedMovie.classList.add('active');

    try {
      const response = await fetch(searchFilm(inputValue));
      const { results } = await response.json();

      const ul = document.querySelector('[data-js="ul"]');

      const lis = results.map(({ poster_path, title, overview }) => {
        return `<div class="data-movie" data-js="data-movie">
                  <img data-js="searched-img-movie" src=${`https://image.tmdb.org/t/p/${imgPoster('w200', poster_path)}`} alt="">
              
                  <div class="searched-movie-data">
                    <li><h6>${title}<h6></li>
                    <li><p>${truncate(overview, 162)}<p></li>
                  </div>
                </div>`
      }).join('');

      ul.innerHTML = lis;
    } catch (error) {
      console.error(error);
    };
  };
};

const movieSearch = async e => {
  e.preventDefault();

  
  const inputValue = e.target.search.value;

  if (inputValue.length === 0) {
    return;
  };
  
  const containerMovieSearch = document.querySelector('.container-movie-search');
  const containerSubmit = document.querySelector('[data-js="container-movie-search"]');
  const templateMoviSearch = document.querySelector('[data-js="template-movie-search"]').content;
  
  
  searchMovieContainer.classList.add('invisible');
  containerMovieSearch.classList.add('active-search');

  resultTitle.textContent = `'${inputValue}'`;

  try {
    const response = await fetch(searchFilm(inputValue));

    if (!response.ok) {
      throw new Error('Sorry! Could not get movie data. Try later!');
    }

    const { results } = await response.json();

    results.map(movie => {
      return {
        src: imgPoster('original', movie.backdrop_path),
        poster: imgPoster('original', movie.poster_path),
        year: new Date(movie.release_date).getFullYear(),
        title: truncate(movie.title, 25),
        description: truncate(movie.overview, 50)
      };
    }).forEach(result => {
      const clone = templateMoviSearch.cloneNode(true);
      const [thumb, year, title, description] = [
        '[data-js="img-film-search"]',
        '[data-js="date-film-search"]',
        '[data-js="title-film-search"]',
        '[data-js="description-movie-search"]'
      ].map(selector => clone.querySelector(selector))

      if (result.poster.includes(null) && result.src.includes(null)) {
        thumb.src = './img/take.png';
      } else if (result.poster.includes(null)) {
        thumb.src = result.src
      } else {
        thumb.src = result.poster;
      }

      !isNaN(result.year) ? year.innerHTML = result.year : year.innerHTML = '--';
      title.innerHTML = result.title;
      description.innerHTML = result.description;

      containerSubmit.append(clone);
    });

    resultsOfResults.innerHTML = results.length > 1 ? `${results.length} resultados:` : `${results.length} resultado:`;

  } catch (error) {
    console.log(error);
  };

  formSearch.reset();
};


searchedMovie.addEventListener('click', e => {
  if (e.target.className === 'search-movie-area active') {
    searchedMovie.classList.remove('active');
  };
});

formSearch.addEventListener('submit', movieSearch);
filterInput.addEventListener('input', showMovieList);
