function buildCards(conflicts, dateRange) {
    var conflictSection = CardService.newCardSection().setHeader("<b>Conflicts</b>");

    for (i = 0; i < conflicts.length; i++) {
        conflictSection.addWidget(
          CardService.newKeyValue().setTopLabel(conflicts[i].event.getTitle() + " - " + conflicts[i].calendar.getName()).setContent(
            conflicts[i].event.getStartTime() + " - " + conflicts[i].event.getEndTime()
          ));
    }
    // Logger.log(dateRange);
    var actionParameters = {
        "startTime": new String(dateRange.startDate.milliseconds()),
        "endTime": new String(dateRange.endDate.milliseconds())
        };
    var action = CardService.newAction().setFunctionName("addToCalendar").setParameters(actionParameters);
    var button = CardService.newTextButton().setOnClickAction(action).setText("Create Event");

    var card = CardService.newCardBuilder()
      .setHeader(
        CardService.newCardHeader().setTitle("EnviroGuard Service Checker"))
      .addSection(conflictSection)
      .build();

    return [card];
}

function addToCalendar(actionEvent) {
    var event = CalendarApp.getDefaultCalendar().createEvent("EnviroGuard Service", startTime, endTime);
    event.setColor("Blueberry");
}
