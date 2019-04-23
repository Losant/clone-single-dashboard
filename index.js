const omnibelt = require('omnibelt')
const api = require('losant-rest')
const { pick, keys } = omnibelt
const client = api.createClient()
const dashboardPostSchema = require('losant-rest/lib/schemas/dashboardPost.json')

const userAuthParams = {
  credentials: {
    "email": "LOSANT EMAIL",
    "password": "PASSWORD"
  }
}

var sourceDashboardParams = {
  dashboardId: "DASHBOARDID"
}

var targetDashboardParams = {
  applicationId: "APPLICATIONID"
}

// Auth User
client.auth.authenticateUser(userAuthParams)
  .then((authResponse) => {
    // Set Token
    client.setOption('accessToken', authResponse.token)

    // Get Source Dashboard
    client.dashboard.get(sourceDashboardParams)
      .then((getDashboardResponse) => {

        // Get new Dashboard Data
        const newDashboard = buildCloneDashboard(getDashboardResponse)

        // Create New Dashboard
        client.dashboards.post({ dashboard: newDashboard})
          .then((dashboard) => {
            console.log(`Cloned to: https://app.losant.com/applications/${targetDashboardParams.applicationId}/dashboards`)
            console.log(`The cloned dashboard: https://app.losant.com/dashboards/${dashboard.id}`)
          })
          .catch(console.error)
      })
      .catch(console.error)
  })
  .catch(console.error)


  const buildCloneDashboard = (data) => {
  // only pull properties from the post schema
  const { applicationId } = targetDashboardParams
  const dashboard = {
    ...pick(
      keys(dashboardPostSchema.properties), // only pull properties from the post schema
      data
    ),
    applicationId: applicationId,
    name: `${data.name} (Cloned)`, // add '(Cloned)' to the name
    reportConfigs: [], // blank out the report configuration
    public: false // set to private by default
  }
    // add an orgId if the dashboard is org-owned
  if (!applicationId && ownerType === 'organization') {
    dashboard.orgId = ownerId
  }
  return dashboard
}
