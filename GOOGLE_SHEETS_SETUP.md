# Configuration Google Sheets pour Import Auto Algérie

## 📋 Étapes de configuration

### 1. Créer une Google Sheet

1. Allez sur [Google Sheets](https://sheets.google.com)
2. Créez un nouveau document
3. Nommez-le "Demandes de devis - Import Auto Algérie"
4. Copiez l'ID de la sheet depuis l'URL :
   ```
   https://docs.google.com/spreadsheets/d/[VOTRE_SHEET_ID]/edit
   ```

### 2. Configurer Google Apps Script

1. Allez sur [Google Apps Script](https://script.google.com)
2. Créez un nouveau projet
3. Nommez-le "Import Auto Algérie - Form Handler"
4. Remplacez le contenu par le code du fichier `google-apps-script.js`
5. Modifiez ces variables :
   ```javascript
   const SHEET_ID = 'VOTRE_GOOGLE_SHEET_ID_ICI'; // Ligne 6
   const emailTo = 'votre-email@example.com'; // Ligne 73
   ```

### 3. Déployer le script

1. Dans Google Apps Script, cliquez sur "Déployer" > "Nouveau déploiement"
2. Type : "Application Web"
3. Description : "Récepteur formulaire Import Auto"
4. Exécuter en tant que : "Moi"
5. Qui peut accéder : "Tout le monde"
6. Cliquez sur "Déployer"
7. **Copiez l'URL de déploiement** (elle ressemble à : `https://script.google.com/macros/s/AKfycbx...../exec`)

### 4. Mettre à jour le formulaire

1. Dans `components/QuoteForm.tsx`, ligne 28, remplacez :
   ```javascript
   const response = await fetch('https://script.google.com/macros/s/AKfycbx7B5_YOUR_SCRIPT_ID/exec', {
   ```
   Par votre URL de déploiement

### 5. Configurer OAuth (optionnel pour sécurisation)

**NE COMMETTEZ JAMAIS VOS SECRETS DANS CE FICHIER. Utilisez des variables d'environnement.**

Les identifiants fournis (à titre d'exemple) :
- **Client ID** : `[VOTRE_CLIENT_ID_GOOGLE]`
- **Client Secret** : `[VOTRE_CLIENT_SECRET_GOOGLE]`

**Pour une sécurisation avancée** (optionnel) :
1. Allez sur [Google Cloud Console](https://console.cloud.google.com)
2. Créez un projet ou sélectionnez-en un existant
3. Activez l'API Google Sheets
4. Configurez l'écran de consentement OAuth
5. Ajoutez les domaines autorisés

## 🎯 Structure des données reçues

Le formulaire envoie ces champs vers Google Sheets :

| Colonne | Données |
|---------|---------|
| A | Date/Heure |
| B | Nom |
| C | Email |
| D | Téléphone |
| E | Marque |
| F | Modèle |
| G | Année |
| H | Budget |
| I | Pays d'origine |
| J | Ville de livraison |
| K | Délai souhaité |
| L | Services additionnels |
| M | Message |

## 🔔 Notifications par email

Le script envoie automatiquement un email à chaque nouvelle demande.
Modifiez l'email destinataire ligne 73 du script :
```javascript
const emailTo = 'contact@import-auto-algerie.com';
```

## 🧪 Test de fonctionnement

1. Remplissez le formulaire sur votre site
2. Vérifiez que les données apparaissent dans la Google Sheet
3. Vérifiez la réception de l'email de notification

## 🔧 Dépannage

**Le formulaire ne s'envoie pas :**
- Vérifiez l'URL du script dans `QuoteForm.tsx`
- Vérifiez que le script est déployé avec les bonnes permissions

**Pas de données dans la sheet :**
- Vérifiez l'ID de la Google Sheet dans le script
- Vérifiez les logs dans Google Apps Script

**Pas d'email de notification :**
- Vérifiez l'adresse email dans le script
- Vérifiez les autorisations du script pour envoyer des emails

## 📱 Fonctionnalités

✅ Collecte automatique des demandes de devis  
✅ Formatage automatique de la Google Sheet  
✅ Notifications email instantanées  
✅ Horodatage automatique  
✅ Interface utilisateur avec loading states  
✅ Gestion d'erreurs  

## 🚀 Prêt !

Une fois configuré, votre formulaire enverra automatiquement toutes les demandes vers votre Google Sheet et vous recevrez un email à chaque nouvelle demande. 