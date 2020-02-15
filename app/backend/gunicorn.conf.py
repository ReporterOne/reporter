"""Main gunicorn config file."""
import os


PORT = os.environ.get("PORT", 8443)
bind = f"0.0.0.0:{PORT}"
workers = 1


def when_ready(server):
    """When ready hook of gunicorn."""
    server.log.info("Running snitcher...")
    # TODO: run snitcher process from here
