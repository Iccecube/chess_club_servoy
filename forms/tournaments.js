/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"79F0B267-83E5-4FAF-86BC-076CF219300E"}
 */
var searchTournament = null;

/**
 * @properties={typeid:35,uuid:"D1850268-5E7E-4BA2-9F0D-6EBA457EEAD9",variableType:-4}
 */
var searchText = null;
/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @private
 *
 * @properties={typeid:24,uuid:"16A32417-ABF7-4B1C-A290-FA9527EA7854"}
 */
 function saveTournament(event) {
		if (!tournament_name || tournament_name.trim() == '') {
			plugins.dialogs.showWarningDialog('Required', 'Tournament name is required.');
			return false;
		}
		
		if (!start_date) {
			plugins.dialogs.showWarningDialog('Required', 'Start date is required.');
			return false;
		}
		
		var success = databaseManager.saveData();
		if (success) {
			plugins.dialogs.showInfoDialog('Success', 'Tournament saved!');
		} else {
			plugins.dialogs.showErrorDialog('Error', 'Could not save tournament.');
		}
	}

	/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @private
 *
 * @properties={typeid:24,uuid:"1B4F7D58-9070-43B6-B660-FC34B05FCF53"}
 */
	function newTournament(event) {
		var success = foundset.newRecord();
		if (!success) return;
		
		tournament_name = 'New Tournament';
		start_date = application.getServerTimeStamp();
		status = 'upcoming';
		prize_fund = 0;
		max_participants = 32;
		
		plugins.dialogs.showInfoDialog('New Tournament', 'Enter details and click Save.');
	}	
	
	/**
 * TODO generated, please specify type and doc for the params
 * @param event
 *
 * @properties={typeid:24,uuid:"073E0DE5-3101-42C4-90DB-8BE9D8839693"}
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
 * @properties={typeid:24,uuid:"8C55DD1A-8CD7-4AC3-9766-394015F1FB77"}
 */
	function deleteTournament(event) {
		if (!tournament_id) {
			plugins.dialogs.showWarningDialog('No Selection', 'Please select a Tournament to delete.');
			return;
		}
		
		var memberName = tournament_name;
		
		var response = plugins.dialogs.showQuestionDialog(
			'Delete Tournament',
			'Delete ' + memberName + '? This cannot be undone.\n\nAll game registrations will also be deleted.',
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
 * TODO generated, please specify type and doc for the params
 * @param event
 *
 * @properties={typeid:24,uuid:"9008473B-3E78-49DD-AF2E-E91965CA28A0"}
 * @AllowToRunInFind
 */
	function searchTournaments(event) {

	    if (!searchTournament || searchTournament.trim() == '') {
	        plugins.dialogs.showWarningDialog(
	            'Search',
	            'Please enter search text.'
	        );
	        return;
	    }

	    var term = '%' + searchTournament.trim() + '%';

	    controller.find();

	    tournament_name = term;

	    controller.newRecord();
	    location = term;

	    controller.newRecord();
	    status = term;

	    var count = controller.search();

	    application.output("Search term: " + term);
	    application.output("Found: " + count);

	    if (count > 0) {

	        plugins.dialogs.showInfoDialog(
	            'Results',
	            'Found ' + count + ' tournament(s).'
	        );

	    } else {

	        plugins.dialogs.showInfoDialog(
	            'No Results',
	            'No tournaments found matching "' + searchTournament + '".'
	        );

	        controller.loadAllRecords();
	    }
	}



	/**
 * TODO generated, please specify type and doc for the params
 * @param event
 *
 * @properties={typeid:24,uuid:"15B27084-7723-484C-8258-1197F44827E6"}
 */
function clearSearch(event) {
		searchText = '';
		foundset.loadAllRecords();
		plugins.dialogs.showInfoDialog('Cleared', 'Showing all ' + foundset.getSize() + ' members.');
	}

	/**

	 * @private
	 *
	 * @properties={typeid:24,uuid:"EE10A894-36A3-4ACB-8904-485D83C176B1"}
	 */
	function showDashboard() {
		forms.dashboard.controller.show();
	}

	/**

	 * @private
	 *
	 * @properties={typeid:24,uuid:"0279FDC8-A7E7-4EB0-9F66-92250786696F"}
	 */
	function showMembers() {
		forms.chess_members.controller.show();
	}

	/**

	 * @private
	 *
	 * @properties={typeid:24,uuid:"A065CEDE-5E90-450E-8474-17245D739D70"}
	 */
	function showGames() {
		forms.tournaments.controller.show();
	}

	/**

	 * @private
	 *
	 * @properties={typeid:24,uuid:"91DA7FBB-1816-4603-910B-645AACD7B95A"}
	 */
	function showStandings() {
		forms.standings.controller.show();
		}
	
		/**
 * @properties={typeid:24,uuid:"FAB2FCC0-6957-41A0-A6A0-8D9A51A7C8BF"}
 */
function getRegistrationCount() {
		    return tournaments_to_registrations.getSize();
		}
