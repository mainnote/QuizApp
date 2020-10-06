const init_data = require( './init_data.json' )
const axios = require( 'axios' )
const BASE_URL = 'https://33.1122.ca/'
const _ = require('lodash');
let BOOKS;

function array2dict(data){
    let result = {}
    data.forEach( item =>
        result[item.title] = item.id
    );
    return result
}

async function getBooks() {
    return await axios.get( BASE_URL + 'books');
}

async function run() {
    BOOKS = array2dict((await getBooks()).data)
    
    let books = [];
    let categories = [];
    let len = init_data.surveyChapters.length;
    for ( let i = 0; i < len; i++ ) {
        let chapter = init_data.surveyChapters[ i ];
        for ( const question of chapter.Questions ) {
            books = _.union(books, question.Books)
            categories = _.union(categories, [question.Category])
            if (question.Books.length === 0)
            console.log('No book:', question.Question_No)

            question.Books.forEach(book => {
                if (!BOOKS.hasOwnProperty(book))
                    console.log('Wrong book:', question.Question_No)
            })
        }
    }

    //console.log(categories)
}

run()