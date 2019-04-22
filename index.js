const omnibelt = require('omnibelt')
const api = require('losant-rest')
const { pick, keys } = omnibelt
const client = api.createClient();

const userAuthParams = {
  credentials: {
    "email": "LOSANT EMAIL",
    "password": "PASSWORD"
  }
};

var sourceDashboardParams = {
  dashboardId: "DASHBOARDID"
};

var targetDashboardParams = {
  applicationId: "APPLICATIONID"
};

// Auth User
client.auth.authenticateUser(userAuthParams)
  .then((authResponse) => {
    // Set Token
    client.setOption('accessToken', authResponse.token);

    // Get Source Dashboard
    client.dashboard.get(sourceDashboardParams)
      .then((getDashboardResponse) => {

        const newDashboard = buildCloneDashboard(getDashboardResponse)
        client.dashboards.post({ dashboard: newDashboard})
          .then((dashboard) => {
            console.log(`Cloned to: https://app.losant.com/application/${targetDashboardParams}/dashboards/`)
            console.log(`The cloned dashboard: https://app.losant.com/dashboards/${dashboard.id}`)
          })
          .catch(console.error);
      })
      .catch(console.error);
  })
  .catch(console.error);


  const buildCloneDashboard = (data) => {
  // only pull properties from the post schema
  const { applicationId } = targetDashboardParams;
  const dashboard = {
    ...pick(
      keys(dashboardPostSchema.properties), // only pull properties from the post schema
      data
    ),
    applicationId: applicationId,
    name: `${data.name} (Cloned)`, // add '(Cloned)' to the name
    reportConfigs: [], // blank out the report configuration
    public: false // set to private by default
  };
    // add an orgId if the dashboard is org-owned
  if (!applicationId && ownerType === 'organization') {
    dashboard.orgId = ownerId;
  }
  return dashboard;
};

const dashboardPostSchema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "orgId": {
      "type": "string",
      "pattern": "^[A-Fa-f\\d]{24}$"
    },
    "applicationId": {
      "type": "string",
      "pattern": "^[A-Fa-f\\d]{24}$"
    },
    "name": {
      "type": "string",
      "minLength": 1,
      "maxLength": 255
    },
    "blocks": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "maxLength": 255
          },
          "blockType": {
            "type": "string",
            "enum": [
              "application-list",
              "bar",
              "custom-chart",
              "dashboard-list",
              "data-table",
              "device-list",
              "device-log",
              "device-state-table",
              "event-list",
              "gauge",
              "graph",
              "heatmap",
              "iframe",
              "image",
              "indicator",
              "input",
              "map",
              "open-event-indicator",
              "pie",
              "position-chart",
              "section-header",
              "workflow-list"
            ]
          },
          "title": {
            "type": "string",
            "maxLength": 255
          },
          "description": {
            "type": "string",
            "maxLength": 32767
          },
          "applicationId": {
            "type": "string",
            "pattern": "^[A-Fa-f\\d]{24}$"
          },
          "startX": {
            "type": "number"
          },
          "startY": {
            "type": "number"
          },
          "width": {
            "type": "number"
          },
          "height": {
            "type": "number"
          },
          "config": {
            "type": "object"
          }
        },
        "required": [
          "blockType",
          "startX",
          "startY",
          "width",
          "height"
        ],
        "additionalProperties": false
      }
    },
    "description": {
      "type": "string",
      "maxLength": 32767
    },
    "refreshRate": {
      "type": "number",
      "minimum": 5,
      "maximum": 600
    },
    "defaultTheme": {
      "type": "string",
      "enum": [
        "dark",
        "light"
      ]
    },
    "reportConfigs": {
      "type": "array",
      "max": 10,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "cron",
          "toEmail"
        ],
        "properties": {
          "id": {
            "type": "string",
            "max": 14
          },
          "cron": {
            "type": "string",
            "max": 255
          },
          "toEmail": {
            "type": "array",
            "min": 1,
            "max": 10,
            "items": {
              "type": "string",
              "format": "email",
              "maxLength": 1024
            }
          },
          "subject": {
            "type": "string",
            "max": 255
          },
          "message": {
            "type": "string",
            "max": 32767
          },
          "theme": {
            "type": "string",
            "enum": [
              "dark",
              "light"
            ]
          },
          "timezone": {
            "type": "string",
            "max": 255
          }
        }
      }
    },
    "public": {
      "type": "boolean"
    },
    "password": {
      "type": [
        "string",
        "null"
      ]
    },
    "contextConfiguration": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "pattern": "^[0-9a-zA-Z_-]{1,255}$"
          },
          "type": {
            "type": "string",
            "enum": [
              "deviceAttribute",
              "deviceId",
              "deviceTag",
              "number",
              "string"
            ]
          },
          "applicationId": {
            "type": "string",
            "pattern": "^[A-Fa-f\\d]{24}$"
          },
          "defaultValue": {
            "oneOf": [
              {
                "type": "string",
                "maxLength": 32767
              },
              {
                "type": "number"
              },
              {
                "type": "object",
                "properties": {
                  "key": {
                    "type": "string",
                    "pattern": "^[0-9a-zA-Z_-]{1,255}$"
                  },
                  "value": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 255
                  }
                },
                "additionalProperties": false
              }
            ]
          },
          "validationEnabled": {
            "type": "boolean"
          },
          "validationConfig": {
            "type": "object",
            "properties": {
              "min": {
                "type": "number"
              },
              "max": {
                "type": "number"
              },
              "regExp": {
                "type": "string",
                "maxLength": 1024
              },
              "attributes": {
                "type": "array",
                "items": {
                  "type": "string",
                  "pattern": "^[0-9a-zA-Z_-]{1,255}$"
                },
                "maxItems": 100
              },
              "deviceIds": {
                "type": "array",
                "items": {
                  "type": "string",
                  "pattern": "^[A-Fa-f\\d]{24}$"
                },
                "maxItems": 1000
              },
              "deviceTags": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "key": {
                      "type": "string",
                      "pattern": "^[0-9a-zA-Z_-]{1,255}$"
                    },
                    "value": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 255
                    }
                  },
                  "additionalProperties": false
                },
                "maxItems": 100
              },
              "includeFullDevice": {
                "type": "boolean"
              }
            },
            "additionalProperties": false
          }
        },
        "required": [
          "name",
          "type",
          "defaultValue"
        ],
        "additionalProperties": false
      },
      "maxItems": 100
    }
  },
  "additionalProperties": false,
  "required": [
    "name"
  ]
}