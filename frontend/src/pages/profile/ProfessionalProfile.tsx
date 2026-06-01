import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GovernanceScope } from '../../components/governance'
import ProfileHeaderPro from '../../components/profile/ProfileHeaderPro'
import { ProfileTabNav, ProfilePanel } from '../../components/profile/ProfileTabs'
import { useAuth } from '../../lib/auth'
import {
  useProfessionalProfile,
  emptyProfessionalProfile,
  mapAuthRoleToProfessional,
  professionalRoleLabels,
  computeVerification,
} from '../../lib/professionalProfile'
import { formatDate } from '../../utils/format'
import type { ProfileTabKey } from '../../types/profile'

export default function ProfessionalProfile() {
  const navigate = useNavigate()
  const { username = '' } = useParams()
  const { user, profile: authProfile } = useAuth()
  const [stored] = useProfessionalProfile(user?.id)
  const [tab, setTab] = useState<ProfileTabKey>('overview')

  const selfHandle = authProfile?.username ?? ''
  const isSelf =
    username.toLowerCase() === 'me' ||
    (Boolean(selfHandle) && username.toLowerCase() === selfHandle.toLowerCase())

  // Only the signed-in user's own data is available client-side. Other
  // usernames render an honest public shell (no fabricated data) until a
  // by-username lookup is wired server-side.
  const data = isSelf ? stored : emptyProfessionalProfile
  const verificationSource = isSelf ? authProfile : null

  const handle = isSelf ? selfHandle || username : username
  const displayName = data.artisticName || (isSelf ? selfHandle : username) || 'MUSVORA Profile'
  // Role is derived from the VIEWED user's data only. For other members we have
  // no client-side data yet, so we never borrow the viewer's role — we use a
  // neutral label and a neutral stat set until a server-side lookup exists.
  const role = data.professionalRole ?? (isSelf ? mapAuthRoleToProfessional(authProfile?.role) : 'artist')
  const avatarUrl = data.avatarUrl ?? (isSelf ? authProfile?.avatar_url ?? null : null)
  const verification = computeVerification(verificationSource)
  const isOwner = isSelf && authProfile?.role === 'supreme_owner'
  const roleLabel = isOwner ? 'Founder' : isSelf ? professionalRoleLabels[role] : 'MUSVORA Member'
  const memberSince =
    isSelf && authProfile?.created_at ? formatDate(authProfile.created_at, { year: 'numeric', month: 'short' }) : null

  return (
    <GovernanceScope className="min-h-screen" style={{ fontFamily: 'var(--gv-font-sans)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', paddingBottom: 'var(--gv-space-8)' }}>
        <ProfileHeaderPro
          displayName={displayName}
          handle={handle}
          roleLabel={roleLabel}
          country={data.country}
          languages={data.languages}
          genres={data.genres}
          avatarUrl={avatarUrl}
          coverImageUrl={data.coverImageUrl}
          verification={verification}
          isOwner={isOwner}
          isSelf={isSelf}
          onBack={() => navigate('/profile')}
          onEdit={() => navigate('/profile/edit')}
          onFounderConsole={() => navigate('/owner')}
        />

        <ProfileTabNav active={tab} onChange={setTab} />

        <div style={{ padding: 'var(--gv-space-5)' }}>
          {!isSelf && (
            <p
              style={{
                fontSize: 'var(--gv-text-xs)',
                color: 'var(--gv-text-muted)',
                marginBottom: 'var(--gv-space-4)',
              }}
            >
              Public profile preview. Only information the member has made public is shown.
            </p>
          )}
          <ProfilePanel
            active={tab}
            data={data}
            role={role}
            isSelf={isSelf}
            memberSince={memberSince}
            onUpload={() => navigate('/upload')}
            onEdit={() => navigate('/profile/edit')}
          />
        </div>
      </div>
    </GovernanceScope>
  )
}
