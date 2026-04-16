import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
  children: ReactNode
}

export default function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold px-6 py-2.5 rounded-xl transition-colors duration-200',
    ghost: 'bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors duration-200',
    danger: 'bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors duration-200',
  }

  return (
    <button className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
