import SidebarTimeline from './layouts/SidebarTimeline';
import SidebarIconsSkills from './layouts/SidebarIconsSkills';
import StudentCv from './layouts/StudentCv';

// layout_key (stocke en base, cote backend) -> composant React de rendu.
// Doit rester synchronise avec backend/src/config/cvTemplates.js (VALID_LAYOUT_KEYS).
const layoutRegistry = {
  sidebar_timeline: SidebarTimeline,
  sidebar_icons_skills: SidebarIconsSkills,
  student_cv: StudentCv,
};

export function getLayoutComponent(layoutKey) {
  return layoutRegistry[layoutKey] || SidebarTimeline;
}
