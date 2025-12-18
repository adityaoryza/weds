/**
 * Google Apps Script for Wedding RSVP
 * 
 * SETUP INSTRUCTIONS:
 * 1. Buka Google Sheets baru: https://sheets.new
 * 2. Rename sheet ke "RSVP"
 * 3. Tambahkan header di row 1: Timestamp | Name | Attendance | Guest Count | Message
 * 4. Klik Extensions → Apps Script
 * 5. Hapus semua kode dan paste kode ini
 * 6. Klik Deploy → New deployment
 * 7. Pilih type: Web app
 * 8. Execute as: Me
 * 9. Who has access: Anyone
 * 10. Deploy dan copy URL-nya
 * 11. Paste URL ke site.js (GOOGLE_SCRIPT_URL)
 */

// Handle POST requests
function doPost(e) {
    try {
        // Parse incoming data
        const data = JSON.parse(e.postData.contents);

        // Get the active spreadsheet
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName('RSVP') || ss.getActiveSheet();

        // Prepare row data
        const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
        const row = [
            timestamp,
            data.name || '',
            data.attendance || '',
            data.guestCount || 0,
            data.message || ''
        ];

        // Append to sheet
        sheet.appendRow(row);

        // Return success
        return ContentService
            .createTextOutput(JSON.stringify({ success: true, message: 'RSVP saved!' }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        // Return error
        return ContentService
            .createTextOutput(JSON.stringify({ success: false, message: error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// Handle GET requests (for testing)
function doGet(e) {
    return ContentService
        .createTextOutput(JSON.stringify({ status: 'ok', message: 'RSVP API is running' }))
        .setMimeType(ContentService.MimeType.JSON);
}
