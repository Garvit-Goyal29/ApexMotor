import random

def objective_function(x):
    # Example objective function: f(x) = -x^2 + 4x
    return -x**2 + 4*x

def hill_climbing():
    # Initialize a random solution
    current_solution = random.uniform(-10, 10)
    current_value = objective_function(current_solution)
    
    step_size = 0.1
    max_iterations = 1000

    for _ in range(max_iterations):
        # Generate neighbors
        neighbors = [current_solution + step_size, current_solution - step_size]
        
        # Evaluate neighbors
        next_solution = max(neighbors, key=objective_function)
        next_value = objective_function(next_solution)
        
        # Check if the neighbor is better
        if next_value > current_value:
            current_solution = next_solution
            current_value = next_value
        else:
            # If no better neighbors, return current solution
            break

    return current_solution, current_value

# Example usage
best_solution, best_value = hill_climbing()
print(f"Best solution: {best_solution}")
print(f"Best value: {best_value}")
