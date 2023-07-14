// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { stripHtml } from "string-strip-html";

var limesurvey = require('node-limesurvey')({
  url: 'https://mudilabresearch.altervista.org:443/limesurvey/admin/remotecontrol',
  username: process.env.LS_USER,
  password: process.env.LS_PASSWORD
})

import { getQuestionCoords } from '../../components/common';

export default async function handler(req, res) {

  const { survey_id, response_id, token } = req.query;

  let rawResponses = (token && token != 'undefined') ? limesurvey.getResponsesByToken(survey_id, token) : limesurvey.getResponsesById(survey_id, response_id);
  //console.error('B', responses2)

  let rawQuestions = limesurvey.getQuestions(survey_id)

  const questions = await rawQuestions;
  const responses = (await rawResponses)[0];

  const systemQuestions = [];

  let section = 0;

  
  const answeredQuestions = questions && questions.map(q => {

    const rawQuestionId = q.title;

    if (q.question_order == '1')
      section = section + 1;

    const questionCoords = getQuestionCoords(rawQuestionId, section);

    // This only happens when working with the 'responses' dict rather than the questions with q.title
    if (!questionCoords)
      throw new Error('INVALID_QUESTION_ID ' + rawQuestionId)

    let { questionId, sectionId, explanatoryNotes, systemSection, serviceSection } = questionCoords;

    const rawAnswer = responses[q.title];

    const answer = rawAnswer && stripHtml(rawAnswer).result || '-';
    return {
      ...q,
      title: q.title,
      explanatoryNotes,
      answer,
      questionId,
      sectionId,
      systemSection,
      serviceSection
    }

  })



  const scoreQuestionsBySection = {};

  answeredQuestions && answeredQuestions.map(q => {

    const s = q.sectionId;

    if (q.serviceSection)
      return;

    if (!scoreQuestionsBySection[s])
      scoreQuestionsBySection[s] = [];

    scoreQuestionsBySection[s].push(q);

  });

  res.status(200).json({ data: { responses, systemQuestions, scoreQuestionsBySection } })
}

