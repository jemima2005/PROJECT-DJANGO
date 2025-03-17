/**
 * student.js - Script pour l'interface étudiante
 * Fonctionnalités spécifiques à l'expérience utilisateur de l'étudiant
 */

/**
 * Fonction pour initialiser la navigation étudiante
 */
function initStudentNavigation() {
    // Gestion du menu déroulant de profil
    const profileDropdown = document.getElementById('profileDropdown');
    const profileMenu = document.getElementById('profileMenu');
    
    if (profileDropdown && profileMenu) {
        profileDropdown.addEventListener('click', function(e) {
            e.preventDefault();
            profileMenu.classList.toggle('show');
            
            // Fermer le menu en cliquant en dehors
            document.addEventListener('click', function closeMenu(event) {
                if (!event.target.matches('#profileDropdown') && !profileMenu.contains(event.target)) {
                    profileMenu.classList.remove('show');
                    document.removeEventListener('click', closeMenu);
                }
            });
        });
    }
    
    // Menu mobile pour petits écrans
    const mobileMenuBtn = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    }
    
    // Marquage du lien actif dans la navigation
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.includes(href)) {
            link.classList.add('active');
        }
    });
}

/**
 * Fonction pour initialiser les modules de cours (accordéon)
 */
function initCourseModules() {
    const moduleHeaders = document.querySelectorAll('.module-header');
    
    moduleHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const moduleContent = this.parentElement.querySelector('.module-content');
            const moduleIcon = this.querySelector('i.fa-chevron-right, i.fa-chevron-down');
            
            // Fermer tous les autres modules
            document.querySelectorAll('.module-content.show').forEach(content => {
                if (content !== moduleContent) {
                    content.classList.remove('show');
                    const icon = content.parentElement.querySelector('.module-header i.fa-chevron-down');
                    if (icon) {
                        icon.classList.remove('fa-chevron-down');
                        icon.classList.add('fa-chevron-right');
                    }
                }
            });
            
            // Basculer le module actuel
            moduleContent.classList.toggle('show');
            
            if (moduleIcon) {
                if (moduleContent.classList.contains('show')) {
                    moduleIcon.classList.remove('fa-chevron-right');
                    moduleIcon.classList.add('fa-chevron-down');
                } else {
                    moduleIcon.classList.remove('fa-chevron-down');
                    moduleIcon.classList.add('fa-chevron-right');
                }
            }
        });
    });
    
    // Ouvrir automatiquement le premier module
    const firstModule = document.querySelector('.module-item:first-child .module-content');
    const firstModuleIcon = document.querySelector('.module-item:first-child .module-header i');
    
    if (firstModule && firstModuleIcon) {
        firstModule.classList.add('show');
        firstModuleIcon.classList.remove('fa-chevron-right');
        firstModuleIcon.classList.add('fa-chevron-down');
    }
}

/**
 * Fonction pour initialiser les tabs
 */
function initStudentTabs() {
    const tabLinks = document.querySelectorAll('.tab-link');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Désactiver tous les tabs
            tabLinks.forEach(tab => {
                tab.classList.remove('active');
                const target = document.getElementById(tab.getAttribute('data-tab'));
                if (target) {
                    target.classList.remove('active');
                }
            });
            
            // Activer le tab cliqué
            this.classList.add('active');
            const targetTab = document.getElementById(this.getAttribute('data-tab'));
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });
}

/**
 * Fonction pour initialiser la barre de progression circulaire
 * @param {HTMLElement} element - L'élément de la barre de progression
 * @param {number} percent - Le pourcentage de progression (0-100)
 */
function initCircleProgress(element, percent) {
    if (!element) return;
    
    // Calculer l'angle pour le conic-gradient
    const degrees = (percent / 100) * 360;
    
    // Mettre à jour le style de l'élément
    element.style.background = `
        radial-gradient(closest-side, #343a40 79%, transparent 80% 100%),
        conic-gradient(#4e73df ${degrees}deg, rgba(255, 255, 255, 0.2) 0deg)
    `;
    
    // Mettre à jour la valeur affichée
    const valueElement = element.querySelector('.progress-value');
    if (valueElement) {
        valueElement.textContent = `${Math.round(percent)}%`;
    }
}

/**
 * Fonction pour initialiser les forums
 */
