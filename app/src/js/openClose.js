var mainPanel = null;
var profilePanel = null;


function initializeState() {
	profilePanel = $('#profile-panel');
	mainPanel = $('#injected-content');
}

function clickHandler(event) {

	if (profileIsOpen()) {
		closeProfilePanel();
	} else if (!profileIsOpen() && sidebarIsOpen()) {
		closeSidebarPanel();
	} else if (!sidebarIsOpen()) {
		openSidebarPanel();
	}
}

function initialNudge() {
	mainPanel.removeClass('out-of-sight').addClass('sidebar-closed');
}

function closeProfilePanel() {
	profilePanel.addClass('profile-closed');
}

function closeSidebarPanel() {
	if (profileIsOpen()) {
		closeProfilePanel();
	}
	mainPanel.addClass('sidebar-closed');
}

function openSidebarPanel() {
	mainPanel.removeClass('sidebar-closed');
}

function openProfilePanel() {
	if (!sidebarIsOpen()) {
		openSidebarPanel();
	}
	profilePanel.removeClass('profile-closed');
}

function profileIsOpen() {
	return !profilePanel.hasClass('profile-closed');
}

function sidebarIsOpen() {
	return !mainPanel.hasClass('sidebar-closed');
}