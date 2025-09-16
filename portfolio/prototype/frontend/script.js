// Enhanced RailOptima Frontend with Python AI Integration
class RailOptimaSystem {
    constructor() {
        this.baseUrl = 'http://localhost:5000/api';
        this.trains = [];
        this.junctions = [];
        this.aiClient = null;
        this.isConnected = false;
        this.animationId = null;
        
        this.init();
    }
    
    async init() {
        console.log('🚂 Initializing RailOptima System...');
        await this.connectToBackend();
        this.initializeUI();
        this.startAnimation();
    }
    
    async connectToBackend() {
        try {
            const response = await fetch(`${this.baseUrl}/status`);
            if (response.ok) {
                const data = await response.json();
                this.isConnected = true;
                this.updateSystemData(data);
                this.showAlert('Connected to AI Backend Successfully! 🤖', 'success');
                console.log('✅ Backend connected');
            }
        } catch (error) {
            console.warn('⚠️ Backend not available, using simulation mode');
            this.isConnected = false;
            this.initializeSimulationMode();
            this.showAlert('Running in Simulation Mode 🔧', 'warning');
        }
    }
    
    updateSystemData(data) {
        if (data.trains) {
            this.trains = data.trains;
            this.updateTrainsOnTrack();
        }
        if (data.traffic_analysis) {
            this.updateMetrics(data.traffic_analysis, data.performance_metrics || {});
        }
        this.updateAIStatus(data.ai_enabled);
    }
    
    updateTrainsOnTrack() {
        // Clear existing trains
        const existingTrains = document.querySelectorAll('.train');
        existingTrains.forEach(train => train.remove());
        
        // Add trains from backend data
        const trackViz = document.getElementById('trackViz');
        this.trains.forEach(trainData => {
            const trainElement = this.createTrainElement(trainData);
            trackViz.appendChild(trainElement);
        });
    }
    
    createTrainElement(trainData) {
        const trainElement = document.createElement('div');
        trainElement.className = `train ${trainData.type}`;
        trainElement.id = trainData.id;
        trainElement.textContent = trainData.id;
        
        const topPosition = trainData.track === 'main' ? '45%' : '55%';
        trainElement.style.left = `${trainData.position}%`;
        trainElement.style.top = topPosition;
        trainElement.onclick = () => this.selectTrain(trainData.id);
        
        return trainElement;
    }
    
    updateMetrics(analysis, performance) {
        // Update UI metrics
        document.getElementById('activeTrains').textContent = analysis.total_trains || 5;
        
        const avgDelay = Math.round(analysis.avg_delay || 12);
        const avgDelayElement = document.getElementById('avgDelay');
        avgDelayElement.textContent = `${avgDelay} min`;
        avgDelayElement.className = `metric-value ${avgDelay > 15 ? 'bad' : avgDelay > 8 ? 'warning' : 'good'}`;
        
        const throughput = Math.round((1 - (analysis.congestion_level || 0.15)) * 100);
        const throughputElement = document.getElementById('throughput');
        throughputElement.textContent = `${throughput}%`;
        throughputElement.className = `metric-value ${throughput < 60 ? 'bad' : throughput < 80 ? 'warning' : 'good'}`;
        
        const conflicts = (analysis.potential_conflicts || []).length;
        const conflictsElement = document.getElementById('conflicts');
        conflictsElement.textContent = conflicts;
        conflictsElement.className = `metric-value ${conflicts > 2 ? 'bad' : conflicts > 0 ? 'warning' : 'good'}`;
        
        document.getElementById('aiDecisions').textContent = performance.decisions_made || 0;
    }
    
    updateAIStatus(aiEnabled) {
        const aiIndicator = document.getElementById('aiIndicator');
        const statusDot = document.querySelector('.status-dot');
        const statusText = statusDot.nextElementSibling;
        
        if (this.isConnected && aiEnabled) {
            aiIndicator.className = 'ai-indicator';
            statusDot.style.background = '#10b981';
            statusText.textContent = 'AI System Active';
        } else if (this.isConnected) {
            aiIndicator.className = 'ai-indicator thinking';
            statusDot.style.background = '#f59e0b';
            statusText.textContent = 'AI System Ready';
        } else {
            aiIndicator.className = 'ai-indicator thinking';
            statusDot.style.background = '#6b7280';
            statusText.textContent = 'Simulation Mode';
        }
    }
    
    async enableAIMode() {
        if (!this.isConnected) {
            this.showAlert('Backend not connected. Using simulation.', 'warning');
            return this.simulateAIMode();
        }
        
        try {
            this.showLoading(true);
            const response = await fetch(`${this.baseUrl}/ai/enable`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.ok) {
                const result = await response.json();
                this.showAlert('AI Traffic Control Activated! 🧠', 'success');
                this.logAIDecision('AI Mode Enabled', 'Neural network optimization active');
                await this.refreshSystemStatus();
            }
        } catch (error) {
            this.showAlert('Error enabling AI mode', 'error');
        } finally {
            this.showLoading(false);
        }
    }
    
