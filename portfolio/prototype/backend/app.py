import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import json
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass, asdict
from flask import Flask, jsonify, request
from flask_cors import CORS
import threading
import time
import logging
from enum import Enum

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TrainType(Enum):
    EXPRESS = "express"
    PASSENGER = "passenger"
    FREIGHT = "freight"

class TrackType(Enum):
    MAIN = "main"
    SECONDARY = "secondary"

class Priority(Enum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3

@dataclass
class Train:
    id: str
    type: TrainType
    position: float
    speed: float
    priority: Priority
    delay: int
    track: TrackType
    destination: str
    schedule_time: datetime
    passengers: int = 0
    cargo_weight: float = 0.0
    
    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type.value,
            'position': self.position,
            'speed': self.speed,
            'priority': self.priority.value,
            'delay': self.delay,
            'track': self.track.value,
            'destination': self.destination,
            'schedule_time': self.schedule_time.isoformat(),
            'passengers': self.passengers,
            'cargo_weight': self.cargo_weight
        }

@dataclass
class Junction:
    id: str
    position: float
    active: bool
    main_to_secondary: bool
    switch_time: float = 0.0

@dataclass
class Signal:
    id: str
    position: float
    state: str  # 'red', 'yellow', 'green'
    controlled_by_ai: bool = True

