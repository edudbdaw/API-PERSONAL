

//page number manage
let page = 1;

const btnBefore = document.querySelector('#btn-before');
const btnAfter = document.querySelector('#btn-after');
const currentPage = document.querySelector('#current-page');

// Page buttons
btnBefore.addEventListener('click', function (e) {
    e.preventDefault();
    if (page > 1) {
        page--;
    }
    scroolToTop();
    getDatas(page);

})

btnAfter.addEventListener('click', function (e) {
    e.preventDefault();
    page++;
    scroolToTop();
    getDatas(page);
})

//save page in SessionStorage
function savePage() {
    sessionStorage.setItem('page', page);
}

// get pageNumer and print in html
function pageNumer(page) {
    currentPage.textContent = `${page}`
}

//scroll to top while clicking pany page button
function scroolToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}
// get datas
async function getDatas(page) {

    // I call pageNumer for everyTime i use getDatas , so when i click btn-Before , btn-After or 
    //by default always the page refresh
    pageNumer(page);
    try {
        //get api datas
        const api = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=25`);
        const apiString = await api.json();
        console.log(apiString);

        //img link
        const urlIIIF = "https://www.artic.edu/iiif/2";

        //save interesting values
        const apiData = apiString.data;
        const apiResults = apiData.map((individualData) => {
            return {
                'id': individualData.id,
                'title': individualData.title,
                'imageId': individualData.image_id,
                'artist': individualData.artist_display || 'Unknown Artist',
                'type': individualData.artwork_type_title,
                'date': individualData.date_display,
                'material': individualData.medium_display,
                'styles': individualData.style_titles,
                'tags': individualData.classification_titles
            };
        });

        printCards(apiResults);

        //search by input
        const input = document.querySelector('#input-search');
        console.log(input);
        input.addEventListener('input', function (e) {
            e.preventDefault();
            let target = e.target.value.toLowerCase();
            let filterByText = apiResults.filter((individualData) => {
                const title = individualData.title.toLowerCase();
                const artist = individualData.artist.toLowerCase();
                return title.includes(target) || artist.includes(target);
            })
            printCards(filterByText);

            //I call again style due to the theme is not applaying again 
            getThemeFirst();
        })



    } catch (error) {
        console.log(error);
    }
    //Call for apply the style of the page 
    getThemeFirst();
}

//Default Charge
getDatas(page);
//show img link
function getImgLink(individualDataIMG) {
    return `https://www.artic.edu/iiif/2/${individualDataIMG.imageId}/full/400,/0/default.jpg`;
}
//show img full link
function getFullImgLink(individualDataIMG) {
    return `https://www.artic.edu/iiif/2/${individualDataIMG.imageId}/full/800,/0/default.jpg`;
}
//Print cards
function printCards(apiResults) {
    const cardContainer = document.querySelector('#cards-container');
    cardContainer.textContent = '';
    apiResults.forEach((individualData) => {
        // Create Elements
        const card = document.createElement('div');
        const title = document.createElement('h2');
        const img = document.createElement('img');
        const artistP = document.createElement('p');
        const date = document.createElement('p');
        const fav = document.createElement('button');
        const heartImg = document.createElement('img');

        // Fill Content
        img.src = getImgLink(individualData);
        img.alt = individualData.title;
        title.textContent = individualData.title;
        hearPath = './img/circulo.png'
        heartImg.src = hearPath;
        artistP.textContent = `Artist: ${individualData.artist}`;
        date.textContent = individualData.date;

        // Tailwind Styles
        card.classList.add('card', 'flex', 'flex-col', 'border', 'p-4', 'rounded', 'shadow-md', 'w-72', 'mx-2', 'my-2', 'transition-all', 'duration-300', 'hover:-translate-y-2', 'hover:scale-105');
        img.classList.add('w-full', 'h-48', 'object-cover', 'rounded'); // object-cover avoid deformation
        title.classList.add('titleCard', 'font-bold', 'text-lg', 'text-center');
        artistP.classList.add('artistCard', 'text-gray-600', 'text-sm');
        date.classList.add('dateCard', 'mb-3');

        //call fav funcion for give color or not
        heartFavStyle(individualData, heartImg);

        //button complete image
        const btnImg = document.createElement('button');
        btnImg.textContent = 'View Image';
        btnImg.classList.add('flex', 'mx-auto', 'mt-auto', 'bg-black', 'text-white', 'px-1.5', 'py-1.5', 'mt-4', 'mb-1', 'rounded', 'font-semibold', 'transition-all', 'duration-200', 'hover:bg-gray-400');
        btnImg.addEventListener('click', function (e) {
            e.preventDefault();
            window.open(getFullImgLink(individualData));
        })

        //fav event
        fav.addEventListener('click', function (e) {
            e.preventDefault();
            addToFav(individualData);
            heartFavStyle(individualData, heartImg);
        });


        //Insert into containers
        card.appendChild(title);
        card.appendChild(fav);
        fav.appendChild(heartImg);
        card.appendChild(artistP);
        card.append(img);
        card.appendChild(date);
        card.appendChild(btnImg)
        cardContainer.appendChild(card);
    });
}


//add to fav

function addToFav(individualData) {
    const favsArray = localStorage.getItem('favs');
    const favArraysToJson = JSON.parse(favsArray) ?? [];
    if (favArraysToJson.includes(individualData.id)) {
        const indexArrayExisted = favArraysToJson.indexOf(individualData.id);
        favArraysToJson.splice(indexArrayExisted , 1);
    } else {
        favArraysToJson.push(individualData.id);
    }
    
    const favArraysToString = JSON.stringify(favArraysToJson);
    localStorage.setItem('favs', favArraysToString);

    //call getDatas from the api again for reload the favs due to , the cards get style by the function hearstyle 
    //that is inside getDatas
    getDatas(page);
}

//give colour or not depending if is fav or not
function heartFavStyle(individualData, heartImg) {
    const favs = localStorage.getItem('favs');
    const favsToJson = JSON.parse(favs) ?? [];
    heartImg.classList.add('h-8', 'flex', 'mx-auto', 'my-2', 'transition-all', 'duration-300', 'hover:-translate-y-1', 'hover:scale-105');
    if (favsToJson.includes(individualData.id)) {
        heartImg.classList.remove('grayscale-75');
    } else {
        heartImg.classList.add('grayscale-75');
    }
}


//color funcition
const camaleonColor = document.querySelector('#camaleon');

camaleonColor.addEventListener('click', function (e) {
    e.preventDefault();
    setTheme();

})

//get theme
function getThemeFirst() {
    const theme = localStorage.getItem('theme');
    const imgCamaleon = document.querySelector('#camaleonImg');
    if (!theme) {
        localStorage.setItem('theme', 'white');
        console.log("No habia tema");
    } else {
        if (theme == 'white') {
            imgCamaleon.classList.remove('grayscale-100');
            removeBlackStyle();
        } else {
            imgCamaleon.classList.add('grayscale-100');
            setBlackStyle();
        }
    }
}

//set theme
function setTheme() {

    const theme = localStorage.getItem('theme');
    const imgCamaleon = document.querySelector('#camaleonImg');
    if (theme == 'white') {
        //If white change to black , if black change to white
        imgCamaleon.classList.add('grayscale-100');
        localStorage.setItem('theme', 'black');
        setBlackStyle();
    } else {

        imgCamaleon.classList.remove('grayscale-100');
        localStorage.setItem('theme', 'white');
        removeBlackStyle();

    }
}

function setBlackStyle() {
    document.body.classList.add('bg-black');
    const pageName = document.querySelector('#pageName');
    pageName.classList.add('text-white')
    const inputSearch = document.querySelector('#input-search');
    inputSearch.classList.add('text-white');
    const currentPage = document.querySelector('#current-page');
    currentPage.classList.add('text-white', 'border-white');

    const card = document.querySelectorAll('.card');
    const title = document.querySelectorAll('.titleCard');
    const artist = document.querySelectorAll('.artistCard');
    const date = document.querySelectorAll('.dateCard');

    card.forEach((card) => {
        card.classList.remove('bg-white');
        card.classList.add('bg-gray-900');
    });

    title.forEach((title) => {
        title.classList.remove('text-black');
        title.classList.add('text-white');
    });

    artist.forEach((artist) => {
        artist.classList.remove('text-gray-600');
        artist.classList.add('text-gray-300');
    });

    date.forEach((date) => {
        date.classList.remove('text-black');
        date.classList.add('text-white');
    });
}

function removeBlackStyle() {

    document.body.classList.remove('bg-black');
    const pageName = document.querySelector('#pageName');
    pageName.classList.remove('text-white');
    const inputSearch = document.querySelector('#input-search');
    inputSearch.classList.remove('text-white');
    const currentPage = document.querySelector('#current-page');
    currentPage.classList.remove('text-white', 'border-white');

    const card = document.querySelectorAll('.card');
    const title = document.querySelectorAll('.titleCard');
    const artist = document.querySelectorAll('.artistCard');
    const date = document.querySelectorAll('.dateCard');

    card.forEach((card) => {
        card.classList.remove('bg-gray-900');
        card.classList.add('bg-white');
    });

    title.forEach((title) => {
        title.classList.remove('text-white');
        title.classList.add('text-black');
    });

    artist.forEach((artist) => {
        artist.classList.remove('text-gray-300');
        artist.classList.add('text-gray-600');
    });

    date.forEach((date) => {
        date.classList.remove('text-white');
        date.classList.add('text-black');
    });
}


// Music
const audio = document.getElementById('museum-audio');
const musicBtn = document.getElementById('music-btn');
const musicIcon = document.getElementById('music-icon');

//initial config
audio.volume = 0.08; 

//music button event
musicBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        musicIcon.textContent = '🎵'; 
        musicBtn.classList.add('animate-pulse');
    } else {
        audio.pause();
        musicIcon.textContent = '🔇';
        musicBtn.classList.remove('animate-pulse');
    }
});