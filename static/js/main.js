/**
 * main.js - Script principal pour l'application Online School
 * Contient les fonctions communes utilisées dans toute l'application
 */

// Configuration globale
const APP_CONFIG = {
    apiUrl: 'https://api.onlineschool.example.com',
    maxUploadSize: 10 * 1024 * 1024, // 10 MB
    supportedFileTypes: ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.jpg', '.png', '.mp4', '.zip'],
    defaultPageSize: 10,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm'
};

/**
 * Fonction pour formater une date
 * @param {Date|string} date - La date à formater
 * @param {string} format - Le format souhaité (par défaut: DD/MM/YYYY)
 * @returns {string} - La date formatée
 */
function formatDate(date, format = 'DD/MM/YYYY') {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    let formattedDate = format;
    formattedDate = formattedDate.replace('DD', day);
    formattedDate = formattedDate.replace('MM', month);
    formattedDate = formattedDate.replace('YYYY', year);
    
    return formattedDate;
}

/**
 * Fonction pour formater une heure
 * @param {Date|string} date - La date/heure à formater
 * @param {string} format - Le format souhaité (par défaut: HH:mm)
 * @returns {string} - L'heure formatée
 */
function formatTime(date, format = 'HH:mm') {
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    
    let formattedTime = format;
    formattedTime = formattedTime.replace('HH', hours);
    formattedTime = formattedTime.replace('mm', minutes);
    
    return formattedTime;
}

/**
 * Fonction pour valider une adresse email
 * @param {string} email - L'adresse email à valider
 * @returns {boolean} - true si l'email est valide, false sinon
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Fonction pour valider un mot de passe
 * @param {string} password - Le mot de passe à valider
 * @returns {object} - Un objet avec un statut et un message
 */
function validatePassword(password) {
    if (password.length < 8) {
        return { valid: false, message: 'Le mot de passe doit contenir au moins 8 caractères' };
    }
    
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Le mot de passe doit contenir au moins une majuscule' };
    }
    
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: 'Le mot de passe doit contenir au moins une minuscule' };
    }
    
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'Le mot de passe doit contenir au moins un chiffre' };
    }
    
    if (!/[^A-Za-z0-9]/.test(password)) {
        return { valid: false, message: 'Le mot de passe doit contenir au moins un caractère spécial' };
    }
    
    return { valid: true, message: 'Mot de passe valide' };
}

/**
 * Fonction pour sauvegarder des données dans le localStorage
 * @param {string} key - La clé de stockage
 * @param {any} value - La valeur à stocker
 */
function saveToLocalStorage(key, value) {
    try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
    } catch (error) {
        console.error('Erreur lors de la sauvegarde dans localStorage:', error);
    }
}

/**
 * Fonction pour récupérer des données du localStorage
 * @param {string} key - La clé de stockage
 * @param {any} defaultValue - Valeur par défaut si la clé n'existe pas
 * @returns {any} - La valeur récupérée ou la valeur par défaut
 */
function getFromLocalStorage(key, defaultValue = null) {
    try {
        const serializedValue = localStorage.getItem(key);
        if (serializedValue === null) {
            return defaultValue;
        }
        return JSON.parse(serializedValue);
    } catch (error) {
        console.error('Erreur lors de la récupération depuis localStorage:', error);
        return defaultValue;
    }
}

/**
 * Fonction pour afficher un message de notification
 * @param {string} message - Le message à afficher
 * @param {string} type - Le type de notification (info, success, warning, error)
 * @param {number} duration - La durée d'affichage en millisecondes
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-message">${message}</div>
        <button class="notification-close">&times;</button>
    `;
    
    // Ajouter au DOM
    const notificationsContainer = document.getElementById('notifications-container');
    if (!notificationsContainer) {
        // Créer le conteneur s'il n'existe pas
        const container = document.createElement('div');
        container.id = 'notifications-container';
        container.className = 'notifications-container';
        document.body.appendChild(container);
        container.appendChild(notification);
    } else {
        notificationsContainer.appendChild(notification);
    }
    
    // Gérer la fermeture de la notification
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.classList.add('notification-closing');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Fermer automatiquement après la durée spécifiée
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('notification-closing');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, duration);
}

/**
 * Fonction pour simuler une requête API (pour le développement frontend)
 * @param {string} endpoint - L'endpoint de l'API
 * @param {object} options - Les options de la requête
 * @returns {Promise} - Une promesse avec la réponse simulée
 */
function mockApiRequest(endpoint, options = {}) {
    return new Promise((resolve, reject) => {
        console.log(`Mock API Request to ${endpoint}`, options);
        
        // Simuler un délai réseau
        setTimeout(() => {
            // Simuler des réponses selon l'endpoint
            switch (endpoint) {
                case '/auth/login':
                    if (options.body && options.body.email === 'test@example.com' && options.body.password === 'Password1!') {
                        resolve({
                            success: true,
                            data: {
                                token: 'mock-token-123456',
                                user: {
                                    id: 1,
                                    name: 'Utilisateur Test',
                                    email: 'test@example.com',
                                    role: 'student'
                                }
                            }
                        });
                    } else {
                        reject({
                            success: false,
                            error: 'Email ou mot de passe incorrect'
                        });
                    }
                    break;
                    
                case '/users/profile':
                    resolve({
                        success: true,
                        data: {
                            id: 1,
                            name: 'Utilisateur Test',
                            email: 'test@example.com',
                            role: 'student',
                            phone: '+33 6 12 34 56 78',
                            address: '123 Rue des Étudiants, 75000 Paris',
                            enrollmentDate: '2022-09-01'
                        }
                    });
                    break;
                    
                default:
                    reject({
                        success: false,
                        error: 'Endpoint non implémenté dans la simulation'
                    });
            }
        }, 300); // Délai simulé de 300ms
    });
}