class NeuralTrafficController:
    """Advanced AI controller using neural network principles for traffic optimization"""
    
    def __init__(self):
        self.weights = self._initialize_weights()
        self.learning_rate = 0.01
        self.decision_history = []
        self.performance_metrics = {
            'total_delay_reduction': 0,
            'conflicts_resolved': 0,
            'throughput_improvement': 0,
            'decisions_made': 0
        }
    
    def _initialize_weights(self) -> Dict[str, float]:
        """Initialize neural network weights"""
        return {
            'priority_weight': 0.35,
            'delay_weight': 0.25,
            'congestion_weight': 0.20,
            'speed_weight': 0.15,
            'distance_weight': 0.05
        }
    
    def analyze_traffic_situation(self, trains: List[Train], junctions: List[Junction]) -> Dict:
        """Analyze current traffic situation and generate insights"""
        analysis = {
            'total_trains': len(trains),
            'congestion_level': self._calculate_congestion(trains),
            'avg_delay': np.mean([train.delay for train in trains]),
            'priority_distribution': self._get_priority_distribution(trains),
            'track_utilization': self._calculate_track_utilization(trains),
            'potential_conflicts': self._detect_potential_conflicts(trains)
        }
        return analysis
    
    def _calculate_congestion(self, trains: List[Train]) -> float:
        """Calculate overall network congestion"""
        main_track_trains = [t for t in trains if t.track == TrackType.MAIN]
        secondary_track_trains = [t for t in trains if t.track == TrackType.SECONDARY]
        
        main_congestion = len(main_track_trains) / 100  # Normalize by track capacity
        secondary_congestion = len(secondary_track_trains) / 100
        
        return (main_congestion + secondary_congestion) / 2
    
    def _get_priority_distribution(self, trains: List[Train]) -> Dict[str, int]:
        """Get distribution of train priorities"""
        distribution = {'high': 0, 'medium': 0, 'low': 0}
        for train in trains:
            if train.priority == Priority.HIGH:
                distribution['high'] += 1
            elif train.priority == Priority.MEDIUM:
                distribution['medium'] += 1
            else:
                distribution['low'] += 1
        return distribution
    
    def _calculate_track_utilization(self, trains: List[Train]) -> Dict[str, float]:
        """Calculate utilization of each track"""
        main_trains = len([t for t in trains if t.track == TrackType.MAIN])
        secondary_trains = len([t for t in trains if t.track == TrackType.SECONDARY])
        
        return {
            'main': min(main_trains / 10, 1.0),  # Max 10 trains per track
            'secondary': min(secondary_trains / 8, 1.0)  # Max 8 trains per secondary
        }
    
    def _detect_potential_conflicts(self, trains: List[Train]) -> List[Dict]:
        """Detect potential conflicts between trains"""
        conflicts = []
        for i, train1 in enumerate(trains):
            for j, train2 in enumerate(trains[i+1:], i+1):
                if train1.track == train2.track:
                    distance = abs(train1.position - train2.position)
                    relative_speed = abs(train1.speed - train2.speed)
                    
                    if distance < 20 and relative_speed > 0.5:
                        conflicts.append({
                            'train1': train1.id,
                            'train2': train2.id,
                            'distance': distance,
                            'severity': self._calculate_conflict_severity(distance, relative_speed)
                        })
        return conflicts
    
    def _calculate_conflict_severity(self, distance: float, relative_speed: float) -> str:
        """Calculate severity of potential conflict"""
        risk_score = (1 / distance) * relative_speed
        if risk_score > 0.1:
            return 'high'
        elif risk_score > 0.05:
            return 'medium'
        else:
            return 'low'
    
    def optimize_train_routes(self, trains: List[Train], junctions: List[Junction]) -> Dict:
        """Main optimization function using AI algorithms"""
        optimization_results = {
            'actions': [],
            'predicted_improvements': {},
            'confidence': 0.0,
            'execution_time': 0.0
        }
        
        start_time = time.time()
        
        # Analyze each train for potential optimizations
        for train in trains:
            action = self._analyze_train_optimization(train, trains, junctions)
            if action:
                optimization_results['actions'].append(action)
        
        # Calculate predicted improvements
        optimization_results['predicted_improvements'] = self._calculate_predicted_improvements(
            optimization_results['actions'], trains
        )
        
        # Calculate overall confidence
        optimization_results['confidence'] = self._calculate_optimization_confidence(
            optimization_results['actions']
        )
        
        optimization_results['execution_time'] = time.time() - start_time
        
        # Update performance metrics
        self.performance_metrics['decisions_made'] += len(optimization_results['actions'])
        
        return optimization_results
    
    def _analyze_train_optimization(self, train: Train, all_trains: List[Train], 
                                  junctions: List[Junction]) -> Optional[Dict]:
        """Analyze optimization opportunities for a specific train"""
        # Find nearby junctions
        nearby_junctions = [j for j in junctions if abs(j.position - train.position) < 30]
        
        if not nearby_junctions:
            return None
        
        best_action = None
        best_score = 0
        
        for junction in nearby_junctions:
            # Calculate potential benefit of track switching
            current_track_score = self._evaluate_track_conditions(train, all_trains, train.track)
            alternate_track = TrackType.SECONDARY if train.track == TrackType.MAIN else TrackType.MAIN
            alternate_track_score = self._evaluate_track_conditions(train, all_trains, alternate_track)
            
            if alternate_track_score > current_track_score + 0.1:  # Minimum improvement threshold
                action_score = alternate_track_score - current_track_score
                if action_score > best_score:
                    best_score = action_score
                    best_action = {
                        'type': 'track_switch',
                        'train_id': train.id,
                        'junction_id': junction.id,
                        'from_track': train.track.value,
                        'to_track': alternate_track.value,
                        'confidence': min(action_score, 1.0),
                        'expected_delay_reduction': int(action_score * 10)
                    }
        
        return best_action
    
    def _evaluate_track_conditions(self, train: Train, all_trains: List[Train], 
                                 track: TrackType) -> float:
        """Evaluate conditions on a specific track for the given train"""
        score = 0.5  # Base score
        
        # Count trains on track
        track_trains = [t for t in all_trains if t.track == track and t.id != train.id]
        congestion_penalty = len(track_trains) * 0.1
        score -= congestion_penalty
        
        # Check for conflicts
        conflicts = 0
        for other_train in track_trains:
            distance = abs(train.position - other_train.position)
            if distance < 25:  # Conflict zone
                conflicts += 1
                score -= 0.15
        
        # Priority bonus
        if train.priority == Priority.HIGH:
            score += 0.2
        elif train.priority == Priority.MEDIUM:
            score += 0.1
        
        # Delay penalty
        score -= (train.delay / 60) * 0.1  # Convert minutes to penalty
        
        return max(score, 0.0)
    
    def _calculate_predicted_improvements(self, actions: List[Dict], trains: List[Train]) -> Dict:
        """Calculate predicted improvements from optimization actions"""
        if not actions:
            return {'delay_reduction': 0, 'throughput_improvement': 0, 'conflicts_resolved': 0}
        
        total_delay_reduction = sum(action.get('expected_delay_reduction', 0) for action in actions)
        conflicts_resolved = len([a for a in actions if a.get('type') == 'track_switch'])
        throughput_improvement = min(len(actions) * 5, 30)  # Max 30% improvement
        
        return {
            'delay_reduction': total_delay_reduction,
            'throughput_improvement': throughput_improvement,
            'conflicts_resolved': conflicts_resolved
        }
    
    def _calculate_optimization_confidence(self, actions: List[Dict]) -> float:
        """Calculate overall confidence in optimization decisions"""
        if not actions:
            return 0.0
        
        confidences = [action.get('confidence', 0.5) for action in actions]
        return np.mean(confidences)
    
    def predict_delays(self, trains: List[Train], time_horizon: int = 60) -> Dict[str, int]:
        """Predict delays for trains over given time horizon (minutes)"""
        predictions = {}
        
        for train in trains:
            # Simple prediction model based on current conditions
            current_delay = train.delay
            congestion_factor = len([t for t in trains if t.track == train.track]) * 0.5
            priority_factor = (4 - train.priority.value) * 2  # Higher priority = less additional delay
            
            predicted_additional_delay = congestion_factor + priority_factor
            predictions[train.id] = int(current_delay + predicted_additional_delay)
        
        return predictions
    
    def generate_ai_recommendations(self, trains: List[Train], junctions: List[Junction]) -> List[str]:
        """Generate human-readable AI recommendations"""
        recommendations = []
        
        # Analyze traffic situation
        analysis = self.analyze_traffic_situation(trains, junctions)
        
        if analysis['congestion_level'] > 0.7:
            recommendations.append("High congestion detected. Consider implementing dynamic scheduling.")
        
        if analysis['avg_delay'] > 15:
            recommendations.append("Average delay is high. Optimize signal timing and junction switching.")
        
        high_priority_delayed = [t for t in trains if t.priority == Priority.HIGH and t.delay > 10]
        if high_priority_delayed:
            recommendations.append(f"Priority trains {[t.id for t in high_priority_delayed]} experiencing delays.")
        
        conflicts = analysis['potential_conflicts']
        if len(conflicts) > 0:
            recommendations.append(f"Detected {len(conflicts)} potential conflicts requiring attention.")
        
        return recommendations

