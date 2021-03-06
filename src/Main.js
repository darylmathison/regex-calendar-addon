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

    var mailText = message.getPlainBody();

    var dateRange = createRange(mailText);
    if (dateRange) {
        var conflicts = existingConflicts(dateRange);
        if (conflicts && conflicts.length > 0) {
            message = "There are " + conflicts.length + " conflicts\n";
            for (i = 0; i < conflicts.length; i++) {
                Logger.log(conflicts[i].event);
                message += " " + conflicts[i].event.getTitle() + " start time: " + conflicts[i].event.getStartTime() + " - " + conflicts[i].event.getEndTime() + "\n";
            }
        } else {
            message = "Date range " + new Date(dateRange.startDate) + " - " + new Date(dateRange.endDate);
        }
    } else {
        message = "This is not an EvironGuard email";
    }

    return buildCards(conflicts, dateRange);
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
    var conflicts = Array.concat.apply(this, calendars.map(function(calendar, index) {
        Logger.log(calendar.getName());
        var events = calendar.getEvents(dateRange.startDate.toDate(), dateRange.endDate.toDate())
          .map(function(event) {
              return {
                  calendar: calendar,
                  event: event
              };
          });
        Logger.log(events);
        //return calendar.getEvents(new Date(dateRange.startTime), new Date(dateRange.endTime));
        return events;
    }));

    return conflicts;
}
