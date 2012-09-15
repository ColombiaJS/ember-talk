import json
from flask import Flask, request, send_from_directory

app = Flask('TODO')

tasks = [{'text': 'Agregar mas tareas'}]

@app.route('/<path:filename>')
def static_files(filename):
     return send_from_directory('.', filename)

@app.route('/tasks', methods=['GET', 'POST'])
def render_tasks():
    if request.method == 'GET':
        return json.dumps(tasks)

    if request.method == 'POST':
        tasks[:] = request.json
        return ''


if __name__ == '__main__':
    app.run()
