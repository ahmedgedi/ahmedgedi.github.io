const inputField = document.getElementById('cmd');
const outputDiv = document.getElementById('output');
const inputContainer = document.getElementById('input-container');
const promptText = document.getElementById('prompt-text');

const fileSystem = {
    'bio.txt': "Security Engineer @ Amazon (Fire TV & Appstore).\n~8 years of experience breaking and securing enterprise systems, scaling high-leverage security platforms, and driving secure developer self-service automation. Focused on threat modeling, risk architecture, and mobile security.",
    
    'skills.txt': "Languages: Python, TypeScript, Golang, Java, C/C#, Bash\nCloud & Infra: AWS, Azure, Terraform\nSpecialties: Threat Modeling, Mobile App Sec (iOS/Android), Risk Strategy, IAM Hardening, Security Automation",
    
    'education.txt': "Lewis & Clark College\nBachelors Degree in Computer Science & Mathematics",

    'experience': {
        'amazon': {
            'fire_tv.txt': [
                "Amazon | Security Engineer - Fire TV (May 2025 - Present)",
                "- Authored the first-ever comprehensive threat model covering the entire Fire TV platform, mapping complex components to establish the foundational baseline for the security team.",
                "- Defined the security risks looked for across the platform, leveraging mobile security training to dive deep into Fire OS and identify underlying Android vulnerabilities within first-party applications and services.",
                "- Designed custom security detections for the Fire TV ecosystem to validate and neutralize threats targeting platform apps and services.",
                "- Managing platform security for the Amazon Appstore, ensuring strict vetting and risk mitigation across distributed software.",
                "- Administering the data classification platform for Amazon Devices & Services, enforcing secure developer data handling and leading a strategic service migration and merger between security organizations."
            ].join('\n'),
            
            'alexa.txt': [
                "Amazon | Security Engineer - Alexa Services (Sep 2022 - May 2025)",
                "- Focused heavily on threat modeling and risk identification across Alexa services, establishing it as a core component of my engineering workflow.",
                "- Conducted comprehensive Generative AI security reviews for high-visibility Alexa+ initiatives, analyzing over 60 LLM APIs to define pioneering security standards and guardrails where no baseline existed.",
                "- Secured critical Alexa Comms infrastructure and associated backend data flows.",
                "- Advised product and engineering teams on architecture components delivering core security features (key management, authentication, and encryption)."
            ].join('\n')
        },
        'qumulo.txt': "Qumulo | Cloud Security Engineer (May 2022 - Jun 2022)\n- Joined as the second security hire to help architect and define the company's foundational cloud security strategy and product threat modeling framework.",
        'nike': {
            'cloud_security.txt': [
                "Nike | Cloud Security Engineer (Mar 2021 - May 2022)",
                "- Architected and deployed a self-service identity platform automating certificate lifecycle renewals with third-party vendors across multi-cloud environments.",
                "- Built an intuitive interface for internal builders, pairing automated provisioning with native AWS implementation guardrails to drastically reduce manual configuration errors.",
                "- Engineered custom cloud security tooling to automate continuous compliance and proactive vulnerability detection across global enterprise infrastructure.",
                "- Implemented robust infrastructure-as-code hardening strategies using Terraform to securely provision multi-cloud resources across AWS and Azure."
            ].join('\n'),
            
            'application_security.txt': [
                "Nike | Application Security Engineer (Aug 2019 - Mar 2021)",
                "- Co-created an internal enterprise SAST/DAST application security platform used globally by all internal development teams to secure code repositories.",
                "- Designed and engineered the frontend UI and managed multiple pipeline integrations for the next-generation centralized scanning service.",
                "- Architected and implemented the entire end-to-end authentication and authorization (AuthN/AuthZ) layer for the core scanning platform.",
                "- Developed secure, robust enhancements for Nike’s internal Active Directory REST API using C# and PowerShell, strengthening core identity and access management frameworks.",
                "- Partnered with development teams to triage application vulnerabilities and drive secure-by-design engineering practices."
            ].join('\n')
        },
        'new_relic.txt': [
            "New Relic | Security Operations Intern (May 2018 - Aug 2018)",
            "- Automated vulnerability management workflows and streamlined internal Jira reporting.",
            "- Hardened AWS environments using cloud-native security tooling (GuardDuty, AWS Config).",
            "- Developed foundational application security skills utilizing Burp Suite and other penetration testing tools within a corporate operations environment."
        ].join('\n')
    },
    
    'certifications.txt': [
        "GIAC Mobile Device Security Analyst (GMOB) - Credly: https://www.credly.com/badges/fd9964ed-ac36-42d3-bb6c-cbf6ba7ef579",
        "GIAC Advisory Board Member - Credly: https://www.credly.com/badges/079473b7-b9c4-4d30-8b99-68e0be5f183c/public_url",
        "AWS Certified Developer – Associate - Validation Number: 7BBJB9TJBFV4QLW0"
    ].join('\n')
};

