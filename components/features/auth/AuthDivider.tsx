export function AuthDivider({ label }: { label: string }) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-surface-container-lowest px-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:bg-surface-container dark:text-white">
          {label}
        </span>
      </div>
    </div>
  );
}