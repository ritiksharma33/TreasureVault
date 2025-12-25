
let currentVaults = []; 
let currentVaultDetail = null; 




document.addEventListener('DOMContentLoaded', () => {
 
    const backBtn = document.getElementById('back-btn');
    const manualAddBtn = document.getElementById('manual-add-btn');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');


    backBtn.addEventListener('click', handleShowGrid);
    manualAddBtn.addEventListener('click', showManualAddModal);
    modalCancelBtn.addEventListener('click', hideManualAddModal);


    manualAddForm.addEventListener('submit', handleManualFormSubmit);

    vaultGridContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.vault-card');
        if (card) {
            handleShowDetail(card.dataset.vaultId);
        }
    });

    detailContent.addEventListener('click', (e) => {
        const vaultId = e.target.dataset.vaultId;
        if (!vaultId) return;

        if (e.target.classList.contains('btn-edit')) {
            handleEdit(vaultId);
        } else if (e.target.classList.contains('btn-save')) {
            handleSave(vaultId);
        } else if (e.target.classList.contains('btn-cancel')) {
            handleCancelEdit(vaultId);
        } else if (e.target.classList.contains('btn-delete')) {
            handleDelete(vaultId);
        }
    });


    loadAndDisplayVaults();
});


async function loadAndDisplayVaults() {
    try {
        currentVaults = await getVaults();
        renderVaultGrid(currentVaults);
    } catch (error) {
        console.error(error);
        alert("Error: Could not load vaults.");
    }
}


async function handleManualFormSubmit(e) {
    e.preventDefault();


    const vaultData = {
        title: document.getElementById('manual-title').value,
        ideas: document.getElementById('manual-ideas').value,
        actions: document.getElementById('manual-actions').value,
        tags: document.getElementById('manual-tags').value
                    .split(',').map(t => t.trim()).filter(t => t)
    };

    try {
        await createVault(vaultData);
        hideManualAddModal();
        await loadAndDisplayVaults(); 
    } catch (error) {
        console.error(error);
        alert("Error: Could not create vault.");
    }
}


function handleShowGrid() {
    currentVaultDetail = null;
    showGridView();
}


async function handleShowDetail(vaultId) {
    try {
        currentVaultDetail = await getVaultById(vaultId);
        renderDetailContent(currentVaultDetail);
        showDetailView();
    } catch (error) {
        console.error(error);
        alert("Error: Could not load vault details.");
    }
}


function handleEdit() {
    if (!currentVaultDetail) return;
    renderEditForm(currentVaultDetail);
}


function handleCancelEdit() {
    if (!currentVaultDetail) return;
    renderDetailContent(currentVaultDetail);
}


async function handleSave(vaultId) {

    const updatedData = {
        title: document.getElementById('edit-title').value,
        ideas: document.getElementById('edit-ideas').value,
        actions: document.getElementById('edit-actions').value,
        tags: document.getElementById('edit-tags').value
                    .split(',').map(t => t.trim()).filter(t => t)
    };

    try {

        currentVaultDetail = await updateVault(vaultId, updatedData);

        renderDetailContent(currentVaultDetail);

        await loadAndDisplayVaults();
    } catch (error) {
        console.error(error);
        alert("Error: Could not save vault.");
    }
}


async function handleDelete(vaultId) {

    if (!confirm("Are you sure you want to delete this vault? This cannot be undone.")) {
        return;
    }

    try {
        await deleteVault(vaultId);
        await loadAndDisplayVaults(); 
        handleShowGrid(); 
    } catch (error) {
        console.error(error);
        alert("Error: Could not delete vault.");
    }
}

const createVaultUrlBtn = document.getElementById('create-vault-url-btn');
const addUrlInput = document.getElementById('add-url-input');
const transcriptModal = document.getElementById('transcript-modal');
const transcriptTextArea = document.getElementById('transcript-text-area');
const transcriptTitleInput = document.getElementById('transcript-title');
const transcriptCopyBtn = document.getElementById('transcript-copy-btn');
const transcriptCancelBtn = document.getElementById('transcript-cancel-btn');
const transcriptSaveForm = document.getElementById('transcript-save-form');


let currentTranscript = null;
let currentUrl = null;


createVaultUrlBtn.addEventListener('click', handleFetchTranscript);
transcriptCancelBtn.addEventListener('click', () => transcriptModal.style.display = 'none');
transcriptCopyBtn.addEventListener('click', handleCopyTranscript);
transcriptSaveForm.addEventListener('submit', handleSaveTranscriptToVault);

// File: frontend/js/main.js

async function handleFetchTranscript() {
    const url = addUrlInput.value.trim();
    if (!url) {
        alert("Please paste a YouTube URL first.");
        return;
    }
  
    createVaultUrlBtn.disabled = true;
    createVaultUrlBtn.textContent = 'Processing...';

    try {
        // CALL the api.js function correctly
        const newVault = await fetchTranscriptAndSave(url);
        
        console.log("Vault created:", newVault);

        // SUCCESS ACTIONS:
        addUrlInput.value = ''; // Clear the input
        await loadAndDisplayVaults(); // Refresh your grid to show the new vault
        
        
    } catch (error) {
        alert(`Error fetching transcript: ${error.message}`);
        console.error("Transcript Error:", error);
    } finally {
        createVaultUrlBtn.disabled = false;
        createVaultUrlBtn.textContent = 'Create Vault from URL';
    }
}

function handleCopyTranscript() {
    if (currentTranscript) {
        navigator.clipboard.writeText(currentTranscript)
            .then(() => {
                transcriptCopyBtn.textContent = 'Copied!';
                setTimeout(() => transcriptCopyBtn.textContent = '📋 Copy Text', 2000);
            })
            .catch(err => {
                alert('Failed to copy text. Check console for details.');
                console.error('Copy failed:', err);
            });
    }
}


async function handleSaveTranscriptToVault(e) {
    e.preventDefault();

    const title = transcriptTitleInput.value.trim();
    if (!title || !currentTranscript) return;

  
    const vaultData = {
        title: title,
        ideas: currentTranscript, 
        actions: "Full transcript saved. Run LLM summary.", 
        tags: ["YouTube", "Raw Transcript"]
    };

    try {
        await createVault(vaultData); 
        
       
        transcriptModal.style.display = 'none';
        addUrlInput.value = '';
        currentTranscript = null;
        
        await loadAndDisplayVaults(); 
        
    } catch (error) {
        alert("Error saving vault from transcript.");
        console.error("Save Vault Error:", error);
    }
}