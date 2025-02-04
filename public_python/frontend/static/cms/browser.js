// Globalne zmienne
let currentPage = 1;
const filesPerPage = 10;
let allFiles = [];
let fileType = '';
let selectedFile = '';
let selectedIndex = '';
let selectedFileType = '';

const FILES = {
  'komputer': '/static/efekty/adds/galeria/video/komputer/',
  'mobile': '/static/efekty/adds/galeria/video/mobile/',
  'member_image': '/static/efekty/adds/hero/assets/',
  'galeria': '/static/efekty/adds/galeria/assets/',
  'main_background': '/static/efekty/adds/hero/assets/',
  'jumbotron': '/static/efekty/adds/hero/assets/',
  'partners': '/static/efekty/adds/hero/assets/loga/',
  'video': '/static/efekty/adds/hero/assets/video/'
};

// Funkcja aktualizacji podglądu obrazu (jeśli stosujesz podgląd w formularzu)
function updateImagePreview(index) {
  console.log("Wyświetlanie obrazu");
  const imageUrl = document.getElementById(`teamImage${index}`).value;
  document.getElementById(`imagePreview${index}`).src = imageUrl;
}

// Funkcja uploadu pliku – rozszerzona o wybór katalogu docelowego
function uploadFile() {
  const fileInput = document.getElementById('fileUploadInput');
  if (!fileInput.files[0]) {
    alert("Wybierz plik do przesłania.");
    return;
  }
  
  // Pobierz wybrany katalog docelowy
  const targetDirectory = document.getElementById('targetDirectory').value;
  // Ustaw fileType na wybrany katalog, aby później odczyt podglądu był zgodny
  fileType = targetDirectory;
  
  const formData = new FormData();
  formData.append('file', fileInput.files[0]);
  // Dodajemy parametr target, który informuje serwer, do którego katalogu zapisać plik
  formData.append('target', targetDirectory);
  // Opcjonalnie możesz dodać inne parametry, np. index
  if (selectedIndex) {
    formData.append('index', selectedIndex);
  }
  
  // Upewnij się, że adres endpointu jest poprawny
  fetch(`/user/upload_file`, {
    method: 'POST',
    body: formData
  })
  .then(response => {
    // Sprawdź czy odpowiedź ma poprawny typ JSON
    return response.json();
  })
  .then(data => {
    if (data.success) {
      alert("Plik przesłany pomyślnie.");
      // Odśwież listę plików – np. możesz wywołać ponownie funkcję browseFiles
      browseFiles({ target: document.querySelector('.browse-btn') });
      // Czyścimy input
      fileInput.value = '';
    } else {
      alert('File upload failed: ' + (data.error || ''));
    }
  })
  .catch(error => console.error('Error uploading file:', error));
}

// Funkcja przeglądania plików – niezmieniona lub lekko rozszerzona
function browseFiles(event) {
  const button = event.target;
  const index = button.dataset ? button.dataset.index : '';
  const type = button.dataset ? button.dataset.type : fileType;
  selectedIndex = index;
  selectedFileType = type;
  fileType = type;
  console.log("Type:", type, "fileType:", fileType);
  fetch(`/user/browse_hero_files?type=${type}`)
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      allFiles = data.files;
      currentPage = 1;
      renderFileList();
      const fileBrowserModal = new bootstrap.Modal(document.getElementById('fileBrowserModal'));
      fileBrowserModal.show();
    } else {
      alert('Failed to retrieve files');
    }
  })
  .catch(error => console.error('Error browsing files:', error));
}

function renderFileList() {
  const fileListContainer = document.getElementById('fileList');
  fileListContainer.innerHTML = '';
  const paginatedFiles = paginateFiles(allFiles, currentPage, filesPerPage);

  paginatedFiles.forEach(file => {
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
    listItem.textContent = file;
    listItem.style.cursor = 'pointer';

    listItem.addEventListener('click', () => {
      selectFile(file);
    });

    fileListContainer.appendChild(listItem);
  });

  updatePaginationControls();
}

function paginateFiles(files, page, filesPerPage) {
  const start = (page - 1) * filesPerPage;
  const end = start + filesPerPage;
  return files.slice(start, end);
}

function updatePaginationControls() {
  document.getElementById('prevPage').classList.toggle('disabled', currentPage === 1);
  document.getElementById('nextPage').classList.toggle('disabled', currentPage === Math.ceil(allFiles.length / filesPerPage));
}

document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderFileList();
  }
});

document.getElementById('nextPage').addEventListener('click', () => {
  if (currentPage < Math.ceil(allFiles.length / filesPerPage)) {
    currentPage++;
    renderFileList();
  }
});

document.getElementById('searchBtn').addEventListener('click', () => {
  const query = document.getElementById('fileSearch').value.toLowerCase();
  allFiles = allFiles.filter(file => file.toLowerCase().includes(query));
  currentPage = 1;
  renderFileList();
});

// Podłącz przycisk uploadu plików
document.getElementById('uploadFileBtn').addEventListener('click', uploadFile);

