

//page number manage
let page = 1;

const btnBefore = document.querySelector('#btn-before');
const btnAfter = document.querySelector('#btn-after');
const currentPage = document.querySelector('#current-page');

btnBefore.addEventListener('click', function(e) {
    e.preventDefault();
    if (page > 1) {
        page -- ;
    }
    getDatas(page);
    
})

btnAfter.addEventListener('click',function(e) {
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
        const api = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=2`);
        const apiString = await api.json();
        console.log(apiString);

        //img link
        const urlIIIF = "https://www.artic.edu/iiif/2";

        const apiData = apiString.data;


        const apiResults = apiData.map((individualData) => {
            return {
                'id' : individualData.id,
                'image_id' : individualData.image_id,
            }
        })
        
        //show img link
        apiResults.forEach(individualData => {
            console.log(`${urlIIIF}/${individualData.image_id}/full/400,/0/default.jpg`);
        });
        
    } catch (error) {
        console.log(error);
    }
}

//Default Charge
getDatas(page);