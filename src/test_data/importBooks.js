/* this is a file running in nodejs to upload the initial data to strapi */
const axios = require( 'axios' )
const books = require( './books.json' )
const BASE_URL = 'https://33.1122.ca/'

async function getCategories() {
    return await axios.get( BASE_URL + 'categories');
}
async function getTestaments() {
    return await axios.get( BASE_URL + 'testaments');
}
async function putBook(test_id, cat_id, book, book_no) {
    return await axios.post( BASE_URL + 'books',{
        "title": book,
        "book_no": book_no,
        "category": cat_id,
        "testament": test_id
    });
}

function array2dict(data){
    let result = {}
    data.forEach( item =>
        result[item.title] = item.id
    );
    return result
}

// add chapters
async function run() {
    let categoreis = array2dict((await getCategories()).data)
    let testaments = array2dict((await getTestaments()).data)

    let book_no = 1
    for (const cat of books){
        let cat_id = categoreis[cat.category]
        let test_id = testaments[cat.testament]
        for (const book of cat.books){
            await putBook(test_id, cat_id, book, book_no)
            book_no++
        }
    }
    console.log('done')
}

run();