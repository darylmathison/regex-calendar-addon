/**
 * Returns the array of cards that should be rendered for the current
 * e-mail thread. The name of this function is specified in the
 * manifest 'onTriggerFunction' field, indicating that this function
 * runs every time the add-on is started.
 *
 * @param {Object} e The data provided by the Gmail UI.
 * @return {Card[]}
 */
function buildAddOn(e) {
  Logger.clear();
    // Activate temporary Gmail add-on scopes.
    var accessToken = e.messageMetadata.accessToken;
    GmailApp.setCurrentMessageAccessToken(accessToken);

    var messageId = e.messageMetadata.messageId;
    var message = GmailApp.getMessageById(messageId);

    // Create a section for that contains all user Labels.
    var section = CardService.newCardSection()
      .setHeader("<font color=\"#1257e0\"><b>Mmessage Text</b></font>");

    var mailText = message.getPlainBody();

    var dateRange = createRange(mailText);
    var message = "";
  
  if (dateRange) {
    var conflicts = existingConflicts(dateRange);
    if(conflicts && conflicts.length > 0) {
      message = "There are " + conflicts.length + " conflicts\n";
      for ( i = 0; i < conflicts.length; i++ ) {
        Logger.log(conflicts[i]);
        message += " " + conflicts[i].getTitle() + " start time: " + conflicts[i].getStartTime()  + conflicts[i].getEndTime() + "\n";
      }
    } else {
      message = "Date range " + new Date(dateRange.startDate) + " - " + new Date(dateRange.endDate);
    }
  } else {
    message = "This is not an EvironGuard email";
  }
    // Create a checkbox group for user labels that are added to prior section.
    var textInput = CardService.newTextInput().setTitle("Message")
      .setFieldName("message_text")
      .setMultiline(true).setValue(message);

    // Add the checkbox group to the section.
    section.addWidget(textInput);

    // Build the main card after adding the section.
    var card = CardService.newCardBuilder()
      .setHeader(CardService.newCardHeader()
        .setTitle("EnviroGuard")
        .setImageUrl("https://www.gstatic.com/images/icons/material/system/1x/label_googblue_48dp.png"))
      .addSection(section)
      .build();

    return [card];
}

function formatDate(year, month, day, time) {
    return "" + year + month + day + " "
      + time;
}

function createRange(mailText) {

    var dateRegex = /([A-Za-z]{3}) (\d+).*?((\d{1,2}):(\d{1,2})(am|pm))-((\d{1,2}):(\d{1,2})(am|pm))/;

    var date_parts = mailText.match(dateRegex);
    Logger.log(date_parts);
  if (date_parts) {
    var year = new Date().getFullYear();

    return {
        startDate: moment(formatDate(
          year,
          date_parts[1],
          date_parts[2],
          date_parts[3]
        ), "YYYYMMMDD hh:mm:ssa"),
        endDate: moment(formatDate(
          year,
          date_parts[1],
          date_parts[2],
          date_parts[7]
        ), "YYYYMMMDD hh:mm:ssa")
    };
  } else {
    return null;
  }
}

function existingConflicts(dateRange) {
  var calendars = CalendarApp.getAllCalendars();
  var conflicts = Array.concat.apply(this,calendars.map(function(calendar, index) {
    Logger.log(calendar.getName());
    var events = calendar.getEvents(new Date(dateRange.startDate), new Date(dateRange.endDate));
    Logger.log(events);
    //return calendar.getEvents(new Date(dateRange.startTime), new Date(dateRange.endTime));
    return events;
  }));
  
  return conflicts;
}
