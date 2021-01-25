import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Hello! I'm Ahmed Gedi</p>
        <p>
          I'm a Portland based Security engineer & Full stack developer  
        </p>
      </section>
    </Layout>
  )
}
