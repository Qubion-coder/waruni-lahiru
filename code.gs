/**
 * Waruni & Lahiru — Wedding RSVP (Google Apps Script Web App)
 *
 * Spreadsheet:
 * https://docs.google.com/spreadsheets/d/1pBvrioT6eJNi3-hm0FmtsZWVswMdIooQ9hZKNi30LOY/edit
 *
 * The "RSVP" tab (with formatted headers) is created automatically on the
 * first submission — nothing needs to be set up in the sheet by hand.
 *
 * Deploy: Deploy → New deployment → Web app
 *   Execute as: Me
 *   Who has access: Anyone
 * Then copy the Web app URL (ends in /exec) into GOOGLE_SCRIPT_URL in src/App.tsx.
 */

const SPREADSHEET_ID = "1pBvrioT6eJNi3-hm0FmtsZWVswMdIooQ9hZKNi30LOY";

const RSVP_SHEET = {
  name: "RSVP",
  headers: ["Timestamp", "Name", "Attendance", "Guest Count", "Wish"],
  widths: [170, 220, 120, 110, 480],
};

const MAX_GUESTS = 10;
const MAX_TEXT_LENGTH = 1000;

function doPost(e) {
  return handleRequest_(e);
}

function doGet(e) {
  // Visiting the /exec URL in a browser creates the sheet and confirms the deployment works.
  if (!e || !e.parameter || !e.parameter.action) {
    setup();
    return jsonResponse_({ ok: true, message: "RSVP service is running. Sheet is ready." });
  }
  return handleRequest_(e);
}

/** Run once from the editor (or just submit an RSVP) to create the tab with headers. */
function setup() {
  getSheet_();
}

function handleRequest_(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    const params = parseParams_(e);
    const action = String(params.action || "").trim().toLowerCase();

    if (action === "rsvp") return jsonResponse_(saveRsvp_(params));

    return jsonResponse_({ ok: false, message: "Invalid action" });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      message: error && error.message ? error.message : "Unexpected error",
    });
  } finally {
    lock.releaseLock();
  }
}

function saveRsvp_(params) {
  const name = cleanText_(params.name);
  if (!name) return { ok: false, message: "Name is required" };

  const attendanceRaw = String(params.attendance || "").trim().toLowerCase();
  const declined = attendanceRaw === "declined" || attendanceRaw === "decline" || String(params.guests) === "0";
  const attendance = declined ? "Declined" : "Attending";

  let guests = parseInt(params.guests, 10);
  if (declined) {
    guests = 0;
  } else if (!(guests >= 1)) {
    guests = 1;
  } else if (guests > MAX_GUESTS) {
    guests = MAX_GUESTS;
  }

  const wish = cleanText_(params.wish);

  const sheet = getSheet_();
  sheet.appendRow([new Date(), name, attendance, guests, wish]);
  colorAttendance_(sheet, sheet.getLastRow(), declined);

  return { ok: true, message: "RSVP saved" };
}

/** Returns the RSVP tab, creating it and/or its header row if missing. */
function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(RSVP_SHEET.name);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(RSVP_SHEET.name);
  }

  if (sheet.getLastRow() === 0) {
    sheet
      .getRange(1, 1, 1, RSVP_SHEET.headers.length)
      .setValues([RSVP_SHEET.headers])
      .setFontWeight("bold")
      .setFontColor("#ffffff")
      .setBackground("#6b1d3a")
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle");
    sheet.setRowHeight(1, 32);
    sheet.setFrozenRows(1);

    RSVP_SHEET.widths.forEach(function (width, i) {
      sheet.setColumnWidth(i + 1, width);
    });

    // Timestamp format, centred attendance/count, and wrapped wishes
    sheet.getRange("A2:A").setNumberFormat("yyyy-mm-dd hh:mm");
    sheet.getRange("C2:D").setHorizontalAlignment("center");
    sheet.getRange("E2:E").setWrap(true);

    // Remove the default Sheet1 if it is still empty
    const defaultSheet = spreadsheet.getSheetByName("Sheet1");
    if (defaultSheet && defaultSheet.getLastRow() === 0 && spreadsheet.getSheets().length > 1) {
      spreadsheet.deleteSheet(defaultSheet);
    }
  }

  return sheet;
}

function colorAttendance_(sheet, row, declined) {
  sheet
    .getRange(row, 3)
    .setFontColor(declined ? "#a3263f" : "#1e7a46")
    .setFontWeight("bold");
}

/** Trims, caps length, and neutralises spreadsheet formula injection. */
function cleanText_(value) {
  let text = String(value == null ? "" : value).trim().slice(0, MAX_TEXT_LENGTH);
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return text;
}

function parseParams_(e) {
  const params = Object.assign({}, (e && e.parameter) || {});

  if (!(e && e.postData && e.postData.contents)) return params;

  const contents = String(e.postData.contents || "").trim();
  if (!contents) return params;

  if (contents.charAt(0) === "{") {
    return Object.assign(params, JSON.parse(contents));
  }

  return Object.assign(params, parseFormEncoded_(contents));
}

function parseFormEncoded_(raw) {
  const result = {};
  const pairs = String(raw || "").split("&");

  for (let i = 0; i < pairs.length; i++) {
    if (!pairs[i]) continue;
    const parts = pairs[i].split("=");
    const key = decodeURIComponent((parts[0] || "").replace(/\+/g, " "));
    const value = decodeURIComponent((parts.slice(1).join("=") || "").replace(/\+/g, " "));
    if (key) result[key] = value;
  }

  return result;
}

function jsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
