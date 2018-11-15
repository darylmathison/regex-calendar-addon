function buildCard(title, message) {
  var textInput = CardService.newTextInput().setTitle(title)
    .setFieldName("message_text")
    .setMultiline(true).setValue(message);

  var section = CardService.newCardSection()
    .setHeader("<font color=\"#1257e0\"><b>" + title + "</b></font>");
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