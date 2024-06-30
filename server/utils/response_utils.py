from flask import jsonify

# Returns a success message
def return_success(message):
    return jsonify({'success': message})

# Returns an error message
def return_error(message):
    return jsonify({'error': message})
