var formObj = {
    "type": "form",
    "tags": [],
    "access": [
        {
            "roles": [
                "5aa110f87cb55569b81703f4",
                "5aa110f87cb555271a1703f5",
                "5aa110f87cb55510461703f6"
            ],
            "type": "read_all"
        }
    ],
    "submissionAccess": [],
    "owner": "59b0f49b6d85560007c281e1",
    "components": [
        {
            "key": "content",
            "input": false,
            "html": "<div id=\"mapDiv\" style=\"position: relative; width: 600px; height:300px;\">Map</div>\n\n<div id=\"printOutPanel\" style=\"position: relative; width: 600px; height:300px;\">Panel</div>\n",
            "type": "content",
            "tags": [],
            "conditional": {
                "show": "",
                "when": null,
                "eq": ""
            },
            "properties": {},
            "label": "content"
        },
        {
            "autofocus": false,
            "input": true,
            "label": "PushPin",
            "tableView": false,
            "key": "submit",
            "size": "md",
            "leftIcon": "",
            "rightIcon": "",
            "block": false,
            "action": "custom",
            "disableOnInvalid": false,
            "theme": "primary",
            "type": "button",
            "tags": [],
            "conditional": {
                "show": "",
                "when": null,
                "eq": ""
            },
            "properties": {},
            "custom": "PushPin();"
        },
        {
            "autofocus": false,
            "input": true,
            "label": "Traffic",
            "tableView": false,
            "key": "traffic",
            "size": "md",
            "leftIcon": "",
            "rightIcon": "",
            "block": false,
            "action": "custom",
            "disableOnInvalid": false,
            "theme": "primary",
            "type": "button",
            "tags": [],
            "conditional": {
                "show": "",
                "when": null,
                "eq": ""
            },
            "properties": {},
            "custom": "showTraffic();"
        },
        {
            "autofocus": false,
            "input": true,
            "label": "Create Route",
            "tableView": false,
            "key": "createRoute",
            "size": "md",
            "leftIcon": "",
            "rightIcon": "",
            "block": false,
            "action": "custom",
            "disableOnInvalid": false,
            "theme": "primary",
            "type": "button",
            "tags": [],
            "conditional": {
                "show": "",
                "when": null,
                "eq": ""
            },
            "properties": {},
            "custom": "CreateRoute();"
        }
    ],
    "created": "2018-03-14T03:19:33.095Z",
    "revisions": "",
    "_vid": 0,
    "_id": "5aa894c550daadcc9c88e593",
    "title": "BingMap",
    "display": "form",
    "settings": {},
    "name": "bingMap",
    "path": "bingmap",
    "project": "5aa110f77cb5555e671703f3",
    "modified": "2018-03-14T04:04:52.106Z",
    "machineName": "cnacwyscoumtvqx:bingMap"
};