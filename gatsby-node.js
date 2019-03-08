const { WebClient } = require("@slack/client")
const crypto = require("crypto")

function digest(data) {
  return crypto
    .createHash("md5")
    .update(JSON.stringify(data))
    .digest("hex")
}

async function fetchSlackUsers(token) {
  const client = new WebClient(token)

  const response = await client.users.list({
    limit: 100,
  })

  if (!response.ok) return null

  return response.members
}

function processUser(user) {
  return {
    ...user,
    children: null,
    parent: null,
    internal: {
      type: "SlackUser",
    },
  }
}

exports.sourceNodes = async ({ actions }, options = {}) => {
  const token = options.accessToken || null

  if (!token) throw new Error("Please supply a token for Slack")

  const { createNode } = actions

  const users = await fetchSlackUsers(token)

  if (!users) throw new Error("Failed to fetch slack users")

  users.forEach(user => {
    const node = processUser(user)
    node.internal.contentDigest = digest(node)

    createNode(node)
  })

  return
}