/**
 * Fonction pour initialiser les dropdowns
 */
function initDropdowns() {
    document.addEventListener('click', function(event) {
        if (!event.target.matches('.dropdown-toggle')) {
            const dropdowns = document.querySelectorAll('.dropdown-menu.show');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        } else {
            const targetDropdown = event.target.nextElementSibling;
            if (targetDropdown && targetDropdown.classList.contains('dropdown-menu')) {
                targetDropdown.classList.toggle('show');
            }
        }
    });
}

/**
 * Fonction pour initialiser les tabs
 */
function initTabs() {
    const tabLinks = document.querySelectorAll('.tab-link');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Masquer tous les contenus de tab
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Désactiver tous les liens de tab
            tabLinks.forEach(tabLink => {
                tabLink.classList.remove('active');
            });
            
            // Activer le tab cliqué et son contenu
            this.classList.add('active');
            const targetId = this.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

/**
 * Fonction pour charger une partie de page via AJAX
 * @param {string} url - L'URL à charger
 * @param {string} targetId - L'ID de l'élément cible où insérer le contenu
 * @param {function} callback - Fonction à exécuter après le chargement
 */
function loadContent(url, targetId, callback = null) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) {
        console.error(`Element with ID ${targetId} not found`);
        return;
    }
    
    // Afficher un indicateur de chargement
    targetElement.innerHTML = '<div class="loading">Chargement...</div>';
    
    fetch(url)
        .then(response => response.text())
        .then(html => {
            targetElement.innerHTML = html;
            if (callback && typeof callback === 'function') {
                callback();
            }
        })
        .catch(error => {
            console.error('Error loading content:', error);
            targetElement.innerHTML = `<div class="error">Erreur de chargement: ${error.message}</div>`;
        });
}

/**
 * Fonction pour gérer l'envoi des formulaires via AJAX
 * @param {string} formId - L'ID du formulaire
 * @param {string} url - L'URL à laquelle envoyer les données
 * @param {function} successCallback - Fonction à exécuter en cas de succès
 * @param {function} errorCallback - Fonction à exécuter en cas d'erreur
 */
function handleFormSubmit(formId, url, successCallback = null, errorCallback = null) {
    const form = document.getElementById(formId);
    if (!form) {
        console.error(`Form with ID ${formId} not found`);
        return;
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const submitButton = form.querySelector('[type="submit"]');
        
        // Désactiver le bouton de soumission pendant l'envoi
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Chargement...';
        }
        
        fetch(url, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (successCallback && typeof successCallback === 'function') {
                successCallback(data);
            } else {
                showNotification('Opération réussie!', 'success');
            }
        })
        .catch(error => {
            if (errorCallback && typeof errorCallback === 'function') {
                errorCallback(error);
            } else {
                showNotification('Une erreur est survenue. Veuillez réessayer.', 'error');
                console.error('Error submitting form:', error);
            }
        })
        .finally(() => {
            // Réactiver le bouton de soumission
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = submitButton.getAttribute('data-original-text') || 'Envoyer';
            }
        });
    });
    
    // Sauvegarder le texte original du bouton
    const submitButton = form.querySelector('[type="submit"]');
    if (submitButton) {
        submitButton.setAttribute('data-original-text', submitButton.innerHTML);
    }
}

/**
 * Fonction pour créer un graphique avec Chart.js
 * @param {string} canvasId - L'ID du canvas
 * @param {string} type - Le type de graphique (line, bar, pie, etc.)
 * @param {object} data - Les données du graphique
 * @param {object} options - Les options du graphique
 * @returns {Chart} - L'instance du graphique
 */
function createChart(canvasId, type, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas with ID ${canvasId} not found`);
        return null;
    }
    
    const ctx = canvas.getContext('2d');
    return new Chart(ctx, {
        type: type,
        data: data,
        options: options
    });
}

/**
 * Fonction pour confirmer une action
 * @param {string} message - Le message de confirmation
 * @param {function} callback - Fonction à exécuter si l'utilisateur confirme
 */
function confirmAction(message, callback) {
    if (confirm(message)) {
        if (callback && typeof callback === 'function') {
            callback();
        }
    }
}

// Initialiser les fonctionnalités communes lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    initDropdowns();
    initTabs();
    
    // Gestionnaire pour les boutons de fermeture des alertes
    const alertCloseButtons = document.querySelectorAll('.alert .close');
    alertCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const alert = this.closest('.alert');
            alert.classList.add('fade-out');
            setTimeout(() => {
                alert.style.display = 'none';
            }, 300);
        });
    });

    // Initialiser les tooltips
    const tooltipElements = document.querySelectorAll('[data-toggle="tooltip"]');
    tooltipElements.forEach(element => {
        const title = element.getAttribute('title') || element.getAttribute('data-title');
        if (title) {
            element.setAttribute('data-title', title);
            element.removeAttribute('title'); // Éviter le tooltip par défaut du navigateur
            
            element.addEventListener('mouseenter', function() {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = this.getAttribute('data-title');
                
                document.body.appendChild(tooltip);
                
                const rect = this.getBoundingClientRect();
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
                tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
                tooltip.classList.add('show');
                
                this.addEventListener('mouseleave', function onMouseLeave() {
                    tooltip.remove();
                    this.removeEventListener('mouseleave', onMouseLeave);
                });
            });
        }
    });

    // Initialiser les boutons scroll-to-top
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });
        
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});