class TrafficControlSystem:
    """Main system orchestrating AI-powered train traffic control"""
    
    def __init__(self):
        self.ai_controller = NeuralTrafficController()
        self.trains = self._initialize_sample_trains()
        self.junctions = self._initialize_junctions()
        self.signals = self._initialize_signals()
        self.system_status = "active"
        self.ai_enabled = False
        
    def _initialize_sample_trains(self) -> List[Train]:
        """Initialize sample train data"""
        now = datetime.now()
        return [
            Train(
                id="EXP-001",
                type=TrainType.EXPRESS,
                position=10.0,
                speed=2.0,
                priority=Priority.HIGH,
                delay=15,
                track=TrackType.MAIN,
                destination="Delhi",
                schedule_time=now + timedelta(hours=2),
                passengers=450
            ),
            Train(
                id="PAS-102",
                type=TrainType.PASSENGER,
                position=35.0,
                speed=1.5,
                priority=Priority.MEDIUM,
                delay=8,
                track=TrackType.MAIN,
                destination="Pune",
                schedule_time=now + timedelta(hours=1),
                passengers=280
            ),
            Train(
                id="FRT-203",
                type=TrainType.FREIGHT,
                position=60.0,
                speed=1.0,
                priority=Priority.LOW,
                delay=5,
                track=TrackType.SECONDARY,
                destination="Nashik",
                schedule_time=now + timedelta(hours=4),
                cargo_weight=1200.5
            ),
            Train(
                id="EXP-002",
                type=TrainType.EXPRESS,
                position=25.0,
                speed=2.0,
                priority=Priority.HIGH,
                delay=10,
                track=TrackType.MAIN,
                destination="Bangalore",
                schedule_time=now + timedelta(hours=3),
                passengers=520
            ),
            Train(
                id="PAS-103",
                type=TrainType.PASSENGER,
                position=50.0,
                speed=1.5,
                priority=Priority.MEDIUM,
                delay=12,
                track=TrackType.SECONDARY,
                destination="Nagpur",
                schedule_time=now + timedelta(hours=2, minutes=30),
                passengers=320
            )
        ]
    
    def _initialize_junctions(self) -> List[Junction]:
        """Initialize junction data"""
        return [
            Junction(id="junction1", position=25.0, active=False, main_to_secondary=True),
            Junction(id="junction2", position=50.0, active=False, main_to_secondary=False),
            Junction(id="junction3", position=75.0, active=False, main_to_secondary=True)
        ]
    
    def _initialize_signals(self) -> List[Signal]:
        """Initialize signal data"""
        return [
            Signal(id="signal1", position=20.0, state="red"),
            Signal(id="signal2", position=45.0, state="yellow"),
            Signal(id="signal3", position=70.0, state="green")
        ]
    
    def enable_ai_mode(self) -> Dict:
        """Enable AI-powered traffic control"""
        self.ai_enabled = True
        logger.info("AI mode enabled")
        
        return {
            "status": "success",
            "message": "AI traffic control system activated",
            "timestamp": datetime.now().isoformat()
        }
    
    def disable_ai_mode(self) -> Dict:
        """Disable AI mode and switch to manual control"""
        self.ai_enabled = False
        logger.info("AI mode disabled, switching to manual control")
        
        return {
            "status": "success",
            "message": "Switched to manual control mode",
            "timestamp": datetime.now().isoformat()
        }
    
    def run_ai_optimization(self) -> Dict:
        """Run AI optimization on current traffic situation"""
        if not self.ai_enabled:
            return {
                "status": "error",
                "message": "AI mode is not enabled"
            }
        
        logger.info("Running AI optimization...")
        optimization_results = self.ai_controller.optimize_train_routes(self.trains, self.junctions)
        
        # Execute optimization actions
        executed_actions = []
        for action in optimization_results['actions']:
            if self._execute_optimization_action(action):
                executed_actions.append(action)
        
        # Generate recommendations
        recommendations = self.ai_controller.generate_ai_recommendations(self.trains, self.junctions)
        
        return {
            "status": "success",
            "executed_actions": executed_actions,
            "predicted_improvements": optimization_results['predicted_improvements'],
            "confidence": optimization_results['confidence'],
            "recommendations": recommendations,
            "execution_time": optimization_results['execution_time'],
            "timestamp": datetime.now().isoformat()
        }
    
    def _execute_optimization_action(self, action: Dict) -> bool:
        """Execute a specific optimization action"""
        try:
            if action['type'] == 'track_switch':
                train_id = action['train_id']
                new_track = TrackType(action['to_track'])
                
                # Find and update train
                for train in self.trains:
                    if train.id == train_id:
                        train.track = new_track
                        train.delay = max(0, train.delay - action.get('expected_delay_reduction', 0))
                        logger.info(f"Switched {train_id} to {new_track.value} track")
                        return True
                        
            return False
        except Exception as e:
            logger.error(f"Failed to execute action {action}: {e}")
            return False
    
    def get_system_status(self) -> Dict:
        """Get comprehensive system status"""
        analysis = self.ai_controller.analyze_traffic_situation(self.trains, self.junctions)
        delay_predictions = self.ai_controller.predict_delays(self.trains)
        
        return {
            "system_status": self.system_status,
            "ai_enabled": self.ai_enabled,
            "trains": [train.to_dict() for train in self.trains],
            "junctions": [asdict(junction) for junction in self.junctions],
            "signals": [asdict(signal) for signal in self.signals],
            "traffic_analysis": analysis,
            "delay_predictions": delay_predictions,
            "performance_metrics": self.ai_controller.performance_metrics,
            "timestamp": datetime.now().isoformat()
        }
    
    def update_train_position(self, train_id: str, new_position: float) -> Dict:
        """Update train position (simulating movement)"""
        for train in self.trains:
            if train.id == train_id:
                train.position = new_position
                return {"status": "success", "train_id": train_id, "new_position": new_position}
        
        return {"status": "error", "message": f"Train {train_id} not found"}
    
    def emergency_override(self) -> Dict:
        """Emergency override function"""
        logger.warning("Emergency override activated")
        
        # Stop all trains by setting speed to 0
        for train in self.trains:
            train.speed = 0
        
        # Set all signals to red
        for signal in self.signals:
            signal.state = "red"
        
        return {
            "status": "success",
            "message": "Emergency override activated - all trains stopped",
            "timestamp": datetime.now().isoformat()
        }

