import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Award,
  BarChart3,
  Bell,
  Boxes,
  Building2,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  Factory,
  FileText,
  Headphones,
  LayoutDashboard,
  Leaf,
  Megaphone,
  Network,
  Receipt,
  Settings,
  Truck,
  UserCog,
  Users,
  Wrench,
} from 'lucide-react';
import type { Role } from '@/db/schema/identity';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  group?: string;
}

const FRANQUEADOR: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pipeline', label: 'Funil de Vendas', icon: BarChart3 },
  { href: '/operations', label: 'Operacional', icon: Activity },
  { href: '/franchisees', label: 'Rede', icon: Network },
  { href: '/billing', label: 'Financeiro', icon: CreditCard },
  { href: '/factory', label: 'Fábrica', icon: Factory },
  { href: '/academy', label: 'Academy', icon: Award },
  { href: '/announcements', label: 'Comunicados', icon: Megaphone },
  { href: '/carbon', label: 'Carbon', icon: Leaf },
  { href: '/settings', label: 'Configurações', icon: Settings },
];

const FRANQUEADO: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pipeline', label: 'Meu Funil', icon: BarChart3 },
  { href: '/contracts', label: 'Meus Contratos', icon: FileText },
  { href: '/representatives', label: 'Meus Representantes', icon: Users },
  { href: '/technicians', label: 'Meus Técnicos', icon: Wrench },
  { href: '/academy', label: 'Academy', icon: Award },
  { href: '/announcements', label: 'Comunicados', icon: Megaphone },
];

const REPRESENTANTE: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pipeline', label: 'Meu Funil', icon: BarChart3 },
];

const TECNICO: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/installations', label: 'Minhas Instalações', icon: ClipboardCheck },
];

const FABRICA: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/factory/orders', label: 'Pedidos', icon: Receipt },
  { href: '/factory/stock', label: 'Estoque', icon: Boxes },
  { href: '/factory/logistics', label: 'Logística', icon: Truck },
];

const CLIENTE: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/my/contract', label: 'Meu Contrato', icon: FileText },
  { href: '/my/billing', label: 'Boletos', icon: Receipt },
  { href: '/my/fleet', label: 'Frota', icon: Building2 },
  { href: '/my/support', label: 'Chamados', icon: Headphones },
];

export function getNavItems(role: Role | null | undefined): NavItem[] {
  switch (role) {
    case 'franqueador':
      return FRANQUEADOR;
    case 'franqueado':
      return FRANQUEADO;
    case 'representante':
      return REPRESENTANTE;
    case 'tecnico_instalador':
      return TECNICO;
    case 'fabrica':
      return FABRICA;
    case 'cliente':
      return CLIENTE;
    default:
      return [{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }];
  }
}

export const ROLE_LABEL: Record<Role, string> = {
  franqueador: 'Franqueador',
  franqueado: 'Franqueado',
  representante: 'Representante',
  tecnico_instalador: 'Técnico Instalador',
  fabrica: 'Fábrica',
  cliente: 'Cliente',
};

// Util icons re-export para Sidebar reusar sem importar manualmente.
export { Bell, UserCog, CalendarDays };
