/**
 * dashboard.js - Script pour les tableaux de bord administratifs
 * Fonctionnalités spécifiques aux utilisateurs administratifs (admin, enseignant, resp. scolarité, comptable)
 */

// Configuration spécifique aux dashboards
const DASHBOARD_CONFIG = {
    chartColors: {
        primary: 'rgba(78, 115, 223, 0.8)',
        secondary: 'rgba(28, 200, 138, 0.8)',
        warning: 'rgba(246, 194, 62, 0.8)',
        danger: 'rgba(231, 74, 59, 0.8)',
        info: 'rgba(54, 185, 204, 0.8)',
        dark: 'rgba(90, 92, 105, 0.8)'
    },
    chartBgColors: {
        primary: 'rgba(78, 115, 223, 0.1)',
        secondary: 'rgba(28, 200, 138, 0.1)',
        warning: 'rgba(246, 194, 62, 0.1)',
        danger: 'rgba(231, 74, 59, 0.1)',
        info: 'rgba(54, 185, 204, 0.1)',
        dark: 'rgba(90, 92, 105, 0.1)'
    }
};

/**
 * Fonction pour initialiser le sidebar
 */
function initSidebar() {
    const sidebarCollapse = document.getElementById('sidebarCollapse');
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    
    if (sidebarCollapse && sidebar && content) {
        sidebarCollapse.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            content.classList.toggle('active');
        });
    }
    
    // Marquer l'élément actif dans le sidebar
    const currentPath = window.location.pathname;
    const sidebarLinks = document.querySelectorAll('#sidebar ul li a');
    
    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.includes(href)) {
            link.parentElement.classList.add('active');
        }
    });
}

/**
 * Fonction pour initialiser les modals
 */
function initModals() {
    // Ouvrir une modal
    const modalTriggers = document.querySelectorAll('[data-toggle="modal"]');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const targetModal = document.querySelector(this.getAttribute('data-target'));
            if (targetModal) {
                targetModal.classList.add('show');
            }
        });
    });
    
    // Fermer une modal
    const modalCloseButtons = document.querySelectorAll('[data-dismiss="modal"]');
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal-backdrop');
            if (modal) {
                modal.classList.remove('show');
            }
        });
    });
    
    // Fermer une modal en cliquant en dehors de la modal-dialog
    const modals = document.querySelectorAll('.modal-backdrop');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
            }
        });
    });
}

/**
 * Fonction pour initialiser les tableaux avec pagination et tri
 * @param {string} tableId - L'ID du tableau
 * @param {Object} options - Les options du tableau (pagination, tri, recherche)
 */
