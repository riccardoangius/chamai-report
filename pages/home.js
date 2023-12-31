
import { Fragment, useState, useEffect, useMemo } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import { Audio } from 'react-loader-spinner';
import { useResponse } from '../hooks/useResponse'
import { BoxPlot } from '../components/boxplot'
import { BarChart } from '../components/barchart'
import { Questions } from '../components/Questions'
import { sections } from '../components/common'

import { SectionScore } from '../components/SectionScore'

const title = "Checklist for assessment of Medical AI";

export default function Home() {

  const router = useRouter();

  const { sid: survey_id = '388458', rid: response_id = '1', token } = router.query;

  const { responses, systemQuestions, scoreQuestionsBySection } = useResponse({ shouldRequest: router.isReady, response_id, survey_id, token })

  // useEffect(() => {
  //   // console.log(responses, systemQuestions, scoreQuestionsBySection);
  //   console.log('scoreQuestionsBySection', scoreQuestionsBySection);
  // }, [responses, systemQuestions, scoreQuestionsBySection])

  
  if (!responses)
    return (
      <div className={styles.loader}>
        <Audio
          height="80"
          width="80"
          radius="9"
          color="green"
          ariaLabel="loading"
          wrapperStyle
          wrapperClass
        />
      </div>
    );



  return (
    <div className={styles.container}>
      <Head>
        <title>{`${title} - Report`}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          {title}
        </h1>
        <h1>Report</h1>
        <h2>Recorded on: {responses && new Date(responses.submitdate).toLocaleDateString('en-GB')} </h2>
        <h2>Project information</h2>
        <div>

          <Questions sections={[1]} scoreQuestionsBySection={scoreQuestionsBySection} />

        </div>
        <div className={styles.section} id="assessment">

          Based on your answers, the assessment is as follows:
          <div className={styles.sectionScores}>
            {sections.map(s => <SectionScore s={s} scoreQuestionsBySection={scoreQuestionsBySection} key={s}/>)}
          </div>

        </div>
        <div className={styles.highlight} id="stats">

          <h2>At a glance </h2>
          <div className={styles.charts}>
            {/* {response && JSON.stringify(response)} */}
            <BoxPlot scoreQuestionsBySection={scoreQuestionsBySection} /><br /><br /><br />
            <BarChart scoreQuestionsBySection={scoreQuestionsBySection} />
          </div>

        </div>
        <div className={styles.section}>

          <h2>Responses </h2>
          <div className={styles.questions}>
            <Questions sections={sections} scoreQuestionsBySection={scoreQuestionsBySection} allowSort={true} />
          </div>
        </div>
        {/* <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>
        
        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div> */}
      </main>

      <footer className={styles.footer}>
        {/* <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a> */}
      </footer>
    </div>
  )
}
