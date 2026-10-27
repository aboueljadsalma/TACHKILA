const joueursEnregistres = localStorage.getItem("joueurs");

const joueurs = joueursEnregistres
    ? JSON.parse(joueursEnregistres)
    : [{ nom: "Bono", numero: 1, poste: "Gardien", emplacement: "banc" }];

let indexJoueurAModifier = null;

const fenetreFormulaire = document.querySelector(".fenetre-formulaire");
const formulaireJoueurs = document.querySelector("#formulaire-joueurs");
const listeJoueurs = document.querySelector("#liste-joueurs");
const compteurJoueurs = document.querySelector("#compteur-joueurs");
const champNom = document.querySelector("#nom-joueur");
const champNumero = document.querySelector("#numero-joueur");
const retourFormulaire = document.querySelector("#retour-formulaire");
const boutonOuverture = document.querySelector("#ouvrir-formulaire");
const boutonsFermeture = document.querySelectorAll(".fermer-formulaire");
const titreFormulaire = document.querySelector("#titre-formulaire");
const boutonAjouter = formulaireJoueurs.querySelector('button[type="submit"]');

const optionsEmplacements = [
    { valeur: "banc", texte: "Sur le banc" },
    { valeur: "GB", texte: "GB - Gardien" },
    { valeur: "DG", texte: "DG - Défenseur gauche" },
    { valeur: "DC1", texte: "DC - Défenseur central 1" },
    { valeur: "DC2", texte: "DC - Défenseur central 2" },
    { valeur: "DD", texte: "DD - Défenseur droit" },
    { valeur: "MG", texte: "MG - Milieu gauche" },
    { valeur: "MC1", texte: "MC - Milieu central 1" },
    { valeur: "MC2", texte: "MC - Milieu central 2" },
    { valeur: "MD", texte: "MD - Milieu droit" },
    { valeur: "BU1", texte: "BU - Buteur 1" },
    { valeur: "BU2", texte: "BU - Buteur 2" }
];

const postesCompatibles = {
    Gardien: ["GB"],
    Défenseur: ["DG", "DC1", "DC2", "DD"],
    Milieu: ["MG", "MC1", "MC2", "MD"],
    Attaquant: ["BU1", "BU2"]
};

function sauvegarderJoueurs() {
    localStorage.setItem("joueurs", JSON.stringify(joueurs));
}

function afficherJoueurs() {
    listeJoueurs.replaceChildren();

    joueurs.forEach((joueur, index) => {
        const carte = document.createElement("div");
        carte.className = "rounded-xl w-full border-l border-pink-300 bg-gray-700 p-3 mt-2";

        const contenu = document.createElement("div");
        contenu.className = "flex items-center gap-3";

        const numero = document.createElement("span");
        numero.className = "rounded-full border border-pink-300 h-9 w-9 flex items-center justify-center text-white";
        numero.textContent = joueur.numero;

        const informations = document.createElement("div");
        informations.className = "flex-1 min-w-0";

        const nom = document.createElement("h3");
        nom.className = "text-white break-words";
        nom.textContent = joueur.nom;

        const poste = document.createElement("p");
        poste.className = "text-pink-300 text-sm";
        poste.textContent = joueur.poste;

        const boutonModifier = document.createElement("button");
        boutonModifier.type = "button";
        boutonModifier.textContent = "🖊️";
        boutonModifier.className = "text-white cursor-pointer text-lg p-1";
        boutonModifier.setAttribute("aria-label", `Modifier ${joueur.nom}`);

        boutonModifier.addEventListener("click", () => {
            indexJoueurAModifier = index;
            champNom.value = joueur.nom;
            champNumero.value = joueur.numero;

            const posteSelectionne = formulaireJoueurs.querySelector(
                `input[name="poste-joueur"][value="${joueur.poste}"]`
            );

            if (posteSelectionne) {
                posteSelectionne.checked = true;
            }

            titreFormulaire.textContent = "Modifier un joueur";
            boutonAjouter.textContent = "Enregistrer";
            effacerErreur();
            fenetreFormulaire.classList.add("ouverte");
            fenetreFormulaire.setAttribute("aria-hidden", "false");
            champNom.focus();
        });

        const boutonSupprimer = document.createElement("button");
        boutonSupprimer.type = "button";
        boutonSupprimer.textContent = "🗑️";
        boutonSupprimer.className = "text-white cursor-pointer text-lg p-1";
        boutonSupprimer.setAttribute("aria-label", `Supprimer ${joueur.nom}`);

        boutonSupprimer.addEventListener("click", () => {
            if (!confirm(`Voulez-vous vraiment supprimer ${joueur.nom} ?`)) return;

            joueurs.splice(index, 1);
            sauvegarderJoueurs();
            afficherJoueurs();
            afficherJoueursSurTerrain();
        });

        const emplacement = document.createElement("select");
        emplacement.className = "mt-3 w-full rounded-md border border-slate-500 bg-slate-700 p-2 text-sm text-white";
        emplacement.setAttribute("aria-label", `Emplacement de ${joueur.nom}`);

        optionsEmplacements.forEach(option => {
            const elementOption = document.createElement("option");
            elementOption.value = option.valeur;
            elementOption.textContent = option.texte;
            emplacement.append(elementOption);
        });

        emplacement.value = joueur.emplacement || "banc";

        emplacement.addEventListener("change", function() {
            const nouvellePosition = emplacement.value;

            if (nouvellePosition !== "banc") {
                const postesAutorises = postesCompatibles[joueur.poste] || [];

                if (!postesAutorises.includes(nouvellePosition)) {
                    afficherErreur(`${joueur.nom} ne peut pas jouer à cette position.`);
                    emplacement.value = joueur.emplacement || "banc";
                    return;
                }

                const positionOccupee = joueurs.some((autreJoueur, autreIndex) =>
                    autreIndex !== index &&
                    autreJoueur.emplacement === nouvellePosition
                );

                if (positionOccupee) {
                    afficherErreur("Cette position est déjà occupée.");
                    emplacement.value = joueur.emplacement || "banc";
                    return;
                }
            }

            effacerErreur();
            joueur.emplacement = nouvellePosition;
            sauvegarderJoueurs();
            afficherJoueursSurTerrain();
        });

        informations.append(nom, poste);
        contenu.append(numero, informations, boutonModifier, boutonSupprimer);
        carte.append(contenu, emplacement);
        listeJoueurs.append(carte);
    });

    compteurJoueurs.textContent = joueurs.length === 1
        ? "1 joueur"
        : `${joueurs.length} joueurs`;
}

