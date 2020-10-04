using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Office.Interop.Word;
using Newtonsoft.Json;

namespace WordDocConvertor
{
    public class WordDocConvertor
    {
        private List<string> chapterStartList;
        private List<string> chapterDurationList;
        private List<string> questionStartList;
        private List<string> categoryStartList;

        private List<SurveyQuestionCategory> categoryList;
        private List<string> answerList;

        private string questionFilePath = string.Empty;
        private string answerFilePath = string.Empty;
        private string categoryFilePath = string.Empty;
        private string jsonFilePath = string.Empty;
        private string errorFilePath = string.Empty;

        private string errorText = string.Empty;

        public WordDocConvertor()
        {
            this.chapterStartList = new List<string>();
            this.chapterDurationList = new List<string>();
            this.questionStartList = new List<string>();
            this.categoryStartList = new List<string>();

            this.categoryList = new List<SurveyQuestionCategory>();
            this.answerList = new List<string>();
        }

        public void Run()
        {
            Application word_category = null;
            Document doc_category = null;

            Application word_answer = null;
            Document doc_answer = null;

            Application word_question = null;
            Document doc_question = null;

            Survey survey = new Survey();
            SurveyChapter chapter = null;
            SurveyQuestion question = null;

            try
            {
                /*
                 * load configuration
                 */
                IConfigurationRoot configuration = new ConfigurationBuilder()
                    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: false)
                    .Build();

                this.questionFilePath = configuration["questionFile"];
                this.answerFilePath = configuration["answerFile"];
                this.categoryFilePath = configuration["categoryFile"];
                this.jsonFilePath = configuration["jsonFile"];
                this.errorFilePath = configuration["errorFile"];

                var chapterStartCollection = configuration.GetSection("textConfig:chapterStart").GetChildren();
                var chapterDurationCollection = configuration.GetSection("textConfig:chapterDuration").GetChildren();
                var questionstartCollection = configuration.GetSection("textConfig:questionstart").GetChildren();
                var categorystartCollection = configuration.GetSection("textConfig:categoryStart").GetChildren();

                foreach (var keyValuePair in chapterStartCollection)
                {
                    this.chapterStartList.Add(keyValuePair.Value);
                }

                foreach (var keyValuePair in chapterDurationCollection)
                {
                    this.chapterDurationList.Add(keyValuePair.Value);
                }

                foreach (var keyValuePair in questionstartCollection)
                {
                    this.questionStartList.Add(keyValuePair.Value);
                }

                foreach (var keyValuePair in categorystartCollection)
                {
                    this.categoryStartList.Add(keyValuePair.Value);
                }

                /*
                 * load word document file of question answer
                 */
                word_answer = new Application();
                object miss = System.Reflection.Missing.Value;
                object readPath = answerFilePath;
                object readOnly = true;
                doc_answer = word_answer.Documents.Open(ref readPath, ref miss, ref miss, ref miss, ref miss, ref miss,
                    ref miss, ref miss, ref miss, ref miss, ref miss, ref miss, ref miss, ref miss, ref miss, ref miss);

                for (int i = 0; i < doc_answer.Paragraphs.Count; i++)
                {
                    string line = doc_answer.Paragraphs[i + 1].Range.Text.Trim().Trim('\r').Trim('\n');
                    if (line.Length == 0)
                    {
                        // ingnore empty line
                        continue;
                    }

                    string[] array = line.Split(new char[] { ':' });
                    if (array != null && array.Length == 2)
                    {
                        var question_no_str = array[0];
                        var questionAnswers = array[1];

                        int question_no_int = 0;
                        if (int.TryParse(question_no_str, out question_no_int))
                        {
                            this.answerList.Add(questionAnswers);
                        }
                    }
                }

                doc_answer.Close();
                doc_answer = null;

                for (int i = 0; i < this.answerList.Count; i++)
                {
                    this.categoryList.Add(new SurveyQuestionCategory() { Category = string.Empty, Books = new List<string>() });
                }

                /*
                 * load word document file of question categories
                 */
                word_category = new Application();
                miss = System.Reflection.Missing.Value;
                readPath = categoryFilePath;
                readOnly = true;
                doc_category = word_category.Documents.Open(ref readPath, ref miss, ref miss, ref miss, ref miss, ref miss,
                    ref miss, ref miss, ref miss, ref miss, ref miss, ref miss, ref miss, ref miss, ref miss, ref miss);

                string category = string.Empty;
                for (int i = 0; i < doc_category.Paragraphs.Count; i++)
                {
                    string line = doc_category.Paragraphs[i + 1].Range.Text.Trim().Trim('\r').Trim('\n');
                    if (line.Length == 0)
                    {
                        // ingnore empty line
                        continue;
                    }

                    // hit category start
                    if (HitCategoryStart(line))
                    {
                        category = ParseCategoryLine(line).Trim();
                    }
                    else
                    {
                        ParseBookLine(line, category);
                    }
                }

                doc_category.Close();
                doc_category = null;

                //goto complete;

                /*
                 * load word document file of question list
                 */
                word_question = new Application();
                miss = System.Reflection.Missing.Value;
                readPath = questionFilePath;
                readOnly = true;
                doc_question = word_question.Documents.Open(ref readPath, ref miss, ref miss, ref miss, ref miss, ref miss,
                    ref miss, ref miss, ref miss, ref miss, ref miss, ref miss, ref miss, ref miss, ref miss, ref miss);

                /*
                 * parse word document file
                 * 
                 * first, parsing should hit chapter start line
                 * then, parsing should hit chapter duration line
                 * then, parsing should hit chapter description
                 * then, parsing should hit question start
                 * then, parse question with question title line and selection line
                 */

                bool hitChapterStart = false;
                bool hitChapterDuration = false;
                bool hitQuestionStart = false;

                bool firstLineOfQuestionSection = false;
                int question_cnt = 1;

                for (int i = 0; i < doc_question.Paragraphs.Count; i++)
                {
                    string line = doc_question.Paragraphs[i + 1].Range.Text.Trim().Trim('\r').Trim('\n');

                    if (line.Length == 0)
                    {
                        // ingnore empty line
                        continue;
                    }

                    if (IsLineStartWithChapterStartString(line))
                    {
                        // reset
                        hitChapterStart = true;
                        hitChapterDuration = false;
                        hitQuestionStart = false;

                        chapter = new SurveyChapter();
                        chapter.Title = line;
                        survey.surveyChapters.Add(chapter);
                        continue;
                    }

                    if (hitChapterStart && !hitChapterDuration)
                    {
                        if (IsLineStartWithChapterDurationString(line))
                        {
                            hitChapterDuration = true;

                            chapter.Duration = line;
                            continue;
                        }
                    }

                    if (hitChapterStart && hitChapterDuration && !hitQuestionStart)
                    {
                        // all lines are description until hit question remind
                        if (IsLineStartWithQuestionStartString(line))
                        {
                            hitQuestionStart = true;

                            chapter.QuestionRemind = line;

                            firstLineOfQuestionSection = true;
                            continue;
                        }
                        else
                        {
                            chapter.Descriptions.Add(line);
                            continue;
                        }
                    }

                    if (hitChapterStart && hitChapterDuration && hitQuestionStart)
                    {
                        if (firstLineOfQuestionSection)
                        {
                            question = new SurveyQuestion();
                            question.Question_No = question_cnt.ToString() + ".";
                            ParseQuestionTitle(line, question);

                            chapter.Questions.Add(question);

                            firstLineOfQuestionSection = false;
                            question_cnt++;
                            continue;
                        }
                        else
                        {
                            ParseQuestionAnaswers(line, question, question_cnt - 2);

                            firstLineOfQuestionSection = true;
                            continue;
                        }
                    }
                }

                string jsonChapter = JsonConvert.SerializeObject(survey);
                WriteToFile(jsonChapter, this.jsonFilePath);
                WriteToFile(errorText, this.errorFilePath);

            //complete:
            //    Console.WriteLine("End of process");

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
            }
            finally
            {
                if (doc_category != null)
                {
                    doc_category.Close();
                    doc_category = null;
                }

                if (doc_answer != null)
                {
                    doc_answer.Close();
                    doc_answer = null;
                }

                if (doc_question != null)
                {
                    doc_question.Close();
                    doc_question = null;
                }
            }
        }

