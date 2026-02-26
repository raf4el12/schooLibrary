interface FormFieldErrorProps {
  children: React.ReactNode
}

export default function FormFieldError({ children }: FormFieldErrorProps) {
  return <p className="text-red-500 text-sm mt-1">{children}</p>
}
