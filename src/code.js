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
    // Activate temporary Gmail add-on scopes.
    var accessToken = e.messageMetadata.accessToken;
    GmailApp.setCurrentMessageAccessToken(accessToken);

    var messageId = e.messageMetadata.messageId;
    var message = GmailApp.getMessageById(messageId);

    // Create a section for that contains all user Labels.
    var section = CardService.newCardSection()
        .setHeader("<font color=\"#1257e0\"><b>Mmessage Text</b></font>");

    var mailText = message.getPlainBody();
    // Create a checkbox group for user labels that are added to prior section.
    var textInput = CardService.newTextInput().setTitle("Message")
        .setFieldName("message_text")
        .setMultiline(true).setValue(mailText);

    // Add the checkbox group to the section.
    section.addWidget(textInput);

    // Build the main card after adding the section.
    var card = CardService.newCardBuilder()
        .setHeader(CardService.newCardHeader()
            .setTitle('EnviroGuard')
            .setImageUrl('https://www.gstatic.com/images/icons/material/system/1x/label_googblue_48dp.png'))
        .addSection(section)
        .build();

    return [card];
}

/**
 * Updates the labels on the current thread based on
 * user selections. Runs via the OnChangeAction for
 * each CHECK_BOX created.
 *
 * @param {Object} e The data provided by the Gmail UI.
 */
function toggleLabel(e){
    var selected = e.formInputs.labels;

    // Activate temporary Gmail add-on scopes.
    var accessToken = e.messageMetadata.accessToken;
    GmailApp.setCurrentMessageAccessToken(accessToken);

    var messageId = e.messageMetadata.messageId;
    var message = GmailApp.getMessageById(messageId);
    var thread = message.getThread();

    if (selected != null){
        for each (var label in GmailApp.getUserLabels()) {
            if(selected.indexOf(label.getName()) != -1){
                thread.addLabel(label);
            }
            else {
                thread.removeLabel(label);
            }
        }
    }
    else {
        for each (var label in GmailApp.getUserLabels()) {
            thread.removeLabel(label);
        }
    }
}

/**
 * Converts an GmailLabel object to a array of strings.
 * Used for easy sorting and to determine if a value exists.
 *
 * @param {labelsObjects} A GmailLabel object array.
 * @return {lables[]} An array of labels names as strings.
 */
function getLabelArray(labelsObjects){
    var labels = [];
    for(var i = 0; i < labelsObjects.length; i++) {
        labels[i] = labelsObjects[i].getName();
    }
    labels.sort();
    return labels;
}

