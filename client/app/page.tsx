import Head from 'next/head';
import styles from '../styles/globals.css';

export default function Home() {
  return (
    <div>
      <Head>
        <title>BLOOD+ | Saves Lives</title>
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
      </Head>
      <nav>
        <div className={styles.logo}>
          <img src="/logo.png" alt="Blood+ Logo" />
        </div>
        <a href="/"><button className={styles.menuButton}>HOME</button></a>
        <a href="/aboutblood+"><button className={styles.menuButton}>ABOUT BLOOD+</button></a>
        <a href="/contact"><button className={styles.menuButton}>CONTACT</button></a>
        <a href="/bloodbanks"><button className={styles.menuButton}>BLOOD BANKS</button></a>
      </nav>
      <h1>Welcome To Blood+, a digital resource for blood access and donations</h1>
      <section>
        <img src="/images/blood_donor.jpg" alt="Blood Donation" className={styles.centerImage} />
      </section>
    </div>
  );
}
