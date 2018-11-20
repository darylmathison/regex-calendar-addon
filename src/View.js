function buildCards(conflicts, dateRange) {
    var conflictSection = CardService.newCardSection().setHeader("<b>Conflicts</b>");

    for (i = 0; i < conflicts.length; i++) {
        conflictSection.addWidget(
          CardService.newKeyValue().setTopLabel(conflicts[i].event.getTitle() + " - " + conflicts[i].calendar.getName()).setContent(
            conflicts[i].event.getStartTime() + " - " + conflicts[i].event.getEndTime()
          ));
    }
    var actionParameters = {
        "startTime": dateRange.startDate.toJSON(),
        "endTime": dateRange.endDate.toJSON()
    };
    var action = CardService.newAction().setFunctionName("addToCalendar").setParameters(actionParameters);
    var button = CardService.newTextButton().setOnClickAction(action).setText("Create Event");
    conflictSection.addWidget(button);

    var card = CardService.newCardBuilder()
      .setHeader(
        CardService.newCardHeader().setTitle("EnviroGuard Service Checker"))
      .addSection(conflictSection)
      .build();

    return [card];
}

function addToCalendar(actionEvent) {
    var parameters = actionEvent.parameters;
    var start = moment(parameters["startTime"]);
    var end = moment(parameters["endTime"]);
    CalendarApp.getDefaultCalendar().createEvent("EnviroGuard Service",
      start.toDate(), end.toDate());
}
