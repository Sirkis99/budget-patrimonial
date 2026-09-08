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

  function enregistrer(e) {
    e.preventDefault();

    console.log("Mouvement :", form);

    alert("Mouvement enregistré (étape suivante : stockage local)");
  }

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "auto",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      <h1>📊 Budget Patrimonial</h1>

      <form onSubmit={enregistrer}>
        <div style={{ marginBottom: "15px" }}>
          <label>Date</label>
          <br />
          <input
            type="date"
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Libellé</label>
          <br />
          <input
            type="text"
            value={form.libelle}
            onChange={(e) => update("libelle", e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Catégorie</label>
          <br />
          <select
            value={form.categorie}
            onChange={(e) => update("categorie", e.target.value)}
          >
            {Object.entries(categories).map(([groupe, valeurs]) => (
              <optgroup key={groupe} label={groupe}>
                {valeurs.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Compte</label>
          <br />
          <select
            value={form.compte}
            onChange={(e) => update("compte", e.target.value)}
          >
            {comptes.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Montant (€)</label>
          <br />
          <input
            type="number"
            step="0.01"
            value={form.montant}
            onChange={(e) => update("montant", e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Commentaire</label>
          <br />
          <textarea
            rows="3"
            value={form.commentaire}
            onChange={(e) => update("commentaire", e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <button type="submit">
          Enregistrer le mouvement
        </button>
      </form>
    </div>
  );
}