        private bool IsLineStartWithChapterStartString(string line)
        {
            bool hitLine = false;
            for (int i = 0; i < this.chapterStartList.Count; i++)
            {
                if (line.StartsWith(this.chapterStartList[i]))
                {
                    hitLine = true;
                    break;
                }            
            }

            return hitLine;
        }

        private bool IsLineStartWithChapterDurationString(string line)
        {
            bool hitLine = false;
            for (int i = 0; i < this.chapterDurationList.Count; i++)
            {
                if (line.StartsWith(this.chapterDurationList[i]))
                {
                    hitLine = true;
                    break;
                }
            }

            return hitLine;
        }

        private bool IsLineStartWithQuestionStartString(string line)
        {
            bool hitLine = false;
            for (int i = 0; i < this.questionStartList.Count; i++)
            {
                if (line.StartsWith(this.questionStartList[i]))
                {
                    hitLine = true;
                    break;
                }
            }

            return hitLine;
        }

        private void ParseQuestionTitle(string line, SurveyQuestion question)
        {
            try
            {
                // check if line start with number (0 - 9) or dot (.)
                // if so, remove them from the the title

                line = line.Trim();
                if (!string.IsNullOrEmpty(line))
                {
                    int index = -1;
                    while (true)
                    {
                        var firstChar = line[index+1];
                        if (Char.IsDigit(firstChar) || firstChar == '.')
                        {
                            index++;
                        }
                        else
                        {
                            break;
                        }
                    }

                    if (index >= 0)
                    {
                        question.Question_Title = line.Substring(index + 1).Trim();
                    }
                    else
                    {
                        question.Question_Title = line.Trim();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
            }
        }

        private void ParseQuestionAnaswers(string line, SurveyQuestion question, int question_cnt)
        {
            try
            {
                bool hasError = false;
                string[] stringSeparators = new string[] { "  " };
                if (question != null)
                {
                    string pattern = "[a-z]";
                    List<string> list = new List<string>();

                    var matchCollection = Regex.Matches(line, pattern);

                    int previousIndex = 0;
                    foreach (Match m in matchCollection)
                    {
                        if (m.Index > previousIndex)
                        {
                            list.Add(line.Substring(previousIndex, m.Index - previousIndex));
                        }

                        previousIndex = m.Index;
                    }

                    if (previousIndex < line.Length - 1)
                    {
                        list.Add(line.Substring(previousIndex));
                    }

                    for (int i = 0; i < list.Count; i++)
                    {
                        string symbol = list[i].Substring(0, 1).Trim();
                        string content = list[i].Substring(1);
                        if (content.StartsWith("."))
                        {
                            content = content.Substring(1).Trim();
                        }

                        SurveyQuestionAnswer selection = new SurveyQuestionAnswer();
                        selection.AnswerSymbol = symbol;
                        selection.AnswerContent = content.Trim();

                        if (this.answerList[question_cnt].Contains(symbol))
                        {
                            selection.Is_Answer = true;
                        }
                        else
                        {
                            selection.Is_Answer = false;
                        }

                        question.AddSelection(selection);

                        if (!Regex.IsMatch(list[i], "^[a-z]"))
                        {
                            hasError = true;
                        }
                    }

                    if (question_cnt < this.categoryList.Count)
                    {
                        question.Category = this.categoryList[question_cnt].Category;
                        question.Books = new List<string>(this.categoryList[question_cnt].Books);
                    }

                    if (hasError)
                    {
                        this.errorText = this.errorText + "\n" + line;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
            }
        }

        private void WriteToFile(string content, string filePath)
        {
            try
            {
                using (var writer = new StreamWriter(filePath, false, Encoding.Unicode))
                {
                    writer.Write(content);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
            }
        }

        private bool HitCategoryStart(string line)
        {
            bool hitCategory = false;
            for (int i = 0; i < this.categoryStartList.Count; i++)
            {
                if (line.Contains(this.categoryStartList[i]))
                {
                    hitCategory = true;
                    break;
                }
            }
            return hitCategory;
        }

        private string ParseCategoryLine(string line)
        {
            string pattern = @"^[a-z, A-Z]\.";

            var matchCollection = Regex.Matches(line, pattern);

            string result;
            if (matchCollection.Count > 0)
            {
                result = line.Substring(matchCollection[0].Index + matchCollection[0].Length);
            }
            else
            {
                result = line;
            }

            return result.Trim();
        }

        private void ParseBookLine(string line, string category)
        {
            string[] array = line.Split(new char[] { '：' });

            if (array != null && array.Length == 2)
            {
                string book = array[0].Trim();
                string questions = array[1];

                string[] questionList = questions.Split(new char[] { ',' });

                for (int i = 0; i < questionList.Length; i++)
                {
                    int questiongNumber;
                    if (int.TryParse(questionList[i].Trim(), out questiongNumber))
                    {
                        if (questiongNumber <= this.categoryList.Count)
                        {
                            var questionCategory = this.categoryList[questiongNumber - 1];

                            if (string.IsNullOrEmpty(questionCategory.Category))
                            {
                                questionCategory.Category = category;
                            }

                            questionCategory.Books.Add(book);
                        }
                    }
                }
            }
        }
    }
}