    async runAIOptimization() {
        if (!this.isConnected) {
            return this.simulateOptimization();
        }
        
        try {
            this.showLoading(true);
            const response = await fetch(`${this.baseUrl}/ai/optimize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.ok) {
                const result = await response.json();
                this.displayOptimizationResults(result);
                await this.refreshSystemStatus();
            }
        } catch (error) {
            this.showAlert('Optimization failed', 'error');
        } finally {
            this.showLoading(false);
        }
    }
    
    async emergencyOverride() {
        if (!this.isConnected) {
            return this.simulateEmergency();
        }
        
        try {
            const response = await fetch(`${this.baseUrl}/emergency`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.ok) {
                this.showAlert('Emergency Override Activated! 🚨', 'error');
                this.logAIDecision('EMERGENCY', 'All trains stopped for safety');
            }
        } catch (error) {
            this.simulateEmergency();
        }
    }
    
    async refreshSystemStatus() {
        if (this.isConnected) {
            const response = await fetch(`${this.baseUrl}/status`);
            if (response.ok) {
                const data = await response.json();
                this.updateSystemData(data);
            }
        }
    }
    
    // Simulation methods for offline mode
    initializeSimulationMode() {
        this.trains = [
            { id: 'EXP-001', type: 'express', position: 10, track: 'main', delay: 15 },
            { id: 'PAS-102', type: 'passenger', position: 35, track: 'main', delay: 8 },
            { id: 'FRT-203', type: 'freight', position: 60, track: 'secondary', delay: 5 },
            { id: 'EXP-002', type: 'express', position: 25, track: 'main', delay: 10 },
            { id: 'PAS-103', type: 'passenger', position: 50, track: 'secondary', delay: 12 }
        ];
        this.updateTrainsOnTrack();
        this.updateMetrics({
            total_trains: 5,
            avg_delay: 10,
            congestion_level: 0.3,
            potential_conflicts: []
        }, { decisions_made: 0 });
    }
    
    simulateAIMode() {
        this.showAlert('AI Mode Simulated 🤖', 'success');
        this.logAIDecision('Simulation Mode', 'AI logic running locally');
        this.updateAIStatus(true);
    }
    
    simulateOptimization() {
        this.showLoading(true);
        setTimeout(() => {
            const results = {
                executed_actions: [
                    { train_id: 'EXP-001', type: 'track_switch', expected_delay_reduction: 8 }
                ],
                predicted_improvements: {
                    delay_reduction: 25,
                    throughput_improvement: 18,
                    conflicts_resolved: 2
                },
                confidence: 0.85
            };
            this.displayOptimizationResults(results);
            this.showLoading(false);
        }, 2000);
    }
    
    simulateEmergency() {
        this.showAlert('Emergency Simulation Activated! 🚨', 'error');
        this.logAIDecision('EMERGENCY SIM', 'Emergency procedures initiated');
    }
    
    // UI Helper Methods
    displayOptimizationResults(results) {
        const resultDiv = document.getElementById('optimizationResult');
        const improvements = results.predicted_improvements;
        
        resultDiv.innerHTML = `
            <div class="result-header">✅ AI Optimization Complete!</div>
            <div class="result-item">• Reduced average delay by <strong>${improvements.delay_reduction}%</strong></div>
            <div class="result-item">• Improved throughput by <strong>${improvements.throughput_improvement}%</strong></div>
            <div class="result-item">• Resolved <strong>${improvements.conflicts_resolved} conflicts</strong></div>
            <div class="result-item">• Confidence: <strong>${Math.round(results.confidence * 100)}%</strong></div>
        `;
        
        resultDiv.classList.add('show');
        this.showAlert('Traffic Optimization Complete! 🚀', 'success');
        
        setTimeout(() => resultDiv.classList.remove('show'), 10000);
    }
    
    logAIDecision(action, details) {
        const timestamp = new Date().toLocaleTimeString();
        const logContainer = document.getElementById('aiDecisionLog');
        const logItem = document.createElement('div');
        logItem.className = 'ai-log-item';
        logItem.innerHTML = `
            <span class="ai-log-timestamp">[${timestamp}]</span> 
            ${action}: ${details}
        `;
        
        logContainer.appendChild(logItem);
        logContainer.scrollTop = logContainer.scrollHeight;
        
        while (logContainer.children.length > 10) {
            logContainer.removeChild(logContainer.children[1]);
        }
    }
    
    showAlert(message, type) {
        const alert = document.getElementById('alert');
        alert.textContent = message;
        alert.className = `alert ${type} show`;
        
        setTimeout(() => alert.classList.remove('show'), 4000);
    }
    
    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        overlay.classList.toggle('show', show);
    }
    
    selectTrain(trainId) {
        document.querySelectorAll('.train').forEach(t => t.classList.remove('selected'));
        const train = document.getElementById(trainId);
        if (train) {
            train.classList.add('selected');
            this.logAIDecision('Train Selected', `Monitoring ${trainId}`);
        }
    }
    
    startAnimation() {
        const animate = () => {
            if (this.isConnected) {
                this.refreshSystemStatus();
            } else {
                this.simulateTrainMovement();
            }
            this.animationId = setTimeout(animate, 5000);
        };
        animate();
    }
    
    simulateTrainMovement() {
        this.trains.forEach(train => {
            train.position += (Math.random() * 2);
            if (train.position > 95) train.position = 5;
        });
        this.updateTrainsOnTrack();
    }
}

// Global functions for button clicks
let railSystem;

function enableAIMode() {
    railSystem.enableAIMode();
}

function runAIOptimization() {
    railSystem.runAIOptimization();
}

function emergencyOverride() {
    railSystem.emergencyOverride();
}

function manualMode() {
    railSystem.showAlert('Switched to Manual Mode 👤', 'success');
    railSystem.logAIDecision('Manual Mode', 'AI assistance disabled');
}

function selectTrain(trainId) {
    railSystem.selectTrain(trainId);
}

function toggleJunction(junctionId) {
    const junction = document.getElementById(junctionId);
    junction.classList.toggle('active');
    railSystem.logAIDecision('Junction Toggle', `${junctionId} switched`);
}

// Initialize system when page loads
window.addEventListener('DOMContentLoaded', () => {
    railSystem = new RailOptimaSystem();
});