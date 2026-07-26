interface FieldErrorProps {
  message?: string;
  id: string;
}

export function FieldError({ message, id }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p
      id={id}
      className="mt-1 text-sm text-red-600"
      role="alert"
    >
      {message}
    </p>
  );
}
