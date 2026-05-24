import { renderToStaticMarkup } from 'react-dom/server';
import {
  WelcomeFranchiseeEmail,
} from './welcome-franchisee';

/** Renderiza o e-mail de boas-vindas para HTML estático (inline em <body>). */
export function renderWelcomeFranchisee(args: {
  fullName: string;
  resetUrl: string;
  brandLogoUrl?: string;
}): string {
  return `<!DOCTYPE html>${renderToStaticMarkup(WelcomeFranchiseeEmail(args))}`;
}