function afficherErreur(message) {
    retourFormulaire.textContent = message;
    retourFormulaire.hidden = false;
}

function effacerErreur() {
    retourFormulaire.textContent = "";
    retourFormulaire.hidden = true;
}

function reinitialiserFormulaire() {
    formulaireJoueurs.reset();
    indexJoueurAModifier = null;
    titreFormulaire.textContent = "Ajouter un joueur";
    boutonAjouter.textContent = "Ajouter";
    effacerErreur();
}

function ouvrirFormulaire() {
    reinitialiserFormulaire();
    fenetreFormulaire.classList.add("ouverte");
    fenetreFormulaire.setAttribute("aria-hidden", "false");
    champNom.focus();
}

function fermerFormulaire() {
    fenetreFormulaire.classList.remove("ouverte");
    fenetreFormulaire.setAttribute("aria-hidden", "true");
    reinitialiserFormulaire();
}

boutonOuverture.addEventListener("click", ouvrirFormulaire);

boutonsFermeture.forEach(bouton => {
    bouton.addEventListener("click", fermerFormulaire);
});

formulaireJoueurs.addEventListener("submit", evenement => {
    evenement.preventDefault();

    const nom = champNom.value.trim();
    const numero = Number(champNumero.value);
    const posteSelectionne = formulaireJoueurs.querySelector('input[name="poste-joueur"]:checked');

    if ( !nom || !Number.isInteger(numero) || numero < 1 || numero > 99 || !posteSelectionne ) {
        afficherErreur("Vérifiez le nom, le poste et le numéro (de 1 à 99).");
        return;
    }

    if (
        joueurs.some((joueur, index) =>
            joueur.numero === numero && index !== indexJoueurAModifier
        )
    ) {
        afficherErreur("Ce numéro est déjà attribué à un joueur.");
        return;
    }

    const poste = posteSelectionne.value;
    const joueurExistant = indexJoueurAModifier !== null
        ? joueurs[indexJoueurAModifier]
        : null;

    const joueurMisAJour = {nom, numero, poste, emplacement: joueurExistant?.emplacement || "banc" };

    if (joueurMisAJour.emplacement !== "banc") {
        const postesAutorises = postesCompatibles[poste] || [];

        if (!postesAutorises.includes(joueurMisAJour.emplacement)) {
            afficherErreur(
                "La position actuelle n'est pas compatible avec ce poste."
            );
            return;
        }
    }

    if (indexJoueurAModifier !== null) {
        joueurs[indexJoueurAModifier] = joueurMisAJour;
    } else {
        joueurs.push(joueurMisAJour);
    }

    sauvegarderJoueurs();
    afficherJoueurs();
    afficherJoueursSurTerrain();
    fermerFormulaire();
});

const positions = document.querySelectorAll(".joueur-terrain");

function afficherJoueursSurTerrain() {
    positions.forEach(position => {
        const codePosition = position.dataset.position;
        const joueur = joueurs.find(
            joueur => joueur.emplacement === codePosition
        );

        const statut = position.querySelector(".statut-joueur");
        const code = position.querySelector(".code-position");
        if (joueur) {
            statut.textContent = `${joueur.numero} - ${joueur.nom}`;
            position.classList.add("occupee");
        } else {
            statut.textContent = "Libre";
            position.classList.remove("occupee");

            if (code) {
                code.style.display = "";
            }
        }
    });
}

afficherJoueurs();
afficherJoueursSurTerrain();