import { useState, useEffect } from "react";

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

  Enfants: ["Épargne enfants", "Dépenses enfants"],

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

const categoriesRevenus = [
  "Salaire Thierry",
  "Salaire Jennifer",
  "SAP",
  "Don parental",
  "Autres revenus",
];

function exporterCSV(mouvements) {
  if (mouvements.length === 0) {
    alert("Aucun mouvement à exporter");
    return;
  }

  const entete =
    "Date;Libelle;Categorie;Compte;Montant;Commentaire";

  const lignes = mouvements.map((m) =>
    [
      m.date,
      m.libelle,
      m.categorie,
      m.compte,
      m.montant,
      m.commentaire,
    ].join(";")
  );

  const contenu = [entete, ...lignes].join("\n");

const BOM = "\uFEFF";

const blob = new Blob(
  [BOM + contenu],
  {
    type: "text/csv;charset=utf-8;"
  }
);

  const url =
    window.URL.createObjectURL(blob);

  const lien =
    document.createElement("a");

  lien.href = url;

  lien.download =
    "mouvements_budget.csv";

  lien.click();

  window.URL.revokeObjectURL(url);
}

export default function App() {
  const [mouvements, setMouvements] = useState(() => {
  const sauvegarde =
    localStorage.getItem("budget-mouvements");

  return sauvegarde
    ? JSON.parse(sauvegarde)
    : [];
});

  const [form, setForm] = useState({
    date: new Date().toISOString().substring(0, 10),
    libelle: "",
    categorie: "Courses",
    compte: "Compte courant",
    montant: "",
    commentaire: "",
  });

  useEffect(() => {
    localStorage.setItem(
      "budget-mouvements",
      JSON.stringify(mouvements)
    );
  }, [mouvements]);

  function update(field, value) {
    setForm({
      ...form,
      [field]: value,
    });
  }

  function enregistrer(e) {
    e.preventDefault();

    let montant = parseFloat(form.montant);

    if (isNaN(montant)) {
      alert("Montant invalide");
      return;
    }

    if (!categoriesRevenus.includes(form.categorie)) {
      montant = -Math.abs(montant);
    } else {
      montant = Math.abs(montant);
    }

    const nouveauMouvement = {
      id: Date.now(),
      ...form,
      montant,
    };

    setMouvements([nouveauMouvement, ...mouvements]);

    setForm({
      date: new Date().toISOString().substring(0, 10),
      libelle: "",
      categorie: "Courses",
      compte: "Compte courant",
      montant: "",
      commentaire: "",
    });
  }

  function supprimer(id) {
    setMouvements(
      mouvements.filter((m) => m.id !== id)
    );
  }

  const revenus = mouvements
    .filter((m) => m.montant > 0)
    .reduce((s, m) => s + m.montant, 0);

  const depenses = mouvements
    .filter((m) => m.montant < 0)
    .reduce((s, m) => s + Math.abs(m.montant), 0);

  const solde = revenus - depenses;

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "auto",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      <h1>📊 Budget Patrimonial</h1>

      <form onSubmit={enregistrer}>
        <div style={{ marginBottom: 15 }}>
          <label>Date</label>
          <br />
          <input
            type="date"
            value={form.date}
            onChange={(e) =>
              update("date", e.target.value)
            }
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Libellé</label>
          <br />
          <input
            type="text"
            value={form.libelle}
            onChange={(e) =>
              update("libelle", e.target.value)
            }
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Catégorie</label>
          <br />
          <select
            value={form.categorie}
            onChange={(e) =>
              update("categorie", e.target.value)
            }
          >
            {Object.entries(categories).map(
              ([groupe, valeurs]) => (
                <optgroup
                  key={groupe}
                  label={groupe}
                >
                  {valeurs.map((v) => (
                    <option key={v}>
                      {v}
                    </option>
                  ))}
                </optgroup>
              )
            )}
          </select>
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Compte</label>
          <br />
          <select
            value={form.compte}
            onChange={(e) =>
              update("compte", e.target.value)
            }
          >
            {comptes.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Montant</label>
          <br />
          <input
            type="number"
            step="0.01"
            value={form.montant}
            onChange={(e) =>
              update("montant", e.target.value)
            }
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Commentaire</label>
          <br />
          <textarea
            rows="3"
            value={form.commentaire}
            onChange={(e) =>
              update("commentaire", e.target.value)
            }
            style={{ width: "100%" }}
          />
        </div>

        <button type="submit">
          Enregistrer
        </button>
      </form>

      <hr />

      <h2>Résumé</h2>

      <p>
        Revenus :
        {" "}
        <strong style={{ color: "green" }}>
          + {revenus.toFixed(2)} €
        </strong>
      </p>

      <p>
        Dépenses :
        {" "}
        <strong style={{ color: "red" }}>
          - {depenses.toFixed(2)} €
        </strong>
      </p>

      <p>
        Solde :
        {" "}
        <strong>
          {solde.toFixed(2)} €
        </strong>
      </p>

      <hr />

      <h2>Mouvements</h2>

      <button
  onClick={() =>
    exporterCSV(mouvements)
  }
  style={{
    marginBottom: "20px",
    background: "green",
    color: "white",
    padding: "10px",
  }}
>
  Exporter CSV
</button>


      <button
        style={{
        marginBottom: "20px",
        background: "red",
        color: "white",
      }}
      onClick={() => {
        if (
          window.confirm(
          "Supprimer tous les mouvements ?"
        )
      ) {
      setMouvements([]);
      }
      }}
    >
      Vider la liste
    </button>


      {mouvements.length === 0 ? (
        <p>Aucun mouvement.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th>Date</th>
              <th>Libellé</th>
              <th>Catégorie</th>
              <th>Compte</th>
              <th>Montant</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {mouvements.map((m) => (
              <tr key={m.id}>
                <td>{m.date}</td>
                <td>{m.libelle}</td>
                <td>{m.categorie}</td>
                <td>{m.compte}</td>

                <td
                  style={{
                    color:
                      m.montant >= 0
                        ? "green"
                        : "red",
                  }}
                >
                  {m.montant.toFixed(2)} €
                </td>

                <td>
                  <button
                    onClick={() =>
                      supprimer(m.id)
                    }
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}