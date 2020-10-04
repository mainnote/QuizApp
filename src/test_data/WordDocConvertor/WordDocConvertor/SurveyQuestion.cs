using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WordDocConvertor
{
    public class SurveyQuestion
    {
        public SurveyQuestion()
        {
            this.Selections = new List<SurveyQuestionAnswer>();
        }
        public string Question_Title { get; set; }
        public string Question_No { get; set; }
        public string Category { get; set; }
        public List<string> Books { get; set; }
        public List<SurveyQuestionAnswer> Selections { get; set; }
        public void AddSelection(SurveyQuestionAnswer selection)
        {
            this.Selections.Add(selection);
        }
    }
}
