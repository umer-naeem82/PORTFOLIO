// API Base URL
const API_BASE = window.location.origin;

// State
let portfolioData = null;
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadPortfolioData();
    initializeUI();
    initializeChatbot();
    
    // Hide loader
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 500);
});

// Load Portfolio Data
async function loadPortfolioData() {
    try {
        const response = await fetch(`${API_BASE}/api/portfolio?t=${Date.now()}`);
        portfolioData = await response.json();
        console.log('=== LOADED PORTFOLIO DATA ===');
        console.log('Total projects:', portfolioData?.projects?.length);
        console.log('Projects:', portfolioData?.projects);
        renderPortfolio();
    } catch (error) {
        console.error('Error loading portfolio:', error);
    }
}

// Render Portfolio
function renderPortfolio() {
    if (!portfolioData) {
        console.error('❌ Portfolio data is null');
        return;
    }
    
    console.log('✅ Rendering portfolio...');
    
    const { designer, projects } = portfolioData;
    
    if (!projects || !Array.isArray(projects)) {
        console.error('❌ No projects array found');
        return;
    }
    
    console.log(`✅ Found ${projects.length} projects to render`);
    
    // Update hero
    document.getElementById('heroTitle').textContent = designer.name;
    document.getElementById('heroSubtitle').textContent = designer.title;
    
    // Update about
    document.getElementById('aboutBio').textContent = designer.bio;
    document.getElementById('experienceYears').textContent = designer.experience;
    document.getElementById('projectCount').textContent = '100+';
    document.getElementById('clientCount').textContent = '50+';
    
    // Render skills
    const skillsGrid = document.getElementById('skillsGrid');
    skillsGrid.innerHTML = designer.skills.map(skill => 
        `<div class="skill-item">${skill}</div>`
    ).join('');
    
    // Update contact
    document.getElementById('contactEmail').href = `mailto:${designer.email}`;
    document.getElementById('contactEmail').textContent = designer.email;
    document.getElementById('contactBehance').href = designer.behance;
    document.getElementById('contactLocation').textContent = designer.location;
    document.getElementById('availabilityStatus').textContent = `✨ ${designer.availability}`;
    
    // Render projects
    console.log('📸 Calling renderProjects with', projects.length, 'projects');
    renderProjects(projects);
}

// Render Projects
function renderProjects(projects) {
    console.log('=== RENDER PROJECTS CALLED ===');
    console.log('Projects received:', projects);
    console.log('Projects length:', projects?.length);
    console.log('Current filter:', currentFilter);
    
    const grid = document.getElementById('projectsGrid');
    
    if (!grid) {
        console.error('❌ Projects grid element not found!');
        return;
    }
    
    if (!projects || projects.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: white;">No projects found.</p>';
        return;
    }
    
    const filteredProjects = currentFilter === 'all' 
        ? projects 
        : projects.filter(p => p.category === currentFilter);
    
    console.log(`✅ Filtered projects: ${filteredProjects.length} (filter: ${currentFilter})`);
    console.log('Filtered projects data:', filteredProjects);
    
    grid.innerHTML = filteredProjects.map((project, index) => {
        return `
        <div class="project-card" onclick="openProjectModal(${project.id})">
            <img src="${project.images[0]}" 
                 alt="${project.title}" 
                 class="project-image" 
                 loading="lazy"
                 onerror="console.error('❌ Image failed:', '${project.images[0]}'); this.style.display='none';"
                 onload="console.log('✅ Image loaded:', '${project.images[0]}')">
            <div class="project-info">
                <p class="project-category">${project.category}</p>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `}).join('');
    
    console.log(`✅ Rendered ${filteredProjects.length} project cards to DOM`);
}

// Open Project Modal
function openProjectModal(projectId) {
    const project = portfolioData.projects.find(p => p.id === projectId);
    if (!project) return;
    
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <h2>${project.title}</h2>
        <p class="project-category">${project.category} • ${project.year}</p>
        <p style="margin: 1rem 0; color: var(--gray);">${project.description}</p>
        
        <div style="margin: 2rem 0;">
            ${project.images.map(img => `
                <img src="${img}" alt="${project.title}" 
                     style="width: 100%; margin-bottom: 1rem; border-radius: 10px;"
                     onerror="this.style.display='none'">
            `).join('')}
        </div>
        
        <div style="margin: 1.5rem 0;">
            <h4>Client:</h4>
            <p>${project.client}</p>
        </div>
        
        <div style="margin: 1.5rem 0;">
            <h4>Tools Used:</h4>
            <div class="project-tags">
                ${project.tools.map(tool => `<span class="tag">${tool}</span>`).join('')}
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

// Initialize UI
function initializeUI() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            if (portfolioData) {
                renderProjects(portfolioData.projects);
            }
        });
    });
    
    // Modal close
    document.getElementById('modalClose').addEventListener('click', () => {
        document.getElementById('projectModal').classList.remove('active');
    });
    
    // Close modal on outside click
    document.getElementById('projectModal').addEventListener('click', (e) => {
        if (e.target.id === 'projectModal') {
            document.getElementById('projectModal').classList.remove('active');
        }
    });
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Chatbot
function initializeChatbot() {
    const toggle = document.getElementById('chatbotToggle');
    const window = document.getElementById('chatbotWindow');
    const close = document.getElementById('chatbotClose');
    const input = document.getElementById('chatbotInput');
    const send = document.getElementById('chatbotSend');
    
    toggle.addEventListener('click', () => {
        window.classList.toggle('active');
    });
    
    close.addEventListener('click', () => {
        window.classList.remove('active');
    });
    
    send.addEventListener('click', sendChatMessage);
    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
}

async function sendChatMessage() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        const response = await fetch(`${API_BASE}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        
        hideTypingIndicator();
        addChatMessage(data.response, 'ai');
    } catch (error) {
        hideTypingIndicator();
        addChatMessage('Sorry, I encountered an error. Please try again.', 'ai');
        console.error('Chat error:', error);
    }
}

function addChatMessage(text, type) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const avatar = type === 'user' ? '👤' : '🎨';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <p>${text}</p>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbotMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-avatar">🎨</div>
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}
