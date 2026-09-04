/**
 * MANAGEMENT INNOVATION CLUB (MIC) - GOOGLE APPS SCRIPT WEBHOOK
 * 
 * Instructions:
 * 1. Open your Google Sheet ("Management innovation Club").
 * 2. Delete the extra columns O, P, Q... and delete test rows 2, 3, 4.
 * 3. Make sure Row 1 has the 14 columns from A to N (use the Gemini prompt provided).
 * 4. Click: Extensions > Apps Script.
 * 5. Replace all code in Code.gs with this exact script.
 * 6. Click the Save icon (💾).
 * 7. Click Deploy > Manage deployments > Pencil icon (Edit) > Version: "New version" > Deploy.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName("Feuille 1") || doc.getSheets()[0];

    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "No POST body received"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var data = JSON.parse(e.postData.contents);

    // Standard columns definition (Default Columns A to N)
    var defaultHeaders = [
      "Full Name",
      "Family Name",
      "Date of Birth",
      "Academic Degree",
      "Phone Number",
      "Current School or Institution",
      "Email Address of the School",
      "Facebook Or Instagram Profile Link",
      "Preferred Cell",
      "Have you ever been part of a scientific club / association ?",
      "If yes, tell us more?",
      "Skills & Interests",
      "What are your motivations for applying to MIC ESSG Annaba ?",
      "Submission Date & Time"
    ];

    // Helper function to accurately map any column header to the right field value
    function getFieldValue(headerText, data) {
      var h = String(headerText || "").toLowerCase().trim();

      // 1. Email Address (check before school because header contains "Email Address of the School")
      if (h.indexOf("email") !== -1 || h.indexOf("mail") !== -1 || h.indexOf("courriel") !== -1) {
        return data.email || "";
      }

      // 2. School / Institution
      if (h.indexOf("institution") !== -1 || h.indexOf("school") !== -1 || h.indexOf("ecole") !== -1 || h.indexOf("école") !== -1 || h.indexOf("etablissement") !== -1) {
        return data.institution || "ESSG";
      }

      // 3. Social Profile Link (Facebook / Instagram)
      if (h.indexOf("facebook") !== -1 || h.indexOf("instagram") !== -1 || h.indexOf("social") !== -1 || (h.indexOf("profile") !== -1 && h.indexOf("link") !== -1) || h.indexOf("profil") !== -1) {
        return data.socialLink || data.facebookOrInstagram || "";
      }

      // 4. Preferred Cell
      if (h.indexOf("cell") !== -1 || h.indexOf("cellule") !== -1) {
        return data.cell || "";
      }

      // 5. If yes, tell us more (Check before scientific club)
      if (h.indexOf("tell us more") !== -1 || h.indexOf("plus") !== -1 || h.indexOf("if yes") !== -1 || h.indexOf("si oui") !== -1 || h.indexOf("details") !== -1 || h.indexOf("detail") !== -1) {
        return data.clubExperienceDetails || data.clubDetails || "";
      }

      // 6. Scientific Club / Association (Yes/No)
      if (h.indexOf("scientific") !== -1 || h.indexOf("association") !== -1 || (h.indexOf("club") !== -1 && h.indexOf("more") === -1)) {
        return data.pastClubExperience || data.scientificClubMember || "";
      }

      // 7. Motivation for MIC
      if (h.indexOf("motivation") !== -1 || h.indexOf("pourquoi") !== -1 || h.indexOf("lettre") !== -1) {
        return data.motivation || data.motivationLetter || "";
      }

      // 8. Skills & Interests
      if (h.indexOf("skill") !== -1 || h.indexOf("competence") !== -1 || h.indexOf("compétence") !== -1 || h.indexOf("interet") !== -1 || h.indexOf("intérêt") !== -1) {
        if (Array.isArray(data.skills)) return data.skills.join(", ");
        return data.skillsText || data.skillsString || (data.skills ? String(data.skills) : "");
      }

      // 9. Full Name (Prénom)
      if (h.indexOf("full name") !== -1 || h.indexOf("first name") !== -1 || h.indexOf("prenom") !== -1 || h.indexOf("prénom") !== -1) {
        return data.fullName || "";
      }

      // 10. Family Name (Nom)
      if (h.indexOf("family") !== -1 || h.indexOf("last name") !== -1 || (h.indexOf("nom") !== -1 && h.indexOf("prenom") === -1 && h.indexOf("prénom") === -1)) {
        return data.familyName || "";
      }

      // 11. Date of Birth
      if (h.indexOf("birth") !== -1 || h.indexOf("naissance") !== -1 || h.indexOf("birthday") !== -1) {
        return data.birthday || "";
      }

      // 12. Academic Degree
      if (h.indexOf("degree") !== -1 || h.indexOf("niveau") !== -1 || h.indexOf("licence") !== -1 || h.indexOf("master") !== -1 || h.indexOf("etude") !== -1 || h.indexOf("étude") !== -1) {
        return data.degree || "";
      }

      // 13. Phone Number
      if (h.indexOf("phone") !== -1 || h.indexOf("tel") !== -1 || h.indexOf("tél") !== -1 || h.indexOf("mobile") !== -1 || h.indexOf("numero") !== -1 || h.indexOf("numéro") !== -1) {
        return data.phone || "";
      }

      // 14. Submission Date & Time
      if (h.indexOf("time") !== -1 || h.indexOf("date") !== -1 || h.indexOf("timestamp") !== -1 || h.indexOf("heure") !== -1) {
        return data.timestamp || new Date().toISOString();
      }

      return data[headerText] || "";
    }

    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();

    // If sheet is completely empty, initialize Row 1 with headers
    if (lastRow === 0 || lastCol === 0) {
      sheet.appendRow(defaultHeaders);
      sheet.getRange(1, 1, 1, defaultHeaders.length)
        .setFontWeight("bold")
        .setBackground("#0a149e")
        .setFontColor("#ffffff");
      sheet.setFrozenRows(1);
      lastCol = defaultHeaders.length;
    }

    // Read existing headers from Row 1
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var newRow = [];

    // Map each column strictly according to its header
    for (var i = 0; i < headers.length; i++) {
      newRow.push(getFieldValue(headers[i], data));
    }

    // Append exactly one clean row corresponding to Columns 1 through lastCol
    sheet.appendRow(newRow);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Row added successfully"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput("✅ MIC Webhook is ONLINE! Ready to record registration entries.");
}
