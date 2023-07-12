import { labels, sections, getQuestionCoords, scores, scoreColours } from './common';
import { useMemo, useCallback } from 'react';
import { q25 } from './stats'
import prepareBoxplotData from '../utils/prepareBoxplotData';

export const usePrepareData = (props) => {
    const { scoreQuestionsBySection } = props;

    const answersBySection = useMemo(() =>
        scoreQuestionsBySection &&
        Object.entries(scoreQuestionsBySection).reduce((acc, [sectionId, sectionQuestions]) => {

            if (sections.includes(parseInt(sectionId))) {
                // console.log(true);
                const sectionScores = sectionQuestions.map(q => parseFloat(q.answer)).filter(score => !isNaN(score))

                acc[sectionId] = {
                    x: labels[sectionId-2],
                    y: sectionScores
                }
            }
            else {
                // console.log(false);
            }
            // console.log(acc);

            return acc;

        }, {}),
        [scoreQuestionsBySection]
    );

    // console.log(answersBySection);

    const { ready, source, categories, boxData, colors, frequencies, reversed } = useMemo(() => {

        let source, reversed, categories, boxData, colors, frequencies, q75s;
        let ready = false;
        if (answersBySection) {
            ready = true;
            reversed = Object.values(answersBySection).reverse();

            source = reversed.map((s, i) => s.y);
            categories = reversed.map(s => s.x)
            const preparedBoxplotData = prepareBoxplotData(source);
            // boxData = preparedBoxplotData.boxData;

            // TODO: replace with computed from boxData
            const quantiles = reversed.map(s => q25(s.y));
            colors = quantiles.map(v => scoreColours[parseInt(v)])
            boxData = reversed.map((s, i) => ({ value: preparedBoxplotData.boxData[i], itemStyle: { color: colors[i] } }));

            frequencies = reversed.map(s => {

                // TODO: check if maybe we can do better with hidden questions
                // right now we're only counting occurrences across all provided answers
                // const total = s.y.reduce((partialSum, a) => partialSum + a, 0);

                const counts = scores.reduce((acc, k) => {
                    acc[k] = null;
                    return acc
                }, {});

                for (const score of s.y) {
                    counts[score] = counts[score] ? counts[score] + 1 : 1;
                }

                const frequencies = Object.entries(counts).reduce((acc, [score, value]) => {
                    acc[score] = value / s.y.length * 100;

                    return acc;
                }, {});

                return frequencies

            });

        }

        return { ready, source, reversed, boxData, colors, frequencies, categories }

    }, [answersBySection]);
    const labeller = useCallback((i) => ready && reversed[i].x, [ready, reversed]);
    return { answersBySection, ready, source, reversed, boxData, colors, frequencies, categories, labeller }
}