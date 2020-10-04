using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WordDocConvertor
{
    public class SurveyChapter
    {
        public SurveyChapter()
        {
            this.Descriptions = new List<string>();
            this.Questions = new List<SurveyQuestion>();
        }
        public string Title { get; set; }
        public string Duration { get; set; }
        public string QuestionRemind { get; set; }
        public List<string> Descriptions { get; set; }
        public List<SurveyQuestion> Questions { get; set; }
    }
}