function initDataTable(tableId, options = {}) {
    const table = document.getElementById(tableId);
    if (!table) {
        console.error(`Table with ID ${tableId} not found`);
        return;
    }
    
    // Options par défaut
    const defaultOptions = {
        perPage: 10,
        search: true,
        sort: true,
        pagination: true
    };
    
    // Fusionner les options par défaut avec les options fournies
    const settings = { ...defaultOptions, ...options };
    
    // Conteneur de la table
    const tableContainer = table.parentElement;
    
    // Créer le champ de recherche si l'option est activée
    if (settings.search) {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'datatable-search mb-3';
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'form-control';
        searchInput.placeholder = 'Rechercher...';
        
        searchContainer.appendChild(searchInput);
        tableContainer.insertBefore(searchContainer, table);
        
        // Fonctionnalité de recherche
        searchInput.addEventListener('input', function() {
            const searchValue = this.value.toLowerCase();
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchValue)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
            
            // Mettre à jour la pagination
            if (settings.pagination) {
                updatePagination();
            }
        });
    }
    
    // Ajouter la fonctionnalité de tri si l'option est activée
    if (settings.sort) {
        const headerCells = table.querySelectorAll('thead th');
        
        headerCells.forEach((cell, index) => {
            // Ignorer les colonnes qui ne doivent pas être triées (data-sort="false")
            if (cell.getAttribute('data-sort') === 'false') {
                return;
            }
            
            cell.style.cursor = 'pointer';
            cell.innerHTML += ' <span class="sort-icon"></span>';
            
            cell.addEventListener('click', function() {
                const isAsc = this.classList.contains('sort-asc');
                
                // Réinitialiser tous les en-têtes
                headerCells.forEach(th => {
                    th.classList.remove('sort-asc', 'sort-desc');
                });
                
                // Définir la direction de tri
                this.classList.add(isAsc ? 'sort-desc' : 'sort-asc');
                
                // Trier les lignes
                const rows = Array.from(table.querySelectorAll('tbody tr'));
                rows.sort((a, b) => {
                    let aValue = a.cells[index].textContent;
                    let bValue = b.cells[index].textContent;
                    
                    // Trier comme des nombres si les valeurs sont numériques
                    if (!isNaN(aValue) && !isNaN(bValue)) {
                        aValue = parseFloat(aValue);
                        bValue = parseFloat(bValue);
                    }
                    
                    return isAsc 
                        ? (aValue > bValue ? 1 : -1) 
                        : (aValue < bValue ? 1 : -1);
                });
                
                // Réorganiser les lignes dans la table
                const tbody = table.querySelector('tbody');
                rows.forEach(row => tbody.appendChild(row));
                
                // Mettre à jour la pagination
                if (settings.pagination) {
                    updatePagination();
                }
            });
        });
    }
    
    // Ajouter la pagination si l'option est activée
    if (settings.pagination) {
        const rows = table.querySelectorAll('tbody tr');
        const rowCount = rows.length;
        const pageCount = Math.ceil(rowCount / settings.perPage);
        
        // Créer le conteneur de pagination
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'datatable-pagination mt-3';
        
        // Créer le sélecteur d'entrées par page
        const perPageContainer = document.createElement('div');
        perPageContainer.className = 'datatable-per-page';
        perPageContainer.innerHTML = `
            <label>
                Afficher 
                <select class="form-control form-control-sm">
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
                entrées par page
            </label>
        `;
        
        // Créer la navigation de pagination
        const paginationNav = document.createElement('nav');
        paginationNav.innerHTML = `
            <ul class="pagination">
                <li class="page-item disabled">
                    <a class="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <li class="page-item active"><a class="page-link" href="#">1</a></li>
                <li class="page-item disabled">
                    <a class="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        `;
        
        paginationContainer.appendChild(perPageContainer);
        paginationContainer.appendChild(paginationNav);
        tableContainer.appendChild(paginationContainer);
        
        // Initialiser la pagination
        let currentPage = 1;
        let perPage = settings.perPage;
        
        // Fonction pour mettre à jour l'affichage des lignes
        function updatePagination() {
            const rows = Array.from(table.querySelectorAll('tbody tr')).filter(row => row.style.display !== 'none');
            const rowCount = rows.length;
            const pageCount = Math.ceil(rowCount / perPage);
            
            // Mettre à jour le nombre de pages
            const pagination = paginationNav.querySelector('ul');
            pagination.innerHTML = `
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
            `;
            
            // Générer les liens de page
            for (let i = 1; i <= pageCount; i++) {
                pagination.innerHTML += `
                    <li class="page-item ${i === currentPage ? 'active' : ''}">
                        <a class="page-link" href="#">${i}</a>
                    </li>
                `;
            }
            
            pagination.innerHTML += `
                <li class="page-item ${currentPage === pageCount ? 'disabled' : ''}">
                    <a class="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            `;
            
            // Afficher les lignes de la page actuelle
            rows.forEach((row, index) => {
                if (index >= (currentPage - 1) * perPage && index < currentPage * perPage) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
            
            // Ajouter les écouteurs d'événements pour les liens de page
            const pageLinks = pagination.querySelectorAll('.page-link');
            pageLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Gérer les boutons précédent/suivant
                    if (this.getAttribute('aria-label') === 'Previous' && currentPage > 1) {
                        currentPage--;
                    } else if (this.getAttribute('aria-label') === 'Next' && currentPage < pageCount) {
                        currentPage++;
                    } else if (!this.getAttribute('aria-label')) {
                        currentPage = parseInt(this.textContent);
                    }
                    
                    updatePagination();
                });
            });
        }
        
        // Écouteur d'événement pour le sélecteur d'entrées par page
        const perPageSelect = perPageContainer.querySelector('select');
        perPageSelect.value = perPage;
        perPageSelect.addEventListener('change', function() {
            perPage = parseInt(this.value);
            currentPage = 1;
            updatePagination();
        });
        
        // Initialisation
        updatePagination();
    }
}

