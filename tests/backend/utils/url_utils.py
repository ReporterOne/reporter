"""ÜRL and Query classes for generating urls."""

import urllib


class Query:
    def __init__(self, **params):
        if params is None:
            params = {}

        self.params = params

    def to_text(self):
        return urllib.parse.urlencode(self.params, True)


class URL:
    def __init__(self, url: str = '/', query: Query = None):
        self.url = url
        self.query = query

    def to_text(self):
        return_string = self.url
        if self.query is not None and self.query.params != {}:
            return_string += f"?{self.query.to_text()}"

        return return_string
