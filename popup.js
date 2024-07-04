document.addEventListener('DOMContentLoaded', function () {
  const categorySelect = document.getElementById('category');
  const saveButton = document.getElementById('saveButton');
  const itemList = document.getElementById('itemList');
  const itemPreview = document.getElementById('itemPreview');

  // Update the item preview based on the current tab's title
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tabTitle = tabs[0].title;
    const truncatedTitle = tabTitle.length > 50 ? tabTitle.substring(0, 50) + '...' : tabTitle;
    itemPreview.textContent = `Item: ${truncatedTitle}`;
  });

  // Save the selected item to the shopping list
  saveButton.addEventListener('click', function () {
    const selectedCategory = categorySelect.value;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const url = tabs[0].url;
      const tabTitle = tabs[0].title;
      const truncatedTitle = tabTitle.length > 50 ? tabTitle.substring(0, 50) + '...' : tabTitle;

      // Save the item to storage
      chrome.storage.sync.get('savedItems', function (data) {
        const savedItems = data.savedItems || [];
        savedItems.push({ category: selectedCategory, url, title: truncatedTitle });
        chrome.storage.sync.set({ savedItems });

        // Update the shopping list
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="${url}" target="_blank">${truncatedTitle} (${selectedCategory})</a>`;
        itemList.appendChild(listItem);
      });
    });
  });

  // Load and display saved items from storage
  chrome.storage.sync.get('savedItems', function (data) {
    const savedItems = data.savedItems || [];
    savedItems.forEach(item => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `<a href="${item.url}" target="_blank">${item.title} (${item.category})</a>`;
      itemList.appendChild(listItem);
    });
  });
});
