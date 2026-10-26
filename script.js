const joueurs = [
    { nom: "Bono", numero: 1, poste: "Gardien" }
];

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
const boutonAjouter = formulaireJoueurs.querySelector(
    'button[type="submit"]'
);

function afficherJoueurs() {
    listeJoueurs.replaceChildren();

    joueurs.forEach((joueur, index) => {
        const carte = document.createElement("div");
        carte.className =
            "rounded-xl w-full border-l border-pink-300 bg-gray-700 p-3 mt-2";

        const contenu = document.createElement("div");
        contenu.className = "flex items-center gap-3";

        const numero = document.createElement("span");
        numero.className =
            "rounded-full border border-pink-300 h-9 w-9 flex items-center justify-center text-white";
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
        boutonModifier.className =
            "text-white cursor-pointer text-lg p-1";
        boutonModifier.setAttribute(
            "aria-label",
            `Modifier ${joueur.nom}`
        );

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

        const emplacement = document.createElement("select");
        emplacement.className =
            "mt-3 w-full rounded-md border border-slate-500 bg-slate-700 p-2 text-sm text-white";
        emplacement.setAttribute(
            "aria-label",
            `Emplacement de ${joueur.nom}`
        );

        const optionBanc = document.createElement("option");
        optionBanc.value = "banc";
        optionBanc.textContent = "Sur le banc";

        emplacement.append(optionBanc);

        informations.append(nom, poste);
        contenu.append(numero, informations, boutonModifier);
        carte.append(contenu, emplacement);
        listeJoueurs.append(carte);
    });

    compteurJoueurs.textContent =
        joueurs.length === 1
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

boutonsFermeture.forEach((bouton) => {
    bouton.addEventListener("click", fermerFormulaire);
});

formulaireJoueurs.addEventListener("submit", (evenement) => {
    evenement.preventDefault();

    const nom = champNom.value.trim();
    const numero = Number(champNumero.value);

    const posteSelectionne = formulaireJoueurs.querySelector(
        'input[name="poste-joueur"]:checked'
    );

    if (
        !nom ||
        !Number.isInteger(numero) ||
        numero < 1 ||
        numero > 99 ||
        !posteSelectionne
    ) {
        afficherErreur(
            "Vérifiez le nom, le poste et le numéro (de 1 à 99)."
        );
        return;
    }

    const numeroExiste = joueurs.some(
        (joueur, index) =>
            joueur.numero === numero &&
            index !== indexJoueurAModifier
    );

    if (numeroExiste) {
        afficherErreur(
            "Ce numéro est déjà attribué à un joueur."
        );
        return;
    }

    const joueurMisAJour = {
        nom: nom,
        numero: numero,
        poste: posteSelectionne.value
    };

    if (indexJoueurAModifier !== null) {
        joueurs[indexJoueurAModifier] = joueurMisAJour;
    } else {
        joueurs.push(joueurMisAJour);
    }

    afficherJoueurs();
    fermerFormulaire();
});

afficherJoueurs();