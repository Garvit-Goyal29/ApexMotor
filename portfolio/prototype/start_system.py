#!/usr/bin/env python3
import subprocess
import webbrowser
import time
import os
import sys

def start_system():
    print("🚂 Starting RailOptima AI Traffic Control System...")
    
    # Start backend
    print("📡 Starting Python AI Backend...")
    backend_process = subprocess.Popen([
        sys.executable, "backend/app.py"
    ], cwd=".")
    
    # Wait for backend to start
    time.sleep(3)
    
    # Open frontend in browser
    frontend_path = os.path.abspath("frontend/index.html")
    print(f"🌐 Opening frontend at: file://{frontend_path}")
    webbrowser.open(f"file://{frontend_path}")
    
    print("✅ RailOptima System Started!")
    print("🔗 Backend API: http://localhost:5000")
    print("🔗 Frontend: file://frontend/index.html")
    print("\nPress Ctrl+C to stop the system")
    
    try:
        backend_process.wait()
    except KeyboardInterrupt:
        print("\n🛑 Shutting down RailOptima...")
        backend_process.terminate()

if __name__ == "__main__":
    start_system()