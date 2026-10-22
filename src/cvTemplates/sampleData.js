// Donnees d'exemple affichees dans les apercus du catalogue, avant que
// l'acheteur ne remplisse ses propres informations (formulaire de commande).
export const sampleCvData = {
  fullName: 'Prenom NOM',
  jobTitle: 'Intitule du poste recherche',
  phone: '+225 00 00 00 00',
  email: 'prenom.nom@exemple.com',
  address: 'Abidjan, Cote d\'Ivoire',
  profile:
    "Resume professionnel : presentez en quelques lignes votre parcours, vos atouts et l'objectif de votre candidature.",
  education: [
    { period: '2022 - 2025', title: 'Diplome / Formation', place: "Nom de l'etablissement" },
    { period: '2020 - 2022', title: 'Diplome precedent', place: "Nom de l'etablissement" },
  ],
  experience: [
    {
      period: '2023 - Present',
      title: 'Intitule du poste',
      place: "Nom de l'entreprise",
      bullets: ['Principale mission ou realisation', 'Deuxieme mission ou resultat obtenu'],
    },
    {
      period: '2021 - 2023',
      title: 'Intitule du poste precedent',
      place: "Nom de l'entreprise",
      bullets: ['Principale mission ou realisation'],
    },
  ],
  projects: [
    { title: "Nom du projet academique", description: 'Courte description du projet realise.' },
  ],
  skills: [
    { name: 'Competence 1', level: 4 },
    { name: 'Competence 2', level: 3 },
    { name: 'Competence 3', level: 5 },
  ],
  languages: [
    { name: 'Francais', level: 5 },
    { name: 'Anglais', level: 3 },
  ],
  hobbies: ['Lecture', 'Sport', 'Voyages'],
};
