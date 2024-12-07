export function Card({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}): JSX.Element {
  return (
    <div className="border-2 border-gray-300 rounded-lg p-8">
      <h1 className="text-xl border-b border-gray-200 pb-2">{title}</h1>

      <p>{children}</p>
    </div>
  );
}