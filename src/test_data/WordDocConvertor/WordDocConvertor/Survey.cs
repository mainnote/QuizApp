using System.Collections.Generic;

namespace WordDocConvertor
{
    public class Survey
    {
        public Survey()
        {
            this.surveyChapters = new List<SurveyChapter>();
        }
        public List<SurveyChapter> surveyChapters { get; set; }
    }
}
