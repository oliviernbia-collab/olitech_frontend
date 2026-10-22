import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhone,
  faEnvelope,
  faLocationDot,
  faGlobe,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import './SidebarTimeline.css';

function SidebarTimeline({ data, palette, photoUrl }) {
  return (
    <div
      className="cvtpl-timeline"
      style={{
        '--cv-primary': palette.primary,
        '--cv-primary-light': palette.primaryLight,
        '--cv-accent': palette.accent,
        '--cv-sidebar-bg': palette.sidebarBg,
        '--cv-sidebar-text': palette.sidebarText,
        '--cv-on-primary': palette.onPrimary,
      }}
    >
      <aside className="cvtpl-timeline__sidebar">
        <div className="cvtpl-timeline__photo">
          {photoUrl ? <img src={photoUrl} alt={data.fullName} /> : <FontAwesomeIcon icon={faUser} />}
        </div>

        <div className="cvtpl-timeline__block">
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
          <div className="cvtpl-timeline__block">
            <h3>Langues</h3>
            <ul className="cvtpl-timeline__plain-list">
              {data.languages.map((lang) => (
                <li key={lang.name}>{lang.name}</li>
              ))}
            </ul>
          </div>
        )}

        {data.skills?.length > 0 && (
          <div className="cvtpl-timeline__block">
            <h3>Expertise</h3>
            <ul className="cvtpl-timeline__plain-list">
              {data.skills.map((skill) => (
                <li key={skill.name}>{skill.name}</li>
              ))}
            </ul>
          </div>
        )}

        {data.hobbies?.length > 0 && (
          <div className="cvtpl-timeline__block">
            <h3>Centres d'interet</h3>
            <p className="cvtpl-timeline__hobbies">{data.hobbies.join(' / ')}</p>
          </div>
        )}
      </aside>

      <main className="cvtpl-timeline__main">
        <header className="cvtpl-timeline__header">
          <h1>{data.fullName}</h1>
          <p>{data.jobTitle}</p>
        </header>

        <section className="cvtpl-timeline__section">
          <h2>
            <FontAwesomeIcon icon={faGlobe} /> Profil
          </h2>
          <p className="cvtpl-timeline__profile">{data.profile}</p>
        </section>

        {data.education?.length > 0 && (
          <section className="cvtpl-timeline__section">
            <h2>Formation</h2>
            <div className="cvtpl-timeline__list">
              {data.education.map((item) => (
                <div className="cvtpl-timeline__item" key={item.title + item.period}>
                  <span className="cvtpl-timeline__dot" />
                  <div>
                    <span className="cvtpl-timeline__period">{item.period}</span>
                    <strong>{item.title}</strong>
                    <span className="cvtpl-timeline__place">{item.place}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.experience?.length > 0 && (
          <section className="cvtpl-timeline__section">
            <h2>Experience</h2>
            <div className="cvtpl-timeline__list">
              {data.experience.map((item) => (
                <div className="cvtpl-timeline__item" key={item.title + item.period}>
                  <span className="cvtpl-timeline__dot" />
                  <div>
                    <span className="cvtpl-timeline__period">{item.period}</span>
                    <strong>{item.title}</strong>
                    <span className="cvtpl-timeline__place">{item.place}</span>
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
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default SidebarTimeline;