function initForums() {
    // Formulaire de réponse
    const replyButtons = document.querySelectorAll('.reply-btn');
    
    replyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const messageId = this.getAttribute('data-message-id');
            const replyForm = document.getElementById(`replyForm-${messageId}`);
            
            if (replyForm) {
                replyForm.classList.toggle('show');
                
                // Faire défiler vers le formulaire
                if (replyForm.classList.contains('show')) {
                    replyForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    replyForm.querySelector('textarea').focus();
                }
            }
        });
    });
    
    // Formulaire de création de sujet
    const newTopicBtn = document.getElementById('newTopicBtn');
    const newTopicForm = document.getElementById('newTopicForm');
    
    if (newTopicBtn && newTopicForm) {
        newTopicBtn.addEventListener('click', function(e) {
            e.preventDefault();
            newTopicForm.classList.toggle('show');
            
            if (newTopicForm.classList.contains('show')) {
                newTopicForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
                newTopicForm.querySelector('input[type="text"]').focus();
            }
        });
    }
    
    // Éditeur de texte riche
    const textAreas = document.querySelectorAll('.rich-editor');
    
    textAreas.forEach(textArea => {
        const toolbar = document.createElement('div');
        toolbar.className = 'editor-toolbar';
        toolbar.innerHTML = `
            <button type="button" class="editor-btn" data-cmd="bold"><i class="fas fa-bold"></i></button>
            <button type="button" class="editor-btn" data-cmd="italic"><i class="fas fa-italic"></i></button>
            <button type="button" class="editor-btn" data-cmd="underline"><i class="fas fa-underline"></i></button>
            <button type="button" class="editor-btn" data-cmd="insertUnorderedList"><i class="fas fa-list-ul"></i></button>
            <button type="button" class="editor-btn" data-cmd="insertOrderedList"><i class="fas fa-list-ol"></i></button>
            <button type="button" class="editor-btn" data-cmd="createLink"><i class="fas fa-link"></i></button>
            <button type="button" class="editor-btn" data-cmd="insertImage"><i class="fas fa-image"></i></button>
            <button type="button" class="editor-btn" data-cmd="code"><i class="fas fa-code"></i></button>
        `;
        
        textArea.parentNode.insertBefore(toolbar, textArea);
        
        const editorButtons = toolbar.querySelectorAll('.editor-btn');
        
        editorButtons.forEach(button => {
            button.addEventListener('click', function() {
                const command = this.getAttribute('data-cmd');
                
                if (command === 'createLink') {
                    const url = prompt('Entrez l\'URL du lien:');
                    if (url) {
                        document.execCommand(command, false, url);
                    }
                } else if (command === 'insertImage') {
                    const url = prompt('Entrez l\'URL de l\'image:');
                    if (url) {
                        document.execCommand(command, false, url);
                    }
                } else if (command === 'code') {
                    const selection = window.getSelection();
                    const range = selection.getRangeAt(0);
                    const codeElement = document.createElement('code');
                    codeElement.textContent = range.toString();
                    range.deleteContents();
                    range.insertNode(codeElement);
                } else {
                    document.execCommand(command, false, null);
                }
                
                textArea.focus();
            });
        });
    });
}

/**
 * Fonction pour initialiser le quiz
 */
