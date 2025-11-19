from flask import Flask
import ssl

app = Flask(__name__)

@app.route('/hello-world')
def hello_world():
    return 'hello world!'

@app.route('/live')
def live():
    return 'live!'

@app.route('/ready')
def ready():
    return 'ready!'

if __name__ == '__main__':
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain('cert.pem', 'key.pem')
    app.run(host='0.0.0.0', port=8443, ssl_context=context, debug=True) 
