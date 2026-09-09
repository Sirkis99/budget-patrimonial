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
    "Remboursements santé",
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
    "Animaux",
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
    "Fonds vacances",
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
  "Remboursements santé",
  "Autres revenus",
];

function exporterCSV(mouvements) {
  if (mouvements.length === 0) {
    alert("Aucun mouvement à exporter");
    return;
  }

  const entete = [
    "Date",
    "Libellé",
    "Catégorie",
    "Sous-catégorie",
    "Montant",
    "Compte",
    "Type",
    "Identifiant",
    "Commentaire",
  ];

  function formaterDate(dateISO) {
    const [annee, mois, jour] = dateISO.split("-");
    return `${jour}/${mois}/${annee}`;
  }

  function protegerValeur(valeur) {
    const texte = String(valeur ?? "");

    return `"${texte.replaceAll('"', '""')}"`;
  }

  const lignes = mouvements.map((mouvement) => {
    const montant = Number(mouvement.montant)
      .toFixed(2);

    const type =
      Number(mouvement.montant) >= 0
        ? "Revenu"
        : "Dépense";

    const valeurs = [
      formaterDate(mouvement.date),
      mouvement.libelle,
      mouvement.categorie,
      mouvement.sousCategorie,
      montant,
      mouvement.compte,
      type,
      mouvement.id,
      mouvement.commentaire,
    ];

    return valeurs
      .map(protegerValeur)
      .join(";");
  });

  const contenuCSV = [
    entete.map(protegerValeur).join(";"),
    ...lignes,
  ].join("\r\n");

  const BOM = "\uFEFF";

  const blob = new Blob(
    [BOM + contenuCSV],
    {
      type: "text/csv;charset=utf-8;",
    }
  );

  const url = window.URL.createObjectURL(blob);

  const lien = document.createElement("a");

  const dateExport = new Date()
    .toISOString()
    .substring(0, 10);

  lien.href = url;

  lien.download =
    `operations_budget_${dateExport}.csv`;

  document.body.appendChild(lien);

  lien.click();

  document.body.removeChild(lien);

  window.URL.revokeObjectURL(url);
}

function formatEuros(valeur) {
  return Number(valeur).toLocaleString(
    "fr-FR",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }
  );
}

const cardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  padding: "15px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  marginBottom: "15px",
};

 export default function App() {
  const [onglet, setOnglet] = useState("mouvements");
const [patrimoine, setPatrimoine] = useState(() => {
  const sauvegarde =
    localStorage.getItem("budget-patrimoine");

  return sauvegarde
    ? JSON.parse(sauvegarde)
    : {
        compteCourant: 5000,
        livretA: 10000,
        assuranceVie: 1500,
        pee: 22000,
        per: 0,
        fondsVoiture: 0,
        fondsVacances : 3500,
      };
});

const liquidites =
  patrimoine.compteCourant +
  patrimoine.livretA;

const placements =
  patrimoine.assuranceVie +
  patrimoine.pee +
  patrimoine.per;

const fondsVoiture =
  patrimoine.fondsVoiture;

const fondsVacances =
  patrimoine.fondsVacances || 3500;
  
const patrimoineTotal =
  liquidites +
  placements +
  fondsVoiture+
  fondsVacances;

const pctLiquidites =
  patrimoineTotal > 0
    ? (liquidites / patrimoineTotal) * 100
    : 0;

const pctPlacements =
  patrimoineTotal > 0
    ? (placements / patrimoineTotal) * 100
    : 0;

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
    sousCategorie: "",
    type: "Dépense",
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

useEffect(() => {
  localStorage.setItem(
    "budget-patrimoine",
    JSON.stringify(patrimoine)
  );
}, [patrimoine]);

  useEffect(() => {
  localStorage.setItem(
    "budget-patrimoine",
    JSON.stringify(patrimoine)
  );
}, [patrimoine]);

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
      sousCategorie: "",
      type: "Dépense",
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

    <div style={{ marginBottom: "20px" }}>
      <button
        onClick={() => setOnglet("mouvements")}
        style={{ marginRight: "10px" }}
      >
        Mouvements
      </button>

      <button
        onClick={() => setOnglet("patrimoine")}
      >
        Patrimoine
      </button>
    </div>

<h2>
  Onglet actif : {onglet}
</h2>

{onglet === "mouvements" && (
  <>
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
  <label>Sous-catégorie</label>
  <br />
  <input
    type="text"
    placeholder="Ex : Leclerc, Total, Amazon..."
    value={form.sousCategorie}
    onChange={(e) =>
      update("sousCategorie", e.target.value)
    }
    style={{ width: "100%" }}
  />
</div>

<div style={{ marginBottom: 15 }}>
  <label>Type de mouvement</label>
  <br />

  <select
    value={form.type}
    onChange={(e) =>
      update("type", e.target.value)
    }
  >
    <option value="Dépense">
      Dépense
    </option>

    <option value="Revenu">
      Revenu
    </option>

    <option value="Transfert">
      Transfert entre comptes
    </option>
  </select>
</div>

        <div style={{ marginBottom: 15 }}>
          <label>Compte</label>hots
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

  </>
 )}
{onglet === "patrimoine" && (
  <div
    style={{
      border: "1px solid #ccc",
      padding: "20px",
      marginBottom: "20px",
      borderRadius: "8px",
      backgroundColor: "#f8f8f8",
    }}
  >
    <h2>Patrimoine</h2>

<div
  style={{
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "20px",
  }}
>
  <div
    style={{
      backgroundColor: "#1565c0",
      color: "white",
      padding: "15px",
      borderRadius: "10px",
      minWidth: "180px",
    }}
  >
    <strong>💰 Patrimoine total</strong>
    <br />
    {formatEuros(patrimoineTotal)} €
  </div>

  <div
    style={{
      backgroundColor: "#26a69a",
      color: "white",
      padding: "15px",
      borderRadius: "10px",
      minWidth: "180px",
    }}
  >
<strong>💧 Liquidités</strong>
<br />
{formatEuros(liquidites)} €
<br />
{pctLiquidites.toFixed(1)} %
  </div>

  <div
    style={{
      backgroundColor: "#43a047",
      color: "white",
      padding: "15px",
      borderRadius: "10px",
      minWidth: "180px",
    }}
  >
<strong>📈 Placements</strong>
<br />
{formatEuros(placements)} €
<br />
{pctPlacements.toFixed(1)} %
  </div>

  <div
    style={{
      backgroundColor: "#ef6c00",
      color: "white",
      padding: "15px",
      borderRadius: "10px",
      minWidth: "180px",
    }}
  >
    <strong>🚗 Fonds voiture</strong>
    <br />
    {formatEuros(fondsVoiture)} €
  </div>

<div
  style={{
    backgroundColor: "#e91e63",
    color: "white",
    padding: "15px",
    borderRadius: "10px",
    minWidth: "180px",
  }}
>
  <strong>🏖️ Fonds vacances</strong>
  <br />
  {formatEuros(fondsVacances)} €
</div>

</div>

<div
  style={{
    background:
      "linear-gradient(135deg,#1565c0,#42a5f5)",
    color: "white",
    padding: "20px",
    borderRadius: "15px",
    marginBottom: "20px",
  }}
 >


  <h2 style={{ margin: 0 }}>
    💰 Patrimoine Total
  </h2>

  <h1>
    {formatEuros(
      patrimoine.compteCourant +
      patrimoine.livretA +
      patrimoine.assuranceVie +
      patrimoine.pee +
      patrimoine.per +
      patrimoine.fondsVoiture
    )} €
  </h1>
</div>

<div style={cardStyle}>
  <h3 style={{ margin: 0 }}>
    💧 Compte courant
  </h3>

  <p
    style={{
      fontSize: "24px",
      color: "#1565c0",
      fontWeight: "bold",
    }}
  >
    {formatEuros(
      patrimoine.compteCourant
    )} €
  </p>

  <input
    type="number"
    value={patrimoine.compteCourant}
    onChange={(e) =>
      setPatrimoine({
        ...patrimoine,
        compteCourant: Number(
          e.target.value
        ),
      })
    }
  />
</div>


  <div style={cardStyle}>
  <h3 style={{ margin: 0 }}>
    🏦 Livret A
  </h3>

  <p
    style={{
      fontSize: "24px",
      color: "#1565c0",
      fontWeight: "bold",
    }}
  >
    {formatEuros(
      patrimoine.livretA
    )} €
  </p>

  <input
    type="number"
    value={patrimoine.livretA}
    onChange={(e) =>
      setPatrimoine({
        ...patrimoine,
        livretA: Number(
          e.target.value
        ),
      })
    }
  />
</div>


   <div style={cardStyle}>
  <h3 style={{ margin: 0 }}>
    🌱 Assurance-vie
  </h3>

  <p
    style={{
      fontSize: "24px",
      color: "#1565c0",
      fontWeight: "bold",
    }}
  >
    {formatEuros(
      patrimoine.assuranceVie
    )} €
  </p>

  <input
    type="number"
    value={patrimoine.assuranceVie}
    onChange={(e) =>
      setPatrimoine({
        ...patrimoine,
        assuranceVie: Number(
          e.target.value
        ),
      })
    }
  />
</div>


   <div style={cardStyle}>
  <h3 style={{ margin: 0 }}>
    📈 PEE
  </h3>

  <p
    style={{
      fontSize: "24px",
      color: "#2e7d32",
      fontWeight: "bold",
    }}
  >
    {formatEuros(
      patrimoine.pee
    )} €
  </p>

  <input
    type="number"
    value={patrimoine.pee}
    onChange={(e) =>
      setPatrimoine({
        ...patrimoine,
        pee: Number(
          e.target.value
        ),
      })
    }
  />
</div>

    <div style={cardStyle}>
  <h3 style={{ margin: 0 }}>
    🛡️ PER
  </h3>

  <p
    style={{
      fontSize: "24px",
      color: "#2e7d32",
      fontWeight: "bold",
    }}
  >
    {formatEuros(
      patrimoine.per
    )} €
  </p>

  <input
    type="number"
    value={patrimoine.per}
    onChange={(e) =>
      setPatrimoine({
        ...patrimoine,
        per: Number(
          e.target.value
        ),
      })
    }
  />
</div>

   <div style={cardStyle}>
  <h3 style={{ margin: 0 }}>
    🚗 Fonds voiture
  </h3>

  <p
    style={{
      fontSize: "24px",
      color: "#2e7d32",
      fontWeight: "bold",
    }}
  >
    {formatEuros(
      patrimoine.fondsVoiture
    )} €
  </p>

  <input
    type="number"
    value={patrimoine.fondsVoiture}
    onChange={(e) =>
      setPatrimoine({
        ...patrimoine,
        fondsVoiture: Number(
          e.target.value
        ),
      })
    }
  />
</div>

<div style={cardStyle}>
  <h3 style={{ margin: 0 }}>
    🏖️ Fonds vacances
  </h3>

  <p
    style={{
      fontSize: "24px",
      color: "#2e7d32",
      fontWeight: "bold",
    }}
  >
    {formatEuros(
      patrimoine.fondsVacances || 3500
    )} €
  </p>

  <input
    type="number"
    value={patrimoine.fondsVacances || 3500}
    onChange={(e) =>
      setPatrimoine({
        ...patrimoine,
        fondsVacances: Number(
          e.target.value
        ),
      })
    }
  />
</div>

    <hr />

<h3
  style={{
    color: "#1565c0",
    fontSize: "24px",
  }}
>
  Total patrimoine :
  {" "}
  {formatEuros(
    patrimoine.compteCourant +
    patrimoine.livretA +
    patrimoine.assuranceVie +
    patrimoine.pee +
    patrimoine.per +
    patrimoine.fondsVoiture
  )}
  {" "}€
</h3>
  </div>
)}
      
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
              <th>Type</th>
              <th>Catégorie</th>
              <th>Sous-catégorie</th>
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
                <td>{m.type}</td>
                <td>{m.categorie}</td>
                <td>{m.sousCategorie}</td>
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