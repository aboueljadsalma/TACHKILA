const joueurs = [
    { nom: "Bono", numero: 1, poste: "Gardien" }
];

const fenetreFormulaire = document.querySelector(".fenetre-formulaire");
const formulaireJoueurs = document.querySelector("#formulaire-joueurs");
const listeJoueurs = document.querySelector("#liste-joueurs");
const compteurJoueurs = document.querySelector("#compteur-joueurs");
const champNom = document.querySelector("#nom-joueur");
const champNumero = document.querySelector("#numero-joueur");
const retourFormulaire = document.querySelector("#retour-formulaire");
const boutonOuverture = document.querySelector("#ouvrir-formulaire");
const boutonsFermeture = document.querySelectorAll(".fermer-formulaire");

function afficherJoueurs() {
    listeJoueurs.replaceChildren();

    joueurs.forEach((joueur) => {
        const carte = document.createElement("div");
        carte.className = "carte-joueur rounded-xl w-full border-l border-pink-300 bg-gray-700 p-3 mt-2";

        const contenu = document.createElement("div");
        contenu.className = "flex gap-3";

        const numero = document.createElement("span");
        numero.className = "rounded-full border border-pink-300 h-9 w-9 flex items-center justify-center";
        numero.textContent = joueur.numero;

        const informations = document.createElement("div");
        informations.className = "flex-1";

        const nom = document.createElement("h3");
        nom.textContent = joueur.nom;

        const poste = document.createElement("p");
        poste.className = "text-pink-300 text-sm";
        poste.textContent = joueur.poste;

        const emplacement = document.createElement("select");
        emplacement.className = "mt-3 w-full rounded-md border border-slate-500 bg-slate-700 p-2 text-sm text-white";
        emplacement.setAttribute("aria-label", `Emplacement de ${joueur.nom}`);

        const optionBanc = document.createElement("option");
        optionBanc.textContent = "Sur le banc";
        emplacement.append(optionBanc);

        informations.append(nom, poste);
        contenu.append(numero, informations);
        carte.append(contenu, emplacement);
        listeJoueurs.append(carte);
    });

    if (joueurs.length === 1) {
        compteurJoueurs.textContent = "1 joueur";
    } else {
        compteurJoueurs.textContent = `${joueurs.length} joueurs`;
    }
}

function afficherErreur(message) {
    retourFormulaire.textContent = message;
    retourFormulaire.hidden = false;
}

function effacerErreur() {
    retourFormulaire.textContent = "";
    retourFormulaire.hidden = true;
}

function fermerFormulaire() {
    fenetreFormulaire.classList.remove("ouverte");
    fenetreFormulaire.setAttribute("aria-hidden", "true");
    formulaireJoueurs.reset();
    effacerErreur();
}

boutonOuverture.addEventListener("click", () => {
    fenetreFormulaire.classList.add("ouverte");
    fenetreFormulaire.setAttribute("aria-hidden", "false");
    champNom.focus();
});

boutonsFermeture.forEach((bouton) => {
    bouton.addEventListener("click", fermerFormulaire);
});

formulaireJoueurs.addEventListener("submit", (evenement) => {
    evenement.preventDefault();

    const nom = champNom.value.trim();
    const numero = Number(champNumero.value);
    const posteSelectionne = formulaireJoueurs.querySelector('input[name="poste-joueur"]:checked');

    if (!nom || !Number.isInteger(numero) || numero < 1 || numero > 99 || !posteSelectionne) {
        afficherErreur("Vérifiez le nom, le poste et le numéro (de 1 à 99).");
    } else if (joueurs.some((joueur) => joueur.numero === numero)) {
        afficherErreur("Ce numéro est déjà attribué à un joueur.");
    } else {
        joueurs.push({
            nom,
            numero,
            poste: posteSelectionne.value
        });
        afficherJoueurs();
        fermerFormulaire();
    }
});

afficherJoueurs();