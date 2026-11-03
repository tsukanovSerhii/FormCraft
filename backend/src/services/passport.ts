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

type Provider = 'googleId' | 'githubId'

// Find the user by provider id, else link the provider to an existing account with the
// same email (e.g. registered with a password), else create a new user.
// A plain upsert by provider id would fail on the unique email constraint in the second case.
async function findOrLinkUser(provider: Provider, providerId: string, email: string, name: string, avatarUrl?: string) {
  const byProvider = await prisma.user.findUnique({ where: { [provider]: providerId } as any })
  if (byProvider) {
    return prisma.user.update({ where: { id: byProvider.id }, data: { name, avatarUrl } })
  }

  const byEmail = await prisma.user.findUnique({ where: { email } })
  if (byEmail) {
    return prisma.user.update({
      where: { id: byEmail.id },
      data: { [provider]: providerId, avatarUrl: byEmail.avatarUrl ?? avatarUrl },
    })
  }

  return prisma.user.create({ data: { [provider]: providerId, email, name, avatarUrl } })
}

if (oauthEnabled.google) passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: `${BACKEND_URL}/api/auth/google/callback`,
}, async (_accessToken, _refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value
    if (!email) return done(new Error('No email from Google'))

    const user = await findOrLinkUser('googleId', profile.id, email, profile.displayName, profile.photos?.[0]?.value)
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

    const user = await findOrLinkUser('githubId', profile.id, email, profile.displayName ?? profile.username, profile.photos?.[0]?.value)
    done(null, user)
  } catch (err) {
    done(err)
  }
}))
