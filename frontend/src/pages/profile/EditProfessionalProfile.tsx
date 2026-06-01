import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ImagePlus, Loader2, Lock, UserRound } from 'lucide-react'
import { GovernanceScope, Card, Button, SectionHeader, Badge } from '../../components/governance'
import { useAuth } from '../../lib/auth'
import { useProfessionalProfile, readFileAsDataUrl, professionalRoleLabels } from '../../lib/professionalProfile'
import { profileService } from '../../services/profile.service'
import type { ProfessionalProfileData, ProfessionalRole } from '../../types/profile'

type StringKey =
  | 'artisticName' | 'legalName' | 'bio' | 'country' | 'city'
  | 'website' | 'instagram' | 'tiktok' | 'youtube' | 'spotify' | 'appleMusic'

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--gv-surface-2)',
  border: '1px solid var(--gv-border)',
  borderRadius: 'var(--gv-radius-md)',
  padding: '10px 12px',
  color: 'var(--gv-text)',
  fontSize: 'var(--gv-text-sm)',
  fontFamily: 'var(--gv-font-sans)',
  outline: 'none',
}

function Field({
  label,
  hint,
  children,
  privateField,
}: {
  label: string
  hint?: string
  children: React.ReactNode
  privateField?: boolean
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span className="gv-eyebrow">{label}</span>
        {privateField && <Badge tone="neutral" icon={<Lock size={10} />}>Private</Badge>}
      </span>
      {children}
      {hint && <span style={{ fontSize: 'var(--gv-text-xs)', color: 'var(--gv-text-muted)' }}>{hint}</span>}
    </label>
  )
}

