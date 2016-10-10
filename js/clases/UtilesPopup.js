class UtilesPopup {
	constructor() {
		return null
	}

	static getBrowserActionPopupSiAbiero () {
		let popups = chrome.extension.getViews({type: 'popup'})
		let popup = null
		for (let i=0;i<popups.length;i++) {
			if (popups[i].document.title == chrome.i18n.getMessage("ba_default_title")) {
				popup = popups[i]
			}
		}
		
		return popup
	}
}