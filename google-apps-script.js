// Google Apps Script pour recevoir les données du formulaire QuoteForm
// À déployer sur https://script.google.com/

function doPost(e) {
  try {
    // ID de votre Google Sheet (à remplacer par l'ID de votre sheet)
    const SHEET_ID = 'VOTRE_GOOGLE_SHEET_ID_ICI';
    
    // Ouvrir le document Google Sheets
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
    // Parser les données reçues
    const data = JSON.parse(e.postData.contents);
    
    // Créer l'en-tête si c'est la première fois
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Date/Heure',
        'Nom',
        'Email',
        'Téléphone',
        'Marque',
        'Modèle',
        'Année',
        'Budget',
        'Pays d\'origine',
        'Ville de livraison',
        'Délai souhaité',
        'Services additionnels',
        'Message'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Formatage de l'en-tête
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#DC143C');
      headerRange.setFontColor('white');
      headerRange.setFontWeight('bold');
    }
    
    // Préparer les données à insérer
    const rowData = [
      data.timestamp,
      data.name,
      data.email,
      data.phone,
      data.brand,
      data.model,
      data.year,
      data.budget,
      data.origin,
      data.destination,
      data.urgency,
      data.additionalServices,
      data.message
    ];
    
    // Ajouter la nouvelle ligne
    sheet.appendRow(rowData);
    
    // Auto-resize des colonnes
    sheet.autoResizeColumns(1, rowData.length);
    
    // Envoyer un email de notification (optionnel)
    sendNotificationEmail(data);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Données reçues avec succès'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Erreur:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendNotificationEmail(data) {
  try {
    // Email de notification (à personnaliser)
    const emailTo = 'votre-email@example.com'; // Remplacez par votre email
    const subject = `Nouvelle demande de devis - ${data.name}`;
    
    const body = `
Nouvelle demande de devis reçue :

👤 Client : ${data.name}
📧 Email : ${data.email}
📱 Téléphone : ${data.phone}

🚗 Véhicule demandé :
- Marque : ${data.brand}
- Modèle : ${data.model}
- Année : ${data.year}
- Budget : ${data.budget}

🌍 Transport :
- Origine : ${data.origin}
- Destination : ${data.destination}
- Délai : ${data.urgency}

🎯 Services additionnels : ${data.additionalServices || 'Aucun'}

💬 Message : ${data.message || 'Aucun message'}

⏰ Reçu le : ${data.timestamp}

---
Connectez-vous à votre Google Sheet pour voir tous les détails.
    `;
    
    MailApp.sendEmail({
      to: emailTo,
      subject: subject,
      body: body
    });
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('Service Google Apps Script actif pour Import Auto Algérie')
    .setMimeType(ContentService.MimeType.TEXT);
} 