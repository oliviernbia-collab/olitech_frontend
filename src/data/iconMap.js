import {
  faCode,
  faShieldHalved,
  faPalette,
  faFileWord,
  faDownload,
  faChartLine,
  faVideo,
  faGlobe,
  faMobileScreen,
  faRobot,
  faEllipsis,
} from '@fortawesome/free-solid-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

// icon_key (stocke en base) -> icone Font Awesome + libelle pour le selecteur admin
export const iconMap = {
  code: { icon: faCode, label: 'Code / Programmation' },
  shield: { icon: faShieldHalved, label: 'Bouclier / Sécurité' },
  palette: { icon: faPalette, label: 'Palette / Design' },
  office: { icon: faFileWord, label: 'Bureautique' },
  download: { icon: faDownload, label: 'Téléchargement / Installation' },
  facebook: { icon: faFacebook, label: 'Facebook' },
  chart: { icon: faChartLine, label: 'Graphique / Suivi' },
  camera: { icon: faVideo, label: 'Caméra / Vidéosurveillance' },
  globe: { icon: faGlobe, label: 'Globe / Site web' },
  mobile: { icon: faMobileScreen, label: 'Mobile' },
  robot: { icon: faRobot, label: 'Robot / Automatisation' },
  ellipsis: { icon: faEllipsis, label: 'Autre' },
};

export const iconKeys = Object.keys(iconMap);

export function getIcon(iconKey) {
  return iconMap[iconKey]?.icon || faEllipsis;
}