// Usuwanie pliku
document.getElementById('deleteFileBtn').addEventListener('click', function() {
  const fileName = document.getElementById('newFileName').value;
  if (!fileName) {
    alert('Please select a file to delete.');
    return;
  }
  fetch(`/user/delete_hero_files?type=${encodeURIComponent(fileType)}&file_name=${encodeURIComponent(fileName)}`, {
    method: 'POST'
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(data => {
        throw new Error(data.error || 'Failed to delete file');
      });
    }
    return response.json();
  })
  .then(data => {
    alert('File deleted successfully');
    browseFiles({ target: document.querySelector('.browse-btn') });
  })
  .catch(error => {
    console.error('Error deleting file:', error);
    alert(`Failed to delete file: ${error.message}`);
  });
});

// Funkcja wyboru pliku i podglądu
function selectFile(file) {
  selectedFile = file;
  document.getElementById('newFileName').value = file;
  document.getElementById('fileDetails').classList.remove('d-none');
  document.getElementById('renameFileBtn').onclick = function() {
    renameFile(file);
  };

  const fileExtension = file.split('.').pop().toLowerCase();
  const filePreviewContainer = document.getElementById('filePreview');
  filePreviewContainer.innerHTML = '';

  let filePath = '';
  if (fileType in FILES) {
    filePath = FILES[fileType];
  } else {
    filePath = '/static/efekty/adds/galeria/video/';
    console.log('Została zwrócona nieprawidłowa ścieżka, sprawdź zmienną FILES');
  }

  if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
    const img = document.createElement('img');
    img.src = `${filePath}${file}`;
    img.alt = file;
    img.className = 'img-fluid';
    filePreviewContainer.appendChild(img);
  } else if (fileExtension === 'mp4') {
    const video = document.createElement('video');
    video.className = 'w-100';
    video.controls = true;
    const source = document.createElement('source');
    source.src = `${filePath}${file}`;
    source.type = 'video/mp4';
    video.appendChild(source);
    video.innerHTML += 'Your browser does not support the video tag.';
    filePreviewContainer.appendChild(video);
  } else if (fileExtension === 'pdf') {
    const iframe = document.createElement('iframe');
    iframe.src = `${filePath}${file}`;
    iframe.style.width = "100%";
    iframe.style.height = "500px";
    filePreviewContainer.appendChild(iframe);
  } else {
    const p = document.createElement('p');
    p.textContent = 'Preview not available for this file type.';
    filePreviewContainer.appendChild(p);
  }
}

// Funkcja zmiany nazwy pliku
function renameFile(oldFileName) {
  const newFileName = document.getElementById('newFileName').value;
  if (!newFileName) {
    alert('New file name cannot be empty.');
    return;
  }
  fetch(`/user/change_hero_names_files?old_name=${encodeURIComponent(oldFileName)}&new_name=${encodeURIComponent(newFileName)}`, {
    method: 'POST'
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('File renamed successfully.');
      browseFiles({ target: document.querySelector('.browse-btn') });
    } else {
      alert('Failed to rename file.');
    }
  })
  .catch(error => console.error('Error renaming file:', error));
}

// Akcja przycisku OK – ustawia wybraną ścieżkę do pola formularza
document.getElementById('okBtn').addEventListener('click', () => {
  if (selectedFile && selectedIndex) {
    let filePath = '';
    if (selectedFileType in FILES) {
      filePath = `${FILES[selectedFileType]}${selectedFile}`;
    } else {
      filePath = `/static/efekty/adds/galeria/video/${selectedFileType}/${selectedFile}`;
    }

    if (selectedFileType === 'komputer' || selectedFileType === 'mobile') {
      const videoSrcField = selectedFileType === 'komputer' 
                            ? `videoSrc_${selectedIndex}` 
                            : `videoMobileSrc_${selectedIndex}`;
      document.getElementById(videoSrcField).value = filePath;
      document.getElementById(`videoPreview_${selectedIndex}`).querySelector('source').src = filePath;
      document.getElementById(`videoPreview_${selectedIndex}`).load();
    } else if (selectedFileType === 'main_background') {
      document.getElementById('mainBackgroundURL').value = filePath;
      document.getElementById('imagePreview').src = filePath;
    } else if (selectedFileType === 'member_image') {
      document.getElementById(`teamImage${selectedIndex}`).value = filePath;
      document.getElementById(`imagePreview${selectedIndex}`).src = filePath;
    } else if (selectedFileType === 'jumbotron') {
      document.getElementById('jumbotronImageURL').value = filePath;
      document.getElementById('jumbotronImagePreview').src = filePath;
    } else if (selectedFileType === 'partners') {
      document.getElementById(`partnerImage${selectedIndex}`).value = filePath;
      document.getElementById(`partnerImagePreview${selectedIndex}`).src = filePath;
    } else if (selectedFileType === 'video') {
      document.getElementById(`videoImage${selectedIndex}`).value = filePath;
      document.getElementById(`videoImagePreview${selectedIndex}`).src = filePath;
    }

    console.log("File path set to:", filePath);
    const fileBrowserModal = bootstrap.Modal.getInstance(document.getElementById('fileBrowserModal'));
    fileBrowserModal.hide();
  }
});
