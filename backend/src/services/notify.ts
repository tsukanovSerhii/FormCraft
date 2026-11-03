import { pushToUser } from '../controllers/notifications'
import prisma from '../utils/prisma'
import { sendNewResponseEmail } from './email'

// Tell the form owner about a new response: stored in-app notification, live push to open
// tabs (SSE), and an email when the owner keeps "notify on response" enabled
export async function notifyNewResponse(form: { id: string; title: string; userId: string }, responseId: string) {
  const notification = await prisma.notification.create({
    data: {
      userId: form.userId,
      type: 'response',
      title: 'New response',
      body: `Someone submitted "${form.title}"`,
      meta: { formId: form.id, responseId },
    },
  })
  pushToUser(form.userId, { type: 'notification', notification })

  const owner = await prisma.user.findUnique({
    where: { id: form.userId },
    select: { email: true, notifyOnResponse: true },
  })
  if (owner?.notifyOnResponse) {
    await sendNewResponseEmail({ to: owner.email, formTitle: form.title, formId: form.id, responseId })
  }
}
