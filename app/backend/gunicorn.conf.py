bind = "0.0.0.0:8443"
workers = 1

def when_ready(server):
    server.log.info("Running snitcher...")
    # TODO: run snitcher process from here
