// 이 코드를 복사하여 Google Apps Script 에디터에 붙여넣어 주세요.
// 에디터에서 수정한 후, 반드시 [새 배포]를 통해 웹 앱을 배포하고 새 URL을 청첩장에 반영해야 합니다.

function doGet(e) {
  try {
    var spreadsheet = SpreadsheetApp.openById("1Dkibjj02eaZFiDoFsatUPtn4ptnZyD-qU414oX4fp6Q");
    var sheet = spreadsheet.getSheetByName("방명록");
    var data = [];
    
    if (sheet) {
      var rows = sheet.getDataRange().getValues();
      // 첫 번째 줄(헤더)은 건너뜁니다.
      for (var i = 1; i < rows.length; i++) {
        data.push({
          date: rows[i][0],
          name: rows[i][1],
          message: rows[i][3] // 인덱스 2번인 비밀번호(Password)는 보안을 위해 클라이언트에 전달하지 않습니다.
        });
      }
    }
    
    // 최신 방명록 글이 위로 오도록 역순 정렬
    data.reverse();
    
    return ContentService.createTextOutput(JSON.stringify({ result: 'success', data: data }))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var spreadsheet = SpreadsheetApp.openById("1Dkibjj02eaZFiDoFsatUPtn4ptnZyD-qU414oX4fp6Q");
    
    // 1. 참석 여부 전달 (RSVP)
    if (!data.type || data.type === 'rsvp') {
      var sheet = spreadsheet.getSheetByName("참석여부") || spreadsheet.insertSheet("참석여부");
      
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(["접수 일시", "구분", "성함", "참석 여부", "동반 인원", "식사 여부", "축하 메시지"]);
        sheet.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#faf2f3");
      }
      
      sheet.appendRow([
        data.date,
        data.side,
        data.name,
        data.attend,
        data.count,
        data.meal,
        data.message
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
                           .setMimeType(ContentService.MimeType.JSON);
                           
    // 2. 방명록 작성 (Guestbook Write)
    } else if (data.type === 'guestbook') {
      var sheet = spreadsheet.getSheetByName("방명록") || spreadsheet.insertSheet("방명록");
      
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(["작성 일시", "성함", "비밀번호", "메시지"]);
        sheet.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#eef5fc");
      }
      
      sheet.appendRow([
        data.date,
        data.name,
        data.password,
        data.message
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
                           .setMimeType(ContentService.MimeType.JSON);
                           
    // 3. 방명록 삭제 (Guestbook Delete)
    } else if (data.type === 'delete_guestbook') {
      var sheet = spreadsheet.getSheetByName("방명록");
      if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({ result: 'error', message: '방명록 시트를 찾을 수 없습니다.' }))
                             .setMimeType(ContentService.MimeType.JSON);
      }
      
      var rows = sheet.getDataRange().getValues();
      var deleted = false;
      
      // 맨 뒤 행부터 거꾸로 탐색하여 이름, 비밀번호, 메시지가 일치하는 첫 번째 행 삭제
      for (var i = rows.length - 1; i >= 1; i--) {
        if (rows[i][1] === data.name && rows[i][2].toString() === data.password.toString() && rows[i][3] === data.message) {
          sheet.deleteRow(i + 1); // Apps Script 행 번호는 1부터 시작하므로 i + 1
          deleted = true;
          break;
        }
      }
      
      if (deleted) {
        return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
                             .setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({ result: 'error', message: '비밀번호가 일치하지 않거나 메시지를 찾을 수 없습니다.' }))
                             .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
