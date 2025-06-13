<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SHIZXY BOT MD | WhatsApp Bot</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --neon-purple: #ff00ff;
            --neon-cyan: #00ffff;
            --neon-green: #39ff14;
            --neon-blue: #0099ff;
            --bg-dark: #000000;
            --text-light: #ffffff;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--bg-dark);
            color: var(--text-light);
            min-height: 100vh;
            background-image: 
                radial-gradient(circle at 10% 20%, rgba(255, 0, 255, 0.1) 0%, transparent 20%),
                radial-gradient(circle at 90% 80%, rgba(0, 255, 255, 0.1) 0%, transparent 20%);
            overflow-x: hidden;
        }

        .container {
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
            animation: fadeIn 1s ease-out;
        }

        .glass-form {
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(12px);
            border-radius: 20px;
            border: 1px solid var(--neon-cyan);
            padding: 30px;
            margin: 20px 0;
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.2);
            position: relative;
            overflow: hidden;
        }

        .glass-form::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(
                to bottom right,
                rgba(255, 0, 255, 0.1),
                rgba(0, 255, 255, 0.1),
                rgba(57, 255, 20, 0.1)
            );
            transform: rotate(30deg);
            z-index: -1;
            animation: shimmer 10s linear infinite;
        }

        h1 {
            font-size: 4em;
            text-align: center;
            margin-bottom: 30px;
            background: linear-gradient(90deg, var(--neon-purple), var(--neon-cyan), var(--neon-green));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            background-size: 200% 100%;
            animation: gradientText 3s linear infinite;
            text-shadow: 0 0 20px rgba(255, 0, 255, 0.7);
            letter-spacing: 2px;
            position: relative;
        }

        h1::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 150px;
            height: 3px;
            background: linear-gradient(90deg, var(--neon-purple), var(--neon-cyan));
            border-radius: 3px;
            animation: gradientText 3s linear infinite;
        }

        input[type="text"] {
            width: 100%;
            padding: 15px;
            border-radius: 12px;
            border: 2px solid var(--neon-cyan);
            background: rgba(0, 0, 0, 0.3);
            color: var(--text-light);
            font-size: 1em;
            transition: all 0.3s ease;
            margin: 10px 0;
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
        }

        input[type="text"]:focus {
            outline: none;
            border-color: var(--neon-purple);
            box-shadow: 0 0 20px rgba(255, 0, 255, 0.3);
        }

        button {
            width: 100%;
            padding: 15px;
            border: none;
            border-radius: 12px;
            background: linear-gradient(45deg, var(--neon-purple), var(--neon-cyan));
            color: var(--text-light);
            font-weight: bold;
            font-size: 1em;
            cursor: pointer;
            transition: all 0.3s ease;
            animation: buttonGlow 1.5s ease-in-out infinite alternate;
            position: relative;
            overflow: hidden;
            z-index: 1;
        }

        button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: 0.5s;
            z-index: -1;
        }

        button:hover::before {
            left: 100%;
        }

        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.4);
        }

        .status {
            display: inline-block;
            padding: 10px 20px;
            background: linear-gradient(45deg, var(--neon-green), var(--neon-cyan));
            border-radius: 20px;
            margin: 10px 0;
            animation: statusPulse 2s infinite alternate;
            font-weight: bold;
        }

        #pairingCodeDisplay {
            font-size: 1.5em;
            text-align: center;
            margin: 20px 0;
            padding: 15px;
            color: var(--neon-cyan);
            animation: codeGlow 1.5s infinite alternate;
            font-family: monospace;
            letter-spacing: 2px;
        }

        .social-icons {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin: 30px 0;
        }

        .social-icon {
            padding: 15px 25px;
            border-radius: 12px;
            text-decoration: none;
            color: var(--text-light);
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(12px);
            border: 1px solid var(--neon-cyan);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .social-icon i {
            font-size: 1.2em;
            color: var(--neon-cyan);
        }

        .social-icon:hover {
            transform: translateY(-5px);
            box-shadow: 0 0 20px var(--neon-cyan);
            border-color: var(--neon-purple);
        }

        .toast {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            border-radius: 12px;
            background: rgba(0, 0, 0, 0.9);
            color: var(--text-light);
            border: 1px solid var(--neon-cyan);
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1000;
        }

        .section-title {
            font-size: 1.8em;
            margin: 25px 0 15px;
            color: var(--neon-cyan);
            text-shadow: 0 0 10px var(--neon-cyan);
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .section-title i {
            font-size: 0.9em;
        }

        .step-card {
            background: rgba(0, 0, 0, 0.5);
            border-radius: 15px;
            padding: 20px;
            margin: 10px 0;
            border: 1px solid var(--neon-blue);
            position: relative;
            transition: all 0.3s ease;
        }

        .step-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 0 15px var(--neon-blue);
        }

        .step-number {
            position: absolute;
            top: -15px;
            left: -15px;
            width: 40px;
            height: 40px;
            background: var(--neon-purple);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 1.2em;
            box-shadow: 0 0 10px var(--neon-purple);
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }

        .feature-card {
            background: rgba(0, 0, 0, 0.5);
            border-radius: 15px;
            padding: 20px;
            border: 1px solid var(--neon-green);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
            transition: all 0.3s ease;
        }

        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 0 15px var(--neon-green);
        }

        .feature-icon {
            font-size: 2em;
            color: var(--neon-green);
            animation: featureGlow 2s infinite alternate;
        }

        .feature-title {
            font-size: 1.2em;
            font-weight: bold;
            color: var(--text-light);
            text-align: center;
        }

        .feature-description {
            text-align: center;
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.9em;
        }

        footer {
            text-align: center;
            padding: 20px;
            margin-top: 30px;
            border-top: 1px solid rgba(0, 255, 255, 0.3);
            font-size: 0.9em;
            color: rgba(255, 255, 255, 0.7);
        }

        /* Animations */
        @keyframes gradientText {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
        }

        @keyframes glowText {
            from { text-shadow: 0 0 10px var(--neon-cyan); }
            to { text-shadow: 0 0 20px var(--neon-cyan), 0 0 30px var(--neon-cyan); }
        }

        @keyframes buttonGlow {
            from { box-shadow: 0 0 10px rgba(0, 255, 255, 0.5); }
            to { box-shadow: 0 0 20px rgba(0, 255, 255, 0.8); }
        }

        @keyframes statusPulse {
            from { opacity: 0.8; }
            to { opacity: 1; }
        }

        @keyframes codeGlow {
            from { text-shadow: 0 0 10px var(--neon-cyan); }
            to { text-shadow: 0 0 30px var(--neon-purple); }
        }

        @keyframes featureGlow {
            from { text-shadow: 0 0 10px var(--neon-green); }
            to { text-shadow: 0 0 20px var(--neon-green); }
        }

        @keyframes shimmer {
            0% { transform: translateY(-50%) rotate(0deg); }
            100% { transform: translateY(-50%) rotate(360deg); }
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .toast.show { opacity: 1; }

        @media (max-width: 768px) {
            .container { padding: 15px; }
            h1 { font-size: 2.5em; }
            .social-icons {
                flex-wrap: wrap;
                justify-content: center;
            }
            .social-icon { 
                width: 100%;
                justify-content: center;
            }
            .features-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>SHIZXY BOT MD</h1>

        <div class="glass-form">
            <div class="status"><i class="fas fa-circle-check"></i> Status: Active</div>
            <p style="text-align: center; margin-bottom: 20px;">Multi-Device WhatsApp Bot Service</p>

            <form id="pairingForm">
                <input type="text" id="phoneNumber" name="phoneNumber" placeholder="Enter Phone Number" required />
                <button type="submit"><i class="fas fa-qrcode"></i> Generate Pairing Code</button>
            </form>

            <div id="pairingCodeDisplay"></div>
            <button id="copyButton" style="display:none;"><i class="fas fa-copy"></i> Copy Code</button>
        </div>

        <h2 class="section-title"><i class="fas fa-robot"></i> About SHIZXY BOT</h2>
        <div class="glass-form">
            <p>SHIZXY BOT MD is a powerful multi-device WhatsApp bot that enhances your messaging experience with automated responses, fun commands, media tools, and more. Our bot runs 24/7 with high performance and reliability to serve all your WhatsApp automation needs.</p>
        </div>

        <h2 class="section-title"><i class="fas fa-bolt"></i> Features</h2>
        <div class="features-grid">
            <div class="feature-card">
                <i class="fas fa-comment-dots feature-icon"></i>
                <div class="feature-title">Auto-Response</div>
                <div class="feature-description">Set up automatic replies to common messages in your chats and groups</div>
            </div>
            <div class="feature-card">
                <i class="fas fa-image feature-icon"></i>
                <div class="feature-title">Media Tools</div>
                <div class="feature-description">Convert, edit and create images, stickers, and videos on demand</div>
            </div>
            <div class="feature-card">
                <i class="fas fa-shield-alt feature-icon"></i>
                <div class="feature-title">Group Management</div>
                <div class="feature-description">Moderate groups, welcome new members, and enforce rules automatically</div>
            </div>
            <div class="feature-card">
                <i class="fas fa-newspaper feature-icon"></i>
                <div class="feature-title">Content Downloader</div>
                <div class="feature-description">Download content from YouTube, Instagram, TikTok, and more</div>
            </div>
            <div class="feature-card">
                <i class="fas fa-gamepad feature-icon"></i>
                <div class="feature-title">Fun Commands</div>
                <div class="feature-description">Enjoy games, quizzes, and other entertainment features</div>
            </div>
            <div class="feature-card">
                <i class="fas fa-chart-line feature-icon"></i>
                <div class="feature-title">Analytics</div>
                <div class="feature-description">Track message metrics and group activity statistics</div>
            </div>
        </div>

        <h2 class="section-title"><i class="fas fa-mobile-alt"></i> Connect to WhatsApp</h2>
        <div class="glass-form">
            <div class="step-card">
                <div class="step-number">1</div>
                <h3>Install WhatsApp</h3>
                <p>Make sure you have the latest version of WhatsApp installed on your phone and that your account is active.</p>
            </div>
            
            <div class="step-card">
                <div class="step-number">2</div>
                <h3>Enter Your Phone Number</h3>
                <p>Enter your phone number with country code (e.g., +1234567890) in the form above.</p>
            </div>
            
            <div class="step-card">
                <div class="step-number">3</div>
                <h3>Generate Pairing Code</h3>
                <p>Click the "Generate Pairing Code" button and wait for your unique 8-digit pairing code.</p>
            </div>
            
            <div class="step-card">
                <div class="step-number">4</div>
                <h3>Link with WhatsApp</h3>
                <p>Open WhatsApp on your phone → Settings → Linked Devices → Link a Device → Enter the 8-digit pairing code.</p>
            </div>
            
            <div class="step-card">
                <div class="step-number">5</div>
                <h3>Start Using SHIZXY BOT</h3>
                <p>Once connected, you can start using the bot by sending commands like !help to get started.</p>
            </div>
        </div>

        <div class="social-icons">
            <a href="https://github.com/mrlit-a" target="_blank" class="social-icon"><i class="fab fa-github"></i> GitHub</a>
            <a href="https://chat.whatsapp.com/Jx7300IL1iVIaDUolVULBj" target="_blank" class="social-icon"><i class="fab fa-whatsapp"></i> WhatsApp</a>
            <a href="https://www.instagram.com/shizxy_andy/" target="_blank" class="social-icon"><i class="fab fa-instagram"></i> Instagram</a>
        </div>

        <footer>
            © 2025 MRLIT ANDY | Designed with ❤️ | All Rights Reserved
        </footer>
    </div>

    <div id="toast" class="toast"></div>

    <script>
        document.getElementById('pairingForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const phoneNumber = document.getElementById('phoneNumber').value;

            if (!phoneNumber) {
                showToast("Please enter a valid phone number!");
                return;
            }

            try {
                const response = await fetch('/pairing-code', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phoneNumber })
                });

                const data = await response.json();

                if (data.pairingCode) {
                    document.getElementById('pairingCodeDisplay').innerText = 'Pairing Code: ' + data.pairingCode;
                    document.getElementById('copyButton').style.display = 'inline-block';
                } else {
                    showToast('Error generating pairing code.');
                }
            } catch (error) {
                showToast('Network error. Please try again.');
            }
        });

        document.getElementById('copyButton').addEventListener('click', () => {
            const codeText = document.getElementById('pairingCodeDisplay').innerText.replace('Pairing Code: ', '');
            navigator.clipboard.writeText(codeText).then(() => {
                showToast('Pairing Code copied to clipboard!');
            }).catch(() => {
                showToast('Failed to copy code.');
            });
        });

        function showToast(message) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    </script>
</body>
</html>
