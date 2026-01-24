

async function getDatas() {

    try {
        const api = await fetch("https://api.artic.edu/api/v1/artworks?page=1&limit=2");
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
        
        apiResults.forEach(individualData => {
            console.log(`${urlIIIF}/${individualData.image_id}/full/400,/0/default.jpg`);
        });
        
    } catch (error) {
        console.log(error);
    }
}

getDatas();