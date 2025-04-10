// Blog Dashboard Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Load all posts
    loadAllPosts();
    
    // Add new post form submission
    const addPostForm = document.getElementById('addPostForm');
    if (addPostForm) {
        addPostForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const title = document.getElementById('postTitle').value;
            const date = document.getElementById('postDate').value;
            const content = document.getElementById('postContent').value;
            
            if (title && date && content) {
                addNewPost(title, date, content);
                addPostForm.reset();
            }
        });
    }
    
    // Handle edit and delete buttons (delegated event listeners)
    document.getElementById('postsList').addEventListener('click', (e) => {
        const postId = e.target.closest('[data-id]')?.getAttribute('data-id');
        if (!postId) return;
        
        if (e.target.classList.contains('edit-btn')) {
            openEditModal(postId);
        } else if (e.target.classList.contains('delete-btn')) {
            deletePost(postId);
        }
    });
    
    // Close modal when clicking the X button
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            document.querySelector('.modal').style.display = 'none';
        });
    }
});

// Load all posts from localStorage and display them
function loadAllPosts() {
    const postsList = document.getElementById('postsList');
    if (!postsList) return;
    
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    
    if (posts.length === 0) {
        postsList.innerHTML = '<p>No blog posts yet. Add your first post above!</p>';
        return;
    }
    
    postsList.innerHTML = posts.map(post => `
        <div class="post-item" data-id="${post.id}">
            <div>
                <h3>${post.title}</h3>
                <p class="post-date">${new Date(post.date).toLocaleDateString()}</p>
            </div>
            <div class="post-actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        </div>
    `).join('');
}

// Add a new post to localStorage
function addNewPost(title, date, content) {
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    
    const newPost = {
        id: Date.now().toString(),
        title,
        date,
        content
    };
    
    posts.unshift(newPost); // Add new post at the beginning
    localStorage.setItem('blogPosts', JSON.stringify(posts));
    
    // Reload the posts list
    loadAllPosts();
}

// Open edit modal with post data
function openEditModal(postId) {
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const post = posts.find(p => p.id === postId);
    
    if (!post) return;
    
    const modal = document.querySelector('.modal');
    if (!modal) {
        // Create modal if it doesn't exist
        const modalHTML = `
            <div class="modal">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h2>Edit Post</h2>
                    <form id="editPostForm">
                        <input type="hidden" id="editPostId" value="${post.id}">
                        <div class="form-group">
                            <label for="editPostTitle">Title</label>
                            <input type="text" id="editPostTitle" value="${post.title}" required>
                        </div>
                        <div class="form-group">
                            <label for="editPostDate">Date</label>
                            <input type="date" id="editPostDate" value="${post.date}" required>
                        </div>
                        <div class="form-group">
                            <label for="editPostContent">Content</label>
                            <textarea id="editPostContent" rows="10" required>${post.content}</textarea>
                        </div>
                        <button type="submit" class="submit-btn">Update Post</button>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add event listener for the edit form submission
        document.getElementById('editPostForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const id = document.getElementById('editPostId').value;
            const title = document.getElementById('editPostTitle').value;
            const date = document.getElementById('editPostDate').value;
            const content = document.getElementById('editPostContent').value;
            
            if (id && title && date && content) {
                updatePost(id, title, date, content);
                document.querySelector('.modal').style.display = 'none';
            }
        });
        
        // Add event listener to close modal when clicking outside
        document.querySelector('.modal').addEventListener('click', (e) => {
            if (e.target === document.querySelector('.modal')) {
                document.querySelector('.modal').style.display = 'none';
            }
        });
    } else {
        // Update existing modal with current post data
        document.getElementById('editPostId').value = post.id;
        document.getElementById('editPostTitle').value = post.title;
        document.getElementById('editPostDate').value = post.date;
        document.getElementById('editPostContent').value = post.content;
    }
    
    document.querySelector('.modal').style.display = 'flex';
}

// Update an existing post
function updatePost(id, title, date, content) {
    let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    
    posts = posts.map(post => {
        if (post.id === id) {
            return { ...post, title, date, content };
        }
        return post;
    });
    
    localStorage.setItem('blogPosts', JSON.stringify(posts));
    loadAllPosts();
}

// Delete a post
function deletePost(id) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    posts = posts.filter(post => post.id !== id);
    
    localStorage.setItem('blogPosts', JSON.stringify(posts));
    loadAllPosts();
}