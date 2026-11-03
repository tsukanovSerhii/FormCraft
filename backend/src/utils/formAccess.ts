import prisma from './prisma'

export type FormAccess = 'read' | 'write' | 'delete'

// The author has full access. Members of the form's workspace (invitation accepted) can read;
// editors and owners can also write; only workspace owners can delete someone else's form.
export async function findAccessibleForm(formId: string, userId: string, access: FormAccess = 'read') {
  const form = await prisma.form.findUnique({ where: { id: formId } })
  if (!form) return null
  if (form.userId === userId) return form
  if (!form.workspaceId) return null

  const member = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId: form.workspaceId, userId } },
  })
  if (!member?.acceptedAt) return null

  if (access === 'read') return form
  if (access === 'write') return member.role === 'owner' || member.role === 'editor' ? form : null
  return member.role === 'owner' ? form : null
}

// Only owners/editors who accepted the invitation may put forms into a workspace
export async function canWriteToWorkspace(workspaceId: string, userId: string) {
  const member = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } },
  })
  return Boolean(member?.acceptedAt) && (member!.role === 'owner' || member!.role === 'editor')
}