export default function EditProfessionalProfile() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stored, setStored] = useProfessionalProfile(user?.id)

  const [form, setForm] = useState<ProfessionalProfileData>(stored)
  const [langText, setLangText] = useState(stored.languages.join(', '))
  const [genreText, setGenreText] = useState(stored.genres.join(', '))
  const [uploading, setUploading] = useState<'avatar' | 'cover' | null>(null)
  const [saved, setSaved] = useState(false)

  const avatarInput = useRef<HTMLInputElement>(null)
  const coverInput = useRef<HTMLInputElement>(null)

  const setField = (key: StringKey, value: string) =>
    setForm(prev => ({ ...prev, [key]: value.trim() === '' ? null : value }))

  const handleUpload = async (file: File, kind: 'avatar' | 'cover') => {
    if (!file) return
    setUploading(kind)
    try {
      const userId = user?.id ?? 'me'
      const res =
        kind === 'avatar'
          ? await profileService.uploadAvatar(userId, file)
          : await profileService.uploadCover(userId, file)
      // Fall back to a local data-URL when storage is unavailable, so the
      // upload still works in any environment.
      const url = res.data ?? (await readFileAsDataUrl(file))
      setForm(prev => ({ ...prev, [kind === 'avatar' ? 'avatarUrl' : 'coverImageUrl']: url }))
    } catch {
      const url = await readFileAsDataUrl(file)
      setForm(prev => ({ ...prev, [kind === 'avatar' ? 'avatarUrl' : 'coverImageUrl']: url }))
    } finally {
      setUploading(null)
    }
  }

  const handleSave = async () => {
    const next: ProfessionalProfileData = {
      ...form,
      languages: langText.split(',').map(s => s.trim()).filter(Boolean),
      genres: genreText.split(',').map(s => s.trim()).filter(Boolean),
    }
    setStored(next)
    // Best-effort sync of the bio to the existing profiles column (no schema
    // change). Silently ignored when Supabase is offline.
    if (user?.id && next.bio) {
      try {
        await profileService.update(user.id, { bio: next.bio })
      } catch {
        /* offline / mock — local persistence already done */
      }
    }
    setSaved(true)
    setTimeout(() => navigate('/profile/me'), 500)
  }

  const roles = Object.keys(professionalRoleLabels) as ProfessionalRole[]

  return (
    <GovernanceScope className="min-h-screen" style={{ fontFamily: 'var(--gv-font-sans)' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: 'var(--gv-space-5)', paddingBottom: 'var(--gv-space-8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--gv-space-5)' }}>
          <Button variant="ghost" size="sm" leadingIcon={<ArrowLeft size={15} />} onClick={() => navigate('/profile/me')}>
            Back
          </Button>
          <Button variant="gold" size="sm" onClick={handleSave} disabled={saved}>
            {saved ? 'Saved' : 'Save Profile'}
          </Button>
        </div>

        <SectionHeader
          eyebrow="Professional Profile"
          title="Edit Profile"
          description="Public information you choose to share. Email, password and internal identifiers are never shown."
        />

        {/* Media */}
        <Card padding="lg" style={{ marginTop: 'var(--gv-space-4)' }}>
          <span className="gv-eyebrow">Profile Media</span>
          <div style={{ display: 'flex', gap: 'var(--gv-space-4)', marginTop: 'var(--gv-space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
            <div
              style={{
                width: 72, height: 72, borderRadius: 'var(--gv-radius-lg)', flexShrink: 0,
                background: form.avatarUrl ? `center / cover no-repeat url(${form.avatarUrl})` : 'var(--gv-surface-2)',
                border: '1px solid var(--gv-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gv-text-muted)',
              }}
            >
              {!form.avatarUrl && <UserRound size={26} />}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Button
                variant="secondary" size="sm"
                leadingIcon={uploading === 'avatar' ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
                onClick={() => avatarInput.current?.click()}
                disabled={uploading !== null}
              >
                {form.avatarUrl ? 'Change Photo' : 'Upload Photo'}
              </Button>
              <Button
                variant="secondary" size="sm"
                leadingIcon={uploading === 'cover' ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
                onClick={() => coverInput.current?.click()}
                disabled={uploading !== null}
              >
                {form.coverImageUrl ? 'Change Cover' : 'Upload Cover (optional)'}
              </Button>
            </div>
          </div>
          <input
            ref={avatarInput} type="file" accept="image/*" hidden
            onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f, 'avatar') }}
          />
          <input
            ref={coverInput} type="file" accept="image/*" hidden
            onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f, 'cover') }}
          />
        </Card>

        {/* Identity */}
        <Card padding="lg" style={{ marginTop: 'var(--gv-space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--gv-space-4)' }}>
          <span className="gv-eyebrow">Profile Information</span>
          <Field label="Artistic Name">
            <input style={inputStyle} value={form.artisticName ?? ''} onChange={e => setField('artisticName', e.target.value)} placeholder="Stage / artist name" />
          </Field>
          <Field label="Legal Name" privateField hint="Used only for verification & contracts — never shown publicly.">
            <input style={inputStyle} value={form.legalName ?? ''} onChange={e => setField('legalName', e.target.value)} placeholder="Optional" />
          </Field>
          <Field label="Professional Role">
            <select
              style={inputStyle}
              value={form.professionalRole ?? ''}
              onChange={e => setForm(prev => ({ ...prev, professionalRole: (e.target.value || null) as ProfessionalRole | null }))}
            >
              <option value="">Select role…</option>
              {roles.map(r => <option key={r} value={r}>{professionalRoleLabels[r]}</option>)}
            </select>
          </Field>
          <Field label="Biography">
            <textarea
              style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
              value={form.bio ?? ''} onChange={e => setField('bio', e.target.value)}
              placeholder="A short professional biography"
            />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gv-space-3)' }}>
            <Field label="Country">
              <input style={inputStyle} value={form.country ?? ''} onChange={e => setField('country', e.target.value)} />
            </Field>
            <Field label="City">
              <input style={inputStyle} value={form.city ?? ''} onChange={e => setField('city', e.target.value)} />
            </Field>
          </div>
          <Field label="Languages" hint="Separate with commas">
            <input style={inputStyle} value={langText} onChange={e => setLangText(e.target.value)} placeholder="English, Spanish" />
          </Field>
          <Field label="Genres" hint="Separate with commas">
            <input style={inputStyle} value={genreText} onChange={e => setGenreText(e.target.value)} placeholder="Bachata, Salsa, Pop" />
          </Field>
        </Card>

        {/* Links */}
        <Card padding="lg" style={{ marginTop: 'var(--gv-space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--gv-space-4)' }}>
          <span className="gv-eyebrow">Links</span>
          <Field label="Website"><input style={inputStyle} value={form.website ?? ''} onChange={e => setField('website', e.target.value)} placeholder="yoursite.com" /></Field>
          <Field label="Instagram"><input style={inputStyle} value={form.instagram ?? ''} onChange={e => setField('instagram', e.target.value)} /></Field>
          <Field label="TikTok"><input style={inputStyle} value={form.tiktok ?? ''} onChange={e => setField('tiktok', e.target.value)} /></Field>
          <Field label="YouTube"><input style={inputStyle} value={form.youtube ?? ''} onChange={e => setField('youtube', e.target.value)} /></Field>
          <Field label="Spotify"><input style={inputStyle} value={form.spotify ?? ''} onChange={e => setField('spotify', e.target.value)} /></Field>
          <Field label="Apple Music"><input style={inputStyle} value={form.appleMusic ?? ''} onChange={e => setField('appleMusic', e.target.value)} /></Field>
        </Card>

        <div style={{ marginTop: 'var(--gv-space-5)' }}>
          <Button variant="gold" block onClick={handleSave} disabled={saved}>
            {saved ? 'Saved' : 'Save Profile'}
          </Button>
        </div>
      </div>
    </GovernanceScope>
  )
}
