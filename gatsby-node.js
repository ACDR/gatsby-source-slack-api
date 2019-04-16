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

  const response = await client.users.list()

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

async function fetchSlackEmoji(token) {
  const client = new WebClient(token)

  const response = await client.emoji.list()

  if (!response.ok) return null

  return response.emoji
}

function processEmoji(emoji) {
  return {
    ...emoji,
    children: null,
    parent: null,
    internal: {
      type: "SlackEmoji",
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

  const emoji = await fetchSlackEmoji(token)

  if (!emoji) throw new Error("Failed to fetch slack emoji")

  emoji.forEach(emoji => {
    const node = processUser(emoji)
    node.internal.contentDigest = digest(node)

    createNode(node)
  })

  return
}