let currentPath = []; 
let commandHistory = [];
let historyIndex = -1;

function getDirectory(pathArray) {
    let dir = fileSystem;
    for (const segment of pathArray) {
        if (dir[segment] && typeof dir[segment] === 'object') {
            dir = dir[segment];
        } else {
            return null;
        }
    }
    return dir;
}

function updatePrompt() {
    const pathString = currentPath.length === 0 ? '~' : `~/${currentPath.join('/')}`;
    promptText.innerHTML = `guest@gedi:${pathString}$`;
}

const commands = {
    'help': () => `Available commands:
  whoami    - Display basic info
  pwd       - Print working directory
  ls        - List directory contents
  cd <dir>  - Change directory (e.g., "cd experience")
  cat <file>- Print file contents (e.g., "cat about.txt")
  clear     - Clear the terminal screen`,
    
    'whoami': () => "guest",
    
    'pwd': () => `/${currentPath.join('/')}`,
    
    'ls': () => {
        const dir = getDirectory(currentPath);
        if (!dir) return '';
        return Object.keys(dir).map(key => 
            typeof dir[key] === 'object' ? `<span class="dir-color">${key}/</span>` : key
        ).join('   ');
    },

    'cd': (args) => {
        const target = args[0];
        if (!target || target === '~') {
            currentPath = [];
            updatePrompt();
            return '';
        }
        if (target === '..') {
            currentPath.pop();
            updatePrompt();
            return '';
        }

        const targetPath = target.split('/').filter(p => p !== '');
        let tempPath = [...currentPath];
        
        for(let p of targetPath) {
            if (p === '..') {
                tempPath.pop();
            } else {
                tempPath.push(p);
            }
        }

        if (getDirectory(tempPath) !== null) {
            currentPath = tempPath;
            updatePrompt();
            return '';
        } else {
            return `bash: cd: ${target}: No such directory`;
        }
    },

    'cat': (args) => {
        const filename = args[0];
        if (!filename) return "cat: missing operand";
        
        const dir = getDirectory(currentPath);
        if (dir[filename]) {
            if (typeof dir[filename] === 'string') {
                return dir[filename];
            } else {
                return `cat: ${filename}: Is a directory`;
            }
        }
        return `cat: ${filename}: No such file or directory`;
    },
    
    'clear': () => { outputDiv.innerHTML = ''; return ''; }
};

inputField.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const rawCommand = this.value.trim();
        const args = rawCommand.split(' ').filter(Boolean);
        const cmd = args[0] ? args[0].toLowerCase() : '';
        const cmdArgs = args.slice(1);
        let response = '';

        if (rawCommand) {
            commandHistory.push(rawCommand);
            historyIndex = commandHistory.length;
        }

        const pathString = currentPath.length === 0 ? '~' : `~/${currentPath.join('/')}`;
        const promptEcho = `<span class="prompt">guest@gedi:${pathString}$</span> ${rawCommand}\n`;

        if (cmd === '') {
            response = '';
        } else if (cmd === 'clear') {
            commands['clear']();
            this.value = '';
            return; 
        } else if (commands[cmd]) {
            response = commands[cmd](cmdArgs);
        } else {
            response = `bash: ${cmd}: command not found`;
        }

        outputDiv.innerHTML += promptEcho + (response ? response + '\n' : '');
        this.value = '';
        document.getElementById('terminal-container').scrollTop = document.getElementById('terminal-container').scrollHeight;
    } else if (event.key === 'ArrowUp') {
        if (historyIndex > 0) {
            historyIndex--;
            this.value = commandHistory[historyIndex];
        }
        event.preventDefault();
    } else if (event.key === 'ArrowDown') {
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            this.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            this.value = '';
        }
        event.preventDefault();
    }
});

document.addEventListener('click', () => inputField.focus());

const bootText = [
    "Initializing secure boot...",
    "Loading kernel modules [OK]",
    "Mounting file systems [OK]",
    "Starting networking [OK]",
    "Establishing secure connection to gedi.codes...",
    "Connection established.",
    "Welcome to Ahmed's Interactive Portfolio :]",
    "Type 'help' to see available commands.\n"
];

let bootIndex = 0;
function printBootSequence() {
    if (bootIndex < bootText.length) {
        outputDiv.innerHTML += bootText[bootIndex] + '\n';
        bootIndex++;
        let delay = bootIndex > 6 ? 100 : Math.random() * 300 + 100;
        setTimeout(printBootSequence, delay);
    } else {
        inputContainer.classList.remove('hidden');
        inputField.focus();
        document.getElementById('terminal-container').scrollTop = document.getElementById('terminal-container').scrollHeight;
    }
}

window.onload = printBootSequence;