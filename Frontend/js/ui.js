// File: frontend/js/ui.js

// --- DOM Elements ---
const vaultGridView = document.getElementById('vault-grid-view');
const vaultDetailView = document.getElementById('vault-detail-view');
const vaultGridContainer = document.getElementById('vault-grid-container');
const detailContent = document.getElementById('detail-content');
const detailHeaderTitle = document.getElementById('detail-header-title');
const manualAddModal = document.getElementById('manual-add-modal');
const manualAddForm = document.getElementById('manual-add-form');




// --- View Toggling ---
function showGridView() {
    vaultDetailView.style.display = 'none';
    vaultGridView.style.display = 'block';
    window.scrollTo(0, 0);
}

function showDetailView() {
    vaultGridView.style.display = 'none';
    vaultDetailView.style.display = 'block';
    window.scrollTo(0, 0);
}

function showManualAddModal() {
    manualAddModal.style.display = 'flex';
}

function hideManualAddModal() {
    manualAddForm.reset();
    manualAddModal.style.display = 'none';
}

// --- Grid Rendering ---
function renderVaultGrid(vaults) {
    vaultGridContainer.innerHTML = ''; // Clear existing grid
    if (vaults.length === 0) {
        vaultGridContainer.innerHTML = '<p>No vaults found. Add one!</p>';
        return;
    }
    vaults.forEach(vault => {
        vaultGridContainer.innerHTML += getVaultCardHTML(vault);
    });
}

function getVaultCardHTML(vault) {
    const createdDate = new Date(vault.created_date).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });

    // Truncate tags for the card view
    const tagsPreview = vault.tags.length > 0 ? `🏷️ ${vault.tags.slice(0, 3).join(' • ')}` : 'No tags';

    return `
        <div class="vault-card" data-vault-id="${vault.id}">
            <p class="card-title">🎁 ${vault.title}</p>
            <span class="card-tags">${tagsPreview}</span>
            <p class="card-date">📅 ${createdDate}</p>
        </div>
    `;
}

// --- Detail View Rendering ---
function renderDetailContent(vault) {
    detailHeaderTitle.innerHTML = `🎁 ${vault.title}`;

    const tagsHTML = vault.tags.map(tag => `<span class="tag">🏷️ ${tag}</span>`).join('') || '<p>No tags added.</p>';

    // Split text by newlines, filter empty lines, and map to HTML
    const ideasHTML = vault.ideas.split('\n')
                        .filter(line => line.trim())
                        .map(idea => `<div class="content-item">${idea}</div>`).join('') || '<p>No ideas added yet.</p>';

    const actionsHTML = vault.actions.split('\n')
                        .filter(line => line.trim())
                        .map(action => `<div class="content-item">${action}</div>`).join('') || '<p>No actions added yet.</p>';

    detailContent.innerHTML = `
        <section class="detail-section">
            <h2>ℹ️ INFO</h2>
            <div class="detail-box" id="detail-info-box">
                <p><strong>Title:</strong> ${vault.title}</p>
                <p><strong>Added:</strong> ${new Date(vault.created_date).toLocaleString()}</p>
            </div>
        </section>

        <section class="detail-section">
            <div class="tags-container" id="detail-tags-container">
                ${tagsHTML}
            </div>
        </section>

        <section class="detail-section">
            <h2>💡 FUTURE IDEAS</h2>
            <div class="detail-box" id="detail-ideas-box">
                ${ideasHTML}
            </div>
        </section>

        <section class="detail-section">
            <h2>✅ PRACTICAL ACTIONS</h2>
            <div class="detail-box" id="detail-actions-box">
                ${actionsHTML}
            </div>
        </section>

        <footer class="detail-footer" id="detail-footer-buttons">
            <button class="btn btn-primary btn-edit" data-vault-id="${vault.id}">Edit</button>
            <button class="btn btn-danger btn-delete" data-vault-id="${vault.id}">🗑️ Delete Vault</button>
        </footer>
    `;
}

// --- Edit-in-Place Rendering ---
function renderEditForm(vault) {
    detailHeaderTitle.innerHTML = `✏️ Editing: ${vault.title}`;

    // 1. Replace Info Box
    document.getElementById('detail-info-box').innerHTML = `
        <div class="form-group">
            <label for="edit-title">Title</label>
            <input type="text" id="edit-title" class="form-group" value="${vault.title}">
        </div>
    `;

    // 2. Replace Tags
    document.getElementById('detail-tags-container').innerHTML = `
        <div class="form-group" style="width: 100%">
            <label for="edit-tags">Tags (comma-separated)</label>
            <input type="text" id="edit-tags" class="form-group" value="${vault.tags.join(', ')}">
        </div>
    `;

    // 3. Replace Ideas
    document.getElementById('detail-ideas-box').innerHTML = `
        <label for="edit-ideas">Ideas (one per line)</label>
        <textarea id="edit-ideas" class="form-group" rows="5">${vault.ideas}</textarea>
    `;

    // 4. Replace Actions
    document.getElementById('detail-actions-box').innerHTML = `
        <label for="edit-actions">Actions (one per line)</label>
        <textarea id="edit-actions" class="form-group" rows="5">${vault.actions}</textarea>
    `;

    // 5. Replace Footer Buttons
    document.getElementById('detail-footer-buttons').innerHTML = `
        <button class="btn btn-green btn-save" data-vault-id="${vault.id}">Save Changes</button>
        <button class="btn btn-secondary btn-cancel" data-vault-id="${vault.id}">Cancel</button>
        <button class="btn btn-danger btn-delete" data-vault-id="${vault.id}">🗑️ Delete Vault</button>
    `;
}