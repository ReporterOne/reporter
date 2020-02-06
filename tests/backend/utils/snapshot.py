import os
import inspect
import json

import jsondiff

SNAPSHOT_DIRECTORY = \
    os.path.join(os.path.dirname(os.path.abspath(__file__)), '__snapshots__')


def response_snapshot(id, response):
    os.makedirs(SNAPSHOT_DIRECTORY, exist_ok=True)
    curframe = inspect.currentframe()
    caller_frame = inspect.getouterframes(curframe, 2)
    method = caller_frame[1]
    name = method.function
    snapshot_name = f"{name}_{id}"
    file_name = os.path.basename(method.filename)
    base_name, ext = os.path.splitext(file_name)
    snapshot_file = os.path.join(SNAPSHOT_DIRECTORY, f"snap_{base_name}.json")
    if os.path.exists(snapshot_file):
        with open(snapshot_file) as f:
            data = json.load(f)

        if snapshot_name in data:
            if not data[snapshot_name] == response:
                raise AssertionError(
                    jsondiff.diff(data[snapshot_name], response))

        else:
            data[snapshot_name] = response
            with open(snapshot_file, 'w') as f:
                json.dump(data, f)

    else:
        data = {
            snapshot_name: response
        }
        with open(snapshot_file, 'w') as f:
            json.dump(data, f)

    return True

