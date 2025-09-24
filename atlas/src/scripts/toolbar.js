    // Navigation setup
    const style = document.createElement('style');
    style.textContent = `
        .nav-bar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 60px;
            background: rgba(255, 255, 255, 0.95);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            padding: 0 20px;
            z-index: 1000;
        }
        .nav-button {
            padding: 8px 16px;
            margin-right: 15px;
            border: none;
            border-radius: 6px;
            background: #4A90E2;
            color: white;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .nav-button:hover {
            background: #357ABD;
            transform: translateY(-1px);
        }
        .title {
            font-size: 18px;
            color: #333;
            margin-left: auto;
            font-weight: 500;
        }
        .controls-hint {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(255, 255, 255, 0.95);
            padding: 10px 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            font-size: 14px;
            color: #666;
            z-index: 1000;
        }
    `;
    document.head.appendChild(style);

    const navBar = document.createElement('div');
    navBar.className = 'nav-bar';

    const backButton = document.createElement('button');
    backButton.className = 'nav-button';
    backButton.textContent = '← Back to Upload';
    backButton.onclick = () => window.location.href = '/pdf-viewer';

    const homeButton = document.createElement('button');
    homeButton.className = 'nav-button';
    homeButton.textContent = 'Home';
    homeButton.onclick = () => window.location.href = '/';

    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = 'Concept Map Visualization';

    navBar.appendChild(backButton);
    navBar.appendChild(homeButton);
    navBar.appendChild(title);
    document.body.appendChild(navBar);