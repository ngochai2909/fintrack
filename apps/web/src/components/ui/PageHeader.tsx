import Link from 'next/link';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: string;
  };
  children?: ReactNode;
}

export function PageHeader({
  title,
  description,
  icon,
  action,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          {icon && <span>{icon}</span>}
          {title}
        </h1>
        {description && <p className="text-gray-600 mt-1">{description}</p>}
      </div>

      {action && (
        <ActionButton
          label={action.label}
          href={action.href}
          onClick={action.onClick}
          icon={action.icon}
        />
      )}

      {children}
    </div>
  );
}

interface ActionButtonProps {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: string;
}

function ActionButton({ label, href, onClick, icon }: ActionButtonProps) {
  const className =
    'bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2 justify-center';

  if (href) {
    return (
      <Link href={href} className={className}>
        {icon && <span className="text-xl">{icon}</span>}
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {icon && <span className="text-xl">{icon}</span>}
      <span>{label}</span>
    </button>
  );
}
