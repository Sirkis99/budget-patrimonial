import { useState } from "react";

const comptes = [
  "Compte courant",
  "Livret A",
  "Assurance-vie",
  "PEE",
  "PER",
  "Fonds voiture",
];

const categories = {
  Revenus: [
    "Salaire Thierry",
    "Salaire Jennifer",
    "SAP",
    "Don parental",
    "Autres revenus",
  ],

  "Charges fixes": [
    "Électricité",
    "Eau",
    "Taxe foncière",
    "Assurances",
    "Abonnements",
    "Poubelles",
  ],

  "Vie courante": [
    "Courses",
    "Carburant",
    "Restaurants",
    "Loisirs",
    "Vêtements",
    "Santé",
    "Divers",
    "Vacances",
  ],

  Enfants: [
    "Épargne enfants",
    "Dépenses enfants",
  ],

  "Jardin / Maison": [
    "Paysagiste CESU",
    "Paysagiste solde",
    "Piscine entretien",
    "Bois",
  ],

  Transport: [
    "Titre transport",
    "Entretien voiture 1",
    "Voiture 2",
  ],

  Patrimoine: [
    "AV",
    "PEE",
    "PER",
    "Fonds voiture",
  ],

  Projets: [
    "Piscine",
    "Climatisation",
    "Voiture principale",
    "Cabanon",
  ],
};

export default function App() {
  const [form, setForm] = useState({
    date: new Date().toISOString().substring(0, 10),
    libelle: "",
    categorie: "Courses",
    compte: "Compte courant",
    montant: "",
    commentaire: "",
  });

  function update(field, value) {
    setForm({
      ...form,
      [field]: value,
    });
  }

  function enregistrer