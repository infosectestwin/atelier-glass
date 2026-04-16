interface ConfirmationMessageProps {
  email: string
}

export default function ConfirmationMessage({ email }: ConfirmationMessageProps) {
  return (
    <div className="text-center py-8">
      <div className="text-4xl mb-4">✓</div>
      <h2 className="text-2xl font-bold text-white mb-2">Request received!</h2>
      <p className="text-white/60">
        A confirmation email has been sent to <span className="text-white">{email}</span>.
      </p>
      <p className="text-white/40 text-sm mt-2">We'll be in touch soon.</p>
    </div>
  )
}
