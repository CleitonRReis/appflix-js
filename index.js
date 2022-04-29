const filterInput = document.querySelector('[data-js="search"]');
const yearOfFilm = document.querySelector('[data-js="date-film"]');
const titleFilm = document.querySelector('[data-js="title-film"]');
const searchFilmInput = document.querySelector('[data-js="search"]');
const imgFilmWeek = document.querySelector('[data-js="img-film-week"]');
const descriptionFilm = document.querySelector('[data-js="description"]');
const searchedMovie = document.querySelector('[data-js="search-movie-area"]');

const APIKEY = '3942be052658547c45144d8ba9fb9009';
const endPointMostPopularDay = `https://api.themoviedb.org/3/trending/movie/day?api_key=${APIKEY}`;
const endPointMostPopularWeek = `https://api.themoviedb.org/3/trending/movie/week?api_key=${APIKEY}`;

const imgPoster = (size, pathImg) => `https://image.tmdb.org/t/p/${size}${pathImg}`;
const endPointDatailsFilm = id => `https://api.themoviedb.org/3/movie/${id}?api_key=${APIKEY}`;
const searchFilm = nameFilm => `https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&query=${nameFilm}`;

const handleApi = async () => {
  for (let i = 0; i < 1; i++) {
    const filmArea = document.querySelector('[data-js="film-area"]');
    const filmModels = document.querySelector('[data-js="models"]').cloneNode(true);

    try {
      const response = await fetch(endPointMostPopularDay);

      if (!response.ok) {
        throw new Error('Desculpe! Não foi possíve obter os dados do filme. Tente novamente mais tarde!');
      }

      const responseData = await response.json();
      const { poster_path } = responseData.results[i]
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

const truncate = (str, limit) => {
  return str.length > limit ? `${str.substring(0, limit)}...` : str;
};

const getFilmsWeek = async () => {
  const response = await fetch(endPointMostPopularWeek);
  const responseData = await response.json();

  const filmArea = document.querySelector('[data-js="films-week-dad"]');
  const filmsWeekTemplate = document.querySelector(
    '[data-js="films-week"]'
  ).content;

  responseData.results
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
        '[data-js="description"]',
      ].map(selector => clone.querySelector(selector));

      thumb.src = result.src;
      date.innerHTML = result.year;
      title.innerHTML = result.title;
      description.innerHTML = result.description;

      filmArea.appendChild(clone);
    });
};

getFilmsWeek();

filterInput.addEventListener('input', async e => {
  e.preventDefault();
  const inputValue = e.target.value.trim().toLowerCase();

  if (inputValue) {
    searchedMovie.classList.add('active');

    const searchedMovieContainer = document.querySelector('[data-js="search-movie-container"]');

    try {
      const response = await fetch(searchFilm(inputValue));
      const responseData = await response.json();
      const arrayFilms = responseData.results;
      const filmSearchedTemplate = document.querySelector('[data-js="films-searched"]').content;

      arrayFilms.map(({ poster_path, title, overview }) => {
        return {
          src: imgPoster('w200', poster_path),
          title,
          description: truncate(overview, 162)
        }
      }).forEach(result => {
        const clone = filmSearchedTemplate.cloneNode(true);
        const [imgMovie, title, description] = [
          '[data-js="searched-img-movie"]',
          '[data-js="searched-name-movie"]',
          '[data-js="searched-descrition-movie"]'
        ].map(selector => clone.querySelector(selector));

        if (result.src.includes('null')) {
          imgMovie.src = 'img/take.png';
        } else {
          imgMovie.src = result.src;
        };

        title.innerHTML = result.title;
        description.innerHTML = result.description;

      searchedMovieContainer.append(clone);

      Array.from(searchedMovieContainer.children)
        .filter(movie => !movie.textContent.toLowerCase().includes(inputValue))
        .forEach(movie => {
          movie.classList.add('invisible')
        });

      Array.from(searchedMovieContainer.children)
        .filter(movie => movie.textContent.toLowerCase().includes(inputValue))
        .forEach(movie => {
          movie.classList.remove('invisible')
        });
    });
    } catch (error) {
      console.error(error);
    };
  };
});

searchedMovie.addEventListener('click', e => {
  if (e.target.className === 'search-movie-area active') {
    searchedMovie.classList.remove('active');
  };
});