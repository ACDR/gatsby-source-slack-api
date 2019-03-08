# gatsby-source-slack-users

Source plugin for pulling users into Gatsby from the [Slack Web API](https://api.slack.com/methods/users.list).

## :warning: State of this plugin

This plugin is not well tested and is mostly an experiment. Contributors are welcome.

## Install

---

`npm install --save gatsby-source-slack-users`

## How to use

```javascript
// In your gatsby-config.js
plugins: {
  resolve: `gatsby-source-slack-users`,
  options: {
    accessToken: `YOUR_TOKEN_HERE`
  }
}
```

## How to query

You can query nodes created from Slack Users like the following:

```graphql
query {
  allSlackUsers {
    edges {
      node {
        id
        name
        profile {
          realName
          email
        }
      }
    }
  }
}
```