function initQuiz() {
    const quizForm = document.getElementById('quizForm');
    
    if (quizForm) {
        // Logique pour le minuteur
        const timerElement = document.getElementById('quizTimer');
        const timerValueElement = document.getElementById('timerValue');
        
        if (timerElement && timerValueElement) {
            let timeLeft = parseInt(timerValueElement.getAttribute('data-time') || '1800'); // Par défaut 30 minutes
            let timerId;
            
            function updateTimer() {
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                
                timerValueElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                if (timeLeft <= 300) { // Moins de 5 minutes
                    timerElement.classList.add('text-danger');
                } else {
                    timerElement.classList.remove('text-danger');
                }
                
                if (timeLeft <= 0) {
                    clearInterval(timerId);
                    alert('Le temps est écoulé ! Votre quiz va être soumis automatiquement.');
                    quizForm.submit();
                }
                
                timeLeft--;
            }
            
            // Démarrer le minuteur
            updateTimer();
            timerId = setInterval(updateTimer, 1000);
        }
        
        // Bouton de soumission du quiz
        const submitQuizBtn = document.getElementById('submitQuizBtn');
        
        if (submitQuizBtn) {
            submitQuizBtn.addEventListener('click', function(e) {
                if (!confirm('Êtes-vous sûr de vouloir soumettre votre quiz ? Cette action est irréversible.')) {
                    e.preventDefault();
                }
            });
        }
        
        // Navigation entre les questions
        const questionNavBtns = document.querySelectorAll('.question-nav-btn');
        
        questionNavBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const targetQuestionId = this.getAttribute('data-question');
                const targetQuestion = document.getElementById(targetQuestionId);
                
                if (targetQuestion) {
                    // Masquer toutes les questions
                    document.querySelectorAll('.quiz-question').forEach(q => {
                        q.style.display = 'none';
                    });
                    
                    // Afficher la question cible
                    targetQuestion.style.display = 'block';
                    
                    // Mettre à jour la navigation
                    questionNavBtns.forEach(navBtn => {
                        navBtn.classList.remove('active');
                    });
                    this.classList.add('active');
                }
            });
        });
    }
}

/**
 * Fonction pour initialiser le tableau de suivi des notes
 */
function initGradesTable() {
    const gradesTable = document.getElementById('gradesTable');
    
    if (gradesTable) {
        // Calculs des moyennes
        const rows = gradesTable.querySelectorAll('tbody tr');
        let totalCredits = 0;
        let weightedSum = 0;
        
        rows.forEach(row => {
            const grade = parseFloat(row.querySelector('.grade-value').textContent);
            const credits = parseFloat(row.querySelector('.credits-value').textContent);
            const status = row.querySelector('.status-value');
            
            if (!isNaN(grade) && !isNaN(credits)) {
                // Calculer le résultat pondéré
                const weighted = grade * credits;
                row.querySelector('.weighted-value').textContent = weighted.toFixed(1);
                
                // Mettre à jour le statut
                if (grade >= 10) {
                    status.textContent = 'Validé';
                    status.classList.add('text-success');
                } else {
                    status.textContent = 'Non validé';
                    status.classList.add('text-danger');
                }
                
                // Accumuler pour la moyenne générale
                totalCredits += credits;
                weightedSum += weighted;
            }
        });
        
        // Calculer et afficher la moyenne générale
        const averageElement = document.getElementById('overallAverage');
        if (averageElement && totalCredits > 0) {
            const average = weightedSum / totalCredits;
            averageElement.textContent = average.toFixed(2);
            
            // Ajouter un indicateur de classe
            if (average >= 16) {
                averageElement.classList.add('text-success', 'font-weight-bold');
            } else if (average >= 14) {
                averageElement.classList.add('text-success');
            } else if (average >= 12) {
                averageElement.classList.add('text-primary');
            } else if (average >= 10) {
                averageElement.classList.add('text-warning');
            } else {
                averageElement.classList.add('text-danger');
            }
        }
    }
}

/**
 * Fonction pour initialiser les calendriers
 */
function initCalendars() {
    const calendarElement = document.getElementById('calendar');
    
    if (calendarElement && typeof FullCalendar !== 'undefined') {
        const calendar = new FullCalendar.Calendar(calendarElement, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
            },
            height: 'auto',
            locale: 'fr',
            buttonText: {
                today: 'Aujourd\'hui',
                month: 'Mois',
                week: 'Semaine',
                day: 'Jour',
                list: 'Liste'
            },
            firstDay: 1, // Lundi comme premier jour
            events: [
                // Ces données seraient normalement chargées depuis une API
                {
                    title: 'Cours de Programmation',
                    start: '2023-06-12T10:00:00',
                    end: '2023-06-12T12:00:00',
                    color: '#4e73df'
                },
                {
                    title: 'TP Base de données',
                    start: '2023-06-13T14:00:00',
                    end: '2023-06-13T16:00:00',
                    color: '#1cc88a'
                },
                {
                    title: 'Examen Algorithmique',
                    start: '2023-06-15T09:00:00',
                    end: '2023-06-15T11:00:00',
                    color: '#e74a3b'
                },
                {
                    title: 'Projet de groupe',
                    start: '2023-06-16',
                    end: '2023-06-18',
                    color: '#f6c23e'
                }
            ],
            eventClick: function(info) {
                alert('Événement: ' + info.event.title);
            }
        });
        
        calendar.render();
    }
}

