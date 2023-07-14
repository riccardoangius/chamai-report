
import { Fragment, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';

import HTMLReactParser, { domToReact } from 'html-react-parser';
import { scoreColours, sectionNames } from '../common';
import styles from './questions.module.css'



import { IoIosClose, IoIosArrowDown } from 'react-icons/io';

const ScoredQuestion = props => {

    const { q } = props;

    if (q.serviceSection)
        return null;

    const answer = q.answer;
    const colour = scoreColours[parseInt(answer)];

    const openResponse = q.systemSection && !q.multipleChoice;

    return (
        <div
            id={q.title}
            className={`${styles.item} ${openResponse && styles.openResponse || null} ${q.multipleChoice && styles.multipleChoice}`}
            key={q.title} >
            <div className={styles.colour} style={{ backgroundColor: colour }} />

            <div className={`${styles.question} ${q.systemSection && styles.bold}`}>
                {/* {q.title} */}
                {/* &nbsp;{q.sectionId} - {q.questionId} - {q.systemSection.toString()} */}
                {/* <br></br> */}
                {!q.explanatoryNotes && HTMLReactParser(q.question, { replace })}
                {/* {q.help && <div className={styles.refTrigger}>•••</div>}<div className={styles.ref}>{HTMLReactParser(q.help, { replace })}</div>*/}
                {q.explanatoryNotes && <div>{answer}</div>}
            </div>
            <div className={styles.answer}>
                {!q.explanatoryNotes && answer}
            </div>

        </div>
    )

}


const QuestionIndicator = props => {
    const { q, handleClick, text } = props;

    if (q.serviceSection)
        return null;

    if (q.systemSection)
        return;

    const answer = q.answer;
    const colour = scoreColours[parseInt(answer)];

    return (
        <div className={`${styles.summaryItem}`} key={q.title}>

            <Link href={`#${q.title}`}>

                <a className={styles.link} onClick={handleClick}>
                    <div className={styles.dot} style={{ backgroundColor: colour }} data-q={q.question}>
                        {text || q.question.match(/(\d+\.\d+)+/g)}


                    </div>

                </a>
            </Link>
            <div className={`${styles.question}`}>

                <div className={`${styles.value}`}>
                    {/* 
                                        {q.title}
                                            &nbsp;
                                            <br></br> 
                                            
                                            */}
                    {HTMLReactParser(q.question, { replace })}
                </div>
            </div>


        </div>
    )

}

const scoreSorter = (a, b) => {

    if (a.sectionId == b.sectionId)
        return a.answer - b.answer
    else if (a.sectionId != b.sectionId)
        return a.sectionId > b.sectionId

}

const replace = (node) => {
    let cleanNode = node;
    // do not render any style
    if (node.type == 'tag' && node.attribs && node.attribs.style) {

        
        if (node.attribs.style)
            node.attribs.style = null;
        if (node.attribs.href)
            node.attribs.target = "_blank";
    }
    cleanNode = domToReact(node)
    return cleanNode
    // return children for font tags
    if (node.type === 'tag' && node.name === 'font') {
        if (node.children.length == 1)
            return HTMLReactParser(node.children[0].toString());
    }

    if (node.type === 'tag' && node.name === 'p' && node.children.length == 1 && node.children[0].type == 'text') {
        const data = node.children[0].data.replace(/[\r\n]/g, "");
        if (data == '' && data.startsWith(' '))
            return <Fragment />;
    }
}


export const Menu = props => {
    const { scoreQuestionsBySection, sections, checked } = props;

    const [menuOpen, setMenuOpen] = useState(false);

    const handleClick = () => setMenuOpen(s => !s);

    const menuToggle = useMemo(() => (
        <span className={(menuOpen && styles.menuOpenToggle) || styles.menuToggle} onClick={handleClick}>
            <b>Explore answers</b>

            {menuOpen && <IoIosClose /> || <IoIosArrowDown />}
        </span>
    ), [menuOpen]);

    if (!scoreQuestionsBySection)
        return null;

    return (<Fragment>
        {menuToggle}
        <div className={(menuOpen && styles.menuOpen) || styles.menu}>
            <div className={styles.questionLinks}>
                <QuestionIndicator text={"PI"} q={{ title: "", question: "Project information" }} handleClick={handleClick} />
                <QuestionIndicator text={"AS"} q={{ title: "assessment", question: "Project assessment" }} handleClick={handleClick} />
                <QuestionIndicator text={"ST"} q={{ title: "stats", question: "Statistics" }} handleClick={handleClick} />
                {sections.map(s => {
                    const questions = scoreQuestionsBySection[s];

                    if (!questions) {
                        console.error(s, scoreQuestionsBySection);
                    }

                    const sorted = checked ? [...questions].sort(scoreSorter) : questions;

                    return (
                        sorted.map(q => <QuestionIndicator q={q} key={q.title} handleClick={handleClick} />)
                    )
                }
                )}


            </div >
        </div>
    </Fragment>
    )
}

export const Questions = props => {
    const { sections, scoreQuestionsBySection, allowSort = false } = props;
    const [checked, setChecked] = useState(false);

    if (!scoreQuestionsBySection)
        return null;

    return (
        <Fragment>
            <div className={styles.questions}>

                {allowSort && <div className={styles.sortControl}><input
                    type="checkbox"
                    id='sortByScore'
                    checked={checked}
                    onChange={() => setChecked(v => !v)}
                /> <label htmlFor='sortByScore'>Sort by score</label></div>}


                {sections.map(s => {
                    const questions = scoreQuestionsBySection[s];

                    if (!questions) {
                        console.error(s, scoreQuestionsBySection);
                    }

                    const sorted = checked ? [...questions].sort(scoreSorter) : questions;

                    return (
                        <div key={s}>
                            <h3 className={styles.sectionTitle} id={`section_${s}`}>{sectionNames[s]}</h3>
                            {sorted.map(q => <ScoredQuestion q={q} key={q.title} />)}
                        </div>
                    )
                }
                )}


            </div >
            {allowSort && <Menu {...props} checked={checked} />}
        </Fragment>


    )
}