

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
        })



    } catch (error) {
        console.log(error);
    }
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
        card.classList.add('flex', 'flex-col', 'border', 'p-4', 'rounded', 'shadow-md', 'w-72', 'mx-2', 'my-2', 'transition-all', 'duration-300', 'hover:-translate-y-2', 'hover:scale-105');
        img.classList.add('w-full', 'h-48', 'object-cover', 'rounded'); // object-cover avoid deformation
        title.classList.add('font-bold', 'text-lg', 'text-center');
        artistP.classList.add('text-gray-600', 'text-sm');
        date.classList.add('mb-3');
        heartImg.classList.add('h-8', 'flex', 'mx-auto', 'my-2', 'transition-all', 'duration-300', 'hover:-translate-y-1', 'hover:scale-105')
        //button complete image
        const btnImg = document.createElement('button');
        btnImg.textContent = 'View Image';
        btnImg.classList.add('flex', 'mx-auto', 'mt-auto', 'bg-black', 'text-white', 'px-1.5', 'py-1.5', 'mt-4', 'mb-1', 'rounded', 'font-semibold', 'transition-all', 'duration-200', 'hover:bg-gray-400');
        btnImg.addEventListener('click', function (e) {
            e.preventDefault();
            window.open(getFullImgLink(individualData));
        })

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


//fav Logic
function showFav(individualData) {
    const favourites = localStorage.getItem('fav');
    const favoritosUsable = JSON.parse(favourites) || [];

}
showFav();


//color funcition
const camaleonColor = document.querySelector('#camaleon');

camaleonColor.addEventListener('click', function (e) {
    e.preventDefault();
    const imgCamaleon = document.querySelector('#camaleonImg');
    getTheme();
    imgCamaleon.classList.add('grayscale-100');
})

function getTheme() {
    const theme = localStorage.getItem('theme');
    if (!theme) {
        localStorage.setItem('theme', 'white');
    } else {
        if (theme == 'white') {
            const imgCamaleon = document.querySelector('#camaleonImg');
            imgCamaleon.classList.remove('grayscale-100');
            localStorage.setItem('theme' , 'black');
    console.log(imgCamaleon);

            
        } else {
            const imgCamaleon = document.querySelector('#camaleonImg');
            imgCamaleon.classList.add('grayscale-100');
            localStorage.setItem('theme' , 'white');
    console.log(imgCamaleon);


        }
    }
    
    console.log(theme);

}