export function Card({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}): JSX.Element {
  return (
    <div className="rounded-xl p-8 bg-sky-200">
      <h1 className="text-xl border-b border-gray-400 pb-2">{title}</h1>

      <p>{children}</p>
    </div>
  );
}