/**
 * Fonction pour initialiser les actions en masse
 * @param {string} tableId - L'ID du tableau
 * @param {string} actionSelectId - L'ID du sélecteur d'action
 * @param {string} applyBtnId - L'ID du bouton d'application
 */
function initBulkActions(tableId, actionSelectId, applyBtnId) {
    const table = document.getElementById(tableId);
    const actionSelect = document.getElementById(actionSelectId);
    const applyBtn = document.getElementById(applyBtnId);
    
    if (!table || !actionSelect || !applyBtn) {
        console.error('One or more elements not found');
        return;
    }
    
    // Écouteur pour la case à cocher principale (sélectionner tout)
    const selectAllCheckbox = table.querySelector('thead input[type="checkbox"]');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = table.querySelectorAll('tbody input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
    
    // Écouteur pour le bouton d'application des actions en masse
    applyBtn.addEventListener('click', function() {
        const action = actionSelect.value;
        if (!action) {
            showNotification('Veuillez sélectionner une action.', 'warning');
            return;
        }
        
        const checkedBoxes = table.querySelectorAll('tbody input[type="checkbox"]:checked');
        if (checkedBoxes.length === 0) {
            showNotification('Veuillez sélectionner au moins un élément.', 'warning');
            return;
        }
        
        // Récupérer les IDs des éléments sélectionnés
        const selectedIds = Array.from(checkedBoxes).map(checkbox => checkbox.value);
        
        // Confirmer l'action
        let message = 'Êtes-vous sûr de vouloir ';
        
        switch (action) {
            case 'activate':
                message += 'activer';
                break;
            case 'deactivate':
                message += 'désactiver';
                break;
            case 'delete':
                message += 'supprimer';
                break;
            case 'export':
                message += 'exporter';
                break;
            default:
                message += 'appliquer cette action sur';
                break;
        }
        
        message += ` ${selectedIds.length} élément(s) ?`;
        
        confirmAction(message, function() {
            // Ici, vous enverriez une requête à l'API pour effectuer l'action
            console.log(`Applying action '${action}' to ids:`, selectedIds);
            
            // Simuler une action réussie
            showNotification(`Action '${action}' appliquée avec succès sur ${selectedIds.length} élément(s).`, 'success');
            
            // Décocher toutes les cases
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = false;
            }
            
            const checkboxes = table.querySelectorAll('tbody input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            
            // Réinitialiser le sélecteur d'action
            actionSelect.value = '';
        });
    });
}

/**
 * Fonction pour initialiser les graphiques
 */
function initCharts() {
    // Vérifier si Chart.js est disponible
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not found. Make sure to include it before dashboard.js');
        return;
    }
    
    // Graphique d'inscriptions mensuelles
    const enrollmentChartEl = document.getElementById('enrollmentChart');
    if (enrollmentChartEl) {
        const enrollmentChart = new Chart(enrollmentChartEl.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
                datasets: [{
                    label: 'Inscriptions 2023',
                    data: [12, 19, 15, 8, 22, 14, 11, 9, 28, 16, 14, 10],
                    backgroundColor: DASHBOARD_CONFIG.chartBgColors.primary,
                    borderColor: DASHBOARD_CONFIG.chartColors.primary,
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Graphique de répartition par rôle
    const roleChartEl = document.getElementById('roleDistributionChart');
    if (roleChartEl) {
        const roleChart = new Chart(roleChartEl.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Étudiants', 'Enseignants', 'Resp. Scolarité', 'Administrateurs', 'Comptables'],
                datasets: [{
                    label: 'Répartition par rôle',
                    data: [198, 32, 8, 4, 3],
                    backgroundColor: [
                        DASHBOARD_CONFIG.chartColors.danger,
                        DASHBOARD_CONFIG.chartColors.warning,
                        DASHBOARD_CONFIG.chartColors.secondary,
                        DASHBOARD_CONFIG.chartColors.primary,
                        DASHBOARD_CONFIG.chartColors.info
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false
            }
        });
    }
    
    // Graphique d'activité des étudiants
    const studentActivityChartEl = document.getElementById('studentActivityChart');
    if (studentActivityChartEl) {
        const studentActivityChart = new Chart(studentActivityChartEl.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
                datasets: [{
                    label: 'Connexions',
                    data: [65, 78, 52, 68, 82, 45, 32],
                    backgroundColor: DASHBOARD_CONFIG.chartBgColors.primary,
                    borderColor: DASHBOARD_CONFIG.chartColors.primary,
                    borderWidth: 2,
                    tension: 0.4
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Graphique de performance par cours
    const coursePerformanceChartEl = document.getElementById('coursePerformanceChart');
    if (coursePerformanceChartEl) {
        const coursePerformanceChart = new Chart(coursePerformanceChartEl.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Prog.', 'Algo.', 'BDD', 'Web', 'IA', 'Réseau', 'Sécurité', 'Mobile'],
                datasets: [{
                    label: 'Note moyenne',
                    data: [13.5, 14.2, 12.8, 15.7, 11.9, 13.2, 14.6, 13.8],
                    backgroundColor: [
                        DASHBOARD_CONFIG.chartColors.primary,
                        DASHBOARD_CONFIG.chartColors.secondary,
                        DASHBOARD_CONFIG.chartColors.warning,
                        DASHBOARD_CONFIG.chartColors.danger,
                        DASHBOARD_CONFIG.chartColors.info,
                        DASHBOARD_CONFIG.chartColors.dark,
                        'rgba(255, 159, 64, 0.8)',
                        'rgba(153, 102, 255, 0.8)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 20
                    }
                }
            }
        });
    }
    
    // Graphique des revenus par catégorie
    const categoryChartEl = document.getElementById('categoryChart');
    if (categoryChartEl) {
        const categoryChart = new Chart(categoryChartEl.getContext('2d'), {
            type: 'pie',
            data: {
                labels: ['Frais de scolarité', 'Frais d\'inscription', 'Frais d\'examens', 'Bibliothèque', 'Matériel pédagogique', 'Événements'],
                datasets: [{
                    label: 'Revenus par catégorie',
                    data: [921400, 207350, 58100, 34800, 78000, 51450],
                    backgroundColor: [
                        DASHBOARD_CONFIG.chartColors.primary,
                        DASHBOARD_CONFIG.chartColors.secondary,
                        DASHBOARD_CONFIG.chartColors.warning,
                        DASHBOARD_CONFIG.chartColors.danger,
                        DASHBOARD_CONFIG.chartColors.info,
                        'rgba(153, 102, 255, 0.8)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let value = context.raw;
                                return new Intl.NumberFormat('fr-FR', { 
                                    style: 'currency', 
                                    currency: 'EUR' 
                                }).format(value);
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Graphique d'évolution des revenus
    const trendsChartEl = document.getElementById('trendsChart');
    if (trendsChartEl) {
        const trendsChart = new Chart(trendsChartEl.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep'],
                datasets: [{
                    label: 'Revenus 2023',
                    data: [201150, 167800, 184800, 155600, 153950, 190700, 58200, 62400, 176500],
                    backgroundColor: DASHBOARD_CONFIG.chartBgColors.primary,
                    borderColor: DASHBOARD_CONFIG.chartColors.primary,
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Revenus 2022',
                    data: [189500, 155200, 172300, 148900, 146700, 178300, 52800, 59100, 168400],
                    backgroundColor: DASHBOARD_CONFIG.chartBgColors.secondary,
                    borderColor: DASHBOARD_CONFIG.chartColors.secondary,
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value / 1000 + ' K€';
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let value = context.raw;
                                return new Intl.NumberFormat('fr-FR', { 
                                    style: 'currency', 
                                    currency: 'EUR' 
                                }).format(value);
                            }
                        }
                    }
                }
            }
        });
    }
}

/**
 * Fonction pour gérer les formulaires du tableau de bord
 */
function initDashboardForms() {
    // Formulaire de création d'utilisateur
    const userForm = document.getElementById('userForm');
    if (userForm) {
        const userRole = document.getElementById('userRole');
        const studentFields = document.getElementById('studentFields');
        const teacherFields = document.getElementById('teacherFields');
        
        // Afficher/masquer les champs spécifiques selon le rôle
        if (userRole) {
            userRole.addEventListener('change', function() {
                // Masquer tous les champs spécifiques
                if (studentFields) studentFields.style.display = 'none';
                if (teacherFields) teacherFields.style.display = 'none';
                
                // Afficher les champs selon le rôle sélectionné
                switch (this.value) {
                    case 'student':
                        if (studentFields) studentFields.style.display = 'block';
                        break;
                    case 'teacher':
                        if (teacherFields) teacherFields.style.display = 'block';
                        break;
                }
            });
        }
        
        // Gestion de la soumission du formulaire
        const saveUserBtn = document.getElementById('saveUserBtn');
        if (saveUserBtn) {
            saveUserBtn.addEventListener('click', function() {
                // Vérification des champs obligatoires
                const requiredFields = userForm.querySelectorAll('[required]');
                let isValid = true;
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('is-invalid');
                    } else {
                        field.classList.remove('is-invalid');
                    }
                });
                
                // Vérification des mots de passe
                const password = document.getElementById('userPassword');
                const confirmPassword = document.getElementById('userPasswordConfirm');
                
                if (password && confirmPassword && password.value !== confirmPassword.value) {
                    isValid = false;
                    password.classList.add('is-invalid');
                    confirmPassword.classList.add('is-invalid');
                    showNotification('Les mots de passe ne correspondent pas.', 'error');
                }
                
                if (isValid) {
                    // Ici, vous enverriez une requête à l'API pour créer/modifier l'utilisateur
                    showNotification('Utilisateur enregistré avec succès !', 'success');
                    
                    // Fermer la modal
                    const modal = document.getElementById('userModal');
                    if (modal) {
                        modal.classList.remove('show');
                    }
                } else {
                    showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
                }
            });
        }
    }
    
    // Formulaire de création d'un cours
    const courseForm = document.getElementById('createCourseForm');
    if (courseForm) {
        const saveCourseBtn = document.getElementById('saveCourseBtn');
        if (saveCourseBtn) {
            saveCourseBtn.addEventListener('click', function() {
                // Vérification des champs obligatoires
                const requiredFields = courseForm.querySelectorAll('[required]');
                let isValid = true;
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('is-invalid');
                    } else {
                        field.classList.remove('is-invalid');
                    }
                });
                
                if (isValid) {
                    // Ici, vous enverriez une requête à l'API pour créer le cours
                    showNotification('Cours créé avec succès !', 'success');
                    
                    // Fermer la modal
                    const modal = document.getElementById('createCourseModal');
                    if (modal) {
                        modal.classList.remove('show');
                    }
                } else {
                    showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
                }
            });
        }
    }
    
    // Formulaire de création d'une évaluation
    const evaluationForm = document.getElementById('createEvaluationForm');
    if (evaluationForm) {
        const saveEvaluationBtn = document.getElementById('saveEvaluationBtn');
        const createQuestionsBtn = document.getElementById('createQuestionsBtn');
        const evaluationType = document.getElementById('evaluationType');
        
        // Afficher/masquer les champs spécifiques selon le type d'évaluation
        if (evaluationType) {
            evaluationType.addEventListener('change', function() {
                const durationField = document.querySelector('.evaluation-duration-field');
                const autoGradeField = document.querySelector('.evaluation-auto-grade-field');
                
                // Masquer/afficher les champs selon le type d'évaluation
                if (durationField && autoGradeField) {
                    switch (this.value) {
                        case 'quiz':
                        case 'exam':
                            durationField.style.display = 'block';
                            autoGradeField.style.display = 'block';
                            break;
                        case 'assignment':
                        case 'project':
                            durationField.style.display = 'none';
                            autoGradeField.style.display = 'none';
                            break;
                    }
                }
            });
        }
        
        // Gestion de la création d'évaluation
        if (saveEvaluationBtn) {
            saveEvaluationBtn.addEventListener('click', function() {
                // Vérification des champs obligatoires
                const requiredFields = evaluationForm.querySelectorAll('[required]');
                let isValid = true;
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('is-invalid');
                    } else {
                        field.classList.remove('is-invalid');
                    }
                });
                
                if (isValid) {
                    // Ici, vous enverriez une requête à l'API pour créer l'évaluation
                    showNotification('Évaluation créée avec succès !', 'success');
                    
                    // Fermer la modal
                    const modal = document.getElementById('createEvaluationModal');
                    if (modal) {
                        modal.classList.remove('show');
                    }
                } else {
                    showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
                }
            });
        }
        
        // Gestion de la création de questions
        if (createQuestionsBtn) {
            createQuestionsBtn.addEventListener('click', function() {
                // Vérification des champs obligatoires
                const title = document.getElementById('evaluationTitle');
                const type = document.getElementById('evaluationType');
                const course = document.getElementById('evaluationCourse');
                const startDate = document.getElementById('evaluationStartDate');
                const endDate = document.getElementById('evaluationEndDate');
                
                let isValid = true;
                if (!title || !title.value.trim()) isValid = false;
                if (!type || !type.value.trim()) isValid = false;
                if (!course || !course.value.trim()) isValid = false;
                if (!startDate || !startDate.value.trim()) isValid = false;
                if (!endDate || !endDate.value.trim()) isValid = false;
                
                if (isValid) {
                    // Ici, vous redirigeriez vers la page de création de questions
                    alert('Redirection vers la page de création de questions...');
                    
                    // Fermer la modal
                    const modal = document.getElementById('createEvaluationModal');
                    if (modal) {
                        modal.classList.remove('show');
                    }
                } else {
                    showNotification('Veuillez remplir tous les champs obligatoires avant de créer des questions.', 'error');
                }
            });
        }
    }
    
    // Formulaire de génération de rapport
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        const generateReportBtn = document.getElementById('generateReportBtn');
        const reportPeriod = document.getElementById('reportPeriod');
        
        // Gestion des périodes prédéfinies
        if (reportPeriod) {
            reportPeriod.addEventListener('change', function() {
                const startDateInput = document.getElementById('startDate');
                const endDateInput = document.getElementById('endDate');
                
                if (!startDateInput || !endDateInput) return;
                
                const today = new Date();
                let startDate, endDate;
                
                switch (this.value) {
                    case 'month':
                        // Mois en cours
                        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                        break;
                    case 'quarter':
                        // Trimestre en cours
                        const quarter = Math.floor(today.getMonth() / 3);
                        startDate = new Date(today.getFullYear(), quarter * 3, 1);
                        endDate = new Date(today.getFullYear(), (quarter + 1) * 3, 0);
                        break;
                    case 'year':
                        // Année en cours
                        startDate = new Date(today.getFullYear(), 0, 1);
                        endDate = new Date(today.getFullYear(), 11, 31);
                        break;
                    case 'academic':
                        // Année académique (de septembre à août)
                        const month = today.getMonth();
                        const year = today.getFullYear();
                        if (month >= 8) { // Septembre ou après
                            startDate = new Date(year, 8, 1); // 1er septembre
                            endDate = new Date(year + 1, 7, 31); // 31 août de l'année suivante
                        } else {
                            startDate = new Date(year - 1, 8, 1); // 1er septembre de l'année précédente
                            endDate = new Date(year, 7, 31); // 31 août
                        }
                        break;
                    // case 'custom': ne rien faire, laisser les dates telles quelles
                }
                
                if (startDate && endDate) {
                    startDateInput.value = formatDate(startDate, 'YYYY-MM-DD');
                    endDateInput.value = formatDate(endDate, 'YYYY-MM-DD');
                }
            });
        }
        
        // Gestion de la génération de rapport
        if (generateReportBtn) {
            generateReportBtn.addEventListener('click', function() {
                // Simuler le chargement
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Génération...';
                
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-sync-alt"></i> Générer';
                    showNotification('Rapport généré avec succès !', 'success');
                }, 1500);
            });
        }
    }
}

