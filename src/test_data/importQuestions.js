/* this is a file running in nodejs to upload the initial data to strapi */
const axios = require( 'axios' )
const init_data = require( './init_data.json' )
const BASE_URL = 'https://33.1122.ca/'
const QUIZ_ID = "5f6a35156254027e53ce24c0"

//axios.get( BASE_URL + 'quizzes').then(res => console.log(res.data))
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

async function addChapter( chapter, index ) {
    console.log( chapter.Title + ' is loading......' );
    return await axios.post( BASE_URL + 'chapters', {
        "title": chapter.Title,
        "duration": chapter.Duration,
        "reminds": chapter.QuestionRemind,
        "description": chapter.Descriptions.map( item => '<p>' + item + '</p>' ).join( '' ),
        "chapter_no": index + 1,
        "quiz": QUIZ_ID
    } );
}

async function addQuestion( chapter_id, question ) {
    console.log( question.Question_Title + ' is added.' );
    let question_no = parseInt( question.Question_No.replace( '.', '' ).trim() );
    let choices = question.Selections.map( ( choice, index ) => {
        return {
            "is_answer": choice.Is_Answer,
            "choice_symbol": choice.AnswerSymbol,
            "choice_content": choice.AnswerContent
        }
    } )

    let books = question.Books.map(book => BOOKS[book])

    return await axios.post( BASE_URL + 'questions', {
        "chapter": chapter_id,
        "question_no": question_no,
        "question_content": question.Question_Title,
        "choice": choices,
        "books": books
    } );
}


// add chapters
// too fast timeouted
function promiseRun() {
    let all_chapters_calls = init_data.surveyChapters.map( ( chapter, chapter_index ) => {
        return addChapter( chapter, chapter_index ).then( response => {
            let chapter_id = response.data.id
            let all_questions_calls = chapter.Questions.map( ( question ) => {
                return addQuestion( chapter_id, question )
            } )

            return Promise.all( all_questions_calls ).then( () => console.log( 'done questions' ) )
        } )
    } )
    Promise.all( all_chapters_calls ).then( () => console.log( 'done chapters' ) )
}

async function run() {
    BOOKS = array2dict((await getBooks()).data)

    let len = init_data.surveyChapters.length;
    for ( let i = 0; i < len; i++ ) {
        let chapter = init_data.surveyChapters[ i ];
        let response = await addChapter( chapter, i );
        let chapter_id = response.data.id;
        for ( const question of chapter.Questions ) {
            await addQuestion( chapter_id, question );
        }
    }
}

run();