import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhone,
  faEnvelope,
  faLocationDot,
  faUser,
  faGlobe,
  faGraduationCap,
  faBriefcase,
  faLanguage,
  faStar,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import './SidebarIconsSkills.css';

function LevelBar({ level = 0, max = 5 }) {
  return (
    <div className="cvtpl-icons__bar">
      <div className="cvtpl-icons__bar-fill" style={{ width: `${(level / max) * 100}%` }} />
    </div>
  );
}

function SidebarIconsSkills({ data, palette, photoUrl }) {
  return (
    <div
      className="cvtpl-icons"
      style={{
        '--cv-primary': palette.primary,
        '--cv-primary-light': palette.primaryLight,
        '--cv-accent': palette.accent,
        '--cv-on-primary': palette.onPrimary,
      }}
    >
      <aside className="cvtpl-icons__sidebar">
        <div className="cvtpl-icons__photo">
          {photoUrl ? <img src={photoUrl} alt={data.fullName} /> : <FontAwesomeIcon icon={faUser} />}
        </div>
        <h1>{data.fullName}</h1>
        <p className="cvtpl-icons__title">{data.jobTitle}</p>

        <div className="cvtpl-icons__block">
          <h3>
            <span className="cvtpl-icons__badge">
              <FontAwesomeIcon icon={faPhone} />
            </span>
            Contact
          </h3>
          <ul>
            <li>{data.phone}</li>
            <li>{data.email}</li>
            <li>
              <FontAwesomeIcon icon={faLocationDot} /> {data.address}
            </li>
          </ul>
        </div>

        {data.skills?.length > 0 && (
          <div className="cvtpl-icons__block">
            <h3>
              <span className="cvtpl-icons__badge">
                <FontAwesomeIcon icon={faStar} />
              </span>
              Competences
            </h3>
            {data.skills.map((skill) => (
              <div className="cvtpl-icons__skill" key={skill.name}>
                <span>{skill.name}</span>
                <LevelBar level={skill.level} />
              </div>
            ))}
          </div>
        )}

        {data.languages?.length > 0 && (
          <div className="cvtpl-icons__block">
            <h3>
              <span className="cvtpl-icons__badge">
                <FontAwesomeIcon icon={faLanguage} />
              </span>
              Langues
            </h3>
            {data.languages.map((lang) => (
              <div className="cvtpl-icons__skill" key={lang.name}>
                <span>{lang.name}</span>
                <LevelBar level={lang.level} />
              </div>
            ))}
          </div>
        )}

        {data.hobbies?.length > 0 && (
          <div className="cvtpl-icons__block">
            <h3>
              <span className="cvtpl-icons__badge">
                <FontAwesomeIcon icon={faHeart} />
              </span>
              Loisirs
            </h3>
            <p className="cvtpl-icons__hobbies">{data.hobbies.join(' / ')}</p>
          </div>
        )}
      </aside>

      <main className="cvtpl-icons__main">
        <section className="cvtpl-icons__section">
          <h2>
            <span className="cvtpl-icons__icon-circle">
              <FontAwesomeIcon icon={faGlobe} />
            </span>
            Profil
          </h2>
          <p className="cvtpl-icons__profile">{data.profile}</p>
        </section>

        {data.education?.length > 0 && (
          <section className="cvtpl-icons__section">
            <h2>
              <span className="cvtpl-icons__icon-circle">
                <FontAwesomeIcon icon={faGraduationCap} />
              </span>
              Formation
            </h2>
            {data.education.map((item) => (
              <div className="cvtpl-icons__entry" key={item.title + item.period}>
                <span className="cvtpl-icons__period">{item.period}</span>
                <div>
                  <strong>{item.title}</strong>
                  <span className="cvtpl-icons__place">{item.place}</span>
                </div>
              </div>
            ))}
          </section>
        )}

        {data.experience?.length > 0 && (
          <section className="cvtpl-icons__section">
            <h2>
              <span className="cvtpl-icons__icon-circle">
                <FontAwesomeIcon icon={faBriefcase} />
              </span>
              Experience
            </h2>
            {data.experience.map((item) => (
              <div className="cvtpl-icons__entry" key={item.title + item.period}>
                <span className="cvtpl-icons__period">{item.period}</span>
                <div>
                  <strong>{item.title}</strong>
                  <span className="cvtpl-icons__place">{item.place}</span>
                  {item.bullets?.length > 0 && (
                    <ul>
                      {item.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default SidebarIconsSkills;
