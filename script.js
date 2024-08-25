function showTab(tabId) {
    const tabs = document.querySelectorAll('.form-container');
    tabs.forEach(tab => tab.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
}