/**
 * Fonction pour initialiser le lecteur vidéo
 */
function initVideoPlayer() {
    const videoPlayers = document.querySelectorAll('.video-player');
    
    videoPlayers.forEach(player => {
        const videoElement = player.querySelector('video');
        const playBtn = player.querySelector('.play-btn');
        const pauseBtn = player.querySelector('.pause-btn');
        const progressBar = player.querySelector('.progress-bar');
        const currentTime = player.querySelector('.current-time');
        const duration = player.querySelector('.duration');
        const volumeBtn = player.querySelector('.volume-btn');
        const volumeSlider = player.querySelector('.volume-slider');
        const fullscreenBtn = player.querySelector('.fullscreen-btn');
        
        if (videoElement) {
            // Gestion du play/pause
            if (playBtn) {
                playBtn.addEventListener('click', function() {
                    videoElement.play();
                    playBtn.style.display = 'none';
                    if (pauseBtn) pauseBtn.style.display = 'inline-block';
                });
            }
            
            if (pauseBtn) {
                pauseBtn.addEventListener('click', function() {
                    videoElement.pause();
                    pauseBtn.style.display = 'none';
                    if (playBtn) playBtn.style.display = 'inline-block';
                });
            }
            
            // Gestion de la barre de progression
            if (progressBar) {
                videoElement.addEventListener('timeupdate', function() {
                    const value = (videoElement.currentTime / videoElement.duration) * 100;
                    progressBar.style.width = value + '%';
                    
                    if (currentTime) {
                        const minutes = Math.floor(videoElement.currentTime / 60);
                        const seconds = Math.floor(videoElement.currentTime % 60);
                        currentTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    }
                });
                
                // Cliquer sur la barre de progression
                const progressContainer = player.querySelector('.progress-container');
                if (progressContainer) {
                    progressContainer.addEventListener('click', function(e) {
                        const rect = this.getBoundingClientRect();
                        const pos = (e.clientX - rect.left) / rect.width;
                        videoElement.currentTime = pos * videoElement.duration;
                    });
                }
            }
            
            // Afficher la durée totale
            videoElement.addEventListener('loadedmetadata', function() {
                if (duration) {
                    const minutes = Math.floor(videoElement.duration / 60);
                    const seconds = Math.floor(videoElement.duration % 60);
                    duration.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                }
            });
            
            // Gestion du volume
            if (volumeBtn && volumeSlider) {
                volumeBtn.addEventListener('click', function() {
                    if (videoElement.muted) {
                        videoElement.muted = false;
                        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                    } else {
                        videoElement.muted = true;
                        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                    }
                });
                
                volumeSlider.addEventListener('input', function() {
                    videoElement.volume = this.value;
                    
                    if (this.value > 0.5) {
                        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                    } else if (this.value > 0) {
                        volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
                    } else {
                        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                    }
                });
            }
            
            // Gestion du plein écran
            if (fullscreenBtn) {
                fullscreenBtn.addEventListener('click', function() {
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    } else {
                        player.requestFullscreen();
                    }
                });
            }
            
            // Gestion des contrôles au survol
            player.addEventListener('mouseenter', function() {
                player.querySelector('.video-controls').classList.add('visible');
            });
            
            player.addEventListener('mouseleave', function() {
                player.querySelector('.video-controls').classList.remove('visible');
            });
            
            // Double-clic pour le plein écran
            videoElement.addEventListener('dblclick', function() {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    player.requestFullscreen();
                }
            });
        }
    });
}

/**
 * Fonction pour initialiser le système de commentaires des leçons
 */
