import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: keyof typeof LucideIcons;
  size?: number | string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, className = '', ...props }) => {
  const LucideIcon = LucideIcons[name];

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  return (
    <LucideIcon
      size={size}
      className={className}
      aria-hidden="true"
      {...props}
    />
  );
};

export default Icon; 