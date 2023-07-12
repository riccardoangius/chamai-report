export const sections = [2, 3, 4, 5, 6, 7]

export const sectionNames = ['', '', 'PROBLEM UNDERSTANDING', 'DATA UNDERSTANDING', 'DATA PREPARATION',
  'MODELING', 'VALIDATION', 'DEPLOYMENT']



export const ScoreLevels = { High: "HIGH IMPACT", Medium: "MEDIUM IMPACT", Low: "LOW IMPACT" }
export const ScoreLevelMap = {
  1: ScoreLevels.High,
  2: ScoreLevels.Medium,
  3: ScoreLevels.Medium,
  4: ScoreLevels.Low,
}
export const labels = sections.map(s => s + '. ' + sectionNames[s])

export const scores = [1, 2, 3, 4];
export const scoreColours = ['#fbc3bc', '#f7a399', '#f38375', '#ef6351'];

export const fetchResponse = async (survey_id, token, response_id, fn) => {

  const res = await fetch(`/api/fetchResponse?survey_id=${survey_id}&token=${token}&response_id=${response_id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  const data = (await res.json()).data;

  fn(data);
  return data
}

export const getQuestionCoords = (rawQuestionId, sectionId) => {

  const referencesDummyQuestion = "G08Q62";
    
  const questionIdMatches = rawQuestionId.match(/^(G08Q62|INTROD|(IN|Q|A)\d+)$/);

  if (!questionIdMatches)
    return;

  const questionId = questionIdMatches[0];

  const systemSection = Math.floor(sectionId) == 1;

  const serviceSection = rawQuestionId.startsWith('INTROD') || rawQuestionId.startsWith('G08Q62');
  const explanatoryNotes = rawQuestionId.startsWith('A');

  return { questionId, sectionId, explanatoryNotes, systemSection, serviceSection };

}