function initLessonComments() {
    const commentForm = document.getElementById('lessonCommentForm');
    const commentsList = document.getElementById('lessonComments');
    
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const commentText = this.querySelector('textarea').value.trim();
            
            if (commentText) {
                // En conditions réelles, vous enverriez ces données à votre API
                // Simuler l'ajout d'un commentaire
                const now = new Date();
                const formattedDate = now.toLocaleDateString('fr-FR') + ' à ' + 
                    now.getHours().toString().padStart(2, '0') + ':' + 
                    now.getMinutes().toString().padStart(2, '0');
                
                const newComment = document.createElement('div');
                newComment.className = 'comment';
                newComment.innerHTML = `
                    <div class="comment-author">
                        <img src="${this.getAttribute('data-user-avatar') || '/static/images/default-avatar.jpg'}" alt="Avatar">
                        <div>
                            <span class="author-name">${this.getAttribute('data-user-name') || 'Moi'}</span>
                            <span class="comment-date">${formattedDate}</span>
                        </div>
                    </div>
                    <div class="comment-content">
                        <p>${commentText.replace(/\n/g, '<br>')}</p>
                    </div>
                    <div class="comment-actions">
                        <a href="#" class="reply-btn" data-message-id="new-comment">Répondre</a>
                    </div>
                `;
                
                // Ajouter le commentaire à la liste
                if (commentsList) {
                    commentsList.appendChild(newComment);
                }
                
                // Réinitialiser le formulaire
                this.querySelector('textarea').value = '';
                
                // Notifier l'utilisateur
                showNotification('Votre commentaire a été ajouté avec succès !', 'success');
            } else {
                showNotification('Veuillez entrer un commentaire avant de soumettre.', 'warning');
            }
        });
    }
    
    // Initialiser les boutons de réponse pour les commentaires existants
    if (commentsList) {
        const replyButtons = commentsList.querySelectorAll('.reply-btn');
        
        replyButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const commentId = this.getAttribute('data-message-id');
                const comment = this.closest('.comment');
                
                // Vérifier si le formulaire de réponse existe déjà
                let replyForm = document.getElementById(`reply-form-${commentId}`);
                
                if (!replyForm) {
                    // Créer le formulaire de réponse
                    replyForm = document.createElement('div');
                    replyForm.id = `reply-form-${commentId}`;
                    replyForm.className = 'comment-reply-form';
                    replyForm.innerHTML = `
                        <textarea placeholder="Écrivez votre réponse..." rows="3"></textarea>
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary cancel-reply">Annuler</button>
                            <button type="button" class="btn btn-primary submit-reply">Répondre</button>
                        </div>
                    `;
                    
                    // Ajouter le formulaire après le commentaire
                    comment.after(replyForm);
                    
                    // Focus sur le textarea
                    replyForm.querySelector('textarea').focus();
                    
                    // Gérer le bouton d'annulation
                    replyForm.querySelector('.cancel-reply').addEventListener('click', function() {
                        replyForm.remove();
                    });
                    
                    // Gérer le bouton de soumission
                    replyForm.querySelector('.submit-reply').addEventListener('click', function() {
                        const replyText = replyForm.querySelector('textarea').value.trim();
                        
                        if (replyText) {
                            // En conditions réelles, vous enverriez ces données à votre API
                            // Simuler l'ajout d'une réponse
                            const now = new Date();
                            const formattedDate = now.toLocaleDateString('fr-FR') + ' à ' + 
                                now.getHours().toString().padStart(2, '0') + ':' + 
                                now.getMinutes().toString().padStart(2, '0');
                            
                            const newReply = document.createElement('div');
                            newReply.className = 'comment comment-reply';
                            newReply.innerHTML = `
                                <div class="comment-author">
                                    <img src="/static/images/default-avatar.jpg" alt="Avatar">
                                    <div>
                                        <span class="author-name">Moi</span>
                                        <span class="comment-date">${formattedDate}</span>
                                    </div>
                                </div>
                                <div class="comment-content">
                                    <p>${replyText.replace(/\n/g, '<br>')}</p>
                                </div>
                            `;
                            
                            // Ajouter la réponse après le formulaire
                            replyForm.after(newReply);
                            
                            // Supprimer le formulaire
                            replyForm.remove();
                            
                            // Notifier l'utilisateur
                            showNotification('Votre réponse a été ajoutée avec succès !', 'success');
                        } else {
                            showNotification('Veuillez entrer une réponse avant de soumettre.', 'warning');
                        }
                    });
                } else {
                    // Si le formulaire existe déjà, le supprimer
                    replyForm.remove();
                }
            });
        });
    }
}

/**
 * Fonction pour gérer les actions sur les ressources pédagogiques
 */