/**
 * Fonction pour initialiser les événements spécifiques au tableau de bord
 */
function initDashboardEvents() {
    // Gestion des filtres
    const applyFiltersBtn = document.getElementById('applyFilters');
    const resetFiltersBtn = document.getElementById('resetFilters');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            // Récupérer les valeurs des filtres
            const filters = {};
            
            // Récupérer tous les éléments de formulaire dans la section de filtres
            const filterContainer = this.closest('.card-body');
            if (filterContainer) {
                const filterInputs = filterContainer.querySelectorAll('select, input');
                filterInputs.forEach(input => {
                    if (input.id && input.value) {
                        filters[input.id] = input.value;
                    }
                });
            }
            
            console.log('Applying filters:', filters);
            showNotification('Filtres appliqués', 'success');
            
            // Ici, vous implémenteriez la logique de filtrage réelle
        });
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            // Réinitialiser les filtres
            const filterContainer = this.closest('.card-body');
            if (filterContainer) {
                const filterInputs = filterContainer.querySelectorAll('select, input');
                filterInputs.forEach(input => {
                    if (input.tagName === 'SELECT') {
                        input.selectedIndex = 0;
                    } else if (input.type === 'text' || input.type === 'search') {
                        input.value = '';
                    }
                });
            }
            
            console.log('Filters reset');
            showNotification('Filtres réinitialisés', 'info');
            
            // Ici, vous réinitialiseriez également l'affichage
        });
    }
    
    // Gestion de l'exportation
    const exportReportBtn = document.getElementById('exportReportBtn');
    if (exportReportBtn) {
        exportReportBtn.addEventListener('click', function() {
            alert('Exportation en cours...');
            showNotification('Rapport exporté avec succès', 'success');
        });
    }
    
    // Gestion de l'impression
    const printReportBtn = document.getElementById('printReportBtn');
    if (printReportBtn) {
        printReportBtn.addEventListener('click', function() {
            window.print();
        });
    }
    
    // Gestion des modules de cours
    const moduleHeaders = document.querySelectorAll('.module-header');
    moduleHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const content = this.nextElementSibling;
            
            if (content.classList.contains('show')) {
                content.classList.remove('show');
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-right');
            } else {
                content.classList.add('show');
                icon.classList.remove('fa-chevron-right');
                icon.classList.add('fa-chevron-down');
            }
        });
    });
}

// Initialiser le module lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    initSidebar();
    initModals();
    initCharts();
    initDashboardForms();
    initDashboardEvents();
    
    // Initialiser les datatables si présentes
    const tables = document.querySelectorAll('.datatable');
    tables.forEach(table => {
        initDataTable(table.id);
    });
    
    // Initialiser les actions en masse si présentes
    const bulkActionSelect = document.getElementById('bulkAction');
    const applyBulkActionBtn = document.getElementById('applyBulkAction');
    if (bulkActionSelect && applyBulkActionBtn) {
        // Trouver la table associée
        const tableContainer = bulkActionSelect.closest('.card-footer');
        if (tableContainer) {
            const table = tableContainer.previousElementSibling.querySelector('table');
            if (table) {
                initBulkActions(table.id, 'bulkAction', 'applyBulkAction');
            }
        }
    }
});