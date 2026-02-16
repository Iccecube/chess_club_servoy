/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"F8A66357-19D6-4056-B5C1-8C5F1B60BB9C"}
 */
var searchText = null;


/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @private
 *
 * @properties={typeid:24,uuid:"10CBA617-DF7B-4B3C-92A3-271C39B5FBB2"}
 */
 function newMember(event) {
		var success = foundset.newRecord();
		
		if (!success) {
			plugins.dialogs.showErrorDialog('Error', 'Could not create new member.');
			return;
		}
		
		// Set defaults
		first_name = '';
		last_name = '';
		email = '';
		phone = '';
		date_joined = application.getServerTimeStamp();
		membership_type = 'regular';
		rating = 1200;
		active = 1;
		notes = '';
		
		plugins.dialogs.showInfoDialog('New Member', 'Enter member information and click Save.');
	}

	/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 * 
 * @private
 *
 * @properties={typeid:24,uuid:"8D840363-5D28-49D4-9A0F-E48B9F21C105"}
 */
	function saveMember(event) {
		// Validate required fields
		if (!first_name || first_name.trim() == '') {
			plugins.dialogs.showWarningDialog('Required Field', 'First Name is required.');
			return false;
		}
		
		if (!last_name || last_name.trim() == '') {
			plugins.dialogs.showWarningDialog('Required Field', 'Last Name is required.');
			return false;
		}
		
		if (!email || email.trim() == '') {
			plugins.dialogs.showWarningDialog('Required Field', 'Email is required.');
			return false;
		}
		
		// Validate email format
		if (email.indexOf('@') == -1) {
			plugins.dialogs.showWarningDialog('Invalid Email', 'Please enter a valid email address.');
			return false;
		}
		
		// Check for duplicate email
		var fs = databaseManager.getFoundSet('db:/chess_club_db/chess_members');
		fs.loadRecords("email = '" + email + "' AND member_id != " + (member_id || 0));
		
		if (fs.getSize() > 0) {
			plugins.dialogs.showWarningDialog('Duplicate Email', 'This email is already registered.');
			return false;
		}
		
		// Validate rating range
		if (rating < 0 || rating > 3000) {
			plugins.dialogs.showWarningDialog('Invalid Rating', 'Rating must be between 0 and 3000.');
			return false;
		}
		
		// Save
		var success = databaseManager.saveData();
		
		if (success) {
			plugins.dialogs.showInfoDialog('Success', 'Member saved successfully!');
			return true;
		} else {
			plugins.dialogs.showErrorDialog('Error', 'Could not save member.');
			return false;
		}
	}
	
	/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @private
 *
 * @properties={typeid:24,uuid:"9373224C-6276-47F8-B597-E667E2840503"}
 */
	function cancelChanges(event) {
		var editCount = databaseManager.getEditedRecords().length;
		
		if (editCount > 0) {
			var response = plugins.dialogs.showQuestionDialog(
				'Discard Changes',
				'You have unsaved changes. Discard them?',
				'Yes, Discard',
				'No, Keep Editing'
			);
			
			if (response == 'Yes, Discard') {
				databaseManager.revertEditedRecords();
				plugins.dialogs.showInfoDialog('Discarded', 'Changes have been discarded.');
			}
		} else {
			plugins.dialogs.showInfoDialog('No Changes', 'No unsaved changes to discard.');
		}
	}
	
	/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @private
 *
 * @properties={typeid:24,uuid:"1C978BA1-2364-4196-9FB3-FDD27C3EAAB2"}
 */
	function deleteMember(event) {
		if (!member_id) {
			plugins.dialogs.showWarningDialog('No Selection', 'Please select a member to delete.');
			return;
		}
		
		var memberName = first_name + ' ' + last_name;
		
		var response = plugins.dialogs.showQuestionDialog(
			'Delete Member',
			'Delete ' + memberName + '? This cannot be undone.\n\nAll games and registrations will also be deleted.',
			'Yes, Delete',
			'No, Cancel'
		);
		
		if (response == 'Yes, Delete') {
			var success = foundset.deleteRecord();
			
			if (success) {
				databaseManager.saveData();
				plugins.dialogs.showInfoDialog('Deleted', memberName + ' has been deleted.');
			} else {
				plugins.dialogs.showErrorDialog('Error', 'Could not delete member.');
			}
		}
	}
	
	/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @private
 *
 * @properties={typeid:24,uuid:"96712959-8CB0-4BCF-A372-C3A3ADF80B44"}
 * @AllowToRunInFind
 */
	function searchMembers(event) {

	    if (!searchText || searchText.trim() == '') {
	        plugins.dialogs.showWarningDialog('Search', 'Please enter search text.');
	        return;
	    }

	    var term = "%" + searchText.trim() + "%";

	    foundset.find();

	    // first_name search
	    first_name = term;

	    // OR last_name
	    foundset.newRecord();
	    last_name = term;

	    // OR email
	    foundset.newRecord();
	    email = term;

	    // OR rating if number
	    if (!isNaN(searchText)) {
	        foundset.newRecord();
	        rating = parseInt(searchText);
	    }

	    var count = foundset.search();

	    if (count > 0) {
	        plugins.dialogs.showInfoDialog('Results', 'Found ' + count + ' member(s).');
	    } else {
	        plugins.dialogs.showInfoDialog('No Results', 'No members found matching "' + searchText + '".');
	    }
	}


	/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @private
 *
 * @properties={typeid:24,uuid:"F3BE04C7-A5EE-438B-811D-BE2B4AC9454D"}
 */
	function clearSearch(event) {
		searchText = '';
		foundset.loadAllRecords();
		plugins.dialogs.showInfoDialog('Cleared', 'Showing all ' + foundset.getSize() + ' members.');
	}
	
	/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"F3ED1AAA-9B3B-4146-BFB7-F1980B1D6EC1"}
 */
	function onShowMembers(firstShow, event) {
		if (firstShow) {
			foundset.loadAllRecords();
			foundset.sort('last_name asc, first_name asc');
		}
	}
	
/**

 * @private
 *
 * @properties={typeid:24,uuid:"39CDCBF3-0740-42D1-80E2-2083F53A1B9C"}
 */
	function showDashboard(event) {
		forms.dashboard.controller.show();
	}

/**

 * @private
 *
 * @properties={typeid:24,uuid:"25D6538B-4055-45EE-BB85-41DA18B2681A"}
 */
function showMembers() {
	forms.chess_members.controller.show();
}

/**

 * @private
 *
 * @properties={typeid:24,uuid:"54F51EA0-1203-4464-9805-08181E1A4C2F"}
 */
function showGames() {
	forms.tournaments.controller.show();
}

/**

 * @private
 *
 * @properties={typeid:24,uuid:"A5702C51-A637-467A-9785-AA9D587DE146"}
 */
function showStandings() {
	forms.standings.controller.show();
	}