function initResourceActions() {
    // Téléchargement de ressources
    const downloadBtns = document.querySelectorAll('.download-resource');
    
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const resourceId = this.getAttribute('data-resource-id');
            const resourceName = this.getAttribute('data-resource-name');
            
            // En conditions réelles, vous redirigeriez vers une URL de téléchargement
            console.log(`Téléchargement de la ressource ${resourceId}: ${resourceName}`);
            
            // Simuler un téléchargement
            showNotification(`Téléchargement de "${resourceName}" en cours...`, 'info');
        });
    });
    
    // Marquer comme terminé
    const completeButtons = document.querySelectorAll('.mark-as-complete');
    
    completeButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const lessonId = this.getAttribute('data-lesson-id');
            const isCompleted = this.classList.contains('completed');
            
            // En conditions réelles, vous enverriez ces données à votre API
            if (isCompleted) {
                this.classList.remove('completed');
                this.innerHTML = '<i class="far fa-check-circle"></i> Marquer comme terminé';
                showNotification('Leçon marquée comme non terminée.', 'info');
            } else {
                this.classList.add('completed');
                this.innerHTML = '<i class="fas fa-check-circle"></i> Terminé';
                showNotification('Leçon marquée comme terminée. Bravo !', 'success');
                
                // Mettre à jour la barre de progression du cours
                updateCourseProgress();
            }
        });
    });
    
    // Fonction pour mettre à jour la progression du cours
    function updateCourseProgress() {
        const progressCircle = document.querySelector('.progress-circle');
        const progressValue = document.querySelector('.progress-value');
        
        if (progressCircle && progressValue) {
            const totalLessons = document.querySelectorAll('.mark-as-complete').length;
            const completedLessons = document.querySelectorAll('.mark-as-complete.completed').length;
            
            if (totalLessons > 0) {
                const progressPercent = (completedLessons / totalLessons) * 100;
                
                // Mettre à jour la barre de progression
                initCircleProgress(progressCircle, progressPercent);
            }
        }
    }
}

// Initialiser toutes les fonctionnalités lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    initStudentNavigation();
    initCourseModules();
    initStudentTabs();
    initForums();
    initQuiz();
    initGradesTable();
    initCalendars();
    initVideoPlayer();
    initLessonComments();
    initResourceActions();
    
    // Initialiser les barres de progression circulaires
    const progressCircles = document.querySelectorAll('.progress-circle');
    progressCircles.forEach(circle => {
        const percent = parseFloat(circle.getAttribute('data-percent') || '0');
        initCircleProgress(circle, percent);
    });
    
    // Initialiser les événements de notification
    const notificationCloseBtns = document.querySelectorAll('.notification .close');
    notificationCloseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.notification').classList.add('fade-out');
            setTimeout(() => {
                this.closest('.notification').remove();
            }, 300);
        });
    });
});

/**
 * Fonction pour afficher des notifications à l'utilisateur
 * @param {string} message - Le message à afficher
 * @param {string} type - Le type de notification (info, success, warning, error)
 * @param {number} duration - La durée d'affichage en millisecondes
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${type === 'info' ? 'fa-info-circle' : 
                            type === 'success' ? 'fa-check-circle' : 
                            type === 'warning' ? 'fa-exclamation-triangle' : 
                            'fa-times-circle'}"></i>
        </div>
        <div class="notification-content">
            <p>${message}</p>
        </div>
        <button class="close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Ajouter au conteneur de notifications
    let notificationsContainer = document.querySelector('.notifications-container');
    
    if (!notificationsContainer) {
        notificationsContainer = document.createElement('div');
        notificationsContainer.className = 'notifications-container';
        document.body.appendChild(notificationsContainer);
    }
    
    notificationsContainer.appendChild(notification);
    
    // Gestion du bouton de fermeture
    notification.querySelector('.close').addEventListener('click', function() {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
            
            // Nettoyer le conteneur s'il est vide
            if (notificationsContainer.children.length === 0) {
                notificationsContainer.remove();
            }
        }, 300);
    });
    
    // Fermeture automatique après la durée spécifiée
    if (duration > 0) {
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.add('fade-out');
                setTimeout(() => {
                    notification.remove();
                    
                    // Nettoyer le conteneur s'il est vide
                    if (notificationsContainer.children.length === 0) {
                        notificationsContainer.remove();
                    }
                }, 300);
            }
        }, duration);
    }
    
    return notification;
}