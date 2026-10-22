import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faLocationDot, faUser } from '@fortawesome/free-solid-svg-icons';
import './StudentCv.css';

function Dots({ level = 0, max = 5 }) {
  return (
    <span className="cvtpl-student__dots">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < level ? 'is-filled' : ''} />
      ))}
    </span>
  );
}

function StudentCv({ data, palette, photoUrl }) {
  return (
    <div
      className="cvtpl-student"
      style={{
        '--cv-primary': palette.primary,
        '--cv-primary-light': palette.primaryLight,
        '--cv-accent': palette.accent,
        '--cv-on-primary': palette.onPrimary,
      }}
    >
      <header className="cvtpl-student__header">
        <div className="cvtpl-student__photo">
          {photoUrl ? <img src={photoUrl} alt={data.fullName} /> : <FontAwesomeIcon icon={faUser} />}
        </div>
        <div>
          <span className="cvtpl-student__eyebrow">CV Etudiant</span>
          <h1>{data.fullName}</h1>
          <p>{data.jobTitle}</p>
        </div>
      </header>

      <div className="cvtpl-student__body">
        <aside className="cvtpl-student__sidebar">
          <div className="cvtpl-student__block">
            <h3>Contact</h3>
            <ul>
              <li>
                <FontAwesomeIcon icon={faPhone} /> {data.phone}
              </li>
              <li>
                <FontAwesomeIcon icon={faEnvelope} /> {data.email}
              </li>
              <li>
                <FontAwesomeIcon icon={faLocationDot} /> {data.address}
              </li>
            </ul>
          </div>

          {data.languages?.length > 0 && (
            <div className="cvtpl-student__block">
              <h3>Langues</h3>
              {data.languages.map((lang) => (
                <div className="cvtpl-student__rating" key={lang.name}>
                  <span>{lang.name}</span>
                  <Dots level={lang.level} />
                </div>
              ))}
            </div>
          )}

          {data.skills?.length > 0 && (
            <div className="cvtpl-student__block">
              <h3>Competences</h3>
              {data.skills.map((skill) => (
                <div className="cvtpl-student__rating" key={skill.name}>
                  <span>{skill.name}</span>
                  <Dots level={skill.level} />
                </div>
              ))}
            </div>
          )}

          {data.hobbies?.length > 0 && (
            <div className="cvtpl-student__block">
              <h3>Qualites</h3>
              <div className="cvtpl-student__tags">
                {data.hobbies.map((hobby) => (
                  <span key={hobby}>{hobby}</span>
                ))}
              </div>
            </div>
          )}
        </aside>

        <main className="cvtpl-student__main">
          <section className="cvtpl-student__section">
            <h2>Profil</h2>
            <p className="cvtpl-student__profile">{data.profile}</p>
          </section>

          {data.education?.length > 0 && (
            <section className="cvtpl-student__section">
              <h2>Formation</h2>
              <div className="cvtpl-student__list">
                {data.education.map((item) => (
                  <div className="cvtpl-student__item" key={item.title + item.period}>
                    <span className="cvtpl-student__dot" />
                    <div>
                      <span className="cvtpl-student__period">{item.period}</span>
                      <strong>{item.title}</strong>
                      <span className="cvtpl-student__place">{item.place}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.experience?.length > 0 && (
            <section className="cvtpl-student__section">
              <h2>Stages / Experiences</h2>
              <div className="cvtpl-student__list">
                {data.experience.map((item) => (
                  <div className="cvtpl-student__item" key={item.title + item.period}>
                    <span className="cvtpl-student__dot" />
                    <div>
                      <span className="cvtpl-student__period">{item.period}</span>
                      <strong>{item.title}</strong>
                      <span className="cvtpl-student__place">{item.place}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.projects?.length > 0 && (
            <section className="cvtpl-student__section">
              <h2>Projets academiques</h2>
              <div className="cvtpl-student__projects">
                {data.projects.map((project) => (
                  <div className="cvtpl-student__project" key={project.title}>
                    <strong>{project.title}</strong>
                    <p>{project.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default StudentCv;
