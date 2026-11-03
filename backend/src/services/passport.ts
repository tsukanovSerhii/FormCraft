import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github2'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import prisma from '../utils/prisma'

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:3000'

// OAuth is optional: strategies are registered only when credentials are set,
// so the server can boot (e.g. on a demo host) with email/password auth only.
export const oauthEnabled = {
  google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  github: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
}

if (oauthEnabled.google) passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: `${BACKEND_URL}/api/auth/google/callback`,
}, async (_accessToken, _refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value
    if (!email) return done(new Error('No email from Google'))

    const user = await prisma.user.upsert({
      where: { googleId: profile.id },
      update: { name: profile.displayName, avatarUrl: profile.photos?.[0]?.value },
      create: {
        googleId: profile.id,
        email,
        name: profile.displayName,
        avatarUrl: profile.photos?.[0]?.value,
      },
    })
    done(null, user)
  } catch (err) {
    done(err)
  }
}))

if (oauthEnabled.github) passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  callbackURL: `${BACKEND_URL}/api/auth/github/callback`,
  scope: ['user:email'],
}, async (_accessToken: string, _refreshToken: string, profile: any, done: any) => {
  try {
    const email = profile.emails?.[0]?.value
    if (!email) return done(new Error('No email from GitHub'))

    const user = await prisma.user.upsert({
      where: { githubId: profile.id },
      update: { name: profile.displayName ?? profile.username, avatarUrl: profile.photos?.[0]?.value },
      create: {
        githubId: profile.id,
        email,
        name: profile.displayName ?? profile.username,
        avatarUrl: profile.photos?.[0]?.value,
      },
    })
    done(null, user)
  } catch (err) {
    done(err)
  }
}))
