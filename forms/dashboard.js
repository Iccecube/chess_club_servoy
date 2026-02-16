/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"1D0FB47D-8D4A-43D1-A19E-6BD42EFE1076",variableType:8}
 */
var upcomingTournaments = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"C8807ACA-D944-4245-BF8C-0EF6E6F47780",variableType:8}
 */
var averageRating = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"BCC7FA99-DFE4-4BF4-957C-F3E823B792C8",variableType:8}
 */
var activeMembers = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"7FE264FE-19B0-427F-A39C-BB0F4B8768B7",variableType:8}
 */
var totalMembers = null;

/**
 * @type {Date}
 *
 * @properties={typeid:35,uuid:"74453071-DC62-464B-BEDE-8DDC54C70E9D",variableType:93}
 */
var chartStartDate = null;

/**
 * @type {Date}
 *
 * @properties={typeid:35,uuid:"CD7F2322-2DE1-4F7D-BB33-9BBBD235C8CF",variableType:93}
 */
var chartEndDate = null;


/**
 * TODO generated, please specify type and doc for the params
 * @param firstShow
 * @param event
 *
 * @properties={typeid:24,uuid:"6AE9E284-469B-44AD-BA6B-0741E37A7C74"}
 */
function onShowDashboard(firstShow, event) {
	if (firstShow || !firstShow) {
		calculateStatistics();
		loadRecentActivity();
	}
}

/**
 * @properties={typeid:24,uuid:"9D8C1156-C855-43C1-A6CD-30C01D4C1643"}
 */
function calculateStatistics() {
	// Total members
	var members = databaseManager.getFoundSet('db:/chess_club_db/chess_members');
	members.loadAllRecords();
	totalMembers = members.getSize();
	
	// Active members and average rating
	activeMembers = 0;
	var totalRating = 0;
	var ratedCount = 0;
	
	for (var i = 1; i <= totalMembers; i++) {
		var member = members.getRecord(i);
		if (member.active == 1) activeMembers++;
		if (member.rating > 0) {
			totalRating += member.rating;
			ratedCount++;
		}
	}
	
	averageRating = ratedCount > 0 ? Math.round(totalRating / ratedCount) : 0;
	
}



