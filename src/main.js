

//page number manage
let page = 1;

const btnBefore = document.querySelector('#btn-before');
const btnAfter = document.querySelector('#btn-after');
const currentPage = document.querySelector('#current-page');

btnBefore.addEventListener('click', function (e) {
    e.preventDefault();
    if (page > 1) {
        page--;
    }
    getDatas(page);

})

btnAfter.addEventListener('click', function (e) {
    e.preventDefault();
    page++;
    getDatas(page);
})


function pageNumer(page) {
    currentPage.textContent = `${page}`
}

// get datas
async function getDatas(page) {

    // I call pageNumer for everyTime i use getDatas , so when i click btn-Before , btn-After or 
    //by default always the page refresh
    pageNumer(page);
    try {
        //get api datas
        const api = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=2`);
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

        console.log(apiResults);

        //show img link
        apiResults.forEach(individualData => {
            console.log(`${urlIIIF}/${individualData.imageId}/full/400,/0/default.jpg`);
        });

    } catch (error) {
        console.log(error);
    }
}

//Default Charge
getDatas(page);