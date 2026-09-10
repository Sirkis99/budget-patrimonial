import { useState, useEffect } from "react";

const comptes = [
  "Compte courant",
  "Livret A",
  "Assurance-vie",
  "PEE",
  "PER",
  "Fonds voiture",
  "Fonds vacances",
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

  "Epargne": [
  "PEE",
  "PER",
  "Livret A",
  "Assurance-vie",
  "Fonds voiture",
  "Fonds vacances",
  "Autre épargne",
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

const entetes = [
  "Date",
  "Libellé",
  "Catégorie",
  "Sous-catégorie",
  "Montant",
  "Compte",
  "Type",
  "Identifiant",
  "Commentaire",
  "CompteDestination",
  "ModePaiement",
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
  mouvement.type,
  mouvement.id,
  mouvement.commentaire,
  mouvement.compteDestination || "",
  mouvement.modePaiement || "",
];

    return valeurs
      .map(protegerValeur)
      .join(";");
  });

  const contenuCSV = [
    entetes.map(protegerValeur).join(";"),
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

const correspondanceComptes = {
  "Compte courant": "compteCourant",
  "Livret A": "livretA",
  "Assurance-vie": "assuranceVie",
  "PEE": "pee",
  "PER": "per",
  "Fonds voiture": "fondsVoiture",
  "Fonds vacances": "fondsVacances",
};

function lireLigneCSV(ligne) {
  const colonnes = [];
  let valeur = "";
  let entreGuillemets = false;

  for (let i = 0; i < ligne.length; i++) {
    const caractere = ligne[i];
    const suivant = ligne[i + 1];

    if (
      caractere === '"' &&
      entreGuillemets &&
      suivant === '"'
    ) {
      valeur += '"';
      i++;
    } else if (caractere === '"') {
      entreGuillemets = !entreGuillemets;
    } else if (
      caractere === ";" &&
      !entreGuillemets
    ) {
      colonnes.push(valeur);
      valeur = "";
    } else {
      valeur += caractere;
    }
  }

  colonnes.push(valeur);

  return colonnes.map((colonne) =>
    colonne.trim()
  );
}

function convertirDateCSV(dateCSV) {
  const dateNettoyee = String(
    dateCSV || ""
  ).trim();

  if (!dateNettoyee) {
    return "";
  }

  // La date est déjà au format AAAA-MM-JJ
  if (
    /^\d{4}-\d{2}-\d{2}$/.test(
      dateNettoyee
    )
  ) {
    return dateNettoyee;
  }

  // Conversion de JJ/MM/AAAA vers AAAA-MM-JJ
  const parties = dateNettoyee.split("/");

  if (parties.length === 3) {
    const [jour, mois, annee] = parties;

    return `${annee}-${mois.padStart(
      2,
      "0"
    )}-${jour.padStart(2, "0")}`;
  }

  return dateNettoyee;
}

 export default function App() {


  const [mouvements, setMouvements] = useState(() => {
  const sauvegarde =
    localStorage.getItem("budget-mouvements");


  return sauvegarde
    ? JSON.parse(sauvegarde)
    : [];
});

function importerCSV(event) {
  const fichier =
    event.target.files?.[0];

  if (!fichier) {
    return;
  }

  const lecteur = new FileReader();

  lecteur.onload = (resultat) => {
    try {
      const contenu = String(
        resultat.target?.result || ""
      ).replace(/^\uFEFF/, "");

      const lignes = contenu
        .split(/\r?\n/)
        .filter(
          (ligne) =>
            ligne.trim() !== ""
        );

      if (lignes.length < 2) {
        alert(
          "Le fichier CSV ne contient aucune opération."
        );

        event.target.value = "";
        return;
      }

      const entetesAttendues = [
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

      const entetesFichier =
        lireLigneCSV(lignes[0]);

      const entetesCorrectes =
        entetesAttendues.every(
          (entete, index) =>
            entetesFichier[index] ===
            entete
        );

      if (!entetesCorrectes) {
        alert(
          "Le format du fichier CSV est incorrect.\n\n" +
            "Colonnes attendues :\n" +
            entetesAttendues.join(" ; ")
        );

        event.target.value = "";
        return;
      }

      const mouvementsImportes = [];

      for (
        let index = 1;
        index < lignes.length;
        index++
      ) {
        const colonnes =
          lireLigneCSV(lignes[index]);

        if (colonnes.length < 9) {
          continue;
        }

        const [
          date,
          libelle,
          categorie,
          sousCategorie,
          montantTexte,
          compte,
          type,
          identifiant,
          commentaire,
        ] = colonnes;

        const montant = Number(
          String(montantTexte)
            .replace(/\s/g, "")
            .replace(",", ".")
        );

        if (
          !date ||
          !libelle ||
          !Number.isFinite(montant)
        ) {
          continue;
        }

        mouvementsImportes.push({
          id:
            identifiant ||
            `IMPORT-${Date.now()}-${index}`,
          date: convertirDateCSV(date),
          libelle,
          categorie,
          sousCategorie:
            sousCategorie || "",
          montant,
          compte:
            compte || "Compte courant",
          type:
            type ||
            (montant >= 0
              ? "Revenu"
              : "Dépense"),
          commentaire:
            commentaire || "",

          // Ces deux champs n’existent pas
          // encore dans la table Excel.
          compteDestination: "",
          modePaiement: "",
        });
      }

      if (
        mouvementsImportes.length === 0
      ) {
        alert(
          "Aucune opération valide n’a été trouvée."
        );

        event.target.value = "";
        return;
      }

      const identifiantsExistants =
        new Set(
          mouvements.map((mouvement) =>
            String(mouvement.id)
          )
        );

      const nouveauxMouvements =
        mouvementsImportes.filter(
          (mouvement) =>
            !identifiantsExistants.has(
              String(mouvement.id)
            )
        );

      if (
        nouveauxMouvements.length === 0
      ) {
        alert(
          "Toutes les opérations de ce fichier sont déjà présentes."
        );

        event.target.value = "";
        return;
      }

      setMouvements(
        (anciensMouvements) => [
          ...nouveauxMouvements,
          ...anciensMouvements,
        ]
      );

      alert(
        `${nouveauxMouvements.length} opération(s) importée(s).\n` +
          `${
            mouvementsImportes.length -
            nouveauxMouvements.length
          } doublon(s) ignoré(s).`
      );
    } catch (erreur) {
      console.error(
        "Erreur import CSV :",
        erreur
      );

      alert(
        "Le fichier CSV n’a pas pu être importé."
      );
    } finally {
      event.target.value = "";
    }
  };

  lecteur.onerror = () => {
    alert(
      "Erreur pendant la lecture du fichier."
    );

    event.target.value = "";
  };

  lecteur.readAsText(
    fichier,
    "UTF-8"
  );
}



  const [form, setForm] = useState({
    date: new Date().toISOString().substring(0, 10),
    libelle: "",
    categorie: "Courses",
    sousCategorie: "",
    type: "Dépense",
    compte: "Compte courant",
    compteDestination: "",
    modePaiement: "Carte bancaire",
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
      sousCategorie: "",
      type: "Dépense",
      compte: "Compte courant",
      modePaiement: "Carte bancaire",
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


    </div>

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
  <label>Mode de paiement</label>
  <br />

  <select
    value={form.modePaiement}
    onChange={(e) =>
      update("modePaiement", e.target.value)
    }
  >
    <option value="Carte bancaire">
      💳 Carte bancaire
    </option>

    <option value="Virement">
      🏦 Virement
    </option>

    <option value="Prélèvement">
      📄 Prélèvement
    </option>

    <option value="Espèces">
      💵 Espèces
    </option>

    <option value="Chèque">
      🧾 Chèque
    </option>
  </select>
</div>

       {form.type === "Transfert" && (
  <div style={{ marginBottom: 15 }}>
    <label>Compte destination</label>
    <br />

    <select
      value={form.compteDestination}
      onChange={(e) =>
        update(
          "compteDestination",
          e.target.value
        )
      }
    >
      <option value="">
        Sélectionner...
      </option>

      {comptes.map((c) => (
        <option key={c}>{c}</option>
      ))}
    </select>
  </div>
)}     

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

<label
  style={{
    display: "inline-block",
    marginRight: "10px",
    marginBottom: "20px",
    backgroundColor: "#1565c0",
    color: "white",
    padding: "10px 14px",
    borderRadius: "6px",
    cursor: "pointer",
  }}
>
  Importer CSV

  <input
    type="file"
    accept=".csv,text/csv"
    onChange={importerCSV}
    style={{
      display: "none",
    }}
  />
</label>
      
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
              <th>Mode Paiement</th>
              <th>CompteDestination</th>
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
                <td>{m.montant}</td>
                <td>{m.modePaiement}</td>
                <td>{m.compteDestination}</td>
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