# Flask API for integration with frontend
app = Flask(__name__)
CORS(app)

# Initialize the traffic control system
traffic_system = TrafficControlSystem()

@app.route('/api/status', methods=['GET'])
def get_status():
    """Get system status"""
    return jsonify(traffic_system.get_system_status())

@app.route('/api/ai/enable', methods=['POST'])
def enable_ai():
    """Enable AI mode"""
    return jsonify(traffic_system.enable_ai_mode())

@app.route('/api/ai/disable', methods=['POST'])
def disable_ai():
    """Disable AI mode"""
    return jsonify(traffic_system.disable_ai_mode())

@app.route('/api/ai/optimize', methods=['POST'])
def run_optimization():
    """Run AI optimization"""
    return jsonify(traffic_system.run_ai_optimization())

@app.route('/api/emergency', methods=['POST'])
def emergency_override():
    """Emergency override"""
    return jsonify(traffic_system.emergency_override())

@app.route('/api/train/<train_id>/position', methods=['PUT'])
def update_train_position(train_id):
    """Update train position"""
    data = request.get_json()
    new_position = data.get('position', 0)
    return jsonify(traffic_system.update_train_position(train_id, new_position))

@app.route('/api/recommendations', methods=['GET'])
def get_recommendations():
    """Get AI recommendations"""
    recommendations = traffic_system.ai_controller.generate_ai_recommendations(
        traffic_system.trains, traffic_system.junctions
    )
    return jsonify({"recommendations": recommendations})

def simulate_train_movement():
    """Background thread to simulate train movement"""
    while True:
        for train in traffic_system.trains:
            if train.speed > 0:
                train.position += train.speed * 0.1  # Simulate movement
                if train.position > 100:  # Reset position if train reaches end
                    train.position = 0
        time.sleep(1)

if __name__ == "__main__":
    # Start background simulation
    simulation_thread = threading.Thread(target=simulate_train_movement, daemon=True)
    simulation_thread.start()
    
    logger.info("RailOptima AI Traffic Control System starting...")
    logger.info("AI Neural Network initialized with advanced optimization algorithms")
    
    # Run Flask development server
    app.run(debug=True, host='0.0.0.0', port=5000)