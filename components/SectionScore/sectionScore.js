
import { Fragment, useState } from 'react';
import Link from 'next/link';
import styles from './sectionScore.module.css'
import { scoreColours, sectionNames, ScoreLevelMap, ScoreLevels } from '../common';
import hexToRgba from 'hex-to-rgba';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export const SectionScore = props => {
    const { s, scoreQuestionsBySection } = props;


    if (!scoreQuestionsBySection)
        return

    // console.log(`Section ${s}`);
    // console.log(scoreQuestionsBySection[s]);
    
    const scores = scoreQuestionsBySection[s].map(q => parseInt(q.answer));
    const maxTotal = scores.length * 6;

    const assignedScores = scores.filter(s => !isNaN(s))

    const percentage = assignedScores.reduce((partialSum, a) => partialSum + a, 0) / maxTotal;

    // console.log(percentage);
    // const min = (scores.length > 0 && Math.min(...scores)) || 0;
    // const percentage = (min / 6) * 100;
    const inverse = Math.round((percentage) * 6); 
    const colour = scoreColours[inverse];

    return (
        <div className={styles.root}>
            <Link href={`#section_${s}`}>

                <a>
                    <CircularProgressbarWithChildren value={percentage*100}
                        styles={buildStyles({
                            // Rotation of path and trail, in number of turns (0-1)
                            rotation: 0.25,

                            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                            strokeLinecap: 'butt',

                            // Text size
                            textSize: '16px',

                            // How long animation takes to go from one percentage to another, in seconds
                            pathTransitionDuration: 0.5,

                            // Can specify path transition in more detail, or remove it entirely
                            // pathTransition: 'none',

                            // Colors
                            pathColor: hexToRgba(colour, 100),
                            textColor: '#f88',
                            trailColor: '#d6d6d6',
                            backgroundColor: '#3e98c7',
                        })}
                    >
                        <div className={styles.details}>
                            <div className={styles.score} style={{ color: colour }}>{Math.round(percentage*100)}%</div>
                            {ScoreLevelMap[inverse]}

                        </div>
                    </CircularProgressbarWithChildren >
                    <h4>{sectionNames[s]}</h4></a>
            </Link>
        </div>
    )
}